import React, { useEffect, FormEvent, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../state/AuthProvider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
} from "chart.js";
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from "react-chartjs-2";
import { transaction } from "../types/transaction";
import { meta } from "../types/metas";
import { deleteMeta } from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  Filler
);

interface PatrimonyEvolutionProps {
  transactions: transaction[];
  meta: meta;
}

const PatrimonyEvolution: React.FC<PatrimonyEvolutionProps> = ({ transactions, meta }) => {
  const { ganhos } = useContext(AuthContext);
  const CONSTANT_VALUE = meta.meta; // Valor constante para comparação
  const CONSTANT_DATE = meta.dataMeta.slice(0, 7); // Data constante para comparação
  const nome = meta.nomeMeta;

  const navigate = useNavigate();

  const [chartData, setChartData] = React.useState<any>({
    labels: [],
    datasets: [
      {
        label: "Evolução do Patrimônio",
        data: [],
        borderColor: "rgba(25, 135, 84, 0.8)",
        backgroundColor: "rgba(25, 135, 84, 0.2)",
        fill: true,
      },
      {
        label: "Valor da Meta",
        data: [],
        borderColor: "rgba(255, 99, 132, 0.8)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        borderDash: [10, 5], // Linha tracejada para destaque
      },
    ],
  });

  useEffect(() => {
    if (transactions.length === 0) return;

    const monthlyData: any = {};

    transactions.forEach((transaction: transaction) => {
      const [year, month] = transaction.executionDate.slice(0, 7).split("-");
      const monthYear = `${year}-${month}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { applied: 0, capitalGain: 0 };
      }

      if (transaction.transactionType === "Compra") {
        monthlyData[monthYear].applied +=
          transaction.price * transaction.quantity + Number(transaction.tax);
      } else if (transaction.transactionType === "Venda") {
        monthlyData[monthYear].applied -=
          transaction.price * transaction.quantity + Number(transaction.tax);
        monthlyData[monthYear].capitalGain +=
          transaction.price * transaction.quantity +
          Number(transaction.tax) -
          transaction.totalValue;
      }
    });
    const labels = Object.keys(monthlyData).sort();
    const appliedData = labels.map((label) => monthlyData[label].applied);
    
    for (let i = 1; i < appliedData.length; i++) {
      appliedData[i] += appliedData[i - 1];
    }

    if (appliedData.length > 0){
      appliedData[appliedData.length -1] = ganhos;
    }
    //const capitalGainData = labels.map((label) => monthlyData[label].capitalGain);

    const constantData = new Array(labels.length).fill(CONSTANT_VALUE);

    setChartData({
      labels,
      datasets: [
        {
          label: "Evolução do Patrimônio",
          data: appliedData,
          borderColor: "rgba(25, 135, 84, 0.8)",
          backgroundColor: "rgba(25, 135, 84, 0.2)",
          fill: true,
        },
        {
          label: "Valor da Meta",
          data: constantData,
          borderColor: "rgba(255, 99, 132, 0.8)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: false,
          borderDash: [10, 5],
        },
        {
          label: "Data da Meta",
          borderColor: "rgba(54, 162, 235, 0.8)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderDash: [10, 5],
        },
        /*{
          label: 'Ganho de Capital',
          data: capitalGainData,
          borderColor: 'rgba(53, 162, 235, 0.8)',
          backgroundColor: 'rgba(53, 162, 235, 0.2)',
          fill: true,
        },*/
      ],
    });
  }, [transactions, CONSTANT_VALUE, ganhos]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: meta.nomeMeta,
        font: {
          size: 24,
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: "line",
            scaleID: "x",
            value: CONSTANT_DATE,
            borderColor: "rgba(54, 162, 235, 0.8)",
            borderWidth: 5,
            borderDash: [10, 5],
          },
        },
      },
    },
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await deleteMeta(meta.nomeMeta);
      navigate("/metas");
      window.location.reload();
    } catch (error) {
      alert("Erro ao apagar meta!");
      console.error(error);
    }
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <form onSubmit={handleSubmit} className="d-flex justify-content-end">
        <Link to={`/metas/update/${nome}`} className="btn btn-warning">
          Modificar Meta
        </Link>
        <button type="submit" className="btn btn-danger ml-3">
          Apagar Meta
        </button>
      </form>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PatrimonyEvolution;