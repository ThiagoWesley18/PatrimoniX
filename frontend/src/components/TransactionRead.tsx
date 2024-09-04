import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTransaction, deleteTransaction, getAtivo } from "../services/api";
import { transaction } from "../types/transaction";
import { ativo } from "../types/ativo";
import { formDataInterface } from "../types/forms";

function TransactionRead() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tipoAtivo, setTipoAtivo] = useState<string>("");
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

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().slice(0, 16);
    return formattedDate;
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      if (id) {
        try {
          const result: transaction = await getTransaction(id);
          const ativo: ativo = await getAtivo(result.tradingCode);
          setFormData({
            tax: result.tax.toString(),
            executionDate: formatDateForInput(result.executionDate),
            transactionType: result.transactionType,
            institution: ativo.nomeInstituicao,
            tradingCode: result.tradingCode,
            quantity: result.quantity.toString(),
            price: result.price.toString(),
            totalValue: result.totalValue.toString(),
          });
          setTipoAtivo(ativo.tipo);
        } catch (error) {
          navigate("/404");
          console.error("Error fetching transaction:", error);
        }
      }
    };
    fetchTransaction();
  }, [id, navigate]);

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      navigate("/transaction/history");
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="card w-50">
          <div className="card-body">
            <h5 className="card-title text-center mb-4">Informações da Operação</h5>
            <div className="d-flex justify-content-around mb-3">
              {formData.transactionType === "Compra" ? (
                <button type="button" className="btn btn-success" disabled>
                  COMPRA
                </button>
              ) : (
                <button type="button" className="btn btn-danger" disabled>
                  VENDA
                </button>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Código do Ativo</label>
              <p className="form-control-plaintext">{formData.tradingCode}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Tipo do Ativo</label>
              <p className="form-control-plaintext">{tipoAtivo}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Instituição Financeira</label>
              <p className="form-control-plaintext">{formData.institution}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Data de Execução</label>
              <p className="form-control-plaintext">{formData.executionDate}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Quantidade</label>
              <p className="form-control-plaintext">{formData.quantity}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Preço</label>
              <p className="form-control-plaintext">R$ {formData.price}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Total das taxas</label>
              <p className="form-control-plaintext">R$ {formData.tax}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Valor Total</label>
              <p className="form-control-plaintext">R$ {formData.totalValue}</p>
            </div>
            <div className="d-flex justify-content-between">
              <Link className="btn btn-primary" to={"/transaction/history"}>
                Voltar
              </Link>
              <Link
                className="btn btn-secondary"
                to={`/transaction/update/${id}`}
              >
                Editar
              </Link>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(id!)}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionRead;
