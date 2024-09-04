import React, { useContext, useEffect, useState, useMemo } from "react";
import { FaCoins } from "react-icons/fa";
import {
  fetchTransactions,
  getAtivo,
  getAtivoOutros,
  getQuotes,
} from "../services/api";
import { Link } from "react-router-dom";
import { transaction } from "../types/transaction";
import { AuthContext } from "../state/AuthProvider";
import "../styles/styles.css";
import { Spinner } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { quotes } from "../types/quotes";
import formataValores from "../utils/formataValoresParaReal";

function calculateAveragePrice(
  compras: transaction[],
  vendas: transaction[]
): number {
  const totalValueCompras = compras.reduce(
    (acc, transaction) =>
      acc + Number(transaction.price) * Number(transaction.quantity),
    0
  );

  const totalValueVendas = vendas.reduce(
    (acc, transaction) =>
      acc + Number(transaction.price) * Number(transaction.quantity),
    0
  );

  const totalValue = totalValueCompras - totalValueVendas;
  const quantityCompras = compras.reduce(
    (acc, transaction) => acc + Number(transaction.quantity),
    0
  );
  const quantityVendas = vendas.reduce(
    (acc, transaction) => acc + Number(transaction.quantity),
    0
  );

  const totalQuantity = quantityCompras - quantityVendas;
  return totalValue / totalQuantity;
}

function calculateTotalBalance(
  compras: transaction[],
  vendas: transaction[]
): number {
  const totalCompras = compras.reduce(
    (acc, transaction) => acc + Number(transaction.totalValue),
    0
  );
  const totalVendas = vendas.reduce(
    (acc, transaction) => acc + Number(transaction.totalValue),
    0
  );

  return totalCompras - totalVendas;
}
const groupTransactionsByAsset = (transactions: transaction[]) => {
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.tradingCode]) {
      acc[transaction.tradingCode] = [];
    }
    acc[transaction.tradingCode].push(transaction);
    return acc;
  }, {} as { [key: string]: transaction[] });

  return Object.keys(groupedTransactions).map((tradingCode) => {
    const assetTransactions = groupedTransactions[tradingCode];
    const assetTransactionsCompra = assetTransactions.filter(
      (transaction) => transaction.transactionType === "Compra"
    );
    const assetTransactionsVenda = assetTransactions.filter(
      (transaction) => transaction.transactionType === "Venda"
    );
    const quantityCompra = assetTransactionsCompra.reduce(
      (acc, transaction) => acc + transaction.quantity,
      0
    );
    const quantityVenda = assetTransactionsVenda.reduce(
      (acc, transaction) => acc + Number(transaction.quantity),
      0
    );
    const totalQuantity = quantityCompra - quantityVenda;
    const averagePrice = calculateAveragePrice(
      assetTransactionsCompra,
      assetTransactionsVenda
    );
    const totalBalance = calculateTotalBalance(
      assetTransactionsCompra,
      assetTransactionsVenda
    );

    return {
      tradingCode,
      totalQuantity,
      averagePrice,
      totalBalance,
    };
  });
};

function calculateVariationPercentage(
  currentPrice: number,
  averagePrice: number
): number {
  return ((currentPrice - averagePrice) / averagePrice) * 100;
}

function calculateGrossBalance(
  totalQuantity: number,
  currentPrice: number
): number {
  return totalQuantity * currentPrice;
}

