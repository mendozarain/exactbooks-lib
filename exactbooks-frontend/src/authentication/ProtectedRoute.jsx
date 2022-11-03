import React from "react";
import { Link, Navigate, Route } from "react-router-dom";

function ProtectedRoute({ children  }) {
  console.log("auth",localStorage.getItem("isAuthenticated"))
  const auth = localStorage.getItem("isAuthenticated");
  return auth ? children : <Navigate to='/login'  />;
}

export default ProtectedRoute;

