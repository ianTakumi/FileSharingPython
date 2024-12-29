import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Widget from "../../components/Admin/Widget";
import BarChart from "../../components/Admin/Chart/BarChart";
import LineChart from "../../components/Admin/Chart/LineChart";
import PieChart from "../../components/Admin/Chart/PieChart";
import Map from "../../components/Admin/Map";
import { notifySuccess, notifyError, getUser } from "../../utils/Helpers";
import client from "../../utils/client";

const Home = () => {
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const user = getUser();
  const [userCount, setUserCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  const getNumberofUsers = async () => {
    try {
      const response = await client.get(`/user-count/`, {
        withCredentials: true,
      });
      setUserCount(response.data.user_count);
    } catch (err) {
      console.error("Error fetching user count:", err);
    }
  };

  const getNumberOfContact = async () => {
    try {
      const response = await client.get(`/contact-count/`, {
        withCredentials: true,
      });
      setContactCount(response.data.contact_count);
    } catch (err) {
      notifyError("Error fetching number of contacts");
      console.error("Error fetching number of contacts:", err);
    }
  };

  const getNumberOfFiles = async () => {
    try {
      const response = await client.get("/files-count/", {
        withCredentials: true,
      });
      setFileCount(response.data.file_count);
    } catch (err) {
      notifyError("Error fetching number of files");
      console.error("Error fetching number of files:", err);
    }
  };

  useEffect(() => {
    getNumberofUsers();
    getNumberOfContact();
    getNumberOfFiles();

    if (loggedIn && user && user.is_superuser === true) {
      notifySuccess("Successfully logged in");
    }
  }, [loggedIn]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-left">Dashboard</h1>

      {showWelcome && (
        <div className="mt-5 bg-green-100 border border-green-200 text-green-800 p-4 shadow-md rounded-lg relative">
          <button
            className="absolute top-2 right-2 text-green-800 hover:text-green-900"
            onClick={() => setShowWelcome(false)}
          >
            &times;
          </button>
          <h2 className="text-lg md:text-xl font-semibold text-center md:text-left">
            Welcome, {user ? user.first_name + " " + user.last_name : "User"}!
          </h2>
          <p className="mt-2 text-center md:text-left">
            We are glad to have you on board. This is your admin dashboard where
            you can manage all aspects of the application.
          </p>
        </div>
      )}
      <div className="grid gap-4 py-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Widget type="User" count={userCount} />
        <Widget type="Contact" count={contactCount} />
        <Widget type="File" count={fileCount} />
      </div>

      <div className="mt-8 bg-white p-4 shadow-md rounded-lg">
        <BarChart />
      </div>

      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        <div className="flex-grow basis-full md:basis-1/2 lg:basis-1/3 p-4 bg-white shadow-md rounded-lg min-w-[250px]">
          <Map />
        </div>
        <div className="flex-grow basis-full md:basis-1/2 lg:basis-1/3 p-4 bg-white shadow-md rounded-lg min-w-[250px]">
          <PieChart />
        </div>
      </div>

      <div className="mt-5 bg-white p-4 shadow-md rounded-lg">
        <LineChart />
      </div>
    </div>
  );
};

export default Home;
