import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const location = useLocation();
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="page auth-status-page">
        <div className="auth-shell">
          <div className="auth-panel auth-panel--centered">
            <p className="eyebrow">Checking session</p>
            <h2>Loading your smoothie space...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
