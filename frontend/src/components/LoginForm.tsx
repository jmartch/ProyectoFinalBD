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
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4ff] p-6">
      {/* MAIN CARD (taller and wider like the screenshot) */}
      <div className="w-full max-w-6xl h-[700px] bg-white rounded-xl shadow-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT PANEL (tall, inset rounded panel like screenshot) */}
        <div
          className="
            hidden md:flex flex-col justify-between
            rounded-xl p-4 shadow-lg 
            bg-linear-to-br from-indigo-600 via-purple-500 to-blue-400
            bg-cover bg-center bg-no-repeat
          "
          // To use an image instead of gradient:
          // style={{ backgroundImage: "url('/yourImageHere.jpg')" }}
        >
          <div className="flex-1 flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-72 lg:h-96 w-auto object-contain" />
          </div>
        </div>

        {/* RIGHT PANEL (narrower, centered vertically) */}
        <div className="flex flex-col justify-center px-6 md:px-12">

          {/* Program Title */}
          <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight mb-6">
            GLOBAL ENGLISH
          </h1>

          {/* Welcome Text */}
          <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
          <p className="text-gray-600 mb-8">
            Please enter your credentials to access the platform.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-sm">

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="user">Usuario</Label>
              <Input
                id="user"
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Sign In
            </Button>
          </form>

          {/* TEST CREDENTIALS */}
          <div className="mt-10 p-4 bg-indigo-50 rounded-xl text-sm max-w-sm">
            <p className="mb-2 font-medium">Credenciales de prueba:</p>
            <p><strong>Administrador:</strong> admin@globalenglish.edu / admin123</p>
            <p><strong>Administrativo:</strong> carlos.admin@globalenglish.edu / admin123</p>
            <p><strong>Tutor:</strong> ana.tutor@globalenglish.edu / tutor123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
