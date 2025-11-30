// Sistema de autenticación simulado
import { User, Person, UserRole } from '../types';
import { users, persons } from './mockData';

export interface AuthUser {
  user: User;
  person: Person;
}

export const login = (email: string, password: string): AuthUser | null => {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return null;
  
  const person = persons.find(p => p.id === user.personId);
  if (!person) return null;
  
  return { user, person };
};

export const getCurrentUser = (): AuthUser | null => {
  const stored = localStorage.getItem('currentUser');
  if (!stored) return null;
  return JSON.parse(stored);
};

export const setCurrentUser = (authUser: AuthUser | null): void => {
  if (authUser) {
    localStorage.setItem('currentUser', JSON.stringify(authUser));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const logout = (): void => {
  setCurrentUser(null);
};

export const hasRole = (role: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(role);
};

export const canAccessTutorFunctions = (role: UserRole): boolean => {
  return [UserRole.TUTOR, UserRole.ADMINISTRATIVO, UserRole.ADMINISTRADOR].includes(role);
};

export const canAccessAdminFunctions = (role: UserRole): boolean => {
  return [UserRole.ADMINISTRATIVO, UserRole.ADMINISTRADOR].includes(role);
};

export const canAccessSystemAdmin = (role: UserRole): boolean => {
  return role === UserRole.ADMINISTRADOR;
};