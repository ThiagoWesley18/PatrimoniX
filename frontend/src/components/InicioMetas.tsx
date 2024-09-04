import React from "react";
import { Link } from 'react-router-dom';

function InicioMetas() {
    return (
        <article className="card">
            <div className="card-body" style={{ textAlign: "justify", fontFamily: "tahoma, helvetica, serif", fontSize: "14pt" }}>
                <h5 className="card-title d-flex justify-content-center mb-5" style={{ fontSize: "20pt", fontWeight: "bold" }}>Meta Smart</h5>
                <div className="card-text">
                    <p className="mb-4">
                        A metodologia SMART é uma ferramenta poderosa para transformar seus objetivos em resultados concretos. Ao definir metas específicas, mensuráveis, atingíveis, relevantes e temporais, você aumenta significativamente suas chances de sucesso em qualquer área da vida, seja pessoal ou profissional. A sigla SMART é um acrônimo em inglês que significa:
                    </p>
                    <div className="d-flex justify-content-center align-items-center mb-5">
                        <ul style={{ fontWeight: "bold" }}>
                            <li>Specific (Específica)</li>
                            <li>Measurable (Mensurável)</li>
                            <li>Achievable (Atingível)</li>
                            <li>Relevant (Relevante)</li>
                            <li>Time-bound (Temporal)</li>
                        </ul>
                    </div>
                    <div className="mb-5">
                        <h5><b>Específica (S)</b></h5>
                        <ol>
                            <li>
                                <b>Seja preciso:</b> Em vez de metas vagas como "investir mais", defina um valor exato e o tipo de investimento. Exemplo: "Investir R$ 500 mensais em um fundo de investimento em ações com foco em empresas de tecnologia".
                            </li>
                            <li>
                                <b>Considere seu perfil:</b> A escolha do investimento deve estar alinhada ao seu perfil de investidor (conservador, moderado ou arrojado), tolerância ao risco e horizonte de tempo.
                            </li>
                        </ol>
                    </div>
                    <div className="mb-5">
                        <h5><b>Mensurável (M)</b></h5>
                        <ol>
                            <li>
                                <b>Utilize métricas:</b> Quantifique seus objetivos para acompanhar o progresso. Exemplos: "Aumentar o valor da minha carteira em 15% até o final do ano", "Atingir um patrimônio líquido de R$ 100.000 em 5 anos".
                            </li>
                            <li>
                                <b>Escolha indicadores:</b> Utilize indicadores como taxa interna de retorno (TIR), taxa de crescimento do investimento e valor presente líquido (VPL) para avaliar o desempenho.
                            </li>
                        </ol>
                    </div>
                    <div className="mb-5">
                        <h5><b>Atingível (A)</b></h5>
                        <ol>
                            <li>
                                <b>Avalie sua realidade:</b> Seus objetivos devem ser desafiadores, mas realistas. Considere sua renda, gastos, dívidas e capacidade de poupar.
                            </li>
                            <li>
                                <b>Divida em etapas:</b> Objetivos ambiciosos podem ser mais fáceis de alcançar quando divididos em metas menores e mais curtas.
                            </li>
                        </ol>
                    </div>
                    <div className="mb-5">
                        <h5><b>Relevante (R)</b></h5>
                        <ol>
                            <li>
                                <b>Alinhe com seus objetivos:</b> Seus investimentos devem contribuir para seus objetivos de longo prazo, como a compra da casa própria, a educação dos filhos ou a aposentadoria.
                            </li>
                            <li>
                                <b>Considere seus valores:</b> Escolha investimentos que estejam alinhados com seus valores e crenças.
                            </li>
                        </ol>
                    </div>
                    <div className="mb-5">
                        <h5><b>Temporal (T)</b></h5>
                        <ol>
                            <li>
                                <b>Estabeleça prazos:</b> Defina prazos claros para cada meta, desde metas de curto prazo até objetivos de longo prazo.
                            </li>
                            <li>
                                <b>Crie um cronograma:</b> Organize suas ações em um cronograma para acompanhar o progresso e fazer ajustes quando necessário.
                            </li>
                        </ol>
                    </div>
                    <div className="mb-5">
                        <h5><b>Exemplo de Meta SMART para Investimento:</b></h5>
                        <i>"Investir R$ 300 mensais em um fundo de investimento multimercado com baixo risco por um período de 3 anos, visando obter um retorno médio de 8% ao ano e acumular R$ 15.000 para realizar uma viagem internacional em 2025."</i>
                    </div>
                    <div className="mb-5">
                        <h5><b>Dica:</b></h5>
                        <ul>
                            <li>
                                <b>Revise suas metas regularmente:</b> A vida muda e seus objetivos também. Revise suas metas periodicamente para garantir que elas continuem relevantes e desafiadoras.
                            </li>
                            <li>
                                <b>Busque orientação:</b> Consulte um profissional de investimentos para obter um planejamento financeiro personalizado e adequado ao seu perfil.
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center mb-5">
                    <Link to={"/metas/create"} className="btn" 
                    style={{backgroundColor: "#D9EAFD",
                        borderStyle: "solid",
                        borderColor: "#023E8A",
                        color: "#023E8A",
                        marginRight: "10px"
                    }}>
                        <i className="bi bi-plus-circle" style={{marginRight: "5px"}}></i>
                        Nova Meta
                    </Link>
                </div> 
            </div>
        </article>  
    )
}

export default InicioMetas;