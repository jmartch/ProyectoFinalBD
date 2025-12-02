import { useState, useEffect } from 'react';
import { AuthUser } from '../../lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
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
  // keep gradePeriods and gradeComponents mocks for grades view
  gradePeriods, gradeComponents
} from '../../lib/mockData';
import { fetchAulas, fetchRegistroClasesAll, fetchAsistenciasAll, fetchEstudiantesDetalle, fetchTutores, fetchAulaTutores, fetchHorarios, fetchAsignacionesAulaHorario } from '../../lib/reportService';
import { FileText, Calendar, Users, BarChart } from 'lucide-react';
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
  const [aulasList, setAulasList] = useState<any[]>([]);
  const [estudiantesDetalle, setEstudiantesDetalle] = useState<any[]>([]);
  const [registros, setRegistros] = useState<any[]>([]);
  const [asistencias, setAsistencias] = useState<any[]>([]);
  const [tutoresList, setTutoresList] = useState<any[]>([]);
  const [aulaTutores, setAulaTutores] = useState<any[]>([]);
  const [horariosList, setHorariosList] = useState<any[]>([]);
  const [asignacionesHorario, setAsignacionesHorario] = useState<any[]>([]);

  // Generate classroom attendance rows from backend registros + asistencias
  const generateAttendanceFromBackend = () => {
    if (!selectedAula) return [];
    // Filter registros by aula and date range if provided
    const filtered = registros.filter(r => String(r.id_aula) === String(selectedAula));
    const rows: AttendanceRow[] = filtered.map((r: any) => {
      const fecha = new Date(r.fecha).toLocaleDateString('es-CO');
      const dayOfWeek = new Date(r.fecha).toLocaleDateString('es-CO', { weekday: 'long' });
      // Find tutor assignment for the aula that covers the date
      let tutorName = '-';
      try {
        const fechaISO = new Date(r.fecha);
        const assignment = aulaTutores.find((at: any) => {
          if (!at.id_aula) return false;
          if (String(at.id_aula) !== String(r.id_aula)) return false;
          const start = at.fecha_asignacion ? new Date(at.fecha_asignacion) : null;
          const end = at.fecha_fin ? new Date(at.fecha_fin) : null;
          if (start && fechaISO < start) return false;
          if (end && fechaISO > end) return false;
          return true;
        });

        if (assignment) {
          // Use id_tutor to find the tutor in tutoresList which now has nombre1, apellido1
          const tutor = tutoresList.find(t => String(t.id_tutor) === String(assignment.id_tutor));
          if (tutor) {
            tutorName = `${tutor.nombre1 || ''} ${tutor.apellido1 || ''}`.trim();
          }
        }
      } catch (e) {
        tutorName = '-';
      }

      // Find horario via asignacion_aula_horario for the aula and date
      let schedule = '-';
      try {
        const fechaISO = new Date(r.fecha);
        const asign = asignacionesHorario.find((ah: any) => {
          if (!ah.id_aula) return false;
          if (String(ah.id_aula) !== String(r.id_aula)) return false;
          const start = ah.fecha_inicio ? new Date(ah.fecha_inicio) : null;
          const end = ah.fecha_fin ? new Date(ah.fecha_fin) : null;
          if (start && fechaISO < start) return false;
          if (end && fechaISO > end) return false;
          return true;
        });

        if (asign) {
          const horario = horariosList.find(h => String(h.id_horario ?? h.id) === String(asign.id_horario));
          if (horario) {
            // format schedule: Dia HH:MM
            schedule = `${horario.dia_semana || horario.diaSemana || ''} ${horario.hora_inicio || horario.hora_inicio || ''}`.trim();
          }
        }
      } catch (e) {
        schedule = '-';
      }
      const wasHeld = r.dictada === 1 || r.dictada === true;
      const horasPlanned = '-';
      const horasTaught = '-';
      const motivo = r.codigo_motivo || '-';
      const reposicion = r.fecha_reposicion || '-';
      return {
        week: r.numero_semana,
        date: fecha,
        dayOfWeek,
        tutor: tutorName,
        schedule,
        wasHeld,
        hoursPlanned: horasPlanned as any,
        hoursTaught: horasTaught as any,
        absenceReason: motivo,
        makeupDate: reposicion,
      };
    });
    return rows;
  };

  const generateMockStudentAttendance = () => {
    if (!selectedStudent) return [];
    
    const mockData: StudentAttendanceRow[] = [];
    const weeks = programWeeks.slice(0, 4);
    const selectedStudentData = students.find(s => s.id === selectedStudent);
    const assignment = studentAulaAssignments.find(sa => sa.studentId === selectedStudent && sa.isActive);
    const aula = assignment ? aulas.find(a => a.id === assignment.aulaId) : null;
    const aulaSchedules = aula ? schedules.filter(s => s.aulaId === aula.id && s.isActive) : [];

    weeks.forEach((week) => {
      aulaSchedules.forEach((schedule) => {
        const date = new Date(week.startDate);
        date.setDate(date.getDate() + Object.values(DayOfWeek).indexOf(schedule.dayOfWeek as DayOfWeek));
        
        mockData.push({
          week: week.weekNumber,
          date: date.toLocaleDateString('es-CO'),
          dayOfWeek: schedule.dayOfWeek,
          schedule: `${schedule.startTime} - ${schedule.endTime}`,
          wasHeld: Math.random() > 0.1,
          attended: Math.random() > 0.15, // 85% attendance
          hoursPlanned: schedule.hoursEquivalent,
        });
      });
    });

    return mockData;
  };

  const generateMockGrades = () => {
    if (!selectedStudent) return [];
    
    const selectedStudentData = students.find(s => s.id === selectedStudent);
    const assignment = studentAulaAssignments.find(sa => sa.studentId === selectedStudent && sa.isActive);
    const aula = assignment ? aulas.find(a => a.id === assignment.aulaId) : null;
    const periods = aula ? gradePeriods.filter(p => p.programType === aula.programType) : [];

    const mockData: PeriodGrade[] = periods.map(period => {
      const components = gradeComponents.filter(c => c.periodId === period.id);
      const componentGrades: ComponentGrade[] = components.map(component => ({
        component: component.name,
        percentage: component.percentage,
        grade: Math.floor(Math.random() * 30) + 70, // Random grade 70-100
      }));

      const finalGrade = componentGrades.reduce((sum, cg) => sum + (cg.grade * cg.percentage / 100), 0);

      return {
        period: period.name,
        components: componentGrades,
        finalGrade: Math.round(finalGrade * 10) / 10,
      };
    });

    return mockData;
  };

  const classroomAttendanceData = selectedAula ? generateAttendanceFromBackend() : [];
  const studentAttendanceData = selectedStudent ? generateMockStudentAttendance() : [];
  const studentGradesData = selectedStudent ? generateMockGrades() : [];

  // Load initial lists
  const loadLists = async () => {
    try {
      const [aulasRes, estudiantesRes, registrosRes, asistenciasRes] = await Promise.all([
        fetchAulas(),
        fetchEstudiantesDetalle(),
        fetchRegistroClasesAll(),
        fetchAsistenciasAll()
      ]);
      setAulasList(aulasRes);
      setEstudiantesDetalle(estudiantesRes);
      setRegistros(registrosRes);
      setAsistencias(asistenciasRes);
    } catch (err) {
      console.error('Error loading report lists', err);
    }
  };

  // Extended load to fetch tutors, aula-tutor, horarios and asignaciones
  const loadExtendedLists = async () => {
    try {
      const [tutoresRes, aulaTutoresRes, horariosRes, asignacionesRes] = await Promise.all([
        fetchTutores(),
        fetchAulaTutores(),
        fetchHorarios(),
        fetchAsignacionesAulaHorario()
      ]);
      setTutoresList(tutoresRes);
      setAulaTutores(aulaTutoresRes);
      setHorariosList(horariosRes);
      setAsignacionesHorario(asignacionesRes);
    } catch (err) {
      console.error('Error loading extended report lists', err);
    }
  };

  // Run once on mount
  useEffect(() => { loadLists(); loadExtendedLists(); }, []);

  // Debug: log loaded lists to help diagnose missing tutor/name mappings
  useEffect(() => {
    console.debug('ReportsManager loaded lists:', {
      aulas: aulasList.length,
      registros: registros.length,
      asistencias: asistencias.length,
      tutores: tutoresList.length,
      aulaTutores: aulaTutores.length,
      horarios: horariosList.length,
      asignacionesHorario: asignacionesHorario.length,
    });

    if (aulaTutores.length > 0) console.debug('AulaTutor sample:', aulaTutores[0]);
    if (tutoresList.length > 0) console.debug('Tutor sample:', tutoresList[0]);
    if (asignacionesHorario.length > 0) console.debug('Asignacion aula-horario sample:', asignacionesHorario[0]);
  }, [aulasList, registros, asistencias, tutoresList, aulaTutores, horariosList, asignacionesHorario]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Reportes e Indicadores</h2>
        <p className="text-gray-600">
          Generar reportes de gestión y seguimiento del programa
        </p>
      </div>

      <Tabs value={reportType} onValueChange={(v) => setReportType(v as any)}>
        <TabsList>
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

        <TabsContent value="classroom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Asistencia General del Aula</CardTitle>
              <CardDescription>
                Visualizar el histórico de asistencia por aula mostrando tutor, fechas, horarios y reposiciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aula-select">Aula</Label>
                  <Select value={selectedAula} onValueChange={setSelectedAula}>
                    <SelectTrigger id="aula-select">
                      <SelectValue placeholder="Seleccione aula" />
                    </SelectTrigger>
                      <SelectContent>
                        {aulasList.map((aula: any) => {
                          const institution = institutions.find(i => i.id === (aula.id_sede || aula.institutionId));
                          return (
                            <SelectItem key={aula.id_aula ?? aula.id} value={String(aula.id_aula ?? aula.id)}>
                              {(aula.codigo || aula.code || `Aula ${aula.id_aula || aula.id}`)} {institution ? `- ${institution.name}` : ''}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Período</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Desde" />
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Hasta" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Reporte
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
                    <SelectTrigger id="student-select">
                      <SelectValue placeholder="Seleccione estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
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

              <div className="flex gap-2">
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Reporte
                </Button>
              </div>

              {selectedStudent && studentAttendanceData.length > 0 && (
                <div className="space-y-4 mt-6">
                  {/* Student Info */}
                  {(() => {
                    const studentData = students.find(s => s.id === selectedStudent);
                    const assignment = studentAulaAssignments.find(sa => sa.studentId === selectedStudent && sa.isActive);
                    const aula = assignment ? aulas.find(a => a.id === assignment.aulaId) : null;
                    const institution = aula ? institutions.find(i => i.id === aula.institutionId) : null;

                    return (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">Estudiante</p>
                            <p>{studentData?.firstName} {studentData?.lastName}</p>
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

                  {/* Attendance Table */}
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
                                <Badge variant={row.attended ? 'default' : 'destructive'}>
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

                  {/* Attendance Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl">
                          {studentAttendanceData.filter(d => d.attended).length}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Clases Asistidas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl">
                          {studentAttendanceData.filter(d => !d.attended && d.wasHeld).length}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Ausencias</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl">
                          {Math.round((studentAttendanceData.filter(d => d.attended).length / studentAttendanceData.filter(d => d.wasHeld).length) * 100)}%
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
                    <SelectTrigger id="grades-student-select">
                      <SelectValue placeholder="Seleccione estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName} - {student.documentNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Boletín
                </Button>
              </div>

              {selectedStudent && studentGradesData.length > 0 && (
                <div className="space-y-6 mt-6">
                  {/* Student Header */}
                  {(() => {
                    const studentData = students.find(s => s.id === selectedStudent);
                    const assignment = studentAulaAssignments.find(sa => sa.studentId === selectedStudent && sa.isActive);
                    const aula = assignment ? aulas.find(a => a.id === assignment.aulaId) : null;
                    const institution = aula ? institutions.find(i => i.id === aula.institutionId) : null;

                    return (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                        <h3 className="text-xl mb-4">Boletín de Calificaciones</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">Estudiante</p>
                            <p>{studentData?.firstName} {studentData?.lastName}</p>
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
                            <p>Grado {studentData?.grade} - {aula?.programType}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Grades by Period */}
                  {studentGradesData.map((periodData, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{periodData.period}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Componente</TableHead>
                              <TableHead className="text-center">Porcentaje</TableHead>
                              <TableHead className="text-center">Nota</TableHead>
                              <TableHead className="text-center">Ponderado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {periodData.components.map((component, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{component.component}</TableCell>
                                <TableCell className="text-center">{component.percentage}%</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline">{component.grade}</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  {((component.grade * component.percentage) / 100).toFixed(1)}
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
                      </CardContent>
                    </Card>
                  ))}

                  {/* Final Average */}
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardContent className="pt-6 text-center">
                      <p className="text-sm text-gray-600 mb-2">Promedio General</p>
                      <div className="text-4xl">
                        {(studentGradesData.reduce((sum, p) => sum + p.finalGrade, 0) / studentGradesData.length).toFixed(1)}
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