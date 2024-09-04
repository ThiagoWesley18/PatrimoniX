import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <h6 style={{ fontWeight: "bold" }}>Agradecimentos</h6>
        <div className="row align-items-center justify-content-around">
          <div className="col-lg-4 col-md-4 col-sm-12">
            <img
              src="logo_ufam.png"
              alt="UFAM"
              style={{ maxHeight: "60px", margin: "10px 0" }}
            />
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <img
              src="logo_webAcademy.png"
              alt="Web Academy"
              style={{ maxHeight: "60px", margin: "10px 0" }}
            />
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <img
              src="logo_motorola.png"
              alt="Motorola"
              style={{ maxHeight: "60px", margin: "10px 0" }}
            />
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <p style={{ marginBottom: "1vh" }}>PatrimoniX - Copyright © 2024</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