function TransactionList() {
  const { session } = useContext(AuthContext);
  const [transactions, setTransactions] = useState<transaction[]>([]);
  const [stockQuotes, setStockQuotes] = useState<quotes>({});
  const [isLoading, setIsLoading] = useState(true);
  const [groupAtivo, setGroupAtivo] = useState<{
    [key: string]: [ativoAsset: string, tipo_ativo: string];
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsResponse = await fetchTransactions();
        setTransactions(
          transactionsResponse.filter(
            (transaction) => transaction.userCpf === session
          )
        );

        const grouped = groupTransactionsByAsset(
          transactionsResponse.filter(
            (transaction) => transaction.userCpf === session
          )
        );
        const ativosOutros = await getAtivoOutros();
        const outros = [];
        for (let i = 0; i < ativosOutros.length; i++) {
          outros.push(ativosOutros[i].tradingCode);
        }

        const quotes: quotes = await getQuotes(session);
        const quotesOutros: quotes = {};
        for (const group of grouped) {
          if (outros.includes(group.tradingCode) === true) {
            quotesOutros[group.tradingCode] = 1;
          }
        }
        setStockQuotes({ ...quotes, ...quotesOutros });
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [session]);

  // atualiza as cotaçoes a cada 5 minuto
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const quotes: quotes = await getQuotes(session);
        setStockQuotes(quotes);
      } catch (error) {
        console.error("Erro ao buscar cotações:", error);
      }
    }, 1000 * 60 * 5);
    return () => {
      clearInterval(interval);
    };
  },[session]);

  // para sicronizaçao dos ativos de acordo com as transaçoes do usuario, o userEffect depende da variavel de estado transactions
  useEffect(() => {
    let isMounted = true;
    const groupedAtivo: {
      [key: string]: [ativoAsset: string, tipo_ativo: string];
    } = {};

    // realiza o fetch e salva no obj grupoAtivo
    const fetchAtivos = async (tradingCode: string) => {
      const ativo = await getAtivo(tradingCode);
      //const tipoAtivo = await getTipoAtivo(ativo.tipo);
      groupedAtivo[tradingCode] = [ativo.nomeInstituicao, ativo.tipo];
    };

    // percorre as transaçoes e verifica se o ativo ja foi buscado, caso nao tenha sido, chama a funçao de fetch( fetchAtivos), no final seta o estado groupAtivo
    // com o obj atualizado na funçao fetchAtivos
    const updateGroupedAtivo = async () => {
      try {
        for (const transaction of transactions) {
          if (!groupedAtivo[transaction.tradingCode]) {
            await fetchAtivos(transaction.tradingCode);
          }
        }
        if (isMounted) setGroupAtivo(groupedAtivo);
      } catch (error) {
        console.error("Erro ao buscar Ativos:", error);
      }
    };
    updateGroupedAtivo();
    // previne memory leak
    return () => {
      isMounted = false;
    };
  }, [transactions]);

  const groupedTransactions = useMemo(
    () => groupTransactionsByAsset(transactions),
    [transactions]
  );

  const totalAtivos = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      return acc + transaction.totalQuantity;
    }, 0);
  }, [groupedTransactions]);

  const saldoBrutoTotalAçao = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "acao") {
        const currentPrice = stockQuotes[transaction.tradingCode] || 0;
        const grossBalance = calculateGrossBalance(
          transaction.totalQuantity,
          currentPrice
        );
        return acc + grossBalance;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo, stockQuotes]);

  const totalAtivosAcao = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "acao") {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo]);

  const totalCotasAcao = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "acao") {
        return acc + transaction.totalQuantity;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo]);

  const totalPercentageAcao = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "acao") {
        const currentPrice = stockQuotes[transaction.tradingCode] || 0;
        const variationPercentage = calculateVariationPercentage(
          currentPrice,
          transaction.averagePrice
        );
        return acc + variationPercentage;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo, stockQuotes]);

  const saldoBrutoTotalFII = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "fii") {
        const currentPrice = stockQuotes[transaction.tradingCode] || 0;
        const grossBalance = calculateGrossBalance(
          transaction.totalQuantity,
          currentPrice
        );
        return acc + grossBalance;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo, stockQuotes]);

  const totalAtivosFII = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "fii") {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo]);

  const totalCotasFII = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "fii") {
        return acc + transaction.totalQuantity;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo]);

  const totalPercentageFII = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "fii") {
        const currentPrice = stockQuotes[transaction.tradingCode] || 0;
        const variationPercentage = calculateVariationPercentage(
          currentPrice,
          transaction.averagePrice
        );
        return acc + variationPercentage;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo, stockQuotes]);

  const saldoBrutoTotalETF = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "etf") {
        const currentPrice = stockQuotes[transaction.tradingCode] || 0;
        const grossBalance = calculateGrossBalance(
          transaction.totalQuantity,
          currentPrice
        );
        return acc + grossBalance;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo, stockQuotes]);

  const totalAtivosETF = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "etf") {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo]);

  const totalCotasETF = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "etf") {
        return acc + transaction.totalQuantity;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo]);

  const totalPercentageETF = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "etf") {
        const currentPrice = stockQuotes[transaction.tradingCode] || 0;
        const variationPercentage = calculateVariationPercentage(
          currentPrice,
          transaction.averagePrice
        );
        return acc + variationPercentage;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo, stockQuotes]);

  const saldoBrutoTotalBDR = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "bdr") {
        const currentPrice = stockQuotes[transaction.tradingCode] || 0;
        const grossBalance = calculateGrossBalance(
          transaction.totalQuantity,
          currentPrice
        );
        return acc + grossBalance;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo, stockQuotes]);

  const totalAtivosBDR = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "bdr") {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo]);

  const totalCotasBDR = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "bdr") {
        return acc + transaction.totalQuantity;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo]);

  const totalPercentageBDR = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "bdr") {
        const currentPrice = stockQuotes[transaction.tradingCode] || 0;
        const variationPercentage = calculateVariationPercentage(
          currentPrice,
          transaction.averagePrice
        );
        return acc + variationPercentage;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo, stockQuotes]);

  const saldoBrutoTotalOutros = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "Outros") {
        const grossBalance = calculateGrossBalance(
          transaction.totalQuantity,
          transaction.averagePrice
        );
        return acc + grossBalance;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo]);

  const totalAtivosOutros = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "Outros") {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo]);

  const totalCotasOutros = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "Outros") {
        return acc + transaction.totalQuantity;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo]);

  const totalPercentageOutros = useMemo(() => {
    return groupedTransactions.reduce((acc, transaction) => {
      const group = groupAtivo[transaction.tradingCode];
      if (group && group[1] === "Outros") {
        const currentPrice = stockQuotes[transaction.tradingCode] || 0;
        const variationPercentage = calculateVariationPercentage(
          currentPrice,
          transaction.averagePrice
        );
        return acc + variationPercentage;
      }
      return acc;
    }, 0);
  }, [groupedTransactions, groupAtivo, stockQuotes]);

  return (
    <div className="container-fluid mt-5 px-3">
      {/*Cards*/}
      {/*
      <div className="row">

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Ganhos (Mês)</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">R$40,000</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-200"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Ganhos (Ano)</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">R$215,000</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-200"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Metas
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mx-2-7 mr-1 font-weight-bold text-gray-800">50%</div>
                    </div>
                    <div className="col">
                      <div className="progress progress-sm mr-2">
                        <div className="progress-bar bg-info" role="progressbar"
                          style={{ width: '50%' }} aria-valuenow={50} aria-valuemin={0}
                          aria-valuemax={100}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-clipboard-list fa-2x text-gray-200"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Metas Alcançadas</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">6</div>
                </div>
                <div className="col-auto">
                  <i className="fa-solid fa-square-check fa-2x text-gray-200"></i>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div> */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="textBlue">Carteira</h1>
        <div>
          <Link
            to={"/transaction/create"}
            className="btn"
            style={{
              backgroundColor: "#D9EAFD",
              borderStyle: "solid",
              borderColor: "#023E8A",
              color: "#023E8A",
              marginRight: "10px",
            }}
          >
            <i className="bi bi-plus-circle" style={{ marginRight: "5px" }}></i>
            Registrar Operação
          </Link>
          <Link
            to={"/aporte"}
            className="btn"
            style={{
              backgroundColor: "#D9EAFD",
              borderStyle: "solid",
              borderColor: "#023E8A",
              color: "#023E8A",
            }}
          >
            <i className="bi bi-plus-circle" style={{ marginRight: "5px" }}></i>
            Aporte
          </Link>
        </div>
      </div>

      {/*Tabela Ações*/}
      <div className=" card h-100 py-2 shadow section">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 style={{ color: "#023E8A" }}>Ações</h5>
            <div>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                {totalAtivosAcao} ativos
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                % na carteira:{" "}
                {totalAtivos === 0
                  ? 0
                  : ((totalCotasAcao / totalAtivos) * 100).toFixed(2)}
                %
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span
                style={{
                  fontSize: "1.4 em",
                  fontWeight: "600",
                }}
              >
                Variação:{" "}
              </span>
              <span
                style={{
                  fontSize: "1.4 em",
                  fontWeight: "600",
                  color: totalPercentageAcao >= 0 ? "green" : "red",
                }}
              >
                {totalAtivosAcao === 0
                  ? 0
                  : (totalPercentageAcao / totalAtivosAcao).toFixed(2)}
                %
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                Valor total: {formataValores(saldoBrutoTotalAçao)}
              </span>
              <button
                className="btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#acoesTable"
                aria-expanded="false"
                aria-controls="acoesTable"
              >
                <i className="bi bi-arrow-down-circle-fill"></i>
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <div
              style={{ position: "relative" }}
              id="acoesTable"
              className="collapse"
            >
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Ativo</th>
                      <th scope="col" className="text-center">
                        Quantidade
                      </th>
                      <th scope="col" className="text-center">
                        Preço Médio
                      </th>
                      <th scope="col" className="text-center">
                        Preço Atual
                      </th>
                      <th scope="col" className="text-center">
                        Variação
                      </th>
                      <th scope="col" className="text-center">
                        Saldo Aplicado
                      </th>
                      <th scope="col" className="text-center">
                        Saldo Bruto
                      </th>
                      <th scope="col" className="text-center">
                        Opções
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedTransactions.map((transaction, index) => {
                      if (
                        groupAtivo[transaction.tradingCode] &&
                        groupAtivo[transaction.tradingCode][1] === "acao"
                      ) {
                        const currentPrice =
                          stockQuotes[transaction.tradingCode] || 0;
                        const variationPercentage =
                          calculateVariationPercentage(
                            currentPrice,
                            transaction.averagePrice
                          );
                        const grossBalance = calculateGrossBalance(
                          transaction.totalQuantity,
                          currentPrice
                        );
                        return (
                          <tr key={index}>
                            <td>
                              <FaCoins style={{ marginRight: "0.5rem" }} />
                              {transaction.tradingCode}
                            </td>
                            <td className="text-center">
                              {transaction.totalQuantity}
                            </td>
                            <td className="text-center">
                              {formataValores(transaction.averagePrice)}
                            </td>
                            <td className="text-center">
                              {formataValores(currentPrice)}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                color:
                                  variationPercentage >= 0 ? "green" : "red",
                              }}
                            >
                              {variationPercentage.toFixed(2)}%
                            </td>
                            <td className="text-center">
                              {formataValores(transaction.totalBalance)}
                            </td>
                            <td className="text-center">
                              {formataValores(grossBalance)}
                            </td>
                            <td className="text-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-light rounded shadow-sm dropdown-toggle"
                                  type="button"
                                  id={`dropdownMenuButton-${index}`}
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                ></button>
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby={`dropdownMenuButton-${index}`}
                                >
                                  <li>
                                    <Link
                                      to={`/transaction/create?tradingCode=${
                                        transaction.tradingCode
                                      }&date=${new Date()
                                        .toISOString()
                                        .slice(0, 16)}&institution=${
                                        groupAtivo[transaction.tradingCode][0]
                                      }&type=${
                                        groupAtivo[transaction.tradingCode][1]
                                      }`}
                                      className="dropdown-item"
                                    >
                                      Adicionar Lançamento
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="/transaction/history"
                                      className="dropdown-item"
                                    >
                                      Ver Lançamentos
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return <></>;
                    })}
                  </tbody>
                  {/* <tfoot>  ---- CASO SEJA NECESSARIO VOLTAR A USAR EM BAIXO
                    <tr>
                        <th colSpan={3}>Valor Total:</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style={{ textAlign: "center" }}>
                          R$ {saldoBrutoTotalAçao.toFixed(2)}
                        </th>
                        <th colSpan={1}></th>
                      </tr>
                  </tfoot> */}
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/*Tabela FII*/}
      <div className=" card h-100 py-2 shadow section">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 style={{ color: "#023E8A" }}>FII</h5>
            <div>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                {totalAtivosFII} ativos
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                % na carteira:{" "}
                {totalAtivos === 0
                  ? 0
                  : ((totalCotasFII / totalAtivos) * 100).toFixed(2)}
                %{" "}
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span
                style={{
                  fontSize: "1.4 em",
                  fontWeight: "600",
                }}
              >
                Variação:{" "}
              </span>
              <span
                style={{
                  fontSize: "1.4 em",
                  fontWeight: "600",
                  color: totalPercentageFII >= 0 ? "green" : "red",
                }}
              >
                {totalAtivosFII === 0
                  ? 0
                  : (totalPercentageFII / totalAtivosFII).toFixed(2)}
                %
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                Valor total: {formataValores(saldoBrutoTotalFII)}
              </span>
              <button
                className="btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#fiiTable"
                aria-expanded="false"
                aria-controls="fiiTable"
              >
                <i className="bi bi-arrow-down-circle-fill"></i>
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <div
              style={{ position: "relative" }}
              id="fiiTable"
              className="collapse"
            >
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Ativo</th>
                      <th scope="col" className="text-center">
                        Quantidade
                      </th>
                      <th scope="col" className="text-center">
                        Preço Médio
                      </th>
                      <th scope="col" className="text-center">
                        Preço Atual
                      </th>
                      <th scope="col" className="text-center">
                        Variação
                      </th>
                      <th scope="col" className="text-center">
                        Saldo Aplicado
                      </th>
                      <th scope="col" className="text-center">
                        Saldo Bruto
                      </th>
                      <th scope="col" className="text-center">
                        Opções
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedTransactions.map((transaction, index) => {
                      if (
                        groupAtivo[transaction.tradingCode] &&
                        groupAtivo[transaction.tradingCode][1] === "fii"
                      ) {
                        const currentPrice =
                          stockQuotes[transaction.tradingCode] || 0;
                        const variationPercentage =
                          calculateVariationPercentage(
                            currentPrice,
                            transaction.averagePrice
                          );
                        const grossBalance = calculateGrossBalance(
                          transaction.totalQuantity,
                          currentPrice
                        );

                        return (
                          <tr key={index}>
                            <td>
                              <FaCoins style={{ marginRight: "0.5rem" }} />
                              {transaction.tradingCode}
                            </td>
                            <td className="text-center">
                              {transaction.totalQuantity}
                            </td>
                            <td className="text-center">
                              {formataValores(transaction.averagePrice)}
                            </td>
                            <td className="text-center">
                              {formataValores(currentPrice)}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                color:
                                  variationPercentage >= 0 ? "green" : "red",
                              }}
                            >
                              {variationPercentage.toFixed(2)}%
                            </td>
                            <td className="text-center">
                              {formataValores(transaction.totalBalance)}
                            </td>
                            <td className="text-center">
                              {formataValores(grossBalance)}
                            </td>
                            <td className="text-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-light rounded shadow-sm dropdown-toggle"
                                  type="button"
                                  id={`dropdownMenuButton-${index}`}
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                ></button>
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby={`dropdownMenuButton-${index}`}
                                >
                                  <li>
                                    <Link
                                      to={`/transaction/create?tradingCode=${
                                        transaction.tradingCode
                                      }&date=${new Date()
                                        .toISOString()
                                        .slice(0, 16)}&institution=${
                                        groupAtivo[transaction.tradingCode][0]
                                      }&type=${
                                        groupAtivo[transaction.tradingCode][1]
                                      }`}
                                      className="dropdown-item"
                                    >
                                      Adicionar Lançamento
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="/transaction/history"
                                      className="dropdown-item"
                                    >
                                      Ver Lançamentos
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return <></>;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/*Tabela ETF*/}
      <div className=" card h-100 py-2 shadow section">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 style={{ color: "#023E8A" }}>ETF</h5>
            <div>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                {totalAtivosETF} ativos
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                % na carteira:{" "}
                {totalAtivos === 0
                  ? 0
                  : ((totalCotasETF / totalAtivos) * 100).toFixed(2)}
                %{" "}
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span
                style={{
                  fontSize: "1.4 em",
                  fontWeight: "600",
                }}
              >
                Variação:{" "}
              </span>
              <span
                style={{
                  fontSize: "1.4 em",
                  fontWeight: "600",
                  color: totalPercentageETF >= 0 ? "green" : "red",
                }}
              >
                {totalAtivosETF === 0
                  ? 0
                  : (totalPercentageETF / totalAtivosETF).toFixed(2)}
                %
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                Valor total: {formataValores(saldoBrutoTotalETF)}
              </span>
              <button
                className="btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#etfTable"
                aria-expanded="false"
                aria-controls="etfTable"
              >
                <i className="bi bi-arrow-down-circle-fill"></i>
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <div
              style={{ position: "relative" }}
              id="etfTable"
              className="collapse"
            >
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Ativo</th>
                      <th scope="col" className="text-center">
                        Quantidade
                      </th>
                      <th scope="col" className="text-center">
                        Preço Médio
                      </th>
                      <th scope="col" className="text-center">
                        Preço Atual
                      </th>
                      <th scope="col" className="text-center">
                        Variação
                      </th>
                      <th scope="col" className="text-center">
                        Saldo Aplicado
                      </th>
                      <th scope="col" className="text-center">
                        Saldo Bruto
                      </th>
                      <th scope="col" className="text-center">
                        Opções
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedTransactions.map((transaction, index) => {
                      if (
                        groupAtivo[transaction.tradingCode] &&
                        groupAtivo[transaction.tradingCode][1] === "etf"
                      ) {
                        const currentPrice =
                          stockQuotes[transaction.tradingCode] || 0;
                        const variationPercentage =
                          calculateVariationPercentage(
                            currentPrice,
                            transaction.averagePrice
                          );
                        const grossBalance = calculateGrossBalance(
                          transaction.totalQuantity,
                          currentPrice
                        );

                        return (
                          <tr key={index}>
                            <td>
                              <FaCoins style={{ marginRight: "0.5rem" }} />
                              {transaction.tradingCode}
                            </td>
                            <td className="text-center">
                              {transaction.totalQuantity}
                            </td>
                            <td className="text-center">
                              {formataValores(transaction.averagePrice)}
                            </td>
                            <td className="text-center">
                              {formataValores(currentPrice)}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                color:
                                  variationPercentage >= 0 ? "green" : "red",
                              }}
                            >
                              {variationPercentage.toFixed(2)}%
                            </td>
                            <td className="text-center">
                              {formataValores(transaction.totalBalance)}
                            </td>
                            <td className="text-center">
                              {formataValores(grossBalance)}
                            </td>
                            <td className="text-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-light rounded shadow-sm dropdown-toggle"
                                  type="button"
                                  id={`dropdownMenuButton-${index}`}
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                ></button>
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby={`dropdownMenuButton-${index}`}
                                >
                                  <li>
                                    <Link
                                      to={`/transaction/create?tradingCode=${
                                        transaction.tradingCode
                                      }&date=${new Date()
                                        .toISOString()
                                        .slice(0, 16)}&institution=${
                                        groupAtivo[transaction.tradingCode][0]
                                      }&type=${
                                        groupAtivo[transaction.tradingCode][1]
                                      }`}
                                      className="dropdown-item"
                                    >
                                      Adicionar Lançamento
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="/transaction/history"
                                      className="dropdown-item"
                                    >
                                      Ver Lançamentos
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return <></>;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/*Tabela BDR*/}
      <div className=" card h-100 py-2 shadow section">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 style={{ color: "#023E8A" }}>BDR</h5>
            <div>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                {totalAtivosBDR} ativos
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                % na carteira:{" "}
                {totalAtivos === 0
                  ? 0
                  : ((totalCotasBDR / totalAtivos) * 100).toFixed(2)}
                %{" "}
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span
                style={{
                  fontSize: "1.4 em",
                  fontWeight: "600",
                }}
              >
                Variação:{" "}
              </span>
              <span
                style={{
                  fontSize: "1.4 em",
                  fontWeight: "600",
                  color: totalPercentageBDR >= 0 ? "green" : "red",
                }}
              >
                {totalAtivosBDR === 0
                  ? 0
                  : (totalPercentageBDR / totalAtivosBDR).toFixed(2)}
                %
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                Valor total: {formataValores(saldoBrutoTotalBDR)}
              </span>
              <button
                className="btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#bdrTable"
                aria-expanded="false"
                aria-controls="bdrTable"
              >
                <i className="bi bi-arrow-down-circle-fill"></i>
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <div
              style={{ position: "relative" }}
              id="bdrTable"
              className="collapse"
            >
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Ativo</th>
                      <th scope="col" className="text-center">
                        Quantidade
                      </th>
                      <th scope="col" className="text-center">
                        Preço Médio
                      </th>
                      <th scope="col" className="text-center">
                        Preço Atual
                      </th>
                      <th scope="col" className="text-center">
                        Variação
                      </th>
                      <th scope="col" className="text-center">
                        Saldo Aplicado
                      </th>
                      <th scope="col" className="text-center">
                        Saldo Bruto
                      </th>
                      <th scope="col" className="text-center">
                        Opções
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedTransactions.map((transaction, index) => {
                      if (
                        groupAtivo[transaction.tradingCode] &&
                        groupAtivo[transaction.tradingCode][1] === "bdr"
                      ) {
                        const currentPrice =
                          stockQuotes[transaction.tradingCode] || 0;
                        const variationPercentage =
                          calculateVariationPercentage(
                            currentPrice,
                            transaction.averagePrice
                          );
                        const grossBalance = calculateGrossBalance(
                          transaction.totalQuantity,
                          currentPrice
                        );

                        return (
                          <tr key={index}>
                            <td>
                              <FaCoins style={{ marginRight: "0.5rem" }} />
                              {transaction.tradingCode}
                            </td>
                            <td className="text-center">
                              {transaction.totalQuantity}
                            </td>
                            <td className="text-center">
                              {formataValores(transaction.averagePrice)}
                            </td>
                            <td className="text-center">
                              {formataValores(currentPrice)}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                color:
                                  variationPercentage >= 0 ? "green" : "red",
                              }}
                            >
                              {variationPercentage.toFixed(2)}%
                            </td>
                            <td className="text-center">
                              {formataValores(transaction.totalBalance)}
                            </td>
                            <td className="text-center">
                              {formataValores(grossBalance)}
                            </td>
                            <td className="text-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-light rounded shadow-sm dropdown-toggle"
                                  type="button"
                                  id={`dropdownMenuButton-${index}`}
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                ></button>
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby={`dropdownMenuButton-${index}`}
                                >
                                  <li>
                                    <Link
                                      to={`/transaction/create?tradingCode=${
                                        transaction.tradingCode
                                      }&date=${new Date()
                                        .toISOString()
                                        .slice(0, 16)}&institution=${
                                        groupAtivo[transaction.tradingCode][0]
                                      }&type=${
                                        groupAtivo[transaction.tradingCode][1]
                                      }`}
                                      className="dropdown-item"
                                    >
                                      Adicionar Lançamento
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="/transaction/history"
                                      className="dropdown-item"
                                    >
                                      Ver Lançamentos
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return <></>;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/*Tabela Outros*/}
      <div className=" card h-100 py-2 shadow section">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 style={{ color: "#023E8A" }}>Outros</h5>
            <div>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                {totalAtivosOutros} ativos
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                % na carteira:{" "}
                {totalAtivos === 0
                  ? 0
                  : ((totalCotasOutros / totalAtivos) * 100).toFixed(2)}
                %{" "}
              </span>
              <i className="bi bi-grip-vertical"></i>
              <span style={{ fontSize: "1.4 em", fontWeight: "600" }}>
                Valor total: {formataValores(saldoBrutoTotalOutros)}
              </span>
              <button
                className="btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#outrosTable"
                aria-expanded="false"
                aria-controls="outrosTable"
              >
                <i className="bi bi-arrow-down-circle-fill"></i>
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <div
              style={{ position: "relative" }}
              id="outrosTable"
              className="collapse"
            >
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Ativo</th>
                      <th scope="col" className="text-center">
                        Quantidade
                      </th>
                      <th scope="col" className="text-center">
                        Preço Médio
                      </th>
                      <th scope="col" className="text-center">
                        Saldo Aplicado
                      </th>
                      <th scope="col" className="text-center">
                        Opções
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedTransactions.map((transaction, index) => {
                      if (
                        groupAtivo[transaction.tradingCode] &&
                        groupAtivo[transaction.tradingCode][1] === "Outros"
                      ) {
                        return (
                          <tr key={index}>
                            <td>
                              <FaCoins style={{ marginRight: "0.5rem" }} />
                              {transaction.tradingCode}
                            </td>
                            <td className="text-center">
                              {transaction.totalQuantity}
                            </td>
                            <td className="text-center">
                              {formataValores(transaction.averagePrice)}
                            </td>
                            <td className="text-center">
                              {formataValores(transaction.totalBalance)}
                            </td>
                            <td className="text-center">
                              <div className="dropdown">
                                <button
                                  className="btn btn-light rounded shadow-sm dropdown-toggle"
                                  type="button"
                                  id={`dropdownMenuButton-${index}`}
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                ></button>
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby={`dropdownMenuButton-${index}`}
                                >
                                  <li>
                                    <Link
                                      to={`/transaction/create?tradingCode=${
                                        transaction.tradingCode
                                      }&date=${new Date()
                                        .toISOString()
                                        .slice(0, 16)}&institution=${
                                        groupAtivo[transaction.tradingCode][0]
                                      }&type=${
                                        groupAtivo[transaction.tradingCode][1]
                                      }`}
                                      className="dropdown-item"
                                    >
                                      Adicionar Lançamento
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="/transaction/history"
                                      className="dropdown-item"
                                    >
                                      Ver Lançamentos
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return <></>;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionList;
