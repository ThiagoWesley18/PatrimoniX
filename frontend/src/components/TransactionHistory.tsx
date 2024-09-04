import React, { useContext, useEffect, useState } from "react";
import { deleteTransaction, fetchUserTransactions } from "../services/api";
import { Link } from "react-router-dom";
import { userTransaction } from "../types/transaction";
import { AuthContext } from "../state/AuthProvider";
import "../styles/styles.css";
import formataValores from "../utils/formataValoresParaReal";

function TransactionHistory() {
  const [transactions, setTransactions] = useState<userTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    userTransaction[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dropdownName, setDropdownName] = useState<string>(
    "Filtrar ativos pelo tipo"
  );
  const { session } = useContext(AuthContext);
  const transactionsPerPage = 10;

  useEffect(() => {
    fetchUserTransactions(session).then((response) => {
      setTransactions(response);
      setFilteredTransactions(response);
    });
  }, [session]);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteTransaction(id);
      const updatedTransactions = transactions.filter(
        (transaction) => transaction.id !== id
      );
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterByAssetType = (type: string) => {
    if (type === "Todos os tipos") {
      setFilteredTransactions(transactions);
      setDropdownName("Todos os tipos");
    } else {
      const filtered = transactions.filter(
        (transaction) =>
          transaction.Ativo.tipo.toLowerCase() === type.toLowerCase()
      );
      setFilteredTransactions(filtered);
      setCurrentPage(1); // Resetar a paginação ao filtrar
      if (type === "acao") {
        setDropdownName("Ações");
      } else {
        setDropdownName(type.toUpperCase());
      }
    }
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatDateForDisplay = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Invalid Date";
      }
      return (
        date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
        " " +
        date.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (error) {
      console.error("Error parsing date:", error, dateString);
      return "Invalid Date";
    }
  };

  const sortTransactions = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      const dateA = new Date(a.executionDate).getTime();
      const dateB = new Date(b.executionDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFilteredTransactions(sortedTransactions);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container-fluid mt-5 px-3">
      <h1 className="textBlue">Histórico</h1>

      <div className="card h-100 py-2 shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Renda Variável</h5>
          </div>
          {/*Botões de filtragem e ordenação */}
          <div className="d-flex align-items-center mb-3">
            <button
              onClick={sortTransactions}
              className="btn btn-outline-primary mb-3"
            >
              Ordenar por Data (
              {sortOrder === "asc" ? "Mais Recentes" : "Mais Antigas"})
            </button>
            <div className="btn-group mb-3 ml-3">
              <button
                type="button"
                className="btn btn-outline-primary dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {dropdownName}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => filterByAssetType("acao")}
                  >
                    Ações
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => filterByAssetType("fii")}
                  >
                    FII
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => filterByAssetType("bdr")}
                  >
                    BDR
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => filterByAssetType("etf")}
                  >
                    ETF
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => filterByAssetType("Outros")}
                  >
                    Outros
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => filterByAssetType("Todos os tipos")}
                  >
                    Todos os tipos
                  </button>
                </li>
              </ul>
            </div>
          </div>
          {/*Tabela de histórico de transações */}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Tipo de transação</th>
                  <th scope="col">Ativo</th>
                  <th scope="col">Data de Execução</th>
                  <th scope="col" className="text-center">
                    Quantidade
                  </th>
                  <th scope="col" className="text-center">
                    Preço Unitário
                  </th>
                  <th scope="col" className="text-center">
                    Valor Total
                  </th>
                  <th scope="col" className="text-center">
                    Funções
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td
                      className="transaction-type"
                      style={{
                        borderLeft: `5px solid ${transaction.transactionType === "Compra"
                          ? "green"
                          : "red"
                          }`,
                      }}
                    >
                      {transaction.transactionType}
                    </td>
                    <td>{transaction.tradingCode}</td>
                    <td>{formatDateForDisplay(transaction.executionDate)}</td>
                    <td className="text-center">{transaction.quantity}</td>
                    <td className="text-center">
                      {formataValores(transaction.price)}
                    </td>
                    <td className="text-center">
                      {formataValores(transaction.totalValue)}
                    </td>
                    <td className="text-center">
                      <Link to={`/transaction/${transaction.id}`} className="btn">
                        <i className="bi bi-info-circle"></i>
                      </Link>
                      <Link
                        to={`/transaction/update/${transaction.id}`}
                        className="btn"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="btn"
                        disabled={loading}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav>
            <ul className="pagination">
              {Array.from(
                {
                  length: Math.ceil(
                    filteredTransactions.length / transactionsPerPage
                  ),
                },
                (_, index) => (
                  <li key={index + 1} className="page-item">
                    <button
                      onClick={() => paginate(index + 1)}
                      className="page-link"
                    >
                      {index + 1}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div >
  );
}

export default TransactionHistory;
