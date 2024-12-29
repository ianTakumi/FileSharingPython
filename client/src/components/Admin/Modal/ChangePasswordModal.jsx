import React from "react";
import { useForm } from "react-hook-form";
import client from "../../../utils/client";
import {
  getUser,
  notifyError,
  getBorderColor,
  notifySuccess,
} from "../../../utils/Helpers";

const ChangePassword = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm();

  const onSubmit = (data) => {
    const user = getUser();
    data.user = user;
    console.log(data);

    client
      .put(`/change-password/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        reset();
        onClose();
        notifySuccess("Your password has been successfully changed!");
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data.msg;
          console.log(errorMessage);
          notifyError(errorMessage);
        } else {
          console.log(error.message);
          notifyError(error.message);
        }
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="current_password"
              className="block text-gray-700 mb-2"
            >
              Current Password
            </label>
            <input
              id="current_password"
              type="password"
              className={`w-full px-3 py-2 border rounded-md ${getBorderColor(
                "current_password",
                errors,
                touchedFields
              )}`}
              {...register("current_password", {
                required: "Current Password is required",
              })}
            />
            {errors.current_password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.current_password.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="new_password" className="block text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="new_password"
              type="password"
              className={`w-full px-3 py-2 border rounded-md ${getBorderColor(
                "new_password",
                errors,
                touchedFields
              )}`}
              {...register("new_password", {
                required: "New Password is required",
              })}
            />
            {errors.new_password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.new_password.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirm_password"
              className="block text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirm_password"
              type="password"
              className={`w-full px-3 py-2 border rounded-md ${getBorderColor(
                "confirm_password",
                errors,
                touchedFields
              )}`}
              {...register("confirm_password", {
                required: "Confirm Password is required",
              })}
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirm_password.message}
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
