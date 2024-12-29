import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import client from "../../../utils/client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get(`/upload-per-month/`, {
          withCredentials: true,
        });
        setMonthlyData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures fetch only runs on mount

  // Array of colors for each month (you can customize this to match your design)
  const colors = [
    "rgba(75, 192, 192, 0.6)", // January
    "rgba(255, 99, 132, 0.6)", // February
    "rgba(255, 159, 64, 0.6)", // March
    "rgba(153, 102, 255, 0.6)", // April
    "rgba(54, 162, 235, 0.6)", // May
    "rgba(255, 205, 86, 0.6)", // June
    "rgba(201, 203, 207, 0.6)", // July
    "rgba(75, 192, 192, 0.6)", // August
    "rgba(255, 99, 132, 0.6)", // September
    "rgba(255, 159, 64, 0.6)", // October
    "rgba(153, 102, 255, 0.6)", // November
    "rgba(54, 162, 235, 0.6)", // December
  ];

  // Data for bookings and order sales (can be dynamic if needed)
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Uploads", // You can change the label if needed
        data: monthlyData.map((item) => item.total_uploads), // Map the uploads count to the data array
        backgroundColor: monthlyData.map((_, index) => colors[index]), // Assign unique colors to each month
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options with currency formatting
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for responsiveness
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Uploads per Month",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="chart-container w-full h-96 md:h-[500px] lg:h-[600px] p-4 bg-white rounded-lg">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
