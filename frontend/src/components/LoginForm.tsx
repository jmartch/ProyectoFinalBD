import { useState } from "react";
import logo from "../assets/logo.png";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { login, setCurrentUser, AuthUser } from "../lib/auth";

interface LoginFormProps {
  onLogin: (authUser: AuthUser) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const authUser = login(user, password);
    if (authUser) {
      setCurrentUser(authUser);
      onLogin(authUser);
    } else {
      setError("Credenciales inválidas. Por favor, intente nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4ff] px-4 py-10">
      {/* CARD PRINCIPAL */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-[0_24px_80px_rgba(148,163,184,0.6)] overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* PANEL IZQUIERDO: gradiente + LOGO ENORME */}
<div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-[#4c6fff] via-[#7b5cff] to-[#4ac4ff] px-10 py-10">
  <img
    src={logo}
    alt="Global English"
    className="logo-float w-auto 
               h-[14rem] md:h-[18rem] lg:h-[20rem] xl:h-[22rem]
               drop-shadow-[0_40px_80px_rgba(15,23,42,0.75)]"
  />
  <p className="mt-8 text-sm lg:text-base text-white/90 text-center max-w-sm">
    Plataforma de gestión académica para el programa{" "}
    <span className="font-semibold">GLOBAL ENGLISH</span>.
  </p>
</div>


        {/* PANEL DERECHO (FORMULARIO) */}
        <div className="flex flex-col justify-center px-7 py-8 md:px-10 lg:px-14 lg:py-12">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-[0.25em] text-indigo-500 uppercase mb-1">
              GLOBAL ENGLISH
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-800 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Ingresa tus credenciales para acceder a la plataforma.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-sm">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="user" className="text-sm font-medium text-slate-700">
                Usuario
              </Label>
              <Input
                id="user"
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
                className="h-11 rounded-xl border border-slate-300 bg-slate-50 text-sm placeholder:text-slate-400
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border border-slate-300 bg-slate-50 text-sm placeholder:text-slate-400
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-semibold text-sm text-white
                         bg-gradient-to-r from-[#4c6fff] via-[#7b5cff] to-[#4c6fff]
                         transition-transform duration-200
                         hover:scale-[1.02] active:scale-[0.96]"
            >
              Sign In
            </Button>
          </form>

          {/* CREDENCIALES DE PRUEBA */}
          <div className="mt-8 max-w-sm rounded-2xl bg-indigo-50 border border-indigo-100 px-4 py-4 text-xs text-slate-800">
            <p className="mb-2 font-semibold text-indigo-700">
              Credenciales de prueba
            </p>
            <ul className="space-y-1">
              <li>
                <span className="font-semibold">Administrador:</span>{" "}
                admin@globalenglish.edu /{" "}
                <span className="font-mono">admin123</span>
              </li>
              <li>
                <span className="font-semibold">Administrativo:</span>{" "}
                carlos.admin@globalenglish.edu /{" "}
                <span className="font-mono">admin123</span>
              </li>
              <li>
                <span className="font-semibold">Tutor:</span>{" "}
                ana.tutor@globalenglish.edu /{" "}
                <span className="font-mono">tutor123</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
