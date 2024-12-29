import React from "react";
import { useForm } from "react-hook-form";
import client from "../../../../utils/client";
import {
  notifySuccess,
  notifyError,
  getBorderColor,
} from "../../../../utils/Helpers";

const ChangePassword = ({ onClose, fileId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    const submit_data = {
      file_id: fileId,
      username: data.username,
    };
    await client
      .post(`/files/share/`, submit_data)
      .then((response) => {
        notifySuccess("Successfully shared the file");
        reset();
        onClose();
      })
      .catch((error) => {
        const errorMessage =
          error.response && error.response.data
            ? error.response.data.error || "Something went wrong"
            : "Something went wrong";
        notifyError(errorMessage);
        console.log(error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Share a File</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${getBorderColor(
                "username",
                errors,
                touchedFields
              )}`}
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-gray-500 border border-gray-300 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md font-semibold border-2 text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
