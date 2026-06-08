// RoleProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AlreadyLogged = ({
  children,
}) => {
  const { isAuthenticated,user} = useSelector(
    (state) => state.auth
  );

  if (isAuthenticated && user?.role=="student") {
    return <Navigate to="/student" replace />;
  }
  if (isAuthenticated && user?.role=="professor") {
    return <Navigate to="/professor" replace />;
  }

  

  return children;
};

export default AlreadyLogged;