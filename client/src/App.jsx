// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
import ResetPassword from "./pages/ResetPassword";
import EmailVerify from "./pages/EmailVerify";
import ProtectedRoute from "./components/ProtectedRoute";
import EmailVerifyRoute from "./components/EmailVerifyRoute";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { DataContext } from "./context/DataContext";

function App() {
  const { isLoggedIn, loading } = useContext(DataContext);

  if (loading) {
    return <div>Loading app...</div>;
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Only verified users */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
           <Route
          path="/email"
          element={
           <EmailVerifyRoute>
              <EmailVerify />
          </EmailVerifyRoute> 
          } 
        />  
        

        {/* Login/register only if NOT logged in */}
        <Route
          path="/login"
          element={!isLoggedIn ? <LoginRegister /> : <Navigate to="/" replace />}
        />

        {/* Password reset open to all */}
        <Route path="/password" element={<ResetPassword />} />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}

export default App;
