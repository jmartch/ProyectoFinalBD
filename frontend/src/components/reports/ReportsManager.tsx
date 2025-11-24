import { useState } from 'react';
import { AuthUser } from '../../lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import {
  aulas,
  institutions,
  students,
  studentAulaAssignments,
  schedules,
  tutorAssignments,
  persons,
  programWeeks,
  gradePeriods,
  gradeComponents,
} from '../../lib/mockData';
import { FileText, Download, Calendar, Users, BarChart } from 'lucide-react';
import { DayOfWeek } from '../../types';

interface ReportsManagerProps {
  authUser: AuthUser;
}

interface AttendanceRow {
  week: number;
  date: string;
  dayOfWeek: string;
  tutor: string;
  schedule: string;
  wasHeld: boolean;
  hoursPlanned: number;
  hoursTaught: number;
  absenceReason: string | null;
  makeupDate: null;
}

interface StudentAttendanceRow {
  week: number;
  date: string;
  dayOfWeek: string;
  schedule: string;
  wasHeld: boolean;
  attended: boolean;
  hoursPlanned: number;
}

interface ComponentGrade {
  component: string;
  percentage: number;
  grade: number;
}

interface PeriodGrade {
  period: string;
  components: ComponentGrade[];
  finalGrade: number;
}

export function ReportsManager({ authUser }: ReportsManagerProps) {
  const [reportType, setReportType] = useState<'classroom' | 'student' | 'grades'>('classroom');
  const [selectedAula, setSelectedAula] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Mock attendance data for demonstration
  const generateMockAttendance = () => {
    if (!selectedAula) return [];

    const mockData: AttendanceRow[] = [];
    const weeks = programWeeks.slice(0, 4); // Últimas 4 semanas
    const selectedAulaData = aulas.find((a) => a.id === selectedAula);
    const aulaSchedules = schedules.filter((s) => s.aulaId === selectedAula && s.isActive);
    const assignment = tutorAssignments.find(
      (ta) => ta.aulaId === selectedAula && ta.isActive,
    );
    const tutor = assignment ? persons.find((p) => p.id === assignment.tutorId) : null;

    weeks.forEach((week) => {
      aulaSchedules.forEach((schedule) => {
        const date = new Date(week.startDate);
        date.setDate(
          date.getDate() +
            Object.values(DayOfWeek).indexOf(schedule.dayOfWeek as DayOfWeek),
        );

        mockData.push({
          week: week.weekNumber,
          date: date.toLocaleDateString('es-CO'),
          dayOfWeek: schedule.dayOfWeek,
          tutor: tutor ? `${tutor.firstName} ${tutor.lastName}` : 'Sin asignar',
          schedule: `${schedule.startTime} - ${schedule.endTime}`,
          wasHeld: Math.random() > 0.1, // 90% clases dictadas
          hoursPlanned: schedule.hoursEquivalent,
          hoursTaught: Math.random() > 0.1 ? schedule.hoursEquivalent : 0,
          absenceReason: Math.random() > 0.9 ? 'Festivo' : null,
          makeupDate: null,
        });
      });
    });

    return mockData;
  };

  const generateMockStudentAttendance = () => {
    if (!selectedStudent) return [];

    const mockData: StudentAttendanceRow[] = [];
    const weeks = programWeeks.slice(0, 4);
    const assignment = studentAulaAssignments.find(
      (sa) => sa.studentId === selectedStudent && sa.isActive,
    );
    const aula = assignment ? aulas.find((a) => a.id === assignment.aulaId) : null;
    const aulaSchedules = aula
      ? schedules.filter((s) => s.aulaId === aula.id && s.isActive)
      : [];

    weeks.forEach((week) => {
      aulaSchedules.forEach((schedule) => {
        const date = new Date(week.startDate);
        date.setDate(
          date.getDate() +
            Object.values(DayOfWeek).indexOf(schedule.dayOfWeek as DayOfWeek),
        );

        mockData.push({
          week: week.weekNumber,
          date: date.toLocaleDateString('es-CO'),
          dayOfWeek: schedule.dayOfWeek,
          schedule: `${schedule.startTime} - ${schedule.endTime}`,
          wasHeld: Math.random() > 0.1,
          attended: Math.random() > 0.15, // 85% asistencia
          hoursPlanned: schedule.hoursEquivalent,
        });
      });
    });

    return mockData;
  };

  const generateMockGrades = () => {
    if (!selectedStudent) return [];

    const assignment = studentAulaAssignments.find(
      (sa) => sa.studentId === selectedStudent && sa.isActive,
    );
    const aula = assignment ? aulas.find((a) => a.id === assignment.aulaId) : null;
    const periods = aula
      ? gradePeriods.filter((p) => p.programType === aula.programType)
      : [];

    const mockData: PeriodGrade[] = periods.map((period) => {
      const components = gradeComponents.filter((c) => c.periodId === period.id);
      const componentGrades: ComponentGrade[] = components.map((component) => ({
        component: component.name,
        percentage: component.percentage,
        grade: Math.floor(Math.random() * 30) + 70, // 70-100
      }));

      const finalGrade = componentGrades.reduce(
        (sum, cg) => sum + (cg.grade * cg.percentage) / 100,
        0,
      );

      return {
        period: period.name,
        components: componentGrades,
        finalGrade: Math.round(finalGrade * 10) / 10,
      };
    });

    return mockData;
  };

  const classroomAttendanceData = selectedAula ? generateMockAttendance() : [];
  const studentAttendanceData = selectedStudent ? generateMockStudentAttendance() : [];
  const studentGradesData = selectedStudent ? generateMockGrades() : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl mb-2 font-semibold">Reportes e Indicadores</h2>
        <p className="text-gray-600">
          Generar reportes de gestión y seguimiento del programa
        </p>
      </div>

      <Tabs value={reportType} onValueChange={(v) => setReportType(v as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="classroom">
            <Calendar className="w-4 h-4 mr-2" />
            Asistencia de Aula
          </TabsTrigger>
          <TabsTrigger value="student">
            <Users className="w-4 h-4 mr-2" />
            Asistencia de Estudiante
          </TabsTrigger>
          <TabsTrigger value="grades">
            <BarChart className="w-4 h-4 mr-2" />
            Boletín de Calificaciones
          </TabsTrigger>
        </TabsList>

        {/* Asistencia de Aula */}
        <TabsContent value="classroom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Asistencia General del Aula</CardTitle>
              <CardDescription>
                Visualizar el histórico de asistencia por aula mostrando tutor, fechas,
                horarios y reposiciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aula-select">Aula</Label>
                  <Select value={selectedAula} onValueChange={setSelectedAula}>
                    <SelectTrigger id="aula-select" className="w-full">
                      <SelectValue placeholder="Seleccione aula" />
                    </SelectTrigger>
                    <SelectContent className="r(--radix-select-trigger-width)] rounded-lg border border-slate-200 bg-white shadow-lg">
                      {aulas.map((aula) => {
                        const institution = institutions.find(
                          (i) => i.id === aula.institutionId,
                        );
                        return (
                          <SelectItem key={aula.id} value={aula.id}>
                            {aula.code} - {institution?.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Período</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="Desde"
                    />
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="Hasta"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Reporte
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>

              {selectedAula && classroomAttendanceData.length > 0 && (
                <div className="border rounded-lg overflow-hidden mt-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Semana</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Día</TableHead>
                          <TableHead>Tutor</TableHead>
                          <TableHead>Horario</TableHead>
                          <TableHead>¿Se Dictó?</TableHead>
                          <TableHead>Horas Plan.</TableHead>
                          <TableHead>Horas Dict.</TableHead>
                          <TableHead>Motivo</TableHead>
                          <TableHead>Reposición</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classroomAttendanceData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.week}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.dayOfWeek}</TableCell>
                            <TableCell>{row.tutor}</TableCell>
                            <TableCell>{row.schedule}</TableCell>
                            <TableCell>
                              <Badge variant={row.wasHeld ? 'default' : 'secondary'}>
                                {row.wasHeld ? 'Sí' : 'No'}
                              </Badge>
                            </TableCell>
                            <TableCell>{row.hoursPlanned}h</TableCell>
                            <TableCell>{row.hoursTaught}h</TableCell>
                            <TableCell>{row.absenceReason || '-'}</TableCell>
                            <TableCell>{row.makeupDate || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Asistencia de Estudiante */}
        <TabsContent value="student" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Asistencia Individual</CardTitle>
              <CardDescription>
                Visualizar el histórico de asistencia de un estudiante específico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-select">Estudiante</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger id="student-select" className="w-full">
                      <SelectValue placeholder="Seleccione estudiante" />
                    </SelectTrigger>
                    <SelectContent className="(--radix-select-trigger-width)] rounded-lg border border-slate-200 bg-white shadow-lg">
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName} - {student.documentNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Período</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="Desde" />
                    <Input type="date" placeholder="Hasta" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Reporte
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>

              {selectedStudent && studentAttendanceData.length > 0 && (
                <div className="space-y-4 mt-6">
                  {/* Info estudiante */}
                  {(() => {
                    const studentData = students.find((s) => s.id === selectedStudent);
                    const assignment = studentAulaAssignments.find(
                      (sa) => sa.studentId === selectedStudent && sa.isActive,
                    );
                    const aula = assignment
                      ? aulas.find((a) => a.id === assignment.aulaId)
                      : null;
                    const institution = aula
                      ? institutions.find((i) => i.id === aula.institutionId)
                      : null;

                    return (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">Estudiante</p>
                            <p>
                              {studentData?.firstName} {studentData?.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Institución</p>
                            <p>{institution?.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Grado</p>
                            <p>Grado {studentData?.grade}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Aula</p>
                            <p>{aula?.code}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Tabla asistencia */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Semana</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Día</TableHead>
                            <TableHead>Horario</TableHead>
                            <TableHead>Clase Dictada</TableHead>
                            <TableHead>Asistió</TableHead>
                            <TableHead>Horas</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentAttendanceData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.week}</TableCell>
                              <TableCell>{row.date}</TableCell>
                              <TableCell>{row.dayOfWeek}</TableCell>
                              <TableCell>{row.schedule}</TableCell>
                              <TableCell>
                                <Badge variant={row.wasHeld ? 'default' : 'secondary'}>
                                  {row.wasHeld ? 'Sí' : 'No'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={row.attended ? 'default' : 'destructive'}
                                >
                                  {row.attended ? 'Sí' : 'No'}
                                </Badge>
                              </TableCell>
                              <TableCell>{row.hoursPlanned}h</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Stats asistencia */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl">
                          {studentAttendanceData.filter((d) => d.attended).length}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Clases Asistidas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl">
                          {
                            studentAttendanceData.filter(
                              (d) => !d.attended && d.wasHeld,
                            ).length
                          }
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Ausencias</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl">
                          {Math.round(
                            (studentAttendanceData.filter((d) => d.attended).length /
                              studentAttendanceData.filter((d) => d.wasHeld).length) *
                              100,
                          )}
                          %
                        </div>
                        <p className="text-xs text-gray-600 mt-1">% Asistencia</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Boletín de calificaciones */}
        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Boletín de Calificaciones</CardTitle>
              <CardDescription>
                Reporte de calificaciones por período y componente con nota definitiva
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grades-student-select">Estudiante</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger id="grades-student-select" className="w-full">
                      <SelectValue placeholder="Seleccione estudiante" />
                    </SelectTrigger>
                    <SelectContent className="(--radix-select-trigger-width)] rounded-lg border border-slate-200 bg-white shadow-lg">
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName} - {student.documentNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Boletín
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>

              {selectedStudent && studentGradesData.length > 0 && (
                <div className="space-y-6 mt-6">
                  {/* Encabezado estudiante */}
                  {(() => {
                    const studentData = students.find((s) => s.id === selectedStudent);
                    const assignment = studentAulaAssignments.find(
                      (sa) => sa.studentId === selectedStudent && sa.isActive,
                    );
                    const aula = assignment
                      ? aulas.find((a) => a.id === assignment.aulaId)
                      : null;
                    const institution = aula
                      ? institutions.find((i) => i.id === aula.institutionId)
                      : null;

                    return (
                      <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                        <h3 className="text-xl mb-4">Boletín de Calificaciones</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">Estudiante</p>
                            <p>
                              {studentData?.firstName} {studentData?.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Documento</p>
                            <p>{studentData?.documentNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Institución</p>
                            <p>{institution?.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Grado / Programa</p>
                            <p>
                              Grado {studentData?.grade} - {aula?.programType}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Notas por período */}
                  {studentGradesData.map((periodData, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{periodData.period}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Componente</TableHead>
                                <TableHead className="text-center">
                                  Porcentaje
                                </TableHead>
                                <TableHead className="text-center">Nota</TableHead>
                                <TableHead className="text-center">Ponderado</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {periodData.components.map((component, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{component.component}</TableCell>
                                  <TableCell className="text-center">
                                    {component.percentage}%
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant="outline">{component.grade}</Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {(
                                      (component.grade * component.percentage) /
                                      100
                                    ).toFixed(1)}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow className="bg-blue-50">
                                <TableCell colSpan={3}>
                                  <strong>Nota Final del Período</strong>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="default" className="text-base px-3 py-1">
                                    {periodData.finalGrade}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Promedio general */}
                  <Card className="bg-lineal-to-r from-blue-50 to-indigo-50">
                    <CardContent className="pt-6 text-center">
                      <p className="text-sm text-gray-600 mb-2">Promedio General</p>
                      <div className="text-4xl">
                        {(
                          studentGradesData.reduce(
                            (sum, p) => sum + p.finalGrade,
                            0,
                          ) / studentGradesData.length
                        ).toFixed(1)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

