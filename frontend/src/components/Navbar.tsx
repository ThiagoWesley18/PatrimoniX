import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  fetchTransactions,
  getAtivoOutros,
  getQuoteLabel,
} from "../services/api";
import { transaction } from "../types/transaction";
import { ativo } from "../types/ativo";
import { logout } from "../services/api";
import { FaWallet, FaDollarSign } from "react-icons/fa";
import { AuthContext } from "../state/AuthProvider";
import formataValores from "../utils/formataValoresParaReal";

function Navbar() {
  const { session, setValorGanhos } = useContext(AuthContext);
  const [totalApplied, setTotalApplied] = useState("R$ 0,00");
  const [balance, setBalance] = useState("R$ 0,00");
  const [variation, setVariation] = useState(0);
  const { pathname } = useLocation();
  const navigation = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTransactions();
        const transactions: transaction[] = response.filter(
          (transaction) => transaction.userCpf === session
        );
        const assetTransactionsCompra = transactions.filter(
          (transaction) => transaction.transactionType === "Compra"
        );
        const assetTransactionsVenda = transactions.filter(
          (transaction) => transaction.transactionType === "Venda"
        );
        const calculatedTotalAppliedCompra = assetTransactionsCompra.reduce(
          (acc: number, transaction: transaction) =>
            acc +
            (transaction.price * transaction.quantity +
              Number(transaction.tax)),
          0
        );
        const calculatedTotalAppliedVenda = assetTransactionsVenda.reduce(
          (acc: number, transaction: transaction) =>
            acc +
            (transaction.price * transaction.quantity +
              Number(transaction.tax)),
          0
        );

        const calculatedTotalApplied =
          calculatedTotalAppliedCompra - calculatedTotalAppliedVenda;
        setTotalApplied(formataValores(calculatedTotalApplied));

        // código dos ativos
        const ativos: ativo[] = await getAtivoOutros();
        const outrosAtivos: string[] = [];
        for (const ativo of ativos) {
          outrosAtivos.push(ativo.tradingCode);
        }
        const uniqueTradingCodes = [
          ...new Set(transactions.map((t) => t.tradingCode)),
        ];

        // busca as cotações atuais dos ativos
        let totalBalance = 0;
        for (const tradingCode of uniqueTradingCodes) {
          if (outrosAtivos.includes(tradingCode) === false) {
            const quoteResponse = await getQuoteLabel(tradingCode);
            const quote = quoteResponse.price;
            const assetTransactions = transactions.filter(
              (t) => t.tradingCode === tradingCode
            );
            const transactionsCompra = assetTransactions.filter(
              (transaction) => transaction.transactionType === "Compra"
            );
            const transactionsVenda = assetTransactions.filter(
              (transaction) => transaction.transactionType === "Venda"
            );
            const quantityCompra = transactionsCompra.reduce(
              (acc, t) => acc + t.quantity,
              0
            );
            const quantityVenda = transactionsVenda.reduce(
              (acc, t) => acc + t.quantity,
              0
            );
            const totalQuantity = quantityCompra - quantityVenda;
            totalBalance += quote * totalQuantity;
          } else {
            const assetTransactions = transactions.filter(
              (t) => t.tradingCode === tradingCode
            );
            const transactionsCompra = assetTransactions.filter(
              (transaction) => transaction.transactionType === "Compra"
            );
            const transactionsVenda = assetTransactions.filter(
              (transaction) => transaction.transactionType === "Venda"
            );
            const quantityCompra = transactionsCompra.reduce(
              (acc, t) => acc + t.quantity,
              0
            );
            const quantityVenda = transactionsVenda.reduce(
              (acc, t) => acc + t.quantity,
              0
            );
            const index = outrosAtivos.indexOf(tradingCode);

            const totalQuantity = quantityCompra - quantityVenda;
            const ativoAtual = transactions.find(
              (element) => element.tradingCode === outrosAtivos[index]
            );
            totalBalance +=
              (Number(ativoAtual?.price || 0) +
                (Number(ativoAtual?.tax) || 0)) *
              totalQuantity;
          }
        }

        setBalance(formataValores(totalBalance));
        setValorGanhos(totalBalance);

        if (calculatedTotalApplied === 0) {
          setVariation(0);
        } else {
          setVariation(
            ((totalBalance - calculatedTotalApplied) / calculatedTotalApplied) *
              100
          );
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const onLogout = async () => {
    try {
      await logout();
      navigation("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro ao deslogar:", error);
        console.error("Detalhes do erro:", error.response?.data?.details);
      } else {
        console.error("Erro ao deslogar:", (error as Error).message);
      }
    }
  };

  if (pathname === "/404") {
    return null;
  } else if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/"
  ) {
    return (
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <div className="navbar-brand">
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              PatrimoniX <i className="bi bi-graph-up-arrow"></i>
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDisconnected"
            aria-controls="navbarNavDisconnected"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ color: "#004055", backgroundColor: "white" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDisconnected">
            <ul className="navbar-nav ms-auto">
              {/* <li className="nav-item ">
                <Link className="nav-link" to="/sobre" style={{ color: "white" }}>
                  Sobre
                </Link>
              </li>   ------  REQUER BUGFIX */}
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/register"
                  style={{
                    color: "#004055",
                    backgroundColor: "white",
                    borderRadius: "10%",
                  }}
                >
                  Cadastrar
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/login"
                  style={{
                    color: "#004055",
                    backgroundColor: "white",
                    borderRadius: "10%",
                  }}
                >
                  Entrar
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="navbar navbar-expand-lg ">
        <div className="container-fluid">
          <div className="navbar-brand" style={{ color: "white" }}>
            <Link to="/wallet" style={{ color: "white", textDecoration: "none" }}>
              PatrimoniX <i className="bi bi-graph-up-arrow"></i>
            </Link>
          </div>
          <div className="d-flex align-items-center">
            <span
              className="navbar-text mx-2 d-flex align-items-center"
              style={{ color: "white" }}
            >
              <FaWallet size={28} />
              <div className="d-flex flex-column align-items-start ms-2">
                VALOR APLICADO
                <br />
                {totalApplied}
              </div>
            </span>
            <span
              className="navbar-text mx-2 d-flex align-items-center"
              style={{ color: "white" }}
            >
              <FaDollarSign size={28} />
              <div className="d-flex flex-column align-items-start ms-2">
                SALDO BRUTO
                <br />
                {balance}
              </div>
            </span>
            <span
              className="navbar-text mx-2 d-flex align-items-center"
              style={{ color: "white" }}
            >
              <FaDollarSign size={28} />
              <span
                className="d-flex flex-column align-items-start ms-2"
                style={{ color: "white" }}
              >
                VARIAÇÃO
                <span
                  className={variation < 0 ? "text-danger" : "text-success"}
                >
                  {variation.toFixed(2)}%
                </span>
              </span>
            </span>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ color: "#004055", backgroundColor: "white" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item" key={"wallet"}>
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/wallet"
                  style={{ color: "white" }}
                >
                  Carteira
                </Link>
              </li>
              <li className="nav-item" key={"dashboard"}>
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/graficos"
                  style={{ color: "white" }}
                >
                  Gráficos
                </Link>
              </li>
              
              <li className="nav-item" key={"history"}>
                <Link
                  className="nav-link"
                  to="/transaction/history"
                  style={{ color: "white" }}
                >
                  Histórico
                </Link>
              </li>
              <li className="nav-item" key={"aporte"}>
                <Link
                  className="nav-link"
                  to="aporte"
                  style={{ color: "white" }}
                >
                  Aporte
                </Link>
              </li>
              <li className="nav-item" key={"metas"}>
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/metas"
                  style={{ color: "white" }}
                >
                  Metas
                </Link>
              </li>
              <li className="nav-item" key={"sobre"}>
                <Link
                  className="nav-link"
                  to="/sobre"
                  style={{ color: "white" }}
                >
                  Sobre
                </Link>
              </li>
              <li className="nav-item" key={"perfil"}>
                <Link
                  className="nav-link"
                  to="/profile"
                  style={{ color: "white" }}
                >
                  Perfil
                </Link>
              </li>
              <li className="nav-item" key={"suporte"}>
                <Link className="nav-link" to="/suporte" style={{ color: "white" }}>
                  Suporte
                </Link>
              </li>
            </ul>
            <button
              className="btn btn-secondary ms-3"
              onClick={onLogout}
              style={{ color: "#004055", backgroundColor: "white" }}
            >
              Sair
            </button>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
