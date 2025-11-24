import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { login, setCurrentUser, AuthUser } from "../lib/auth";
import { users, persons, documentTypes } from "../lib/mockData";
import { UserRole } from "../types";
import { UserPlus, LogIn } from "lucide-react";

interface LoginFormProps {
  onLogin: (authUser: AuthUser) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Registration fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.TUTOR);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    // Validaciones
    if (registerPassword !== confirmPassword) {
      setRegisterError("Las contraseñas no coinciden");
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Verificar si el email ya existe
    if (users.find(u => u.email === email)) {
      setRegisterError("Este email ya está registrado");
      return;
    }

    // Verificar si el documento ya existe
    if (persons.find(p => p.documentNumber === documentNumber)) {
      setRegisterError("Este número de documento ya está registrado");
      return;
    }

    // Crear nuevo usuario (en producción esto se haría en el backend)
    const newPersonId = `person-${Date.now()}`;
    const newUserId = `user-${Date.now()}`;

    const newPerson = {
      id: newPersonId,
      firstName,
      lastName,
      documentTypeId: documentType,
      documentNumber,
      email,
      phone,
      role,
      isActive: true,
      hiredDate: new Date(),
    };

    const newUser = {
      id: newUserId,
      email,
      password: registerPassword,
      personId: newPersonId,
      role,
      createdAt: new Date(),
    };

    // Agregar a los arrays de mock data
    persons.push(newPerson);
    users.push(newUser);

    setRegisterSuccess("¡Registro exitoso! Ya puedes iniciar sesión.");
    
    // Limpiar formulario
    setFirstName("");
    setLastName("");
    setDocumentType("");
    setDocumentNumber("");
    setEmail("");
    setPhone("");
    setRegisterPassword("");
    setConfirmPassword("");
    setRole(UserRole.TUTOR);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4ff] p-6">
      {/* MAIN CARD */}
      <div className="w-full max-w-6xl min-h-[700px] bg-white rounded-xl shadow-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT PANEL */}
        <div
          className="
            hidden md:flex flex-col justify-between
            rounded-xl p-4 shadow-lg 
            bg-gradient-to-br from-indigo-600 via-purple-500 to-blue-400
            bg-cover bg-center bg-no-repeat
          "
        >
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col justify-center px-6 md:px-12">

          {/* Program Title */}
          <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight mb-6">
            GLOBAL ENGLISH
          </h1>

          <Tabs defaultValue="login" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="register">
                <UserPlus className="w-4 h-4 mr-2" />
                Registrarse
              </TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
              <p className="text-gray-600 mb-8">
                Please enter your credentials to access the platform.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">

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
              <div className="mt-10 p-4 bg-indigo-50 rounded-xl text-sm">
                <p className="mb-2 font-medium">Credenciales de prueba:</p>
                <p><strong>Administrador:</strong> admin@globalenglish.edu / admin123</p>
                <p><strong>Administrativo:</strong> carlos.admin@globalenglish.edu / admin123</p>
                <p><strong>Tutor:</strong> ana.tutor@globalenglish.edu / tutor123</p>
              </div>
            </TabsContent>

            {/* REGISTER TAB */}
            <TabsContent value="register">
              <h2 className="text-2xl font-bold mb-1">Crear Cuenta</h2>
              <p className="text-gray-600 mb-6">
                Complete el formulario para registrarse en el sistema.
              </p>

              <form onSubmit={handleRegister} className="space-y-4">

                {registerError && (
                  <Alert variant="destructive">
                    <AlertDescription>{registerError}</AlertDescription>
                  </Alert>
                )}

                {registerSuccess && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>{registerSuccess}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombres</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellidos</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Tipo de Documento</Label>
                    <Select value={documentType} onValueChange={setDocumentType} required>
                      <SelectTrigger id="documentType">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map(dt => (
                          <SelectItem key={dt.id} value={dt.id}>
                            {dt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentNumber">Número de Documento</Label>
                    <Input
                      id="documentNumber"
                      type="text"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as UserRole)} required>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.TUTOR}>Tutor</SelectItem>
                      <SelectItem value={UserRole.ADMINISTRATIVO}>Administrativo</SelectItem>
                      <SelectItem value={UserRole.ADMINISTRADOR}>Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Contraseña</Label>
                  <Input
                    id="registerPassword"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  Registrarse
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}