import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import client from "../../../utils/client";
import { notifyError } from "../../../utils/Helpers";
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const [contacts, setContacts] = useState([]);
  const [monthlyData, setMonthlyData] = useState(new Array(12).fill(0));

  const fetchContacts = async () => {
    try {
      const response = await client.get("/contact-list/");
      setContacts(response.data);
    } catch {
      notifyError("Error fetching contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    // Calculate the number of messages per month
    const counts = new Array(12).fill(0); // Initialize an array with 12 months

    contacts.forEach((contact) => {
      const month = new Date(contact.created_at).getMonth(); // Get month from created_at field
      counts[month] += 1; // Increment the count for the respective month
    });

    setMonthlyData(counts);
  }, [contacts]);

  // Data for the LineChart
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
        label: "Contact Us Messages",
        data: monthlyData, // Use monthlyData as the chart's data
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        tension: 0.4, // Smooth the line
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for responsiveness
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Number of Contact Us Messages (January - December)",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Messages: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString(); // Format values with commas if necessary
          },
        },
      },
    },
  };

  return (
    <div className="chart-container w-full h-96 md:h-[500px] lg:h-[600px] p-4 bg-white rounded-lg">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
