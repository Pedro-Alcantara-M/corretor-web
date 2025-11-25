import { Layout } from "@components";
import { Navigate, useLocation } from "react-router-dom";

export const RequiredAuth = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Layout />
};