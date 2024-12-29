import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="about-page bg-gray-100 p-4 sm:p-8 font-sans">
      {/* Banner Section */}
      <div className="banner bg-blue-600 text-white text-center py-8 sm:py-16 mb-6 sm:mb-10">
        <div className="banner-links mt-2 sm:mt-4 text-sm sm:text-lg flex justify-center items-center">
          <Link to="/" className="text-white hover:text-blue-200 mx-1 sm:mx-2">
            Home
          </Link>
          <span className="mx-1 sm:mx-2">/</span>
          <Link
            to="/about-us"
            className="text-white hover:text-blue-200 mx-1 sm:mx-2"
          >
            About Us
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div className="about-container flex flex-col lg:flex-row items-center gap-4 sm:gap-8 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Image Section */}
        <div className="about-image flex-1 w-full h-64 sm:h-auto">
          <img
            src="/images/about-us.jpg"
            alt="About Us"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Text Content */}
        <div className="about-content flex-1 p-4 sm:p-8 text-center lg:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Who We Are
          </h2>
          <p className="text-gray-600 mb-4">
            FileGuard is a secure file-sharing tool that enables users to share
            documents and files easily while ensuring their privacy and data
            security.
          </p>
          <p className="text-gray-600">
            With advanced encryption technologies, FileGuard guarantees that
            your sensitive information remains protected.
          </p>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="advantages-container mt-8 sm:mt-12">
        <h2 className="text-center text-xl sm:text-2xl font-bold text-blue-600 mb-4 sm:mb-8">
          Our Advantages
        </h2>
        <div className="content-container flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Text Section */}
          <div className="text-section flex-1 text-gray-600 space-y-4 text-center lg:text-left">
            <p>
              FileGuard provides a robust file-sharing service that emphasizes
              security and user experience.
            </p>
            <p>
              With our encryption and user-friendly interface, sharing files has
              never been more secure and straightforward.
            </p>
          </div>

          {/* Percent Section */}
          <div className="percent-section flex-1 space-y-4">
            {[
              { label: "Security", width: "95%" },
              { label: "Efficiency", width: "90%" },
              { label: "Guarantee", width: "85%" },
            ].map((item, index) => (
              <div key={index} className="percent-bar">
                <div className="label text-gray-800 font-semibold">
                  {item.label} {item.width}
                </div>
                <div className="bar-container bg-gray-300 rounded-full h-4 mt-1">
                  <div
                    className="filled-bar bg-blue-600 h-4 rounded-full"
                    style={{ width: item.width }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <h2 className="main-title2 text-gray-800 text-xl sm:text-2xl font-bold text-center mt-8 sm:mt-12 mb-6 sm:mb-8">
        Meet Our Team
      </h2>
      <div className="gallery-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {[
          {
            name: "Ian Gabriel G. Calica",
            role: "Fullstack Developer",
            img: "/images/ian.jpg",
          },
          {
            name: "Jaylord Franz P. Baribar",
            role: "Frontend Developer",
            img: "/images/franz.jpg",
          },
          {
            name: "Hanna Mae D. Bernolia",
            role: "Documentation",
            img: "/images/hanna.jpg",
          },
          {
            name: "Tyrone Justine A. Medina",
            role: "Frontend Developer",
            img: "/images/tj.jpg",
          },
        ].map((member, index) => (
          <div
            key={index}
            className="gallery-card p-4 bg-white rounded-lg shadow-lg text-center"
          >
            <div className="image-container mb-2 sm:mb-4">
              <img
                src={member.img}
                alt={member.name}
                className="team-image w-full h-auto object-cover rounded-lg"
              />
              <div className="social-icons flex justify-center space-x-2 mt-2">
                <i class="fi fi-brands-facebook text-blue-500 text-3xl hover:text-blue-700 transition duration-200 ease-in-out cursor-pointer"></i>
                <i class="fi fi-brands-twitter-alt-circle text-black text-3xl hover:text-blue-400 transition duration-200 ease-in-out cursor-pointer"></i>
                <i class="fi fi-brands-linkedin text-blue-500 text-3xl hover:text-blue-700 transition duration-200 ease-in-out cursor-pointer"></i>
              </div>
            </div>
            <div className="member-info">
              <strong className="block text-gray-800">{member.name}</strong>
              <p className="text-gray-500">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
