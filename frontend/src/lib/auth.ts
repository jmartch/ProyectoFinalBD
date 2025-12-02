// src/lib/auth.ts
import { User, Person, UserRole } from "../types";

export interface AuthUser {
  user: User;
  person: Person;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const CURRENT_USER_KEY = "currentUser";

// =======================
// Helpers de sesión
// =======================
export function getCurrentUser(): AuthUser | null {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);

    // 👇 VALIDACIÓN: si no tiene user/person, lo consideramos inválido
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.user ||
      !parsed.person
    ) {
      console.warn(
        "[auth] currentUser inválido en localStorage, limpiando...",
        parsed
      );
      localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }

    return parsed as AuthUser;
  } catch (err) {
    console.error("[auth] Error parseando currentUser, limpiando...", err);
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}


export function setCurrentUser(authUser: AuthUser | null): void {
  if (authUser) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function logout(): void {
  setCurrentUser(null);
}

// =======================
// Mapeo de rol (API → enum UserRole)
// =======================
function mapApiRoleToUserRole(apiRole?: string | null): UserRole {
  const rol = (apiRole ?? "").trim().toLowerCase();

  switch (rol) {
    case "administrador":
      return UserRole.ADMINISTRADOR;
    case "administrativo":
      return UserRole.ADMINISTRATIVO;
    case "tutor":
    default:
      return UserRole.TUTOR;
  }
}

// =======================
// LOGIN real contra backend
// =======================
/**
 * email: lo que el usuario escribe (admin@globalenglish.edu, etc.)
 * password: contraseña en texto plano
 */
export async function login(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuario: email,
      contraseña: password,
    }),
  });

  if (!response.ok) {
    return null;
  }

  // Se espera una respuesta tipo:
  // {
  //   user: { username: "admin@globalenglish.edu", role: "Administrador" },
  //   person: { id: 900001, firstName: "Global", lastName: "Admin", correo: "...", telefono: "..." }
  // }
  const data = await response.json();

  // Rol desde la API (soportamos varias formas por si el backend cambia un poco)
  const apiRole: string =
    data.user?.role ??
    data.user?.rol ??
    data.rol ??
    "Tutor";

  const role: UserRole = mapApiRoleToUserRole(apiRole);

  const personFromApi = data.person ?? {};

  // Adaptamos a tu interfaz Person
  const person: Person = {
    id: String(
      personFromApi.id ??
        personFromApi.doc_funcionario ??
        "" // id del funcionario
    ),
    firstName: personFromApi.firstName ?? personFromApi.nombre1 ?? "",
    lastName: personFromApi.lastName ?? personFromApi.apellido1 ?? "",
    documentTypeId: personFromApi.documentTypeId ?? personFromApi.tipo_doc ?? "",
    documentNumber:
      personFromApi.documentNumber ??
      String(personFromApi.doc_funcionario ?? ""),
    email: personFromApi.correo ?? personFromApi.email ?? email,
    phone: personFromApi.telefono ?? personFromApi.phone ?? "",
    role,
    isActive: personFromApi.isActive ?? true,
    hiredDate: personFromApi.hiredDate
      ? new Date(personFromApi.hiredDate)
      : new Date(),
  };

  // Username del usuario (id interno de User)
  const username: string =
    data.user?.username ??
    data.user?.usuario ??
    data.usuario ??
    email;

  const user: User = {
    id: String(username),
    email,
    password: "", // nunca guardes la real en el front
    personId: person.id,
    role,
    createdAt: data.user?.createdAt
      ? new Date(data.user.createdAt)
      : new Date(),
  };

  const authUser: AuthUser = { user, person };
  setCurrentUser(authUser);
  return authUser;
}

// =======================
// Helpers de roles
// =======================
export const hasRole = (role: UserRole, requiredRoles: UserRole[]): boolean =>
  requiredRoles.includes(role);

export const canAccessTutorFunctions = (role: UserRole): boolean =>
  [UserRole.TUTOR, UserRole.ADMINISTRATIVO, UserRole.ADMINISTRADOR].includes(
    role
  );

export const canAccessAdminFunctions = (role: UserRole): boolean =>
  [UserRole.ADMINISTRATIVO, UserRole.ADMINISTRADOR].includes(role);

export const canAccessSystemAdmin = (role: UserRole): boolean =>
  role === UserRole.ADMINISTRADOR;
