import React, { useContext, useEffect, useState } from "react";
import { fetchTransactions, fetchUserTransactions } from "../services/api";
import { transaction, userTransaction } from "../types/transaction";
import PatrimonyEvolutionChart from "./PatrimonyEvolutionChart";
import ValueAppliedChart from "./ValueAppliedChart";
import PizzaDistributionChart from "./PizzaDistributionChart";
import PizzaDistributionChart1 from "./PizzaDistributionChart1";
import PizzaDistributionChart2 from "./PizzaDistributionChart2";
import PizzaDistributionChart3 from "./PizzaDistributionChart3";
import { AuthContext } from "../state/AuthProvider";
import "../styles/styles.css";
import RentabilidadePorIndices from "./RentabilidadePorIndices";
import { RentabilidadeData } from "../types/rentabilidade";
import { getUserRentabilidade } from "../services/api";

function Dashboard() {
  const { session } = useContext(AuthContext);
  const [transactions, setTransactions] = useState<transaction[]>([]);
  const [userTransactions, setUserTransactions] = useState<userTransaction[]>(
    []
  );
  const [userRentabilidade, setUserRentabilidade] = useState<RentabilidadeData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsResponse = await fetchTransactions();
        setTransactions(
          transactionsResponse.filter(
            (transaction) => transaction.userCpf === session
          )
        );
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };
    fetchData();

    fetchUserTransactions(session).then((response) => {
      setUserTransactions(response);
    });

    getUserRentabilidade(session).then((response) => {
      setUserRentabilidade(response);
    })

  }, [session]);

  return (
    <>
      <h1 className="container mt-5 textBlue">Gráficos</h1>
      <div
        className="container p-4"
        style={{ backgroundColor: "#D9EAFD", borderRadius: "5px" }}
      >
        <div className="row justify-content-center mx-0">
          <div className="card h-100 py-5 shadow section">
            <div className="card-body">
              <RentabilidadePorIndices data={userRentabilidade}/>
            </div>
          </div>

          <h5 className="textBlue">Evolução do valor acumulado por mês</h5>
          <div className="card h-100 py-2 shadow section">
            <div className="card-body">
              <PatrimonyEvolutionChart transactions={transactions} />
            </div>
          </div>
          <h5 className="textBlue">Evolução do valor aplicado por mês</h5>
          <div className="card h-100 py-2 shadow section">
            <div className="card-body">
              <ValueAppliedChart transactions={transactions} />
            </div>
          </div>
          <div className="card h-100 shadow section col-md-6">
            <div className="card-body">
              <PizzaDistributionChart2 transactions={transactions} />
            </div>
          </div>
          <div className="card h-100 shadow section col-md-6">
            <div className="card-body">
              <PizzaDistributionChart3 transactions={transactions} />
            </div>
          </div>
          <div className="card h-100 shadow section col-md-6">
            <div className="card-body">
              <PizzaDistributionChart transactions={transactions} />
            </div>
          </div>
          <div className="card h-100 shadow section col-md-6">
            <div className="card-body">
              <PizzaDistributionChart1 transactions={userTransactions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
