import React, { useState, useMemo } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import "../styles/styles.css";

interface Pergunta {
    criterio: string;
    texto: string;
}

interface RespostaAtivo {
    ativo: string;
    perguntaId: number;
    resposta: boolean;
}

interface Ativo {
    codigo: string;
    tipo: string;
    peso: number;
    cotacaoAtual: number;
    quantidadeComprar: number;
    precoFinal: number;
}

const ativosIniciais: Ativo[] = [
    { codigo: 'JSRE11', tipo: 'FII', peso: 0, cotacaoAtual: 64.70, quantidadeComprar: 0, precoFinal: 0 },
    { codigo: 'VILG11', tipo: 'FII', peso: 0, cotacaoAtual: 85.89, quantidadeComprar: 0, precoFinal: 0 },
    { codigo: 'BCFF11', tipo: 'FII', peso: 0, cotacaoAtual: 8.24, quantidadeComprar: 0, precoFinal: 0 },
    { codigo: 'VGIA11', tipo: 'FIAGRO', peso: 0, cotacaoAtual: 99.74, quantidadeComprar: 0, precoFinal: 0 },
    { codigo: 'MCHY11', tipo: 'FII', peso: 0, cotacaoAtual: 9.30, quantidadeComprar: 0, precoFinal: 0 },
    { codigo: 'VRTA11', tipo: 'FII', peso: 0, cotacaoAtual: 88.97, quantidadeComprar: 0, precoFinal: 0 },
    { codigo: 'GARE11', tipo: 'FII', peso: 0, cotacaoAtual: 72.16, quantidadeComprar: 0, precoFinal: 0 },
];

const perguntasIniciais: Pergunta[] = [
    { criterio: 'Vantagem Competitiva', texto: 'É líder nacional ou mundial no setor em que atua?' },
    { criterio: 'Vantagem Competitiva', texto: 'A empresa está em um setor que é essencial para a economia?' },
    { criterio: 'Confiança e Reputação', texto: 'A empresa tem um histórico de bom relacionamento com investidores e transparência na divulgação de resultados?' },
];

