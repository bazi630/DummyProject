import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./components/chat";


export default function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <BrowserRouter>
      <Routes>

        {/* Root redirect */}
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Navigate to="/chat" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}



