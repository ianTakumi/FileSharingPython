import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "./Home.scss";

const Home = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleAboutUsClick = () => {
    navigate("/about-us");
  };

  return (
    <div>
      {/* Carousel Section */}
      <div className="carousel-container relative overflow-hidden max-w-full">
        <Swiper
          modules={[Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="carousel-slide relative flex items-center justify-start h-[400px] overflow-hidden rounded-lg shadow-xl opacity-80">
              <img
                src="/images/image-slide-1.jpeg"
                alt="Slide 1"
                className="carousel-image w-full h-full object-cover filter brightness-70 transition-transform duration-300 ease-in-out hover:scale-105"
              />
              <div className="slide-content absolute text-center text-white p-5">
                <h1 className="text-4xl sm:text-5xl font-semibold">
                  File sharing &
                </h1>
                <h1 className="text-4xl sm:text-5xl font-semibold">
                  storage made simple
                </h1>
                <p className="text-lg mt-4 sm:text-xl">
                  All your files with you everywhere and anytime.
                </p>
                <button
                  className="signup-button mt-6 py-2 px-6 bg-blue-500 text-white rounded-full transition-all duration-300 ease-in-out hover:bg-blue-700"
                  onClick={handleSignUpClick}
                >
                  Free Sign Up
                </button>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="carousel-slide relative flex items-center justify-start h-[400px] overflow-hidden rounded-lg shadow-xl opacity-80">
              <img
                src="/images/image-slide-2.jpeg"
                alt="Slide 2"
                className="carousel-image w-full h-full object-cover filter brightness-70 transition-transform duration-300 ease-in-out hover:scale-105"
              />
              <div className="slide-content absolute text-center text-white p-5">
                <h1 className="text-4xl sm:text-5xl font-semibold">
                  File sharing &
                </h1>
                <h1 className="text-4xl sm:text-5xl font-semibold">
                  storage made simple
                </h1>
                <p className="text-lg mt-4 sm:text-xl">
                  All your files with you everywhere and anytime.
                </p>
                <button
                  className="signup-button mt-6 py-2 px-6 bg-blue-500 text-white rounded-full transition-all duration-300 ease-in-out hover:bg-blue-700"
                  onClick={handleSignUpClick}
                >
                  Free Sign Up
                </button>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div className="carousel-slide relative flex items-center justify-start h-[400px] overflow-hidden rounded-lg shadow-xl opacity-80">
              <img
                src="/images/image-slide-3.jpeg"
                alt="Slide 3"
                className="carousel-image w-full h-full object-cover filter brightness-70 transition-transform duration-300 ease-in-out hover:scale-105"
              />
              <div className="slide-content absolute text-center text-white p-5">
                <h1 className="text-4xl sm:text-5xl font-semibold">
                  File sharing &
                </h1>
                <h1 className="text-4xl sm:text-5xl font-semibold">
                  storage made simple
                </h1>
                <p className="text-lg mt-4 sm:text-xl">
                  All your files with you everywhere and anytime.
                </p>
                <button
                  className="signup-button mt-6 py-2 px-6 bg-blue-500 text-white rounded-full transition-all duration-300 ease-in-out hover:bg-blue-700"
                  onClick={handleSignUpClick}
                >
                  Free Sign Up
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* About Section */}
      <div className="about-container flex flex-col sm:flex-row p-6">
        <div className="left-side w-full sm:w-1/2 mb-6 sm:mb-0">
          <img
            src="/images/home-about.jpg"
            alt="About Us"
            className="big-image w-full h-auto rounded-lg"
          />
        </div>
        <div className="right-side w-full sm:w-1/2 pl-0 sm:pl-8">
          <div className="first-div mb-4">
            <hr className="mb-4 border-t-2" />
            <span className="text-2xl font-semibold">About Us</span>
          </div>
          <div className="second-div mb-4">
            <h1 className="text-3xl font-semibold">What is FileGuard?</h1>
          </div>
          <div className="third-div mb-4">
            <p className="text-lg">
              FileGuard is a reliable and secure file sharing and storage
              solution that empowers users to manage their files effortlessly.
              Our platform is designed with user-friendliness and security in
              mind, ensuring that your files are always safe and accessible.
            </p>
          </div>
          <div className="fourth-div">
            <button
              className="more-info-button py-2 px-6 bg-blue-500 text-white rounded-full transition-all duration-300 ease-in-out hover:bg-blue-700"
              onClick={handleAboutUsClick}
            >
              More About Us
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-container p-6">
        <div className="benefits-line text-center mb-8">
          <hr className="benefits-divider mb-4 border-t-2" />
          <h1 className="text-3xl font-semibold">Our Benefits</h1>
        </div>

        <div className="benefits-title text-center mb-8">
          <h1 className="text-2xl font-semibold">
            More than just sharing and storage
          </h1>
        </div>

        <div className="benefits-description text-center mb-8">
          <h3 className="text-lg">
            Take a look at the top features to make your life simple and easy.
          </h3>
        </div>

        <div className="benefits-features grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div className="feature text-center">
            <img
              src="/images/icon1.jpg"
              alt="Anonymous file exchange"
              className="feature-icon mx-auto w-16 h-16 rounded-full"
            />
            <p>Anonymous file exchange</p>
          </div>
          <div className="feature text-center">
            <img
              src="/images/icon2.jpg"
              alt="Playing files online"
              className="feature-icon mx-auto w-16 h-16 rounded-full"
            />
            <p>Integrated with cloud</p>
          </div>
          <div className="feature text-center">
            <img
              src="/images/icon3.jpg"
              alt="No size limits"
              className="feature-icon mx-auto w-16 h-16 rounded-full"
            />
            <p>Up to 15 GB of storage</p>
          </div>

          <div className="feature text-center">
            <img
              src="/images/icon5.jpg"
              alt="Triple backups"
              className="feature-icon mx-auto w-16 h-16 rounded-full"
            />
            <p>Highly Secured</p>
          </div>
        </div>

        <div className="benefits-signup text-center mt-8">
          <button
            className="signup-button py-2 px-6 bg-blue-500 text-white rounded-full transition-all duration-300 ease-in-out hover:bg-blue-700"
            onClick={handleSignUpClick}
          >
            Free Sign Up
          </button>
        </div>

        {/* New Floating Section */}
        <div
          className="relative bg-cover bg-center h-[500px]"
          style={{ backgroundImage: "url('/images/background-large.jpg')" }}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 sm:px-8">
            <div className="text-xl sm:text-3xl font-semibold mb-4">
              Handles all of your file needs
            </div>
            <div className="text-3xl sm:text-5xl font-bold mb-4">
              <h1>No matter where you go –</h1>
              <h1>take your files with you</h1>
            </div>
            <div className="text-base sm:text-lg max-w-2xl">
              <p>
                Whether it’s your music collection, home videos, your resume, or
                your important work docs, have them in your pocket whenever you
                need them.
              </p>
            </div>
          </div>
        </div>

        {/* New Features Section */}
        <div className="py-12 px-6 sm:px-16 lg:px-32 bg-gray-100">
          {/* Div 1 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Powerful and Simple
            </h1>
          </div>

          {/* Div 2 */}
          <div className="text-center mb-8 max-w-4xl mx-auto">
            <p className="text-base sm:text-lg">
              File storage made easy – including powerful features you won’t
              find anywhere else. Whether you’re sharing photos, videos, audio,
              or docs, MediaFire can simplify your workflow.
            </p>
          </div>

          {/* Div 3 - Icons and Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
                <img
                  src="/images/step-1.jpg"
                  alt="Share"
                  className="w-12 h-12"
                />
              </div>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mb-2">
                1
              </div>
              <p>
                Share through email, link, or social network. Unlimited
                downloads. No wait times.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
                <img
                  src="/images/step-2.jpg"
                  alt="Collaborate"
                  className="w-12 h-12"
                />
              </div>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mb-2">
                2
              </div>
              <p>
                Store and share any file type. Share folders of project files.
                Easily email large files.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
                <img
                  src="/images/step-3.jpg"
                  alt="Store"
                  className="w-12 h-12"
                />
              </div>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mb-2">
                3
              </div>
              <p>
                10GB for free. Up to 50GB free with bonuses. Store all your
                photos, audio, and videos.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
                <img
                  src="/images/step-4.jpg"
                  alt="Access"
                  className="w-12 h-12"
                />
              </div>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mb-2">
                4
              </div>
              <p>
                Always have your important files with you. Never forget your
                work at home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
