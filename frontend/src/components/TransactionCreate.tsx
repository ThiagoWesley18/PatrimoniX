import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  useContext,
} from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  createTransaction,
  fetchAtivos,
  fetchTipoAtivos,
  createTipoAtivo,
} from "../services/api";
import { transactionSubmit } from "../types/transaction";
import { ativo } from "../types/ativo";
import { formDataInterface } from "../types/forms";
import { AuthContext } from "../state/AuthProvider";
import { tipo_ativo } from "../types/tipo_ativo";
import CadastroOutros from "./CadastroOutros";

function TransactionForm() {
  const [transactionType, setTransactionType] = useState<string>("Compra");
  const [ativos, setAtivos] = useState<ativo[]>();
  const [tipoAtivos, setTipoAtivos] = useState<tipo_ativo[]>();
  const [actualInstitution, setActualInstitution] = useState<string>("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedTipoAtivo, setSelectedTipoAtivo] = useState<string>("");
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

  const getAtivos = async (type: string) => {
    try {
      const response = await fetchAtivos();
      setAtivos(response.filter((ativo) => ativo.tipo === type));

      const initialTradingCode = searchParams.get("tradingCode");
      if (initialTradingCode) {
        const selectedAtivo = response.find(
          (ativo: ativo) => ativo.tradingCode === initialTradingCode
        );
        setActualInstitution(selectedAtivo?.nomeInstituicao || "");
      }
    } catch (error) {
      console.log("Error fetching ativos");
    }
  };

  useEffect(() => {
    const initialTradingCode = searchParams.get("tradingCode") || "";
    const initialDate = searchParams.get("date") || "";
    const initialInstitution = searchParams.get("institution") || "";
    const initialType = searchParams.get("type") || "";
    setActualInstitution(initialInstitution);
    setSelectedTipoAtivo(initialType);

    setFormData((prevFormData) => ({
      ...prevFormData,
      tradingCode: initialTradingCode,
      executionDate: initialDate,
      institution: initialInstitution,
      transactionType: initialType,
    }));
  }, [searchParams]);

  if (selectedTipoAtivo) {
    getAtivos(selectedTipoAtivo);
  }

  useEffect(() => {
    const getTipoAtivos = async () => {
      try {
        const response = await fetchTipoAtivos();
        setTipoAtivos(response.data);
      } catch (error) {
        console.log("Error fetching tipos dos ativos");
      }
    };
    getTipoAtivos();
  }, [searchParams]);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "tradingCode") {
      const selectedAtivo = ativos?.find(
        (ativo) => ativo.tradingCode === value
      );
      setActualInstitution(selectedAtivo?.nomeInstituicao || "");
    }
    if (name === "ativoType") {
      const selectedTipoAtivo = tipoAtivos?.find(
        (tipoAtivo) => tipoAtivo.tipo === value
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        tradingCode: "",
      }));
      setActualInstitution("");
      getAtivos(selectedTipoAtivo!.tipo);
      setSelectedTipoAtivo(selectedTipoAtivo?.tipo || "");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
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
      await createTransaction(formattedData);
      await createTipoAtivo({ tipo: selectedTipoAtivo });
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
      setActualInstitution("");
      navigate("/wallet");
    } catch (error) {
      const errorMessage = (error as Error).message;
      alert("Erro ao criar a transação: " + errorMessage);
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
            <h5 className="card-title text-center mb-4">
              Registrar Operação
            </h5>
            <div className="d-flex justify-content-around mb-3">
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

            <form onSubmit={handleSubmit}>
              {tipoAtivos ? (
                <>
                  <div className="mb-3">
                    <label htmlFor="ativoType" className="form-label">
                      Tipo do Ativo
                    </label>
                    <select
                      id="ativoType"
                      name="ativoType"
                      className="form-select"
                      value={selectedTipoAtivo}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Selecione o tipo do ativo
                      </option>
                      {tipoAtivos.map((tipo) => (
                        <option key={tipo.id} value={tipo.tipo}>
                          {tipo.tipo}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <p></p>
              )}

              {ativos ? (
                <>
                  <div className="mb-3">
                    <label htmlFor="tradingCode" className="form-label">
                      Código do Ativo
                    </label>
                    <select
                      id="tradingCode"
                      name="tradingCode"
                      className="form-select"
                      value={formData.tradingCode}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Selecione um ativo
                      </option>
                      {ativos!.map((ativo) => (
                        <option key={ativo.cnpj} value={ativo.tradingCode}>
                          {ativo.tradingCode}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <p>Aguarde</p>
              )}

              <div className="mb-3">
                <label htmlFor="institution" className="form-label">
                  Instituição Financeira
                </label>
              </div>
              <p id="institution" className="form-control">
                {formData.institution
                  ? formData.institution
                  : actualInstitution}
              </p>
              <div className="mb-3">
                <label htmlFor="executionDate" className="form-label">
                  Data de execução
                </label>
                <input
                  type="datetime-local"
                  id="executionDate"
                  name="executionDate"
                  className="form-control"
                  value={formData.executionDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex justify-content-between">
                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    placeholder="0"
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
                    placeholder="0,00"
                    className="form-control"
                    id="price"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="tax" className="form-label">
                  Total das taxas da Transação
                </label>
                <input
                  type="number"
                  placeholder="0,00"
                  id="tax"
                  name="tax"
                  className="form-control"
                  value={formData.tax}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <Link className="btn btn-secondary" to={"/wallet"}>
                  Cancelar
                </Link>
                <button type="submit" className="btn btn-primary">
                  Criar
                </button>
              </div>
            </form>
            <div className="text-center m-3">
              <p>Nao achou o ativo que procurava? Cadastre um ativo personalizado.</p>{" "}
              <CadastroOutros />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionForm;
