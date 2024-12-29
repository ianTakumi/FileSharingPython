import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import client from "../../../utils/client";

// Register necessary components with Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PieChart = () => {
  // Initialize fileData with empty structure for safety
  const [fileData, setFileData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        // Fetch file data from the backend API
        const response = await client.get(`/get-files/`, {
          withCredentials: true, // Include credentials (cookies)
        });
        console.log(response.data); // Log the response data to check its structure

        // Assuming the backend returns an object with file types as keys and counts as values
        const fileTypes = response.data;

        // Convert the object to arrays of labels and data
        const labels = Object.keys(fileTypes);
        const data = Object.values(fileTypes);

        // Safely update state with the correct structure for the Pie chart
        setFileData({
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40", // Add more colors if needed
              ],
              hoverOffset: 4,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching file data:", err);
      }
    };

    // Call the function to fetch data when the component mounts
    fetchFileData();
  }, []);

  // Options for the pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (context.parsed) {
              label += `: ${context.raw} Files`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="p-4 rounded-lg w-full max-w-sm mt-10">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Top 5 Uploaded File Types
        </h2>
        <Pie data={fileData} options={options} />
        <div className="flex justify-between items-center mt-6"></div>
      </div>
    </div>
  );
};

export default PieChart;
