import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import client from "../../../utils/client";
import { notifyError, notifySuccess } from "../../../utils/Helpers";

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await client.post("/contact/", data);
      notifySuccess("Sent Successfully");
    } catch (error) {
      notifyError("Something went wrong, please try again");
    }
  };

  return (
    <div className="contact-page mt-10">
      {/* Banner */}
      <div className="bg-blue-500 text-white text-center py-16">
        <div className="text-lg">
          <Link to="/" className="text-white hover:text-blue-300">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/contact" className="text-white hover:text-blue-300">
            Contact Us
          </Link>
        </div>
      </div>

      {/* Contact Information */}
      <div className="flex flex-wrap justify-around items-center py-10 bg-gray-100">
        {[
          {
            icon: "/images/phone-icon.jpg",
            title: "Phone",
            content: "09123456789",
          },
          {
            icon: "/images/email-icon.jpg",
            title: "Email",
            content: "fileguard@info.com",
          },
          {
            icon: "/images/address-icon.jpg",
            title: "Address",
            content: "Western Bicutan, Taguig, Metro Manila",
          },
          {
            icon: "/images/hours-icon.jpg",
            title: "Hours",
            content: "Monday - Sunday\n12 MN - 11:59 PM",
          },
        ].map((info, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center w-48 mb-6"
          >
            <img
              src={info.icon}
              alt={`${info.title} Icon`}
              className="w-12 h-12 bg-blue-500 rounded-full p-2 mb-4"
            />
            <p className="text-lg font-semibold">{info.title}</p>
            <p className="text-sm">{info.content}</p>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-md rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            Have questions?
          </h2>
          <p className="text-gray-600 mt-4">
            Have any questions, feedback, or need assistance? Our team is here
            to support you. Feel free to reach out to us, and we’ll do our best
            to make your experience as smooth as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Your name*"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <input
                type="email"
                placeholder="Your E-mail*"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <textarea
            placeholder="Your message*"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 mb-6"
            {...register("message", { required: "Message is required" })}
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm mb-4">
              {errors.message.message}
            </p>
          )}

          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="consent"
              className="h-5 w-5 text-blue-500 rounded border-gray-300"
              {...register("consent", {
                required: "You must agree to data collection",
              })}
            />
            <label htmlFor="consent" className="text-gray-600 text-sm">
              I agree that my submitted data is being collected and stored.
            </label>
            {errors.consent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.consent.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Send message
          </button>
        </form>
      </div>

      {/* Google Maps Section */}
      <div className="my-10 rounded-lg overflow-hidden shadow-md">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30899.361259474914!2d121.01864680179158!3d14.517943197024417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397cf2ca2a215d5%3A0x38380d2c1d509c80!2sWestern%20Bicutan%2C%20Taguig%2C%201630%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1730702443363!5m2!1sen!2sph"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
