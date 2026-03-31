import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

const PrivateRoute = () => {
  const { currentUser, loadingUser } = useContext(AuthContext);

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  return currentUser ? <Outlet /> : <Navigate to="/" replace={true} />;
};

export default PrivateRoute;
