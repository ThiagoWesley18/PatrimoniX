import React, { useState, useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import InicioMetas from "./InicioMetas";
import { transaction } from "../types/transaction";
import { AuthContext } from "../state/AuthProvider";
import { fetchTransactions } from "../services/api";
import { meta } from "../types/metas";
import PatrimonyEvolution from "./MetasEvolutionChart";
import { fetchMetas } from "../services/api";
import formataValores from "../utils/formataValoresParaReal";

function Metas() {
  const { session, ganhos } = useContext(AuthContext);
  const [transactions, setTransactions] = useState<transaction[]>([]);
  const [meta, setMeta] = useState<meta[]>([]);
  const [metasPorcetagem, setMetasPorcetagem] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsResponse = await fetchTransactions();
        setTransactions(
          transactionsResponse.filter(
            (transaction) => transaction.userCpf === session
          )
        );

        try {
          const metasResponse = await fetchMetas();
          setMeta(metasResponse);
        
        } catch (error) {
          console.error("Erro ao buscar metas:", error);
        }
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };
    fetchData();
  }, [session]);

  const metasAlcançadas = meta.reduce((acc, meta) => {
    if (meta.meta <= ganhos) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const metasTotal = meta.length > 0 ? meta.reduce((acc, meta) => acc + meta.meta, 0) : 0;
  const metas = useMemo(() => (ganhos && (metasTotal > 0)? (ganhos / metasTotal ) * 100 : 0), [metasTotal, ganhos]);

  useEffect(() => {
    setMetasPorcetagem(parseFloat(metas.toFixed(2)));
    const interval = setInterval(() => {
      setMetasPorcetagem(parseFloat(metas.toFixed(2)));
    }, 1000*60*5);
    return () => clearInterval(interval);
  }, [metas]);

  return (
    <div className="container-fluid mt-5 px-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="textBlue">Metas</h1>
        <div>
          <Link
            to={"/metas/create"}
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
            Nova Meta
          </Link>
        </div>
      </div>
      {/*Cards*/}
      <div className="row">

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Quantidade de Metas</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{meta.length}</div>
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
                    Metas Totais (R$)</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{formataValores(metasTotal)}</div>
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
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Evolução Total das Metas (%)
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mx-2-7 mr-1 font-weight-bold text-gray-800">{metasPorcetagem}%</div>
                    </div>
                    <div className="col">
                      <div className="progress progress-sm mr-2">
                        <div className="progress-bar bg-info" role="progressbar"
                          style={{ width: metasPorcetagem+"%" }} aria-valuenow={metasPorcetagem} aria-valuemin={0}
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
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{metasAlcançadas}</div>
                </div>
                <div className="col-auto">
                  <i className="fa-solid fa-square-check fa-2x text-gray-200"></i>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div> 

            {meta.length === 0 ? (
        <InicioMetas />
      ) : (
        meta.map((meta) => (
          <div key={meta.nomeMeta} style={{ marginBottom: '100px' }}>
            <PatrimonyEvolution transactions={transactions} meta={meta} />
          </div>
        ))
      )}
    </div>
  );
}

export default Metas;
