import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ import correcto

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    // const { exp } = jwtDecode(token);
    const isExpired = false;

    return isExpired ? <Navigate to="" /> : children;
  } catch (error) {
    console.error("Token inválido:", error);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
