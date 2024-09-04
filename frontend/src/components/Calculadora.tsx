import React, { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup, Modal, Alert } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import "../styles/styles.css";
import {
  fetchAtivos,
  fetchPerguntas,
  fetchRespostasAtivoByAtivo,
  fetchRespostasAtivo,
  getAtivoOutros,
  createPergunta,
  updatePergunta,
  deletePergunta,
  updateRespostaAtivo,
  deleteRespostaAtivo,
  fetchTransactions,
} from "../services/api";
import { fetchStockQuote } from "../services/yahooFinanceApi";
import { ativo } from "../types/ativo";
import { pergunta } from "../types/pergunta";
import { respostaAtivo } from "../types/respostaAtivo";
import formataValoresParaReal from "../utils/formataValoresParaReal";

interface AtivoCalculado {
  codigo: string;
  tipo: string;
  peso: number;
  cotacaoAtual: number;
  quantidadeComprar: number;
  precoFinal: number;
}

const DistribuicaoAtivos: React.FC = () => {
  const [perguntas, setPerguntas] = useState<pergunta[]>([]);
  const [respostasAtivos, setRespostasAtivos] = useState<respostaAtivo[]>([]);
  const [ativoSelecionado, setAtivoSelecionado] = useState<string | null>(null);
  const [mostrarAtivos, setMostrarAtivos] = useState<boolean>(false);
  const [ativos, setAtivos] = useState<AtivoCalculado[]>([]);
  const [cotacoesAtivos, setCotacoesAtivos] = useState<{
    [codigo: string]: number;
  }>({});
  const [allAtivos, setAllAtivos] = useState<ativo[]>([]);
  const [pesosAtivos, setPesosAtivos] = useState<{ [codigo: string]: number }>(
    {}
  );
  const [updateCounter, setUpdateCounter] = useState(0);
  const [pularAnaliseAtivo, setPularAnaliseAtivo] = useState(false);
  const [showModalPular, setShowModalPular] = useState(false);
  const [exibirModalPular, setExibirModalPular] = useState(false);
  const [carregandoTransacoes, setCarregandoTransacoes] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [exibirModalOperacao, setExibirModalOperacao] = useState(false);
  const [exibirModalSemOperacoes, setExibirModalSemOperacoes] = useState(false);
  const [mostrarMensagem, setMostrarMensagem] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingPerguntaId, setEditingPerguntaId] = useState<number | null>(
    null
  );
  const [criterioInput, setCriterioInput] = useState("");
  const [textoInput, setTextoInput] = useState("");
  const [respostas, setRespostas] = useState<{ [perguntaId: number]: boolean }>(
    {}
  );
  const [openSucesso, setOpenSucesso] = useState(false);
  const [openFail, setOpenFail] = useState(false);
  const handleCloseSucesso = () => setOpenSucesso(false);
  const handleCloseFail = () => setOpenFail(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [modalFailMensagem, setModalFailMensagem] = useState("");
  const [valorTotal, setValorTotal] = useState<string>(() => {
    return localStorage.getItem("valorTotal") || "";
  });
  const [pularAnaliseAtivado, setPularAnaliseAtivado] = useState(() => {
    const estadoSalvo = localStorage.getItem("pularAnaliseAtivado");
    return estadoSalvo ? JSON.parse(estadoSalvo) : false;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const perguntasResponse = await fetchPerguntas();
        setPerguntas(perguntasResponse);

        const ativosResponse = await fetchAtivos();
        setAllAtivos(ativosResponse);
        const ativosOutrosResponse = await getAtivoOutros();
        const cotacoes: { [codigo: string]: number } = {};
        for (const ativo of ativosResponse) {
          if (
            ativosOutrosResponse.some(
              (element) => element.tradingCode === ativo.tradingCode
            )
          ) {
            cotacoes[ativo.tradingCode] = await fetchStockQuote(
              ativo.tradingCode
            );
          }
        }
        setCotacoesAtivos(cotacoes);
        await calcularDistribuicao();
        setCarregandoTransacoes(false);
        //await limparAtivosSemOperacoesExistentes();
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setCarregandoTransacoes(false);
      }
    };

    localStorage.setItem("valorTotal", valorTotal);
    localStorage.setItem(
      "pularAnaliseAtivado",
      JSON.stringify(pularAnaliseAtivado)
    );

    if (mostrarMensagem && pularAnaliseAtivado) {
      desfazerPularAnalise();
    }

    {
      /*TODO: ajustar para desativar "Desfazer Pular Análise se nenhum ativo existir na tabela Calculadora de Distribuição de Aporte"*/
    }
    //if (!carregandoTransacoes && ativos.every(ativo => ativo.peso === 0)) {
    //  setMostrarMensagem(true);
    //} else {
    //   setMostrarMensagem(false);
    //}

    fetchData();
  }, [
    updateCounter,
    valorTotal,
    pularAnaliseAtivado,
    mostrarMensagem,
    carregandoTransacoes,
  ]);

  const handleValorTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value;
    valor = valor.replace(/[^0-9,]/g, "").replace(",", ".");
    setValorTotal(valor);
  };

  const carregarRespostasAtivo = async (codigoAtivo: string) => {
    try {
      const respostas = await fetchRespostasAtivoByAtivo(codigoAtivo);
      setRespostasAtivos(respostas);

      let pesoAtivo = respostas.filter((r) => r.resposta).length;

      setPesosAtivos((prevPesos) => ({
        ...prevPesos,
        [codigoAtivo]: pesoAtivo,
      }));

      const novasRespostas: { [perguntaId: number]: boolean } = {};
      respostas.forEach((resposta) => {
        novasRespostas[resposta.perguntaId] = resposta.resposta;
      });
      setRespostas(novasRespostas);
    } catch (error) {
      console.error("Erro ao buscar respostas do ativo:", error);
    }
  };

  {
    /*const limparAtivosRespostasInexistentes = async () => {
        const codigosAtivosHistorico = await buscarCodAtivosOperacoesRegistradas();

        const ativosInexistentes = respostasAtivos.filter(resposta =>
            !codigosAtivosHistorico.includes(resposta.ativoCodigo)
        );

        for (const ativo of ativosInexistentes) {
            await deleteRespostaAtivo(ativo.ativoCodigo, ativo.perguntaId);
        }

        setRespostasAtivos(prevRespostas =>
            prevRespostas.filter(resposta =>
                codigosAtivosHistorico.includes(resposta.ativoCodigo)
            )
        );

        setPesosAtivos(prevPesos => {
            const novosPesos = { ...prevPesos };
            ativosInexistentes.forEach(ativo => {
                delete novosPesos[ativo.ativoCodigo];
            });
            return novosPesos;
        });
    };*/
  }

  const handleAtivoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const codigoAtivo = e.target.value;
    setAtivoSelecionado(codigoAtivo);
    await carregarRespostasAtivo(codigoAtivo);
  };

  const handleRespostaChange = async (
    perguntaId: number,
    resposta: boolean
  ) => {
    try {
      const codigo = ativoSelecionado || "";
      setRespostas((prevRespostas) => ({
        ...prevRespostas,
        [perguntaId]: resposta,
      }));

      if (resposta) {
        await updateRespostaAtivo(codigo, perguntaId, { resposta });
      } else {
        await deleteRespostaAtivo(codigo, perguntaId);
        setRespostasAtivos((prevRespostas) =>
          prevRespostas.filter(
            (r) => r.ativoCodigo !== codigo || r.perguntaId !== perguntaId
          )
        );
      }
      setUpdateCounter(updateCounter + 1);
    } catch (error) {
      console.error("Erro ao salvar resposta:", error);
    }
  };

  const calcularDistribuicao = async () => {
    const valorTotalNumerico = parseFloat(valorTotal) || 0;

    try {
      //await limparAtivosSemOperacoesExistentes();
      const respostasAtivos = await fetchRespostasAtivo();

      const pesosAtivos: { [codigo: string]: number } = {};
      respostasAtivos.forEach((resposta) => {
        if (resposta.resposta) {
          // Conta apenas as respostas true
          pesosAtivos[resposta.ativoCodigo] =
            (pesosAtivos[resposta.ativoCodigo] || 0) + 1;
        }
      });

      const ativosComPeso = Object.keys(pesosAtivos).filter(
        (codigo) => pesosAtivos[codigo] > 0
      );
      const totalPeso = ativosComPeso.reduce(
        (acc, codigo) => acc + pesosAtivos[codigo],
        0
      );

      const novosAtivos: AtivoCalculado[] = await Promise.all(
        ativosComPeso.map(async (codigo) => {
          const peso = pesosAtivos[codigo] || 0;
          const cotacaoAtual = await fetchStockQuote(codigo); // Busca a cotação atual real
          const valorParaInvestir = (valorTotalNumerico * peso) / totalPeso;
          const quantidadeComprar =
            cotacaoAtual > 0 ? Math.floor(valorParaInvestir / cotacaoAtual) : 0;
          const precoFinal = quantidadeComprar * cotacaoAtual;
          const tipo =
            allAtivos.find((ativo) => ativo.tradingCode === codigo)?.tipo ||
            "Desconhecido";

          return {
            codigo,
            tipo,
            peso,
            cotacaoAtual,
            quantidadeComprar,
            precoFinal,
          };
        })
      );

      setAtivos(novosAtivos);
      setMostrarAtivos(novosAtivos.length > 0); // Só mostra a tabela se houver ativos
    } catch (error) {
      console.error("Erro ao calcular a distribuição do aporte:", error);
    }
  };

  const handleOpenModal = (mode: "add" | "edit", perguntaId?: number) => {
    setModalMode(mode);
    if (mode === "edit" && perguntaId !== undefined) {
      setEditingPerguntaId(perguntaId);
      const perguntaToEdit = perguntas.find((p) => p.id === perguntaId);
      if (perguntaToEdit) {
        setCriterioInput(perguntaToEdit.criterio);
        setTextoInput(perguntaToEdit.texto);
      }
    } else {
      setCriterioInput("");
      setTextoInput("");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPerguntaId(null);
  };

  const handleSavePergunta = async () => {
    try {
      if (modalMode === "add") {
        await createPergunta({ criterio: criterioInput, texto: textoInput });
      } else if (modalMode === "edit" && editingPerguntaId !== null) {
        await updatePergunta(editingPerguntaId, {
          id: editingPerguntaId,
          criterio: criterioInput,
          texto: textoInput,
        });
      }
      const perguntasResponse = await fetchPerguntas();
      setPerguntas(perguntasResponse);
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar pergunta:", error);
    }
  };

  const handleDeletePergunta = async (perguntaId: number) => {
    try {
      await deletePergunta(perguntaId);
      const perguntasResponse = await fetchPerguntas();
      setPerguntas(perguntasResponse);
    } catch (error) {
      console.error("Erro ao excluir pergunta:", error);
    }
  };

  const buscarCodAtivosOperacoesRegistradas = async (): Promise<string[]> => {
    try {
      const transactions = await fetchTransactions();
      const codigosAtivos = transactions.map(
        (transaction) => transaction.tradingCode
      );
      return codigosAtivos;
    } catch (error) {
      console.error("Erro ao buscar códigos de ativos:", error);
      return [];
    }
  };

  const pularAnalise = async () => {
    try {
      const codigosAtivos = await buscarCodAtivosOperacoesRegistradas();
      for (const codigo of codigosAtivos) {
        await updateRespostaAtivo(codigo, 6, { resposta: true });
      }
      const novasRespostasAtivos = await fetchRespostasAtivo();
      setRespostasAtivos(novasRespostasAtivos);
      setUpdateCounter(updateCounter + 1);
      setPularAnaliseAtivado(true);
      setExibirModalPular(false);
    } catch (error) {
      console.error("Erro ao pular análise:", error);
      alert("Erro ao pular análise. Tente novamente mais tarde.");
    }
  };

  const desfazerPularAnalise = async () => {
    try {
      const codigosAtivos = await buscarCodAtivosOperacoesRegistradas();
      for (const codigo of codigosAtivos) {
        await updateRespostaAtivo(codigo, 6, { resposta: false });
      }
      const novasRespostasAtivos = await fetchRespostasAtivo();
      setRespostasAtivos(novasRespostasAtivos);
      setUpdateCounter(updateCounter + 1);
      setPularAnaliseAtivado(false);
      setExibirModalPular(false);
    } catch (error) {
      console.error("Erro ao desfazer 'Pular Análise':", error);
      alert("Erro ao desfazer. Tente novamente mais tarde.");
    }
  };

  const removerAtivo = async (codigoAtivo: string) => {
    try {
      setLoading(true);
      // Remove as respostas do ativo da interface
      setAtivos((prevAtivos) =>
        prevAtivos.filter((ativo) => ativo.codigo !== codigoAtivo)
      );
      // Chama a para a API para remover as respostas no back
      const todasPerguntas = await fetchPerguntas();
      const perguntaIds = todasPerguntas.map((pergunta) => pergunta.id);

      for (const perguntaId of perguntaIds) {
        await updateRespostaAtivo(codigoAtivo, perguntaId, { resposta: false });
      }
      const novasRespostasAtivos = await fetchRespostasAtivo();
      setRespostasAtivos(novasRespostasAtivos);
      setUpdateCounter(updateCounter + 1);

      if (ativoSelecionado) {
        await carregarRespostasAtivo(ativoSelecionado);
      }
    } catch (error) {
      console.error("Erro ao remover ativo", error);
      alert("Erro ao remover. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleCliquePularAnalise = () => {
    setExibirModalPular(true);
  };

  const confirmarPularAnalise = async () => {
    try {
      if (!pularAnaliseAtivado) {
        await pularAnalise();

        const codigosAtivos = await buscarCodAtivosOperacoesRegistradas();
        if (codigosAtivos.length === 0) {
          setExibirModalSemOperacoes(true);
          await desfazerPularAnalise();
        } else {
          setExibirModalOperacao(true);
          await calcularDistribuicao();
        }
      } else {
        await desfazerPularAnalise();
        await calcularDistribuicao();
      }
    } catch (error) {
      console.error("Erro ao pular análise:", error);
      alert("Erro ao pular análise. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="container-fluid mt-5 px-3">
      <h1 className="textBlue">Aporte</h1>
      {/* Modal de Pergunta */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#023E8A" }}>
            {modalMode === "add" ? "Adicionar Indicador" : "Editar Indicador"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="criterioInput"></Form.Group>
            <Form.Group className="mb-3" controlId="textoInput">
              <Form.Control
                type="text"
                placeholder="Texto do indicador"
                value={textoInput}
                onChange={(e) => setTextoInput(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleSavePergunta}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Ativo  */}
      <div className="card h-100 py-2 shadow section">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Ativo</h5>
          </div>
          <div>
            <p>
              Quais ativos você gostaria de analisar antes do aporte? Selecione
              e responda às perguntas. Cada "Sim" adiciona um ponto ao ativo.
              Ativos com um ponto ou mais são listados na calculadora abaixo.
            </p>
          </div>
          <Form.Select
            className="form-control"
            aria-label="Selecione um ativo"
            value={ativoSelecionado || ""}
            onChange={handleAtivoChange}
          >
            <option value="">Selecione um ativo</option>
            {allAtivos.map((ativo) => (
              <option key={ativo.tradingCode} value={ativo.tradingCode}>
                {ativo.tradingCode} - {ativo.nomeInstituicao}
              </option>
            ))}
          </Form.Select>

          {ativoSelecionado && (
            <div>
              <Button
                variant="primary"
                onClick={() => handleOpenModal("add")}
                className="mr-2 mt-3"
              >
                Novo Indicador
              </Button>
              <Button
                variant={pularAnaliseAtivado ? "danger" : "primary"}
                onClick={handleCliquePularAnalise}
                className="mr-2 mt-3"
              >
                {pularAnaliseAtivado
                  ? "Desfazer Pular Análise"
                  : "Pular Análise"}
              </Button>

              <Modal
                show={exibirModalPular}
                onHide={() => setExibirModalPular(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title style={{ color: "#023E8A" }}>
                    Confirmação
                  </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  {pularAnaliseAtivado ? (
                    <p
                      style={{
                        textAlign: "justify",
                        color: "#023E8A",
                        margin: 10,
                      }}
                    >
                      Ao Desfazer Pular Análise, os ativos com operações
                      registradas que receberam 1 ponto através da ação de Pular
                      Análise terão esse ponto descontado e podem sair da
                      listagem na calculadora abaixo. Você poderá Pular Análise
                      novamente.
                    </p>
                  ) : (
                    <p
                      style={{
                        textAlign: "justify",
                        color: "#023E8A",
                        margin: 10,
                      }}
                    >
                      Ao pular a análise, todos os ativos que possuem operação
                      registrada em sua carteira serão listados com 1 ponto na
                      calculadora. Se você já possui ativos analisados, os
                      pontos serão acumulativos para ativos com operações
                      registradas. Essa ação poderá ser desfeita posteriormente.
                    </p>
                  )}
                  <p
                    style={{
                      textAlign: "justify",
                      color: "#023E8A",
                      margin: 10,
                    }}
                  >
                    Deseja confirmar?
                  </p>
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setExibirModalPular(false)}
                  >
                    Fechar
                  </Button>
                  <Button variant="primary" onClick={confirmarPularAnalise}>
                    Confirmar
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal
                show={exibirModalSemOperacoes}
                onHide={() => setExibirModalSemOperacoes(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title style={{ color: "#023E8A" }}>
                    Nenhuma Operação Encontrada
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body
                  style={{ textAlign: "justify", color: "#023E8A", margin: 10 }}
                >
                  Não existem operações registradas. Para prosseguir, clique
                  abaixo para registrar sua primeira operação.
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setExibirModalSemOperacoes(false)}
                  >
                    Fechar
                  </Button>
                  <Button
                    variant="primary"
                    as="a"
                    href={`http://localhost:${window.location.port}/transaction/create`}
                  >
                    Registrar Operação
                  </Button>
                </Modal.Footer>
              </Modal>

              {perguntas.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover className="mt-4 table-borderless">
                    <thead>
                      <tr>
                        <th className="th-title">Indicadores</th>
                        <th className="th-title">Resposta</th>
                        <th className="th-title">Opções</th>
                      </tr>
                    </thead>
                    <tbody>
                      {perguntas
                        .filter((pergunta) => pergunta.id !== 6)
                        .map((pergunta, index) => (
                          <tr key={index}>
                            <td>{pergunta.texto}</td>
                            <td>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id={`flexSwitchCheckChecked-${pergunta.id}`}
                                  checked={respostas[pergunta.id] || false}
                                  onChange={(e) =>
                                    handleRespostaChange(
                                      pergunta.id,
                                      e.target.checked
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`flexSwitchCheckChecked-${index}`}
                                >
                                  {respostas[pergunta.id] ? "Sim" : "Não"}
                                </label>
                              </div>
                            </td>
                            <td className="">
                              <button
                                className="btn btn-light rounded shadow-sm dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              ></button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button
                                    onClick={() =>
                                      handleOpenModal("edit", pergunta.id)
                                    }
                                    className="dropdown-item"
                                  >
                                    Editar Indicador
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() =>
                                      handleDeletePergunta(pergunta.id)
                                    }
                                    className="dropdown-item"
                                  >
                                    Excluir
                                  </button>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="warning" className="mt-3">
                  <Alert.Heading>Sem Perguntas Cadastradas</Alert.Heading>
                  <p>Adicione perguntas para começar a analisar os ativos.</p>
                </Alert>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Calculadora */}
      <div className="card h-100 py-2 shadow section">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Calculadora de Distribuição de Aporte</h5>
          </div>
          Quanto você deseja investir? Insira aqui o seu aporte deste mês.
          Quanto mais pontos um ativo possui, maior sua prioridade no cálculo.
          <Form.Group className="my-3">
            <Form.Label></Form.Label>
            <InputGroup>
              <InputGroup.Text>R$</InputGroup.Text>
              <Form.Control
                type="text"
                value={valorTotal}
                onChange={handleValorTotalChange}
                placeholder="Digite o valor do aporte para calcular…"
              />
            </InputGroup>
          </Form.Group>
          {valorTotal && (
            <div>
              {ativos.some((ativo) => ativo.peso > 0) ? (
                <div className="table-responsive">
                  <Table
                    striped
                    hover
                    className="calculadora-aporte mt-4 table-borderless text-center"
                  >
                    <thead>
                      <tr>
                        <th className="th-title">Código</th>
                        <th className="th-title">Pontos</th>
                        <th className="th-title">Cotação Atual</th>
                        <th className="th-title">Sugestão de Compra (Cotas)</th>
                        <th className="th-title">Sugestão de Compra (Preço)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ativos.map((ativo) => (
                        <tr key={ativo.codigo}>
                          <td>{ativo.codigo}</td>
                          <td>{ativo.peso}</td>
                          <td>{formataValoresParaReal(ativo.cotacaoAtual)}</td>
                          <td>{ativo.quantidadeComprar}</td>
                          <td>{formataValoresParaReal(ativo.precoFinal)}</td>
                          <td>
                            {ativo.quantidadeComprar === 0 && (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-${ativo.codigo}`}>
                                    <p>
                                      Este ativo não recebeu sugestões de
                                      valores porque possui baixa prioridade ou
                                      o valor da cota é muito alto comparado aos
                                      demais.
                                    </p>

                                    <p>
                                      Dica: Aportes maiores rendem cáculos mais
                                      distribuídos.
                                    </p>
                                  </Tooltip>
                                }
                                trigger="click"
                              >
                                <span className="d-inline-block">
                                  <FaInfoCircle className="text-info ms-2" />
                                </span>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td className="text-center">
                            <button
                              onClick={() => removerAtivo(ativo.codigo)}
                              className="btn"
                              disabled={loading}
                            >
                              {loading ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                <i className="bi bi-trash"></i>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                !carregandoTransacoes && (
                  <Alert variant="warning" className="mt-3">
                    <p>
                      Para prosseguir, selecione um ativo e responda a(s)
                      pergunta(s). Ativos com um ponto ou mais serão listados
                      aqui.
                    </p>
                  </Alert>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistribuicaoAtivos;
