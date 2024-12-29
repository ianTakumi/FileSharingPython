import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages for the home pages and layout
import Homepage from "./pages/user/Home/Home";
import HomeLayout from "./components/User/layout";
import ContactPage from "./pages/user/Contact/Contact";
import AboutPage from "./pages/user/About/About";
import ResetPasswordPage from "./pages/user/ResetPassword";
import UnauthorizedPage from "./pages/Error401";

// Pages for authenticated user
import AuthUserPage from "./pages/user/Auth/index";
import AuthUserLayout from "./components/User/Auth/Layout";
import AuthFiles from "./pages/user/Auth/Files";
import AuthProfile from "./pages/user/Auth/Profile";
import AuthSharedPage from "./pages/user/Auth/Shared";
import AuthSearch from "./pages/user/Auth/Search";
import AuthMySharedFiles from "./pages/user/Auth/OwnShared";

// Layouts and pages for admin
import AdminLayout from "./components/Admin/Layout";
import AdminHomePage from "./pages/admin/index";
import UsersPage from "./pages/admin/Users";
import SignIn from "./pages/user/signin/signin";
import SignUp from "./pages/user/signup/signup";
import EmailAdmin from "./pages/admin/Email";
import ProfileAdmin from "./pages/admin/Profile";
import ContactAdminPages from "./pages/admin/Contact";
import NewPassword from "./pages/user/NewPassword";

// Protected route
import ProtectedRoute from "./utils/authRoutes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Homepage />} />
          <Route path="about-us" element={<AboutPage />} />
          <Route path="contact-us" element={<ContactPage />} />
        </Route>
        <Route path="/reset-password" element={<ResetPasswordPage />}></Route>
        <Route path="/change-password/:id" element={<NewPassword />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/401" element={<UnauthorizedPage />}></Route>

        {/* Authenticated User Routes */}
        <Route
          path="/drive"
          element={<ProtectedRoute element={<AuthUserLayout />} />}
        >
          <Route
            index
            element={<ProtectedRoute element={<AuthUserPage />} />}
          />
          <Route
            path="files"
            element={<ProtectedRoute element={<AuthFiles />} />}
          />
          <Route
            path="search-results/:query"
            element={<ProtectedRoute element={<AuthSearch />} />}
          />
          <Route
            path="profile"
            element={<ProtectedRoute element={<AuthProfile />} />}
          />
          <Route
            path="shared-with-me"
            element={<ProtectedRoute element={<AuthSharedPage />} />}
          />
          <Route
            path="my-shared-files"
            element={<ProtectedRoute element={<AuthMySharedFiles />} />}
          />
        </Route>
        {/* Routes for admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute element={<AdminLayout />} adminOnly={true} />
          }
        >
          <Route
            index
            element={
              <ProtectedRoute element={<AdminHomePage />} adminOnly={true} />
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute element={<UsersPage />} adminOnly={true} />
            }
          />
          <Route
            path="email"
            element={
              <ProtectedRoute element={<EmailAdmin />} adminOnly={true} />
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute element={<ProfileAdmin />} adminOnly={true} />
            }
          />
          <Route
            path="contacts"
            element={
              <ProtectedRoute
                element={<ContactAdminPages />}
                adminOnly={true}
              />
            }
          />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
