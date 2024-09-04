import React, { useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const feature_images = [
  { path: "feature_carteira.png", alt: "carteira", msg: "Com PatrimoniX, sua gestão de ativos fica mais fácil" },
  { path: "feature_graficos.png", alt: "graficos", msg: "Veja a evolução da sua carteira em detalhes" },
  { path: "feature_calculadora.png", alt: "calculadora", msg: "Distribua seus ativos com ajuda da nossa calculadora" },
  { path: "feature_historico.png", alt: "histórico", msg: "Acompanhe os detalhes de suas transações" }
]

const buttonStyle = {
  backgroundColor: "#D9EAFD",
  borderStyle: "solid",
  borderColor: "#023E8A",
  color: "#023E8A",
  height: "25%",
  fontWeight: "bold"
}

const pageText = {
  color: "#023E8A"
}

function Home() {
  const [currentFeature, setCurrentFeature] = useState(feature_images[0]);

  const handleFeatureChange = (index: number) => {
    setCurrentFeature(feature_images[index]);
  };

  return (
    <main style={{ backgroundColor: "rgb(217, 234, 253, 0.4)" }}>
      {/* Seção 1 - Boas Vindas */}
      <section className="py-5">
        <Container>
          <Row>
            <Col md={7} className="d-flex align-items-center ">
              <div>
                <h1 className="display-5 fw-bold" style={pageText}>SEJA BEM VINDO INVESTIDOR</h1>
                <p className="lead" style={{ ...pageText, fontSize: "1.5rem" }}>
                  O PatrimoniX foi desenvolvido pra você que deseja gerenciar seus investimentos financeiros de forma simples, rápida e sem complicações.
                </p>
              </div>
            </Col>
            <Col className="d-flex justify-content-end" style={{ right: '0' }}>
              <img
                src="logo_patrimonix.png"
                alt="PatrimoniX logo"
                className="rounded"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Seção 2 - Features */}
      <section className="py-5">
        <Container>
          <h2 className="text-start mb-4" style={{ ...pageText, fontSize: "1.5rem", fontWeight: "bold" }}>Conheça nossas funcionalidades</h2>
          <Row>
            <Col md={10}>
              <div>
                <img
                  src={currentFeature.path}
                  alt={currentFeature.alt}
                  className="img-fluid"
                  style={{ minHeight: "50vh", maxHeight: "50vh", width: "100%" }}
                />

              </div>
            </Col>
            <Col md={2} className="d-flex flex-column justify-content-between">
              <button
                className="btn btn-secondary w-100 mb-2"
                style={buttonStyle}
                onClick={() => handleFeatureChange(0)}
              >
                CARTEIRA
              </button>
              <button
                className="btn btn-secondary w-100 mb-2"
                style={buttonStyle}
                onClick={() => handleFeatureChange(1)}
              >
                GRÁFICOS
              </button>
              <button
                className="btn btn-secondary w-100 mb-2"
                style={buttonStyle}
                onClick={() => handleFeatureChange(2)}
              >
                CALCULADORA
              </button>
              <button
                className="btn btn-secondary w-100"
                style={buttonStyle}
                onClick={() => handleFeatureChange(3)}
              >
                HISTÓRICO
              </button>
            </Col>
          </Row>
          <p className="mt-2" style={{ ...pageText, fontSize: "1.25rem" }}>{currentFeature.msg}</p>
        </Container>
      </section>

      {/* Seção 3 - Objetivos  */}
      <section className="py-5">
        <Container>
          <Row className="d-lex justify-content-between">
            <Col md={6} className="mb-4">
              <div className="p-4 border rounded h-100" style={{ backgroundColor: "#D9EAFD" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 style={{ ...pageText, fontWeight: "bold" }}>Dashboard informativo</h3>
                  <img src="image_lupa.png" alt="imagem lupa"></img>
                </div>
                <p style={{ ...pageText, fontSize: "1.5rem" }}>
                  Acompanhe como vão seus rendimentos através do Dashboard e saiba como estão suas aplicações.
                </p>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="p-4 border rounded h-100" style={{ backgroundColor: "#D9EAFD" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 style={{ ...pageText, fontWeight: "bold" }}>Calculadora de ativos financeiros</h3>
                  <img src="image_calculadora.png" alt="imagem calculadora"></img>
                </div>
                <p style={{ ...pageText, fontSize: "1.5rem" }}>
                  Nossa calculadora vai te ajudar a fazer os melhores investimentos e manter o controle de seus ativos ainda mais fácil.
                </p>
              </div>
            </Col>
          </Row>
          <Row className="text-center mt-4">
            <Col>
              <Button className="opacity-85" variant="primary" size="lg" style={{ backgroundColor: '#023E8A' }}>
                <Link to="/register" style={{ color: "white", textDecoration: 'none' }}>
                  Venha fazer parte do melhor gerente financeiro
                </Link>
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}

export default Home;