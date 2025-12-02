import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { Dashboard } from "./components/Dashboard";
import { getCurrentUser, AuthUser } from "./lib/auth";
import { UserRole } from "./types";
import "./styles/globals.css";

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    const currentUser = getCurrentUser();
    setAuthUser(currentUser);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay sesión: solo mostramos el login (SIN router)
  if (!authUser) {
    return <LoginForm onLogin={setAuthUser} />;
  }

  // Ya hay usuario autenticado → definimos basePath según rol
  const role = authUser.user.role as UserRole;

  const basePath =
    role === UserRole.ADMINISTRADOR
      ? "/admin"
      : role === UserRole.ADMINISTRATIVO
      ? "/administrativo"
      : "/tutor"; // por defecto, tutor

  return (
    <BrowserRouter>
      <Routes>
        {/* Al entrar a "/", redirige al endpoint según el rol */}
        <Route path="/" element={<Navigate to={basePath} replace />} />

        {/* Endpoint de Administrador */}
        <Route
          path="/admin/*"
          element={<Dashboard authUser={authUser} />}
        />

        {/* Endpoint de Administrativo */}
        <Route
          path="/administrativo/*"
          element={<Dashboard authUser={authUser} />}
        />

        {/* Endpoint de Tutor */}
        <Route
          path="/tutor/*"
          element={<Dashboard authUser={authUser} />}
        />

        {/* Cualquier otra ruta rara → manda al endpoint del rol */}
        <Route path="*" element={<Navigate to={basePath} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
