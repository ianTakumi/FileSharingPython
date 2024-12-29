import React, { useEffect, useState } from "react";
import client from "../../../utils/client";
import { formatDate, notifyError } from "../../../utils/Helpers";
import Swal from "sweetalert2";

const Shared = () => {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const fetchSharedFiles = async () => {
    try {
      const response = await client.get(`/files/shared/`, {
        withCredentials: true,
      });
      setSharedFiles(response.data);
    } catch (err) {
      notifyError("Error fetching files");
      console.log(err);
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

  const handleDecrypt = async (fileId) => {
    try {
      let timerInterval;
      Swal.fire({
        title: "Decrypting...",
        html: "Please wait while we decrypt your file. <b></b> milliseconds left.",
        timer: 30000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });

      const response = await client.post(`/files/${fileId}/decrypt/`, null, {
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      if (!contentDisposition) {
        console.error("Content-Disposition header is null.");
        Swal.fire({
          icon: "error",
          title: "Download Failed",
          text: "File was decrypted but couldn't retrieve the file name.",
        });
        return;
      }

      const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
      let filename =
        filenameMatch && filenameMatch[1]
          ? filenameMatch[1]
          : "downloaded_file";

      // Map MIME type to file extension
      const mimeType = response.headers["content-type"];
      const mimeToExtension = {
        "application/pdf": ".pdf",
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "application/zip": ".zip",
        "application/msword": ".doc",
        "application/vnd.ms-excel": ".xls",
        // Add more MIME types as needed
      };

      // Check if filename already has an extension
      if (!filename.match(/\.[a-z0-9]+$/i)) {
        const extension = mimeToExtension[mimeType];
        if (extension) {
          filename += extension;
        }
      }

      const blob = new Blob([response.data], {
        type: mimeType,
      });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      Swal.close();
      setActiveDropdown(null);
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Decryption Failed",
        text: "There was an error decrypting the file. Please try again.",
      });

      console.error("Error decrypting file:", error);
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
      <h2 className="font-sans font-bold text-2xl md:text-3xl mb-5 text-gray-700 text-center md:text-left">
        Shared with me
      </h2>
      {sharedFiles.length === 0 ? (
        <div className="flex flex-col items-center">
          <img
            src="/images/auth/shared.png"
            alt="No files"
            className="max-w-full h-auto"
            style={{ maxHeight: "500px" }}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white text-sm md:text-lg">
                <th className="py-3 px-4 md:px-6 font-semibold text-left rounded-tl-lg">
                  File Icon
                </th>
                <th className="py-3 px-4 md:px-6 font-semibold text-left">
                  File Name
                </th>
                <th className="py-3 px-4 md:px-6 font-semibold text-left">
                  Shared by
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
                  <td className="py-4 px-4 md:px-6 flex justify-center items-center">
                    <img
                      src={getFileTypeIcon(file.file_type)}
                      alt="file icon"
                      className="w-8 h-8 md:w-12 md:h-12"
                    />
                  </td>
                  <td className="py-4 px-4 md:px-6 text-gray-700">
                    {file.file_name}
                  </td>
                  <td className="py-4 px-4 md:px-6 text-gray-700">
                    {file.username}
                  </td>
                  <td className="py-4 px-4 md:px-6 text-gray-700">
                    {formatDate(file.shared_date)}
                  </td>
                  <td className="py-4 px-4 md:px-6 text-gray-700">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(file.id)}
                        className="border border-gray-300 rounded-full p-2 focus:outline-none hover:bg-gray-200 transition duration-200"
                      >
                        &#8942;
                      </button>
                      {activeDropdown === file.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleDecrypt(file.file_id)}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                          >
                            Decrypt
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
