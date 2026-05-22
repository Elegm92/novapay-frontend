import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from './pages/Dashboard.jsx'


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Pública */}
        <Route path="/login" element={<Login />} />

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App