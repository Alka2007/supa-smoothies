import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicOnlyRoute = () => {
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

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
