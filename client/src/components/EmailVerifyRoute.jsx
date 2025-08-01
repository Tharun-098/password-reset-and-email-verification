// components/EmailVerifyRoute.jsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../context/DataContext";

const EmailVerifyRoute = ({ children }) => {
  const { isLoggedIn, user } = useContext(DataContext);
  
  if (isLoggedIn && user?.isAccountVerify) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default EmailVerifyRoute;
