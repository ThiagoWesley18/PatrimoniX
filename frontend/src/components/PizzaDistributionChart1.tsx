import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { userTransaction } from "../types/transaction";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PizzaDistributionChartProps {
  transactions: userTransaction[];
}

const PizzaDistributionChart: React.FC<PizzaDistributionChartProps> = ({
  transactions,
}) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
    totalQuotes: 0,
  });

  useEffect(() => {
    if (transactions.length === 0) return;

    const assetData: { [key: string]: number } = {};
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#66FF66",
      "#FF66B2",
      "#66B2FF",
      "#FF6666",
    ];

    let totalQuotes = 0;

    transactions.forEach((transaction) => {
      if (!assetData[transaction.Ativo.tipo]) {
        assetData[transaction.Ativo.tipo] = 0;
      }
      if (transaction.transactionType === "Compra") {
        totalQuotes += transaction.quantity;
        assetData[transaction.Ativo.tipo] += transaction.quantity;
      } else if (transaction.transactionType === "Venda") {
        totalQuotes -= transaction.quantity;
        assetData[transaction.Ativo.tipo] -= transaction.quantity;
      }
    });
    const labels = Object.keys(assetData).map((x) => x.toUpperCase());
    const data = Object.values(assetData);
    const backgroundColor = labels.map(
      (_, index) => colors[index % colors.length]
    );

    setChartData({
      labels: labels,
      datasets: [
        {
          data, // Dados brutos
          backgroundColor,
        },
      ],
      totalQuotes,
    });
  }, [transactions]);

  return (
    <div className="d-flex justify-content-center">
      <div
        style={{ width: "80%", maxWidth: "500px", height: "auto" }}
        className="text-center"
      >
        <p>Composição da Carteira</p>
        <Doughnut
          data={chartData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context: any) {
                    const label = context.label || "";
                    const percentage = (
                      (context.raw / chartData.totalQuotes) *
                      100
                    ).toFixed(2);
                    return `${label}: ${percentage}%`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PizzaDistributionChart;
