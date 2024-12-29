import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import client from "../../../utils/client";
import { notifyError, notifySuccess, setUser } from "../../../utils/Helpers";

const Profile = ({ onClose, user, refresh }) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      username: "",
    },
  });
  const username = watch("username");
  const email = watch("email");
  const checkUniqueness = async () => {
    if (username) {
      const response = await client.get("/check-unique/", {
        params: { username },
      });
      setIsUsernameUnique(response.data.is_username_unique);
      if (!response.data.is_username_unique) {
        setError("username", {
          type: "manual",
          message: "Username already exists",
        });
      }
    }
  };

  const checkEmailUniqueness = async () => {
    if (email) {
      const response = await client.get("/check-unique/", {
        params: { email },
      });
      setIsEmailUnique(response.data.is_email_unique);
      if (!response.data.is_email_unique) {
        setError("email", {
          type: "manual",
          message: "Email already exists",
        });
      }
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
      });
    }
  }, [user, reset]);

  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);

  const onSubmit = async (data) => {
    if (!isEmailUnique || !isUsernameUnique) {
      notifyError("Email or Username must be unique");
      return;
    }

    const userData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      username: data.username,
    };

    const url = `/users/${user.id}`;
    const method = "PUT";

    await client({
      method,
      url,
      headers: {
        "Content-Type": "application/json",
      },
      data: userData,
      withCredentials: true,
    })
      .then((response) => {
        setUser(response.data);
        window.location.reload();
        notifySuccess("User updated successfully");
        onClose();
      })
      .catch((error) => {
        notifyError("Something went wrong");
        console.error(error.response ? error.response.data : error.message);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Update Profile</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-gray-700 mb-2">
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-14"
              {...register("first_name", {
                required: "First Name is required",
              })}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-gray-700 mb-2">
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-14"
              {...register("last_name", { required: "Last Name is required" })}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-14"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-14"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
            {!isEmailUnique && !errors.email && (
              <p className="text-red-500 text-sm mt-1">
                Email is already taken
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
              className="px-4 py-2 rounded-md font-semibold border-2 text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
