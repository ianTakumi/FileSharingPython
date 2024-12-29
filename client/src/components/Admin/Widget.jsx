import React from "react";
import { PersonOutlineOutlined as PersonOutlineOutlinedIcon } from "@mui/icons-material";
import { MonetizationOnOutlined as MonetizationOnOutlinedIcon } from "@mui/icons-material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PhoneIcon from "@mui/icons-material/Phone";
import { useNavigate } from "react-router-dom";
const Widget = ({ type, count }) => {
  let data;
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(data.url);
  };

  switch (type) {
    case "User":
      data = {
        title: "USERS",
        count: count,
        url: "/admin/users",
        link: "See all users",
        icon: (
          <PersonOutlineOutlinedIcon
            style={{
              width: "4rem",
              height: "4rem",
              color: "crimson",
              backgroundColor: "rgba(255,0,0,0.2)",
              padding: "0.5rem",
              borderRadius: "50%",
            }}
          />
        ),
      };
      break;
    case "Contact":
      data = {
        title: "Contacts",
        count: count,
        link: "View all contacts",
        url: "/admin/contacts",
        icon: (
          <PhoneIcon
            style={{
              width: "4rem",
              height: "4rem",
              color: "goldenrod",
              backgroundColor: "rgba(218,165,32,0.2)",
              padding: "0.5rem",
              borderRadius: "50%",
            }}
          />
        ),
      };
      break;
    case "File":
      data = {
        title: "All Files",
        count: count,
        link: "",
        icon: (
          <FileCopyIcon
            style={{
              width: "4rem",
              height: "4rem",
              color: "purple",
              backgroundColor: "rgba(128,0,128,0.2)",
              padding: "0.5rem",
              borderRadius: "50%",
            }}
          />
        ),
      };
      break;
    case "Earnings":
      data = {
        title: "EARNINGS",
        isMoney: true,
        link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            style={{
              width: "4rem",
              height: "4rem",
              color: "green",
              backgroundColor: "rgba(0,128,0,0.2)",
              padding: "0.5rem",
              borderRadius: "50%",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="flex justify-between p-6 shadow-md rounded-lg w-96 h-40 bg-white sm:w-full">
      <div className="flex flex-col justify-between">
        <span className="font-bold text-lg text-gray-600">{data.title}</span>
        <span className="text-4xl font-medium">
          {data.isMoney && "₱"} {count}
        </span>
        <span
          className="text-sm border-b border-gray-400 w-max cursor-pointer"
          onClick={handleNavigation}
        >
          {data.link}
        </span>
      </div>
      <div className="flex flex-col justify-between items-end py-6">
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
