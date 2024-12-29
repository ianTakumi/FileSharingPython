import React from "react";

const Index = () => {
  return (
    <div className="font-sans p-4 sm:p-8 flex flex-col items-center">
      {/* Centered Image */}
      <div className="flex justify-center mb-6 w-full max-w-xs sm:max-w-md">
        <img
          src="/images/nothing.png"
          alt="No Shared Files"
          className="w-full rounded-lg p-5 bg-transparent"
        />
      </div>

      {/* Info Text */}
      <div className="text-center text-gray-700 max-w-md">
        <div className="text-gray-500 text-sm sm:text-base">
          Use the new button to upload
        </div>
      </div>
    </div>
  );
};

export default Index;
