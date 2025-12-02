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
import { fetchAulas, fetchRegistroClasesAll, fetchAsistenciasAll, fetchEstudiantesDetalle, fetchTutores, fetchAulaTutores, fetchHorarios, fetchAsignacionesAulaHorario } from '../../lib/reportService';
import { getReporteAsistenciaEstudiante, getBoletinCalificaciones, type ReporteAsistenciaEstudiante, type BoletinCalificaciones } from '../../lib/api';
import { FileText, Calendar, Users, BarChart, Loader } from 'lucide-react';

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
  hoursPlanned: number | string;
  hoursTaught: number | string;
  absenceReason: string | null;
  makeupDate: string | null;
}

export function ReportsManager({ authUser }: ReportsManagerProps) {
  const [reportType, setReportType] = useState<'classroom' | 'student' | 'grades'>('classroom');
  const [selectedAula, setSelectedAula] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [aulasList, setAulasList] = useState<any[]>([]);
  const [estudiantesDetalle, setEstudiantesDetalle] = useState<any[]>([]);
  const [registros, setRegistros] = useState<any[]>([]);
  const [tutoresList, setTutoresList] = useState<any[]>([]);
  const [aulaTutores, setAulaTutores] = useState<any[]>([]);
  const [horariosList, setHorariosList] = useState<any[]>([]);
  const [asignacionesHorario, setAsignacionesHorario] = useState<any[]>([]);
  
  // Reports data
  const [studentAttendanceReport, setStudentAttendanceReport] = useState<ReporteAsistenciaEstudiante[]>([]);
  const [boletin, setBoletin] = useState<BoletinCalificaciones | null>(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [loadingBoletin, setLoadingBoletin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate classroom attendance rows from backend registros
  const generateAttendanceFromBackend = () => {
    if (!selectedAula) return [];
    const filtered = registros.filter(r => String(r.id_aula) === String(selectedAula));
    const rows: AttendanceRow[] = filtered.map((r: any) => {
      const fecha = new Date(r.fecha).toLocaleDateString('es-CO');
      const dayOfWeek = new Date(r.fecha).toLocaleDateString('es-CO', { weekday: 'long' });
      
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
          const tutor = tutoresList.find(t => String(t.id_tutor) === String(assignment.id_tutor));
          if (tutor) {
            tutorName = `${tutor.nombre1 || ''} ${tutor.apellido1 || ''}`.trim();
          }
        }
      } catch (e) {
        tutorName = '-';
      }

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
            schedule = `${horario.dia_semana || horario.diaSemana || ''} ${horario.hora_inicio || horario.hora_inicio || ''}`.trim();
          }
        }
      } catch (e) {
        schedule = '-';
      }

      const wasHeld = r.dictada === 1 || r.dictada === true;
      const motivo = r.codigo_motivo || '-';
      const reposicion = r.fecha_reposicion || null;
      
      return {
        week: r.numero_semana,
        date: fecha,
        dayOfWeek,
        tutor: tutorName,
        schedule,
        wasHeld,
        hoursPlanned: '-',
        hoursTaught: '-',
        absenceReason: motivo,
        makeupDate: reposicion,
      };
    });
    return rows;
  };

  // Load initial lists
  const loadLists = async () => {
    try {
      const [aulasRes, estudiantesRes, registrosRes] = await Promise.all([
        fetchAulas(),
        fetchEstudiantesDetalle(),
        fetchRegistroClasesAll()
      ]);
      setAulasList(aulasRes);
      setEstudiantesDetalle(estudiantesRes);
      setRegistros(registrosRes);
    } catch (err) {
      console.error('Error loading report lists', err);
      setError('Error cargando datos de reportes');
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
  useEffect(() => { 
    loadLists(); 
    loadExtendedLists(); 
  }, []);

  // Fetch student attendance report when selectedStudent or date range changes
  useEffect(() => {
    const loadAttendance = async () => {
      if (!selectedStudent) {
        setStudentAttendanceReport([]);
        return;
      }

      setLoadingAttendance(true);
      setError(null);
      try {
        const report = await getReporteAsistenciaEstudiante(
          parseInt(selectedStudent), 
          startDate || undefined, 
          endDate || undefined
        );
        setStudentAttendanceReport(report);
      } catch (err) {
        console.error('Error loading student attendance report:', err);
        setError('No se pudo obtener el reporte de asistencia del estudiante');
      } finally {
        setLoadingAttendance(false);
      }
    };

    loadAttendance();
  }, [selectedStudent, startDate, endDate]);

  // Fetch boletin cuando cambia el estudiante
  useEffect(() => {
    const loadBoletin = async () => {
      if (!selectedStudent) {
        setBoletin(null);
        return;
      }

      setLoadingBoletin(true);
      try {
        const b = await getBoletinCalificaciones(parseInt(selectedStudent));
        setBoletin(b);
      } catch (err) {
        console.error('Error loading boletin:', err);
        setError('No se pudo obtener el boletín de calificaciones');
      } finally {
        setLoadingBoletin(false);
      }
    };

    loadBoletin();
  }, [selectedStudent]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Reportes e Indicadores</h2>
        <p className="text-gray-600">
          Generar reportes de gestión y seguimiento del programa
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

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
                      {aulasList.map((aula: any) => (
                        <SelectItem key={aula.id_aula ?? aula.id} value={String(aula.id_aula ?? aula.id)}>
                          {(aula.codigo || aula.code || `Aula ${aula.id_aula || aula.id}`)}
                        </SelectItem>
                      ))}
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

              {selectedAula && generateAttendanceFromBackend().length > 0 && (
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
                        {generateAttendanceFromBackend().map((row, index) => (
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
                            <TableCell>{row.hoursPlanned}</TableCell>
                            <TableCell>{row.hoursTaught}</TableCell>
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
                      {estudiantesDetalle.map(student => (
                        <SelectItem key={student.doc_estudiante} value={String(student.doc_estudiante)}>
                          {student.primer_nombre} {student.primer_apellido} - {student.doc_estudiante}
                        </SelectItem>
                      ))}
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

              {selectedStudent && loadingAttendance && (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                  <p className="text-gray-600">Cargando asistencia...</p>
                </div>
              )}

              {selectedStudent && !loadingAttendance && studentAttendanceReport.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No hay registros de asistencia para este estudiante</p>
                </div>
              )}

              {selectedStudent && !loadingAttendance && studentAttendanceReport.length > 0 && (
                <div className="space-y-4 mt-6">
                  {/* Student Info */}
                  {(() => {
                    const studentData = estudiantesDetalle.find((s: any) => String(s.doc_estudiante) === String(selectedStudent));
                    const aula = aulasList.find((a: any) => String(a.id_aula ?? a.id) === String(studentData?.id_aula));

                    return (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">Estudiante</p>
                            <p>{studentData?.primer_nombre} {studentData?.primer_apellido}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Institución</p>
                            <p>{studentData?.nombre_ied || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Grado</p>
                            <p>Grado {studentData?.grado || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Aula</p>
                            <p>{aula?.codigo || `Aula ${aula?.id_aula ?? aula?.id}`}</p>
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
                            <TableHead>Clase Dictada</TableHead>
                            <TableHead>Asistió</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentAttendanceReport.map((row: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{row.numero_semana}</TableCell>
                              <TableCell>{new Date(row.fecha).toLocaleDateString('es-CO')}</TableCell>
                              <TableCell>{new Date(row.fecha).toLocaleDateString('es-CO', { weekday: 'long' })}</TableCell>
                              <TableCell>
                                <Badge variant={row.dictada ? 'default' : 'secondary'}>
                                  {row.dictada ? 'Sí' : 'No'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={row.asistio ? 'default' : 'destructive'}>
                                  {row.asistio ? 'Sí' : 'No'}
                                </Badge>
                              </TableCell>
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
                          {studentAttendanceReport.filter((d: any) => d.asistio).length}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Clases Asistidas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl">
                          {studentAttendanceReport.filter((d: any) => !d.asistio && d.dictada).length}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Ausencias</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl">
                          {studentAttendanceReport.length > 0 ? Math.round((studentAttendanceReport.filter((d: any) => d.asistio).length / studentAttendanceReport.filter((d: any) => d.dictada).length) * 100) : 0}%
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
                      {estudiantesDetalle.map(student => (
                        <SelectItem key={student.doc_estudiante} value={String(student.doc_estudiante)}>
                          {student.primer_nombre} {student.primer_apellido} - {student.doc_estudiante}
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

              {selectedStudent && loadingBoletin && (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                  <p className="text-gray-600">Cargando boletín...</p>
                </div>
              )}

              {selectedStudent && !loadingBoletin && !boletin && (
                <div className="text-center py-12 text-gray-500">
                  <BarChart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No hay datos de calificaciones para este estudiante</p>
                </div>
              )}

              {selectedStudent && !loadingBoletin && boletin && (
                <div className="space-y-6 mt-6">
                  {/* Student Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                    <h3 className="text-xl mb-4">Boletín de Calificaciones</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Estudiante</p>
                        <p>{boletin.estudiante.nombre1} {boletin.estudiante.apellido1}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Documento</p>
                        <p>{boletin.estudiante.doc_estudiante}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Institución</p>
                        <p>{boletin.estudiante.nombre_ied || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Grado</p>
                        <p>Grado {boletin.estudiante.grado || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Grades by Period */}
                  {boletin.periodos.map((periodData, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {new Date(periodData.periodo.fecha_inicio).toLocaleDateString('es-CO')} - {new Date(periodData.periodo.fecha_fin).toLocaleDateString('es-CO')}
                        </CardTitle>
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
                            {periodData.componentes.map((component: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell>{component.componente.nombre}</TableCell>
                                <TableCell className="text-center">{component.componente.porcentaje}%</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline">{component.nota.toFixed(2)}</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  {((component.nota * component.componente.porcentaje) / 100).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="bg-blue-50">
                              <TableCell colSpan={3}>
                                <strong>Nota Final del Período</strong>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="default" className="text-base px-3 py-1">
                                  {periodData.definitiva.toFixed(2)}
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
                      <div className="text-4xl font-bold">
                        {boletin.promedioGeneral.toFixed(2)}
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
