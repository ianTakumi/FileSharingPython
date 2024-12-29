import React, { useEffect, useState } from "react";
import client from "../../../utils/client";
import { formatDate, notifyError, notifySuccess } from "../../../utils/Helpers";

const Shared = () => {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const fetchSharedFiles = async () => {
    try {
      const response = await client.get(`/files/shared-by-the-user/`, {
        withCredentials: true,
      });
      setSharedFiles(response.data);
    } catch (err) {
      notifyError("Error fetching files");
      console.log(err);
    }
  };

  const handleRevoke = async (fileID) => {
    try {
      await client.delete(`files/shared/delete/${fileID}/`).then((response) => {
        if (response.status === 200) {
          console.log(response.data.message);
          notifySuccess(response.data.message);
          fetchSharedFiles();
        }
      });
    } catch (err) {
      notifyError("Something went wrong");
    }
  };

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return "/images/pdf-icon.png";
      case "doc":
      case "docx":
        return "/images/docx-icon.png";
      case "jpg":
      case "jpeg":
      case "png":
        return "/images/image-icon.png";
      case "xls":
      case "xlsx":
        return "/images/excel-icon.png";
      case "mp3":
        return "/images/mp3-icon.png";
      case "mp4":
        return "/images/mp4-icon.png";
      case "zip":
        return "/images/zip-icon.png";
      default:
        return "/images/file-icon.png";
    }
  };

  const toggleDropdown = (fileId) => {
    setActiveDropdown(activeDropdown === fileId ? null : fileId);
  };

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="font-sans font-bold text-3xl mb-6 text-gray-700">
        My Shared Files
      </h2>

      {sharedFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <img
            src="/images/auth/drive.png"
            alt="No files available"
            className="mt-3"
            style={{ width: "480px", height: "480px" }}
          />
        </div>
      ) : (
        <div>
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white text-lg">
                <th className="py-3 px-6 font-semibold text-left rounded-tl-lg">
                  File Icon
                </th>
                <th className="py-3 px-6 font-semibold text-left">File Name</th>
                <th className="py-3 px-4 md:px-6 font-semibold text-left">
                  Shared to
                </th>
                <th className="py-3 px-4 md:px-6 font-semibold text-left">
                  Shared Date
                </th>
                <th className="py-3 px-4 md:px-6 font-semibold text-left rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sharedFiles.map((file, index) => (
                <tr
                  key={file.id}
                  className={`border-b transition duration-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="py-4 px-6 flex justify-center items-center">
                    <img
                      src={getFileTypeIcon(file.file_type)}
                      alt="file icon"
                      className="w-12 h-12"
                    />
                  </td>
                  <td className="py-4 px-6 text-gray-700">{file.file_name}</td>
                  <td className="py-4 px-6 text-gray-700">
                    {file.shared_with.map((user) => user.username).join(", ")}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {formatDate(file.shared_date)}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(file.id)}
                        className="border border-gray-300 rounded-full p-2 focus:outline-none hover:bg-gray-200 transition duration-200"
                      >
                        &#8942;
                      </button>
                      {activeDropdown === file.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleRevoke(file.id)}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                          >
                            Revoke
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Shared;
