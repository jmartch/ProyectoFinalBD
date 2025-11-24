import { useState } from 'react';
import { AuthUser, logout, setCurrentUser, canAccessAdminFunctions, canAccessSystemAdmin } from '../lib/auth';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, BookOpen, Calendar, ClipboardList, GraduationCap, 
  School, Settings, FileText, LogOut, BarChart3, UserCog
} from 'lucide-react';
import { InstitutionsManager } from './admin/InstitutionsManager';
import { AulasManager } from './admin/AulasManager';
import { StudentsManager } from './admin/StudentsManager';
import { TutorsManager } from './admin/TutorsManager';
import { AttendanceManager } from './tutor/AttendanceManager';
import { GradesManager } from './tutor/GradesManager';
import { ReportsManager } from './reports/ReportsManager';
import { SystemSettings } from './admin/SystemSettings';
import { TutorDashboard } from './tutor/TutorDashboard';
import { aulas, tutorAssignments } from '../lib/mockData';
import { ProgramType } from '../types';
import { Badge } from './ui/badge';

interface DashboardProps {
  authUser: AuthUser;
}

export function Dashboard({ authUser }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const isAdmin = canAccessAdminFunctions(authUser.user.role);
  const isSystemAdmin = canAccessSystemAdmin(authUser.user.role);

  // Determinar los programas del usuario
  const getUserPrograms = () => {
    const userAulas = tutorAssignments
      .filter(ta => ta.tutorId === authUser.person.id && ta.isActive)
      .map(ta => aulas.find(a => a.id === ta.aulaId))
      .filter(Boolean);
    
    const programs = new Set(userAulas.map(a => a?.programType));
    return Array.from(programs);
  };

  const userPrograms = isAdmin ? [ProgramType.INSIDECLASSROOM, ProgramType.OUTSIDECLASSROOM] : getUserPrograms();

  const handleLogout = () => {
    logout();
    window.location.reload();
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
                {userPrograms.length > 0 && (
                  <div className="flex gap-1">
                    {userPrograms.includes(ProgramType.INSIDECLASSROOM) && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        INSIDECLASSROOM (4º-5º)
                      </Badge>
                    )}
                    {userPrograms.includes(ProgramType.OUTSIDECLASSROOM) && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        OUTSIDECLASSROOM (9º-10º)
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p>{authUser.person.firstName} {authUser.person.lastName}</p>
                <p className="text-sm text-gray-600">{authUser.user.role}</p>
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
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="home">
              <BarChart3 className="w-4 h-4 mr-2" />
              Inicio
            </TabsTrigger>
            
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
            
            <TabsTrigger value="attendance">
              <Calendar className="w-4 h-4 mr-2" />
              Asistencia
            </TabsTrigger>
            <TabsTrigger value="grades">
              <ClipboardList className="w-4 h-4 mr-2" />
              Calificaciones
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="w-4 h-4 mr-2" />
              Reportes
            </TabsTrigger>
            
            {isSystemAdmin && (
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="home">
            <TutorDashboard authUser={authUser} />
          </TabsContent>

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

          <TabsContent value="attendance">
            <AttendanceManager authUser={authUser} />
          </TabsContent>

          <TabsContent value="grades">
            <GradesManager authUser={authUser} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsManager authUser={authUser} />
          </TabsContent>

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