import React from "react";

const Sobre = () => {
  return (
    <div className="container my-5">
      {/*Titulo */}
      <div className="row">
        <div className="col-12">
          <h1 className="textBlue">Sobre</h1>
        </div>
      </div>
      {/*Objetivo + logo*/}
      <div className="row my-5">
        <div className="col-md-8">
          <h2 style={{ color: "#023E8A" }}>Objetivo</h2>
          <p style={{ fontSize: "1.5em" }}>
            O PatrimoniX nasce da dificuldade que as pessoas normalmente
            enfrentam ao procurar uma ferramenta de gestão para seus
            investimentos. Sendo assim, o objetivo da nossa aplicação é
            facilitar a interação com seus ativos e organizar seus investimentos
            de forma simples e prática.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <img
            src="logo_patrimonix.png"
            alt="Logo do PatrimoniX"
            className="img-fluid"
          />
        </div>
      </div>
      {/*Membros + Orientador*/}
      <div className="row my-5">
        <div className="col-md-6">
          <h3 className="mb-4" style={{ color: "#023E8A" }}>
            Membros
          </h3>
          <ul className="list-unstyled">
            <li className="d-flex align-items-center mb-3">
              <img
                src="/imagesMembers/image_Daniele.png"
                alt="Daniele Greice"
                className="rounded-circle me-2"
                width="40"
                height="40"
              />
              <span style={{ color: "#023E8A", fontSize: "1.5em" }}>
                Daniele Greice
              </span>
            </li>
            <li className="d-flex align-items-center mb-3">
              <img
                src="/imagesMembers/image_Max.png"
                alt="Max Souza"
                className="rounded-circle me-2"
                width="40"
                height="40"
              />
              <span style={{ color: "#023E8A", fontSize: "1.5em" }}>
                Max Souza
              </span>
            </li>
            <li className="d-flex align-items-center mb-3">
              <img
                src="/imagesMembers/image_Rodrigo.png"
                alt="Rodrigo Santos"
                className="rounded-circle me-2"
                width="40"
                height="40"
              />
              <span style={{ color: "#023E8A", fontSize: "1.5em" }}>
                Rodrigo Santos
              </span>
            </li>
            <li className="d-flex align-items-center mb-3">
              <img
                src="/imagesMembers/image_Thiago.png"
                alt="Thiago Wesley"
                className="rounded-circle me-2"
                width="40"
                height="40"
              />
              <span style={{ color: "#023E8A", fontSize: "1.5em" }}>
                Thiago Wesley
              </span>
            </li>
          </ul>
          <h3 className="mt-4 mb-4" style={{ color: "#023E8A" }}>
            Orientador
          </h3>
          <ul className="list-unstyled">
            <li className="d-flex align-items-center mb-3">
              <img
                src="/imagesMembers/image_Moises.png"
                alt="Moises Carvalho"
                className="rounded-circle me-2"
                width="40"
                height="40"
              />
              <span style={{ color: "#023E8A", fontSize: "1.5em" }}>
                Moisés Carvalho
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
