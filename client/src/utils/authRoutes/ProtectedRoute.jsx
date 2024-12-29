import { Navigate } from "react-router-dom";
import { getUser } from "../Helpers";

const ProtectedRoute = ({ element, adminOnly = false }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/401" replace />; // Redirect to 401 page if not authenticated
  }

  if (adminOnly && user.is_superuser !== true) {
    return <Navigate to="/" replace />; // Redirect non-admin users to the 401 page
  }

  return element;
};

export default ProtectedRoute;
