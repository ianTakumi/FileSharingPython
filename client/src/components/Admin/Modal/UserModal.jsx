import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getBorderColor, getUser } from "../../../utils/Helpers";
import client from "../../../utils/client";
const UserModal = ({
  onClose,
  notifySuccess,
  notifyError,
  userToEdit,
  isEditing,
  refresh,
}) => {
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const user = getUser();
  const checkEmail = async (email) => {
    try {
      const response = await fetch("/api/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 200) {
        console.log(data.message);
        return true;
      } else if (response.status === 400) {
        console.error(data.message);
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "onchange",
    defaultValues: {
      fname: "",
      lname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const username = watch("username");
  const email = watch("email");

  useEffect(() => {
    // Reset form fields if editing and userToEdit is provided
    if (isEditing && userToEdit) {
      reset({
        fname: userToEdit.first_name,
        lname: userToEdit.last_name,
        email: userToEdit.email,
        username: userToEdit.username,
      });
    }
  }, [isEditing, userToEdit, reset]);

  useEffect(() => {
    // Check username uniqueness
    const checkUniqueness = async () => {
      if (username) {
        const url = isEditing
          ? `/check-unique/${userToEdit.id}`
          : `/check-unique`;
        const response = await client.get(url, { params: { username } });
        setIsUsernameUnique(response.data.is_username_unique);
        if (!response.data.is_username_unique) {
          setError("username", {
            type: "manual",
            message: "Username already exists",
          });
        } else {
          clearErrors("username");
        }
      }
    };

    checkUniqueness();
  }, [username, isEditing, userToEdit, setError, clearErrors]);

  useEffect(() => {
    // Check email uniqueness
    const checkEmailUniqueness = async () => {
      if (email) {
        const url = isEditing
          ? `/check-unique/${userToEdit.id}`
          : `/check-unique`;
        const response = await client.get(url, { params: { email } });
        setIsEmailUnique(response.data.is_email_unique);
        if (!response.data.is_email_unique) {
          setError("email", {
            type: "manual",
            message: "Email already exists",
          });
        } else {
          clearErrors("email");
        }
      }
    };

    checkEmailUniqueness();
  }, [email, isEditing, userToEdit, setError, clearErrors]);

  const onSubmit = (data) => {
    if (!isEmailUnique) {
      notifyError("Email already in use");
      return;
    }

    const user = {
      first_name: data.fname,
      last_name: data.lname,
      email: data.email,
      username: data.username,
      password: data.password,
    };

    console.log(user);

    const url = isEditing ? `/users/${userToEdit.id}/` : `/register/`;
    const method = isEditing ? "PUT" : "POST";
    client({
      method,
      url,
      headers: {
        "Content-Type": "application/json",
      },
      data: user,
    })
      .then((response) => {
        refresh();
        notifySuccess(
          isEditing ? "User updated successfully" : "User created successfully"
        );
        onClose();
        console.log(response);
      })
      .catch((error) => {
        notifyError(isEditing ? "Error updating user" : "Error creating user");
        console.error(
          isEditing ? "Error updating user:" : "Error creating user:",
          error.response ? error.response.data : error.message
        );
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit User" : "Add User"}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="mb-4">
            <label htmlFor="fname" className="block text-gray-700 mb-2">
              First Name
            </label>
            <input
              id="fname"
              type="text"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md h-14 ${getBorderColor(
                "fname",
                errors,
                touchedFields
              )}`}
              {...register("fname", { required: "First Name is required" })}
            />
            {errors.fname && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fname.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="lname" className="block text-gray-700 mb-2">
              Last Name
            </label>
            <input
              id="lname"
              type="text"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md h-14 ${getBorderColor(
                "lname",
                errors,
                touchedFields
              )}`}
              {...register("lname", { required: "Last Name is required" })}
            />
            {errors.lname && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lname.message}
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
              className={`w-full px-3 py-2 border border-gray-300 rounded-md h-14 ${getBorderColor(
                "username",
                errors,
                touchedFields
              )}`}
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
              type="text"
              {...register("email", {
                required: "Email is required",
                unique: async (value) => {
                  const isUnique = await checkEmail(value);
                  if (!isUnique) {
                    setError("email", {
                      type: "manual",
                      message: "Email is already taken",
                    });
                  }
                  return isUnique || "Email is already taken";
                },
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Please enter a valid email",
                },
              })}
              className={`w-full px-3 py-2 border  border-gray-300 rounded-md h-14 ${getBorderColor(
                "email",
                errors,
                touchedFields
              )}`}
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

          {!isEditing && (
            <div className="mb-4 col-span-2">
              {/* Use col-span-2 to take both columns */}
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md h-14 ${getBorderColor(
                  "password",
                  errors,
                  touchedFields
                )}`}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

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
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
