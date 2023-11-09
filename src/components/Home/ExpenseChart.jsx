import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Expenses Over Time",
    },
  },
};

export const ExpenseChart = ({ transactions }) => {
  // Create chart data using the useMemo hook for performance optimization
  const chartData = useMemo(() => {
    // Group transactions by day
    const groupedByDay = transactions.reduce((acc, transaction) => {
      // Extract the date part only from date_posted
      const date = transaction.date_posted.split("T")[0];
      // If the date isn't already in the accumulator, initialize it
      if (!acc[date]) {
        acc[date] = 0;
      }
      // Sum the amounts for each day
      acc[date] += transaction.amount;
      return acc;
    }, {});

    // Sort the dates and create labels and data arrays
    const sortedDates = Object.keys(groupedByDay).sort();
    const labels = sortedDates;
    const dataPoints = sortedDates.map((date) => groupedByDay[date]);

    return {
      labels,
      datasets: [
        {
          label: "Daily Expenses",
          data: dataPoints,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        // You can add more datasets here if needed
      ],
    };
  }, [transactions]); // Only recompute if transactions array changes

  return <Line options={options} data={chartData} />;
};
