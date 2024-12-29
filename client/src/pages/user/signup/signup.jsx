import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import client from "../../../utils/client";
import {
  notifyError,
  notifySuccess,
  getBorderColor,
  authenticate,
} from "../../../utils/Helpers";

const SignUp = () => {
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "onChange",
  });

  const username = watch("username");
  const email = watch("email");

  useEffect(() => {
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

    checkUniqueness();
    checkEmailUniqueness();
  }, [username, email, setError]);

  const onSubmit = async (data) => {
    try {
      await client.post("/register/", data).then((response) => {
        reset();
        notifySuccess("Registration successful!");
        authenticate(response.data);
        navigate("/drive/files");
      });
    } catch (error) {
      notifyError("Registration failed. Please try again.");
      console.error(error);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side - Sign Up Form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-white px-6 py-12 md:px-12">
        <div
          className="flex flex-col items-center mb-6 cursor-pointer"
          onClick={handleGoHome}
        >
          <img src="/images/logo.png" alt="Logo" className="w-36 h-36 mb-4" />
          <p className="text-3xl font-bold font-sans text-gray-800">
            FileGuard
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2">
          <div>
            <label className="block text-sm text-gray-700">First Name*</label>
            <input
              id="first_name"
              type="text"
              placeholder="Ex: John"
              className={`${getBorderColor(
                "first_name",
                errors,
                touchedFields
              )} w-full p-3 rounded-md border`}
              {...register("first_name", {
                required: "First Name is required",
              })}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Last Name*</label>
            <input
              id="last_name"
              type="text"
              placeholder="Ex: Doe"
              className={`${getBorderColor(
                "last_name",
                errors,
                touchedFields
              )} w-full p-3 rounded-md border`}
              {...register("last_name", { required: "Last Name is required" })}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Username*</label>
            <input
              id="username"
              type="text"
              placeholder="Ex: johndoe123"
              className={`${getBorderColor(
                "username",
                errors,
                touchedFields
              )} w-full p-3 rounded-md border`}
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">
              Email Address*
            </label>
            <input
              id="email"
              type="email"
              placeholder="mail@example.com"
              className={`${getBorderColor(
                "email",
                errors,
                touchedFields
              )} w-full p-3 rounded-md border`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Password*</label>
            <input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              className={`${getBorderColor(
                "password",
                errors,
                touchedFields
              )} w-full p-3 rounded-md border`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Sign Up
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to={"/signin"} className="text-blue-500">
              Sign In
            </Link>
          </p>
        </form>
      </div>

      {/* Right side - Image */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/login-image.png')" }}
      ></div>
    </div>
  );
};

export default SignUp;
