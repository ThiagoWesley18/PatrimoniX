import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { transaction } from "../types/transaction";
import { getAtivoOutros, getQuoteLabel } from "../services/api";
import { ativo } from "../types/ativo";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PizzaDistributionChartProps {
  transactions: transaction[];
}

const PizzaDistributionChart: React.FC<PizzaDistributionChartProps> = ({ transactions }: PizzaDistributionChartProps) => {
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
    const fetchData = async () => {
      if (transactions.length === 0) return;

      const assetData: {
        [key: string]: {
          totalValue: number;
          quantity: number;
          currentValue: number;
        };
      } = {};
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

      for (const transaction of transactions) {
        if (!assetData[transaction.tradingCode]) {
          assetData[transaction.tradingCode] = {
            totalValue: 0,
            quantity: 0,
            currentValue: 0,
          };
        }
        if (transaction.transactionType === "Compra") {
          assetData[transaction.tradingCode].totalValue +=
            transaction.totalValue;
          assetData[transaction.tradingCode].quantity += transaction.quantity;
        } else if (transaction.transactionType === "Venda") {
          assetData[transaction.tradingCode].totalValue -=
            transaction.totalValue;
          assetData[transaction.tradingCode].quantity -= transaction.quantity;
        }
      }

      const labels = Object.keys(assetData);
      const data: number[] = [];
      let totalInvestedValue = 0;
      const ativos: ativo[] = await getAtivoOutros();
      const outrosAtivos = [];
      for (const ativo of ativos) {
        outrosAtivos.push(ativo.tradingCode);
      }
      for (const label of labels) {
        try {
          if (outrosAtivos.includes(label) === false) {
            const quoteResponse = await getQuoteLabel(label);
            const quote = quoteResponse.price;
            const totalValueWithVariation = assetData[label].quantity * quote; // Calcula o valor total com variação
            assetData[label].currentValue = totalValueWithVariation;
            totalInvestedValue += totalValueWithVariation;
            data.push(totalValueWithVariation);
          } else {
            const totalValue =
              assetData[label].totalValue * assetData[label].quantity;
            totalInvestedValue += totalInvestedValue;
            data.push(totalValue);
          }
        } catch (error) {
          console.error(`Erro ao buscar cotação para ${label}:`, error);
          data.push(0);
        }
      }

      const backgroundColor = labels.map(
        (_, index) => colors[index % colors.length]
      );

      setChartData({
        labels,
        datasets: [
          {
            data,
            backgroundColor,
          },
        ],
        assetData,
        totalInvestedValue,
      });
    };

    fetchData();
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            //const index = tooltipItem.dataIndex;
            const label = tooltipItem.label;
            const percentage = (
              (tooltipItem.raw / chartData.totalInvestedValue) *
              100
            ).toFixed(2);
            const value = formatCurrency(chartData.assetData[label].totalValue);
            return `${label}: ${percentage}%\nValor: R$ ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="d-flex justify-content-center">
      <div
        style={{ width: "80%", maxWidth: "500px", height: "auto" }}
        className="text-center"
      >
        <p>Valor Total por Ativo</p>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PizzaDistributionChart;
