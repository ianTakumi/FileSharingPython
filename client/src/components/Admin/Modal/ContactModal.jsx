import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import {
  getBorderColor,
  notifyError,
  notifySuccess,
} from "../../../utils/Helpers";
import client from "../../../utils/client";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
];

const customSelectStyles = {
  control: (provided, { isFocused }) => ({
    ...provided,
    height: "56px", // Match input height
    padding: "0 8px",
    borderColor: isFocused ? "#3b82f6" : "#d1d5db", // Customize focus color and default color
    borderWidth: "1px",
    boxShadow: isFocused ? "0 0 0 1px #3b82f6" : "none", // Match the border color on focus
    borderRadius: "0.375rem", // Rounded corners
    "&:hover": {
      borderColor: "#3b82f6", // Border color on hover
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af", // Placeholder color
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#374151", // Text color
  }),
};

const ContactModal = ({ onClose, contact, refresh }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      message: "",
      status: { value: "pending", label: "Pending" }, // Default value
    },
  });

  useEffect(() => {
    if (contact) {
      reset({
        name: contact.name,
        email: contact.email,
        message: contact.message,
        status:
          statusOptions.find((option) => option.value === contact.status) ||
          statusOptions[0],
      });
    }
  }, [contact, reset]);

  const onSubmit = (data) => {
    const clean_data = {
      status: data.status.value,
      name: data.name,
      email: data.email,
      message: data.message,
    };
    client
      .put(`contact/${contact.id}/update`, clean_data)
      .then((response) => {
        notifySuccess("Updated Successfully");
        refresh();
        reset();
        onClose();
      })
      .catch((error) => {
        notifyError("Something went wrong");
        console.log(error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Edit Contact</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              readOnly
              className={`w-full px-3 py-2 border border-gray-300 rounded-md h-14 ${getBorderColor(
                "name",
                errors,
                touchedFields
              )}`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              readOnly
              className={`w-full px-3 py-2 border border-gray-300 rounded-md h-14 ${getBorderColor(
                "email",
                errors,
                touchedFields
              )}`}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 mb-2">
              Message
            </label>
            <input
              id="message"
              type="text"
              readOnly
              className={`w-full px-3 py-2 border border-gray-300 rounded-md h-14 ${getBorderColor(
                "message",
                errors,
                touchedFields
              )}`}
              {...register("message", { required: "Message is required" })}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 mb-2">
              Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={statusOptions}
                  styles={customSelectStyles}
                  classNamePrefix="react-select"
                  placeholder="Select status"
                />
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          <div className="flex justify-end col-span-1 md:col-span-2">
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

export default ContactModal;
