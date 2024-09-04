import React, { useState, useContext } from "react";
import { Container, Row, Form, Button } from "react-bootstrap";
import { report } from "../types/report";
import { createReport } from "../services/api";
import CustomModalSuporte from "./CustomModalSuporte";
import { AuthContext } from "../state/AuthProvider";

function Suporte() {
  const { session } = useContext(AuthContext);
  const [report, setReport] = useState<report>({
    titulo: "",
    conteudo: "",
    userCpf: "",
    tipo: "",
  });
  const [bug, setBug] = useState<report>({
    titulo: "",
    localizacao: "",
    conteudo: "",
    userCpf: "",
    tipo: "",
  });
  const [openSucesso, setOpenSucesso] = useState(false);

  const handleCloseSucesso = () => setOpenSucesso(false);

  const handleChangeBug = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setBug((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeReport = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setReport((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReport({ ...bug, userCpf: session, tipo: "bug" })
      .then((response) => {})
      .catch((error) => {
        console.error("Erro ao reportar bug", error);
      });
    setBug({
      titulo: "",
      localizacao: "",
      conteudo: "",
      userCpf: "",
      tipo: "",
    });
    setOpenSucesso(true);
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReport({ ...report, userCpf: session, tipo: "suggestion" })
      .then((response) => {})
      .catch((error) => {
        console.error("Erro ao enviar sugestão", error);
      });
    setReport({
      titulo: "",
      conteudo: "",
      userCpf: "",
      tipo: "",
    });
    setOpenSucesso(true);
  };

  return (
    <div>
      <Container>
        <h1 className="textBlue mt-5 mb-5">Suporte</h1>
        <p>
          Aqui você encontrará respostas para as questões recorrentes sobre
          nossa aplicação e poderá submeter problemas que encontrou ao longo do
          uso de nossa plataforma. Sinta-se a vontade para mandar sugestões de
          como podemos deixar nosso sistema melhor para você!
        </p>
        <Row>
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <strong>Perguntas Frequentes</strong>
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <strong>Preciso usar meu dinheiro real na aplicação?</strong> 
                  <p>
                    Não, a aplicação apenas é lugar para registrar e rastrear as operações, logo,
                    não trabalhamos com a operação de dinheiro real.
                  </p>
                  <strong>Preciso fornecer algum dado bancário para o sistema?</strong> 
                  <p>
                    Não, nosso sistema não trabalha com dados bancários dos usuários.
                  </p>
                  <strong>Sempre que eu fizer uma operação na bolsa de valores, ela aparecerá no sistema automaticamente?</strong> 
                  <p>Não, o sistema não está ligado diretamente à bolsa de valores, 
                     exceto para coletar a cotação atual dos ativos,
                     portanto, você deve registrar suas operações.
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  <strong>Reportar problema ou bug</strong>
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Form onSubmit={handleBugSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Título do problema</Form.Label>
                      <Form.Control
                        type="text"
                        name="titulo"
                        value={bug.titulo}
                        onChange={handleChangeBug}
                        placeholder="Forneça um título que resuma o problema"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Página da localização do problema</Form.Label>
                      <Form.Select
                        name="localizacao"
                        value={bug.localizacao}
                        onChange={handleChangeBug}
                      >
                        <option value="" disabled>
                          Selecione onde encontrou problema
                        </option>
                        <option value="Página Inicial">Página Inicial</option>
                        <option value="Carteira">Carteira</option>
                        <option value="Histórico de Operações">
                          Histórico de Operações
                        </option>
                        <option value="Aportes">Aportes</option>
                        <option value="Perfil">Perfil</option>
                        <option value="Sobre">Sobre</option>
                        <option value="Dashboard">Dashboard</option>
                        <option value="Visualização de Operações">
                          Visualização de Operação
                        </option>
                        <option value="Registro de Operação">
                          Registro de Operação
                        </option>
                        <option value="Outro Local">Outro local</option>
                        <option value="Todas as páginas">
                          Todas as páginas
                        </option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Descrição do problema</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="conteudo"
                        value={bug.conteudo}
                        onChange={handleChangeBug}
                        placeholder="Descreva o problema detalhadamente"
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary">
                      Enviar Bug
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  <strong>Sugerir Melhorias</strong>
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <Form onSubmit={handleSuggestionSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Título da sugestão</Form.Label>
                      <Form.Control
                        type="text"
                        name="titulo"
                        value={report.titulo}
                        onChange={handleChangeReport}
                        placeholder="Dê um nome à sua sugestão"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Descrição da sugestão</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="conteudo"
                        value={report.conteudo}
                        onChange={handleChangeReport}
                        placeholder="Descreva a sugestão detalhadamente"
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary">
                      Enviar Sugestão
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Row>
        <CustomModalSuporte
          open={openSucesso}
          handleClose={handleCloseSucesso}
        />
      </Container>
    </div>
  );
}

export default Suporte;
