import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../components/LoadingScreen";

function AdminRequire({ children }) {
  const { isInitialized, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return <LoadingScreen />;
  }


  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log("Admin Require. userrole: ", user.role)
  if (user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}
export default AdminRequire;