import React from "react";

const Error401 = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="bg-white">
        <img
          src="/images/401.jpg"
          alt="Unauthorized Access"
          className="w-full h-full max-w-xs md:max-w-md lg:max-w-lg object-contain"
        />
      </div>
    </div>
  );
};

export default Error401;
