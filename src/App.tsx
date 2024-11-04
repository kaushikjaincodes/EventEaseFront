import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./components/ui/authContext";
import { ProtectedRoute } from "./components/ui/protectedRoute";
import { Signup } from "./pages/signup";
import Dashboard from "./pages/dashboard";

const App: React.FC = () => {
  const RequireAuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (token && location.pathname === "/") {
      return <Navigate to="/home" replace />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <RequireAuthRedirect>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </RequireAuthRedirect>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
