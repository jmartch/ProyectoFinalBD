import { AuthUser } from '../../lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { aulas, tutorAssignments, institutions, sedes, schedules, students, studentAulaAssignments, persons } from '../../lib/mockData';
import { Calendar, BookOpen, Users, Clock } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ProgramType } from '../../types';

interface TutorDashboardProps {
  authUser: AuthUser;
}

export function TutorDashboard({ authUser }: TutorDashboardProps) {
  // Get tutor's assigned aulas
  const tutorAulas = tutorAssignments
    .filter(ta => ta.tutorId === authUser.person.id && ta.isActive)
    .map(ta => {
      const aula = aulas.find(a => a.id === ta.aulaId);
      if (!aula) return null;
      
      const institution = institutions.find(i => i.id === aula.institutionId);
      const sede = sedes.find(s => s.id === aula.sedeId);
      const aulaSchedules = schedules.filter(s => s.aulaId === aula.id && s.isActive);
      const aulaStudents = studentAulaAssignments
        .filter(sa => sa.aulaId === aula.id && sa.isActive)
        .map(sa => students.find(s => s.id === sa.studentId))
        .filter(Boolean);
      
      return {
        aula,
        institution,
        sede,
        schedules: aulaSchedules,
        studentsCount: aulaStudents.length,
      };
    })
    .filter(Boolean);

  // Separar por programa
  const insideClassroomAulas = tutorAulas.filter(item => item?.aula.programType === ProgramType.INSIDECLASSROOM);
  const outsideClassroomAulas = tutorAulas.filter(item => item?.aula.programType === ProgramType.OUTSIDECLASSROOM);

  const totalStudents = tutorAulas.reduce((sum, item) => sum + (item?.studentsCount || 0), 0);
  const totalAulas = tutorAulas.length;
  const insideStudents = insideClassroomAulas.reduce((sum, item) => sum + (item?.studentsCount || 0), 0);
  const outsideStudents = outsideClassroomAulas.reduce((sum, item) => sum + (item?.studentsCount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Panel de Inicio</h2>
        <p className="text-gray-600">
          Bienvenido, {authUser.person.firstName} {authUser.person.lastName}
        </p>
      </div>

      {/* Stats Cards - Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Aulas Asignadas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalAulas}</div>
            <p className="text-xs text-muted-foreground">
              Aulas activas en el programa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Estudiantes Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Estudiantes bajo su tutoría
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Clases Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {tutorAulas.reduce((sum, item) => sum + (item?.schedules.length || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sesiones programadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats por Programa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* INSIDECLASSROOM */}
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">INSIDECLASSROOM</CardTitle>
              <Badge className="bg-blue-600 text-white">4º - 5º Grado</Badge>
            </div>
            <CardDescription>Clases en horario escolar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl">{insideClassroomAulas.length}</p>
                <p className="text-xs text-gray-600">Aulas</p>
              </div>
              <div>
                <p className="text-2xl">{insideStudents}</p>
                <p className="text-xs text-gray-600">Estudiantes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OUTSIDECLASSROOM */}
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">OUTSIDECLASSROOM</CardTitle>
              <Badge className="bg-purple-600 text-white">9º - 10º Grado</Badge>
            </div>
            <CardDescription>Clases en horario contrario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl">{outsideClassroomAulas.length}</p>
                <p className="text-xs text-gray-600">Aulas</p>
              </div>
              <div>
                <p className="text-2xl">{outsideStudents}</p>
                <p className="text-xs text-gray-600">Estudiantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aulas Details - Separadas por programa */}
      {insideClassroomAulas.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg">INSIDECLASSROOM - Mis Aulas (4º-5º)</h3>
            <Badge className="bg-blue-600 text-white text-xs">
              {insideClassroomAulas.length} {insideClassroomAulas.length === 1 ? 'aula' : 'aulas'}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insideClassroomAulas.map((item, index) => {
              if (!item) return null;
              const { aula, institution, sede, schedules: aulaSchedules, studentsCount } = item;
              
              return (
                <Card key={index} className="border-blue-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{aula.code}</CardTitle>
                        <CardDescription>
                          {institution?.name} - {sede?.name}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                        Grado {aula.grade}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{studentsCount} estudiantes</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          {aula.programType}
                        </Badge>
                      </div>

                      <div className="border-t pt-3 mt-3">
                        <p className="text-xs text-gray-500 mb-2 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Horarios:
                        </p>
                        <div className="space-y-1">
                          {aulaSchedules.map((schedule) => (
                            <div key={schedule.id} className="text-xs bg-blue-50 px-2 py-1 rounded border border-blue-200">
                              {schedule.dayOfWeek}: {schedule.startTime} - {schedule.endTime}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {outsideClassroomAulas.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg">OUTSIDECLASSROOM - Mis Aulas (9º-10º)</h3>
            <Badge className="bg-purple-600 text-white text-xs">
              {outsideClassroomAulas.length} {outsideClassroomAulas.length === 1 ? 'aula' : 'aulas'}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outsideClassroomAulas.map((item, index) => {
              if (!item) return null;
              const { aula, institution, sede, schedules: aulaSchedules, studentsCount } = item;
              
              return (
                <Card key={index} className="border-purple-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{aula.code}</CardTitle>
                        <CardDescription>
                          {institution?.name} - {sede?.name}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                        Grado {aula.grade}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{studentsCount} estudiantes</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                          {aula.programType}
                        </Badge>
                      </div>

                      <div className="border-t pt-3 mt-3">
                        <p className="text-xs text-gray-500 mb-2 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Horarios:
                        </p>
                        <div className="space-y-1">
                          {aulaSchedules.map((schedule) => (
                            <div key={schedule.id} className="text-xs bg-purple-50 px-2 py-1 rounded border border-purple-200">
                              {schedule.dayOfWeek}: {schedule.startTime} - {schedule.endTime}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {tutorAulas.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No tienes aulas asignadas actualmente.</p>
            <p className="text-sm mt-1">Contacta al administrador para más información.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 