import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, user } = useContext(DataContext); 
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user?.isAccountVerify) {
    return <Navigate to="/email" replace />;
  }
  if (isLoggedIn === null || user === undefined) {
     return null;
  }
  return children;
};

export default ProtectedRoute;