const DistribuicaoAtivos: React.FC = () => {
    const [valorTotal, setValorTotal] = useState<string>('');
    const [perguntas] = useState<Pergunta[]>(perguntasIniciais);
    const [respostasAtivos, setRespostasAtivos] = useState<RespostaAtivo[]>([]);
    const [ativoSelecionado, setAtivoSelecionado] = useState<string | null>(null);
    const [mostrarAtivos, setMostrarAtivos] = useState<boolean>(false);
    const [ativos, setAtivos] = useState<Ativo[]>(ativosIniciais);

    const ativosCalculados = useMemo(() => {
        const novosAtivos = ativosIniciais.map((ativo) => ({ ...ativo }));
        respostasAtivos.forEach((resposta) => {
            const ativoIndex = novosAtivos.findIndex((a) => a.codigo === resposta.ativo);
            if (ativoIndex !== -1 && resposta.resposta) {
                novosAtivos[ativoIndex].peso += 1;
            }
        });
        return novosAtivos;
    }, [respostasAtivos]);

    const ativosVisiveis = mostrarAtivos ? ativos.filter(ativo => ativo.peso > 0) : [];

    const handleValorTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let valor = e.target.value;
        valor = valor.replace(/[^0-9,]/g, '').replace(',', '.');
        setValorTotal(valor);
    };

    const distribuirValores = () => {
        const valorTotalNumerico = parseFloat(valorTotal) || 0;

        if (valorTotalNumerico > 0) {
            const totalPeso = ativosCalculados.reduce((acc: number, ativo: Ativo) => acc + ativo.peso, 0);
            const novosAtivos = totalPeso > 0 ? ativosCalculados.map((ativo: Ativo) => {
                const valorParaInvestir = (valorTotalNumerico * ativo.peso) / totalPeso;
                const quantidadeComprar = Math.floor(valorParaInvestir / ativo.cotacaoAtual);
                const precoFinal = quantidadeComprar * ativo.cotacaoAtual;
                return { ...ativo, quantidadeComprar, precoFinal };
            }) : ativosIniciais;
            setAtivos(novosAtivos);
            setMostrarAtivos(true);
        }
    };

    const handleAtivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAtivoSelecionado(e.target.value);
    };

    const handleRespostaChange = (perguntaId: number, resposta: boolean) => {
        setRespostasAtivos((prevRespostas) => {
            const novasRespostas = prevRespostas.filter(
                (resposta) => resposta.ativo !== ativoSelecionado || resposta.perguntaId !== perguntaId
            );
            return [
                ...novasRespostas,
                { ativo: ativoSelecionado || '', perguntaId, resposta },
            ];
        });
    };

    return (
        <div className="container-fluid mt-5 px-3">

            {/* Perguntas */}
            <div className="card h-100 py-2 shadow section">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Perguntas</h5>
                    </div>
                    <div>
                        <p>Você gostaria de analisar os ativos com base em quais índices? Adicione perguntas chave.</p>
                    </div>

                    <Button variant="primary" onClick={distribuirValores}>
                        Adicionar Pergunta
                    </Button>

                    <div className="table-responsive">
                        <Table striped hover className="mt-4 table-borderless">
                            <thead>
                                <tr>
                                    <th className="th-title">Critério</th>
                                    <th className="th-title">Pergunta</th>
                                    <th className="th-title">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Vantagem Competitiva</td>
                                    <td>É líder nacional ou mundial no setor em que atua?</td>
                                    <td className="text-center">
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-light rounded shadow-sm dropdown-toggle"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            ></button>
                                            <ul
                                                className="dropdown-menu"
                                            >
                                                <li>
                                                    Editar Pergunta
                                                </li>
                                                <li>
                                                    Excluir
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Vantagem Competitiva</td>
                                    <td>A empresa está em um setor que é essencial para a economia?</td>
                                    <td className="text-center">
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-light rounded shadow-sm dropdown-toggle"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            ></button>
                                            <ul
                                                className="dropdown-menu"
                                            >
                                                <li>
                                                    Editar Pergunta
                                                </li>
                                                <li>
                                                    Excluir
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Confiança e Reputação</td>
                                    <td>A empresa tem um histórico de bom relacionamento com investidores e transparência na divulgação de resultados?</td>
                                    <td className="text-center">
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-light rounded shadow-sm dropdown-toggle"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            ></button>
                                            <ul
                                                className="dropdown-menu"
                                            >
                                                <li>
                                                    Editar Pergunta
                                                </li>
                                                <li>
                                                    Excluir
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Ativo  */}
            <div className="card h-100 py-2 shadow section">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Ativo</h5>
                    </div>
                    <div>
                        <p>Você gostaria de analisar quais ativos? Pesquise e selecione sua resposta. Respostas com "Sim" adicionam pontos ao ativo.</p>
                    </div>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Insira o nome do ativo…"
                        onChange={handleAtivoChange}
                    />
                    {ativoSelecionado && (
                        <div className="table-responsive">
                            <Table striped hover className="mt-4 table-borderless">
                                <thead>
                                    <tr>
                                        <th className="th-title">Critério</th>
                                        <th className="th-title">Pergunta</th>
                                        <th className="th-title">Resposta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {perguntas.map((pergunta, index) => (
                                        <tr key={index}>
                                            <td>{pergunta.criterio}</td>
                                            <td>{pergunta.texto}</td>
                                            <td>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        id={`flexSwitchCheckChecked-${index}`}
                                                        checked={respostasAtivos.some(
                                                            (resposta) =>
                                                                resposta.ativo === ativoSelecionado &&
                                                                resposta.perguntaId === index &&
                                                                resposta.resposta
                                                        )}
                                                        onChange={(e) => handleRespostaChange(index, e.target.checked)}
                                                        style={{
                                                            backgroundColor: respostasAtivos.some(
                                                                (resposta) =>
                                                                    resposta.ativo === ativoSelecionado &&
                                                                    resposta.perguntaId === index &&
                                                                    resposta.resposta
                                                            )
                                                                ? 'green'
                                                                : '',
                                                        }}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`flexSwitchCheckChecked-${index}`}
                                                    >
                                                        {respostasAtivos.some(
                                                            (resposta) =>
                                                                resposta.ativo === ativoSelecionado &&
                                                                resposta.perguntaId === index &&
                                                                resposta.resposta
                                                        )
                                                            ? 'Sim'
                                                            : 'Não'}
                                                    </label>
                                                </div>
                                            </td>


                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
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
                    Quanto você quer investir? Insira aqui o seu aporte deste mês. Quanto mais pontos um ativo tem, maior sua prioridade.

                    <Form.Group className="my-3">
                        {/*<Form.Label>Valor Total:</Form.Label>*/}
                        <Form.Label></Form.Label>
                        <InputGroup>
                            <InputGroup.Text>R$</InputGroup.Text>
                            <Form.Control
                                type="text"
                                value={valorTotal}
                                onChange={handleValorTotalChange}
                                placeholder="Digite o valor do aporte…"
                            />
                        </InputGroup>
                    </Form.Group>

                    <Button variant="primary" onClick={distribuirValores}>
                        Calcular
                    </Button>

                    {mostrarAtivos && (
                        <div className="table-responsive">
                            <Table striped hover className="calculadora-aporte mt-4 table-borderless text-center">
                                <thead>
                                    <tr>
                                        <th className="th-title">Código</th>
                                        <th className="th-title">Tipo</th>
                                        <th className="th-title">Pontos</th>
                                        <th className="th-title">Cotação Atual</th>
                                        <th className="th-title">Sugestão de Compra (Cotas)</th>
                                        <th className="th-title">Sugestão de Compra (Preço)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ativosVisiveis.map((ativo) => (
                                        <tr key={ativo.codigo}>
                                            <td>{ativo.codigo}</td>
                                            <td>{ativo.tipo}</td>
                                            <td>{ativo.peso}</td>
                                            <td>R$ {ativo.cotacaoAtual.toFixed(2)}</td>
                                            <td>{ativo.quantidadeComprar}</td>
                                            <td>R$ {ativo.precoFinal.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>


                        </div>
                    )}
                </div>
            </div>

        </div >
    );
};

export default DistribuicaoAtivos;