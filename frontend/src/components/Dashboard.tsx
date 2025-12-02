// src/components/Dashboard.tsx
import { useState } from "react";
import {
  AuthUser,
  logout,
  canAccessAdminFunctions,
  canAccessSystemAdmin,
} from "../lib/auth";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  GraduationCap,
  School,
  Settings,
  FileText,
  LogOut,
  BarChart3,
  UserCog,
  Calendar as CalendarIcon,
} from "lucide-react";

import { InstitutionsManager } from "./admin/InstitutionsManager";
import { AulasManager } from "./admin/AulasManager";
import { StudentsManager } from "./admin/StudentsManager";
import  TutorsManager  from "./admin/TutorsManager";
import { AttendanceManager } from "./tutor/AttendanceManager";
import { GradesManager } from "./tutor/GradesManager";
import { ReportsManager } from "./reports/ReportsManager";
import { SystemSettings } from "./admin/SystemSettings";
import { TutorDashboard } from "./tutor/TutorDashboard";
import { ScheduleCalendar } from "./tutor/ScheduleCalendar";

import { ProgramType, UserRole } from "../types";
import { Badge } from "./ui/badge";

interface DashboardProps {
  authUser: AuthUser;
}

export function Dashboard({ authUser }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("home");

  // Defensa básica: por si algo raro quedó en localStorage
  if (!authUser || !authUser.user || !authUser.person) {
    console.error("❌ AuthUser inválido en Dashboard:", authUser);
    return (
      <div className="p-6 text-red-600">
        Error al cargar la sesión. Vuelve a iniciar sesión.
      </div>
    );
  }

  const role = authUser.user.role as UserRole;

  // Roles (según tu enum y helpers)
  const isAdmin = canAccessAdminFunctions(role);      // ADMINISTRADOR / ADMINISTRATIVO
  const isSystemAdmin = canAccessSystemAdmin(role);   // solo ADMINISTRADOR
  const isTutor = role === UserRole.TUTOR;            // solo TUTOR

  // 👉 SIEMPRE mostrar INSIDE y OUTSIDE en el header
  const programs: ProgramType[] = [
    ProgramType.INSIDECLASSROOM,
    ProgramType.OUTSIDECLASSROOM,
  ];

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Etiqueta para mostrar bonito el rol
  const roleLabelMap: Record<UserRole, string> = {
    [UserRole.ADMINISTRADOR]: "Administrador",
    [UserRole.ADMINISTRATIVO]: "Administrativo",
    [UserRole.TUTOR]: "Tutor",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                GLOBALENGLISH
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-600">
                  Sistema de Gestión del Programa de Bilingüismo
                </p>

                {/* ✅ Siempre mostrar INSIDE / OUTSIDE */}
                <div className="flex gap-1">
                  {programs.includes(ProgramType.INSIDECLASSROOM) && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                      INSIDECLASSROOM (4º-5º)
                    </Badge>
                  )}
                  {programs.includes(ProgramType.OUTSIDECLASSROOM) && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                    >
                      OUTSIDECLASSROOM (9º-10º)
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p>
                  {authUser.person.firstName} {authUser.person.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {roleLabelMap[role] ?? role}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* ============ TABS (botones) ============ */}
          <TabsList className="mb-6 flex-wrap h-auto">
            {/* Todos ven Inicio */}
            <TabsTrigger value="home">
              <BarChart3 className="w-4 h-4 mr-2" />
              Inicio
            </TabsTrigger>

            {/* Secciones administrativas: solo ADMINISTRADOR + ADMINISTRATIVO */}
            {isAdmin && (
              <>
                <TabsTrigger value="institutions">
                  <School className="w-4 h-4 mr-2" />
                  Instituciones
                </TabsTrigger>
                <TabsTrigger value="aulas">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Aulas
                </TabsTrigger>
                <TabsTrigger value="students">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Estudiantes
                </TabsTrigger>
                <TabsTrigger value="tutors">
                  <UserCog className="w-4 h-4 mr-2" />
                  Tutores
                </TabsTrigger>
              </>
            )}

            {/* Funciones académicas: ADMIN + TUTOR */}
            {(isAdmin || isTutor) && (
              <>
                <TabsTrigger value="attendance">
                  <Calendar className="w-4 h-4 mr-2" />
                  Asistencia
                </TabsTrigger>
                <TabsTrigger value="grades">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Calificaciones
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendario
                </TabsTrigger>
                <TabsTrigger value="reports">
                  <FileText className="w-4 h-4 mr-2" />
                  Reportes
                </TabsTrigger>
              </>
            )}

            {/* Configuración: solo ADMINISTRADOR (system admin) */}
            {isSystemAdmin && (
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </TabsTrigger>
            )}
          </TabsList>

          {/* ============ CONTENIDO DE CADA TAB ============ */}

          {/* Inicio:
              - Si luego quieres diferenciar más, aquí puedes hacer:
                if (isAdmin) return <AdminHomeDashboard />
                if (isTutor) return <TutorHomeDashboard />
             por ahora dejo tu TutorDashboard genérico.
          */}
          <TabsContent value="home">
            <TutorDashboard authUser={authUser} />
          </TabsContent>

          {/* Bloques solo para ADMIN / ADMINISTRATIVO */}
          {isAdmin && (
            <>
              <TabsContent value="institutions">
                <InstitutionsManager />
              </TabsContent>

              <TabsContent value="aulas">
                <AulasManager />
              </TabsContent>

              <TabsContent value="students">
                <StudentsManager />
              </TabsContent>

              <TabsContent value="tutors">
                <TutorsManager />
              </TabsContent>
            </>
          )}

          {/* Asistencia, notas, calendario y reportes: ADMIN + TUTOR */}
          {(isAdmin || isTutor) && (
            <>
              <TabsContent value="attendance">
                <AttendanceManager authUser={authUser} />
              </TabsContent>

              <TabsContent value="grades">
                <GradesManager authUser={authUser} />
              </TabsContent>

              <TabsContent value="calendar">
                <ScheduleCalendar authUser={authUser} />
              </TabsContent>

              <TabsContent value="reports">
                <ReportsManager authUser={authUser} />
              </TabsContent>
            </>
          )}

          {/* Configuración: solo ADMINISTRADOR */}
          {isSystemAdmin && (
            <TabsContent value="settings">
              <SystemSettings />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
