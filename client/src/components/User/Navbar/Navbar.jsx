import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-semibold text-gray-800">FileGuard</span>
        </a>

        {/* Hamburger Icon (visible only on small screens) */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 focus:outline-none"
          aria-controls="navbar-menu"
          aria-expanded={isOpen ? "true" : "false"}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop Menu (hidden on small screens) */}
        <div className="hidden md:flex md:items-center">
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="text-gray-800 hover:text-blue-500 text-lg">
                Home
              </a>
            </li>
            <li>
              <a
                href="/about-us"
                className="text-gray-800 hover:text-blue-500 text-lg"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/contact-us"
                className="text-gray-800 hover:text-blue-500 text-lg"
              >
                Contact
              </a>
            </li>
          </ul>
          <div className="ml-6">
            <a
              href="/signin"
              className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg text-lg"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-start">
          <div className="bg-white rounded-lg max-w-xs w-full mx-4 p-6 shadow-lg mt-8 relative">
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-gray-800 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <ul className="space-y-4 mt-8 text-center">
              <li>
                <a
                  href="/"
                  className="block text-lg text-gray-800 hover:text-blue-500"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about-us"
                  className="block text-lg text-gray-800 hover:text-blue-500"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="block text-lg text-gray-800 hover:text-blue-500"
                >
                  Contact
                </a>
              </li>
            </ul>
            <div className="mt-6 text-center">
              <a
                href="/signin"
                className="block w-full bg-blue-500 text-white py-2 rounded"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
