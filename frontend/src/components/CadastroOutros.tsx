

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import { transactionSubmit } from "../types/transaction";
import { ativo } from "../types/ativo";
import { formDataInterface } from "../types/forms";
import { AuthContext } from "../state/AuthProvider";
import { createTransaction, createTipoAtivo, createAtivo } from "../services/api";
import "../styles/styles.css";

const CadastroOutros = () => {
  const [show, setShow] = useState(false);
  const [transactionType, setTransactionType] = useState<string>("Compra");
  const [formData, setFormData] = useState<formDataInterface>({
    tax: "",
    executionDate: "",
    transactionType: "",
    totalValue: "",
    quantity: "",
    price: "",
    tradingCode: "",
    institution: "",
  });
  const [ativosInfo, setAtivosInfo] = useState<ativo>({
    tradingCode: "",
    nomeInstituicao: "",
    cnpj: "",
    tipo: "Outros"
  });
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "tradingCode") {
      ativosInfo.tradingCode = value;
    }
    if (name === "institution") {
      ativosInfo.nomeInstituicao = value;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData: transactionSubmit = {
      executionDate: new Date(formData.executionDate).toISOString(),
      tax: parseFloat(formData.tax),
      quantity: parseInt(formData.quantity, 10),
      price: parseFloat(formData.price),
      totalValue:
        parseInt(formData.quantity) * parseFloat(formData.price) +
        parseFloat(formData.tax),
      transactionType: transactionType,
      tradingCode: formData.tradingCode,
      userCpf: session,
    };
    try {
      await createTipoAtivo({ tipo: ativosInfo.tipo });
      await createAtivo(ativosInfo);
      await createTransaction(formattedData);
      setFormData({
        tax: "",
        executionDate: "",
        transactionType: "",
        totalValue: "",
        quantity: "",
        price: "",
        tradingCode: "",
        institution: "",
      });
      setAtivosInfo({
        tradingCode: "",
        nomeInstituicao: "",
        cnpj: "",
        tipo: "Outros"
      })
      navigate("/wallet");
    } catch (error) {
      const errorMessage = (error as Error).message;
      alert("Erro ao criar a transação: " + errorMessage);
    }
    handleClose();
  };

  return (
    <>
      <div>
        <Button variant="primary" onClick={handleShow}>
          Registrar operação com ativo personalizado
        </Button>
      </div>
      {show && <div className="modal-backdrop-custom"></div>}
      <Modal show={show} onHide={handleClose} dialogClassName="modal-custom-dialog">
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Ativo Personalizado</Modal.Title>
        </Modal.Header>
        <div className="d-flex justify-content-around mb-3 mt-3">
          {transactionType === "Compra" ? (
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setTransactionType("Compra")}
            >
              COMPRA
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => setTransactionType("Compra")}
            >
              COMPRA
            </button>
          )}

          {transactionType === "Venda" ? (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setTransactionType("Venda")}
            >
              VENDA
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => setTransactionType("Venda")}
            >
              VENDA
            </button>
          )}
        </div>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="tradingCode">
              <Form.Label>Código do Ativo</Form.Label>
              <Form.Control
                type="text"
                name="tradingCode"
                value={formData.tradingCode}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="ativoType">
              <Form.Label>Tipo do Ativo</Form.Label>
              <Form.Control
                type="text"
                name="ativoType"
                value={ativosInfo.tipo}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="institution">
              <Form.Label>Instituição Financeira</Form.Label>
              <Form.Control
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="executionDate">
              <Form.Label>Data de Execução</Form.Label>
              <Form.Control
                type="datetime-local"
                name="executionDate"
                value={formData.executionDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="quantity">
              <Form.Label>Quantidade</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="tax">
              <Form.Label>Total das taxas da Transação</Form.Label>
              <Form.Control
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit" className="mt-3">
                Salvar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CadastroOutros;