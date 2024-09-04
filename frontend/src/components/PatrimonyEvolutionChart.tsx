import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { transaction } from "../types/transaction";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PatrimonyEvolution = ({
  transactions,
}: {
  transactions: transaction[];
}) => {
  const [chartData, setChartData] = React.useState<any>({
    labels: [],
    datasets: [
      {
        label: "Evolução do Patrimônio",
        data: [],
        backgroundColor: "rgba(25, 135, 84, 0.8)",
      },
      /*{
        label: 'Ganho de Capital',
        data: [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },*/
    ],
  });

  useEffect(() => {
    if (transactions.length === 0) return;

    const monthlyData: any = {};

    transactions.forEach((transaction) => {
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
    //const capitalGainData = labels.map((label) => monthlyData[label].capitalGain);

    setChartData({
      labels,
      datasets: [
        {
          label: "Evolução do Patrimônio",
          data: appliedData,
          backgroundColor: "rgba(25, 135, 84, 0.8)",
        },
        /*{
          label: 'Ganho de Capital',
          data: capitalGainData,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },*/
      ],
    });
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      /*title: {
        display: true,
        text: 'Evolução do Patrimônio',
      },*/
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PatrimonyEvolution;
