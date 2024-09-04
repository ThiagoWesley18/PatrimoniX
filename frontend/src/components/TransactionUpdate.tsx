import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  useContext,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { updateTransaction, getTransaction, getAtivo } from "../services/api";
import { transaction, transactionSubmit } from "../types/transaction";
import { ativo } from "../types/ativo";
import { formDataInterface } from "../types/forms";
import { AuthContext } from "../state/AuthProvider";

function TransactionUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useContext(AuthContext);
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
            totalValue: result.totalValue.toString(),
            quantity: result.quantity.toString(),
            price: result.price.toString(),
            tradingCode: result.tradingCode,
            institution: ativo.nomeInstituicao,
          });
        } catch (error) {
          navigate("/404");
          console.error("Error fetching transaction:", error);
        }
      }
    };
    fetchTransaction();
  }, [id, navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formattedData: transactionSubmit = {
      executionDate: new Date(formData.executionDate).toISOString(),
      quantity: parseInt(formData.quantity, 10),
      price: parseFloat(formData.price),
      totalValue:
        parseInt(formData.quantity) * parseFloat(formData.price) +
        parseFloat(formData.tax),
      transactionType: formData.transactionType,
      userCpf: session,
      tax: parseFloat(formData.tax),
      tradingCode: formData.tradingCode,
    };
    
    try {
      await updateTransaction(id!, formattedData);

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

      navigate("/wallet");
    } catch (error) {
      const errorMessage = (error as Error).message;
      alert("Erro ao editar a transação: " + errorMessage);
    }
  };

  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="card w-50" style={{ backgroundColor: "#D9EAFD" }}>
          <div className="card-body">
            <h5 className="card-title text-center mb-4">Editar Operação</h5>
            <div className="d-flex justify-content-around mb-3">
              {formData.transactionType === "Compra" ? (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      transactionType: "Compra",
                    }))
                  }
                >
                  COMPRA
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      transactionType: "Compra",
                    }))
                  }
                >
                  COMPRA
                </button>
              )}

              {formData.transactionType === "Venda" ? (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      transactionType: "Venda",
                    }))
                  }
                >
                  VENDA
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      transactionType: "Venda",
                    }))
                  }
                >
                  VENDA
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="tradingCode" className="form-label">
                  Código do Ativo
                </label>
                <p id="tradingCode" className="form-control-plaintext">
                  {formData.tradingCode}
                </p>
              </div>
              <div className="mb-3">
                <label htmlFor="institution" className="form-label">
                  Instituição Financeira
                </label>
                <p id="institution" className="form-control-plaintext">
                  {formData.institution}
                </p>
              </div>
              <div className="mb-3">
                <label htmlFor="transactionDate" className="form-label">
                  Data de Execução
                </label>
                <input
                  type="datetime-local"
                  id="transactionDate"
                  name="transactionDate"
                  className="form-control"
                  value={formData.executionDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">
                  Quantidade
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Preço
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tax" className="form-label">
                  Total de taxas
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="tax"
                  name="tax"
                  step="0.01"
                  value={formData.tax}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <Link className="btn btn-secondary" to={"/transaction/history"}>
                  Cancelar
                </Link>
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionUpdate;
