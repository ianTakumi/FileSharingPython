import React, { useEffect, useState } from "react";
import client from "../../../utils/client";
import { formatDate, notifyError, notifySuccess } from "../../../utils/Helpers";
import Swal from "sweetalert2";
import UserModal from "../../../components/User/Auth/Modals/UserModal";

const Files = () => {
  const [files, setFiles] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const handleOpenModal = (fileId) => {
    setSelectedFileId(fileId); // Store the selected file ID
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchFiles = async () => {
    try {
      const response = await client.get("/files");
      setFiles(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    uploadFiles(formData);
  };

  const uploadFiles = async (formData) => {
    setUploading(true);
    try {
      const response = await client.post("/upload/", formData, {
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total;
          const current = progressEvent.loaded;
          const percentCompleted = Math.floor((current / total) * 100);
          setProgress(percentCompleted);
        },
        headers: {
          Accept: "application/json",
          "Content-Type": undefined,
        },
        withCredentials: true,
      });

      notifySuccess("File(s) uploaded successfully!", response.data);
      fetchFiles(); // Refresh files list after upload
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.error || "Something went wrong"
          : "Something went wrong";
      notifyError(errorMessage);
      console.error(error.message);
    } finally {
      setUploading(false);
      setProgress(0);
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
        timer: 8000,
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

      // Make the API call to decrypt the file
      const response = await client.post(`/files/${fileId}/decrypt/`, null, {
        responseType: "blob", // Ensure the response type is set to blob
      });

      // Access Content-Disposition header
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

      // Extract the filename from the Content-Disposition header
      const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
      const filename =
        filenameMatch && filenameMatch[1]
          ? filenameMatch[1]
          : "downloaded_file";

      // Create a URL for the Blob response using the correct MIME type from the headers
      const blob = new Blob([response.data], {
        type: response.headers["content-type"], // Use the MIME type from the response
      });
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element and trigger download
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename; // Use the parsed filename
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url); // Clean up the URL object

      // Close the SweetAlert once the decryption is complete
      Swal.close();

      // Reset the active dropdown
      setActiveDropdown(null);
    } catch (error) {
      // Close the SweetAlert and show an error alert if the decryption fails
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Decryption Failed",
        text: "There was an error decrypting the file. Please try again.",
      });

      console.error("Error decrypting file:", error);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      // Show the loading SweetAlert
      let timerInterval;
      let millisecondsElapsed = 0;
      Swal.fire({
        title: "Deleting...",
        html: "Please wait while the file is being deleted. <b></b> milliseconds left.",
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            millisecondsElapsed += 100; // Increment every 100 ms
            timer.textContent = `${millisecondsElapsed}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });

      // Make the API call to delete the file
      await client.delete(`/files/${fileId}/delete/`);

      // Update the file list
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));

      // Close the SweetAlert and show success notification
      Swal.close();
      notifySuccess("Successfully Deleted");

      // Reset the active dropdown
      setActiveDropdown(null);
    } catch (err) {
      // Close the SweetAlert and show an error alert if the deletion fails
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "There was an error deleting the file. Please try again.",
      });

      console.error("Error deleting file:", err);
      notifyError("Error deleting file");
    }
  };

  const toggleDropdown = (fileId) => {
    setActiveDropdown(activeDropdown === fileId ? null : fileId); // Toggle the dropdown for the specific file
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="font-sans font-bold text-3xl mb-6 text-gray-700">
        My Files
      </h2>
      <button
        className="border border-blue-500 mb-6 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-6 rounded transition duration-300"
        onClick={() => document.getElementById("file-upload").click()}
      >
        Upload File
      </button>
      <input
        id="file-upload"
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {files.length === 0 ? (
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
                <th className="py-3 px-6 font-semibold text-left">
                  Upload Date
                </th>
                <th className="py-3 px-6 font-semibold text-left rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
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
                    {formatDate(file.upload_date)}
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
                            onClick={() => handleDecrypt(file.id)}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                          >
                            Decrypt
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                            onClick={() => handleOpenModal(file.id)}
                          >
                            Share
                          </button>
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                          >
                            Delete
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

      {/* Progress bar and modal components */}
      {uploading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 w-96 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Uploading...
            </h3>
            <div className="relative pt-1">
              <div className="overflow-hidden h-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                ></div>
              </div>
              <p className="text-center text-lg mt-4 text-gray-600">
                {progress}%
              </p>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          fileId={selectedFileId}
        />
      )}
    </div>
  );
};

export default Files;
