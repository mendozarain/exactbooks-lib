import React from "react";
import { Link, Navigate, Route } from "react-router-dom";

function ProtectedRoute({ children  }) {
  const auth = localStorage.getItem("isAuthenticated");
  return auth ? children : <Link to="/login" />;
}

export default ProtectedRoute;

