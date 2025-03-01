"use client"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export function StockChart() {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const data = {
    labels,
    datasets: [
      {
        label: "Portfolio Value",
        data: [10500, 11200, 10800, 11500, 12300, 12100, 13400, 14200, 13800, 15100, 16300, 17200],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "S&P 500",
        data: [10500, 10700, 10900, 11200, 11500, 11800, 12100, 12400, 12700, 13000, 13300, 13600],
        borderColor: "rgb(107, 114, 128)",
        backgroundColor: "rgba(107, 114, 128, 0.0)",
        tension: 0.3,
        borderDash: [5, 5],
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  }

  return (
    <div className="h-[400px] text-accent w-full">
      <Line data={data} options={options} />
    </div>
  )
}

