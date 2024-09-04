import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { transaction } from "../types/transaction";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PizzaDistributionChartProps {
  transactions: transaction[];
}

// Formata os numeros
const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  });
};

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

    transactions.forEach((transaction) => {
      if (!assetData[transaction.tradingCode]) {
        assetData[transaction.tradingCode] = 0;
      }
      if (transaction.transactionType === "Compra") {
        assetData[transaction.tradingCode] +=
          transaction.price * transaction.quantity + Number(transaction.tax);
      } else if (transaction.transactionType === "Venda") {
        assetData[transaction.tradingCode] -=
          transaction.price * transaction.quantity + Number(transaction.tax);
      }
    });

    const labels = Object.keys(assetData);
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
    });
  }, [transactions]);

  return (
    <div className="d-flex justify-content-center">
      <div
        style={{ width: "80%", maxWidth: "500px", height: "auto" }}
        className="text-center"
      >
        <p>Valor Aplicado por Ativo</p>
        <Doughnut
          data={chartData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || "";
                    const value = context.raw as number;
                    return `${label}: ${formatCurrency(value)}`;
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
