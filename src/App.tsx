import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/ui/authContext";
import { ProtectedRoute } from "./components/ui/protectedRoute";
import { Signup } from "./pages/signup";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;