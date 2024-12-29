import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  notifyError,
  notifySuccess,
  getBorderColor,
  authenticate,
} from "../../../utils/Helpers";
import client from "../../../utils/client";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0); // in seconds
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    const storedCooldown = parseInt(localStorage.getItem("cooldownTime"), 10);
    const cooldownStartTime = parseInt(
      localStorage.getItem("cooldownStartTime"),
      10
    );

    if (storedCooldown && cooldownStartTime) {
      const elapsed = Math.floor((Date.now() - cooldownStartTime) / 1000);
      const remainingCooldown = Math.max(0, storedCooldown - elapsed);

      if (remainingCooldown > 0) {
        setCooldown(remainingCooldown);
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            localStorage.removeItem("cooldownTime");
            localStorage.removeItem("cooldownStartTime");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const onValid = async (data) => {
    try {
      const response = await client.post("/login/", data, {
        headers: { "Content-Type": "application/json" },
      });
      const user = response.data.user;
      notifySuccess("Sign-in successful!");
      reset();
      authenticate(response.data);
      setFailedAttempts(0); // Reset failed attempts on success
      localStorage.removeItem("cooldownTime");
      localStorage.removeItem("cooldownStartTime");

      if (user.is_superuser) {
        navigate("/admin");
      } else {
        navigate("/drive/files");
      }
    } catch (error) {
      setFailedAttempts((prev) => prev + 1);
      if (failedAttempts + 1 >= 3) {
        const newCooldown = cooldown === 0 ? 60 : cooldown * 2;
        setCooldown(newCooldown);
        localStorage.setItem("cooldownTime", newCooldown);
        localStorage.setItem("cooldownStartTime", Date.now().toString());
        setFailedAttempts(0); // Reset failed attempts after reaching limit
        notifyError(
          "Too many failed attempts. Please wait before trying again."
        );
      } else {
        notifyError("Sign-in failed. Please check your credentials.");
      }
    }
  };

  const onInvalid = () => {
    notifyError("Please fix the errors before submitting.");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-full lg:w-1/2 bg-white p-8 flex flex-col justify-center items-center">
        <div
          className="logo cursor-pointer mb-10 flex flex-col items-center"
          onClick={handleGoHome}
        >
          <img src="/images/logo.png" alt="Your Logo" className="w-40" />
          <p className="text-lg font-semibold text-gray-700">FileGuard</p>
        </div>

        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          className="w-full space-y-6"
        >
          <div>
            <label htmlFor="username" className="text-sm text-gray-600">
              Username*
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className={`w-full p-3 border rounded-md ${getBorderColor(
                "username",
                errors,
                touchedFields
              )} focus:outline-none`}
              {...register("username", { required: "Username is required" })}
              disabled={cooldown > 0}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-gray-600">
              Password*
            </label>
            <input
              id="password"
              type="password"
              placeholder="Min. of 8 characters"
              className={`w-full p-3 border rounded-md ${getBorderColor(
                "password",
                errors,
                touchedFields
              )} focus:outline-none`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
              disabled={cooldown > 0}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-between items-center text-sm">
            <Link
              to="/reset-password"
              className="text-blue-600 hover:underline"
            >
              Reset Password
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? `Try again in ${cooldown}s` : "Sign In"}
          </button>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Don’t have an account yet?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              New Account
            </Link>
          </p>
        </form>
      </div>

      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/login-image.png')",
        }}
      ></div>
    </div>
  );
};

export default SignIn;
