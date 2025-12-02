import { useState, useEffect } from 'react';
import { AuthUser, canAccessAdminFunctions } from '../../lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Calendar, Check, X, AlertCircle, Loader } from 'lucide-react';
import {
  fetchAulasPorTutor,
  fetchEstudiantesPorAula,
  fetchHorarioPorAulaYDia,
  fetchMotivos,
  fetchTutores,
  guardarAsistenciasMasivo,
  obtenerNumeroSemana,
  obtenerDiaSemana,
  esFestivo,
  type Aula,
  type Estudiante,
  type Motivo,
  type Horario,
  type Tutor,
} from '../../lib/attendanceService';

interface AttendanceManagerProps {
  authUser: AuthUser;
}

export function AttendanceManager({ authUser }: AttendanceManagerProps) {
  // Estado del formulario
  const [selectedTutor, setSelectedTutor] = useState<string>(authUser.person.id);
  const [selectedAula, setSelectedAula] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [studentAttendance, setStudentAttendance] = useState<{ [key: string]: boolean }>({});
  const [classHeld, setClassHeld] = useState<boolean>(true);
  const [absenceReasonId, setAbsenceReasonId] = useState<string>('');
  const [hoursPlanned, setHoursPlanned] = useState<number>(1);
  const [hoursTaught, setHoursTaught] = useState<number>(1);
  const [makeupDate, setMakeupDate] = useState<string>('');

  // Estado para datos del backend
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [tutorAulas, setTutorAulas] = useState<Aula[]>([]);
  const [aulaStudents, setAulaStudents] = useState<Estudiante[]>([]);
  const [aulaSchedule, setAulaSchedule] = useState<Horario | null>(null);
  const [motivos, setMotivos] = useState<Motivo[]>([]);

  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const isAdmin = canAccessAdminFunctions(authUser.user.role);

  // Cargar tutores si es admin
  useEffect(() => {
    const cargarTutores = async () => {
      if (!isAdmin) return;
      try {
        const tutoresData = await fetchTutores();
        setTutores(tutoresData);
      } catch (err) {
        console.error('Error al cargar tutores:', err);
      }
    };

    cargarTutores();
  }, [isAdmin]);

  // Cargar aulas del tutor
  useEffect(() => {
    const cargarAulas = async () => {
      setIsLoading(true);
      setError('');
      try {
        const aulasData = await fetchAulasPorTutor(selectedTutor);
        setTutorAulas(aulasData);
        setSelectedAula('');
        setAulaStudents([]);
        setAulaSchedule(null);
      } catch (err) {
        setError('Error al cargar aulas del tutor');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedTutor) {
      cargarAulas();
    }
  }, [selectedTutor]);

  // Cargar estudiantes y horario cuando cambia aula o fecha
  useEffect(() => {
    const cargarEstudiantesYHorario = async () => {
      if (!selectedAula) return;

      setIsLoading(true);
      setError('');
      try {
        // Cargar estudiantes
        const estudiantesData = await fetchEstudiantesPorAula(selectedAula);
        setAulaStudents(estudiantesData);

        // Resetear asistencias
        setStudentAttendance({});

        // Cargar horario
        const dateObj = new Date(selectedDate);
        const diaSemana = obtenerDiaSemana(dateObj);
        const horarioData = await fetchHorarioPorAulaYDia(selectedAula, diaSemana);
        setAulaSchedule(horarioData);
      } catch (err) {
        setError('Error al cargar datos del aula');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    cargarEstudiantesYHorario();
  }, [selectedAula, selectedDate]);

  // Cargar motivos
  useEffect(() => {
    const cargarMotivos = async () => {
      try {
        const motivosData = await fetchMotivos();
        setMotivos(motivosData);
      } catch (err) {
        console.error('Error al cargar motivos:', err);
      }
    };

    cargarMotivos();
  }, []);

  // Si no hay motivos en la BD, crear uno por defecto antes de guardar
  const ensureDefaultMotivo = async (): Promise<string | null> => {
    try {
      if (motivos.length > 0) return motivos[0].codigo_motivo;
      // crear motivo por defecto
      // importamos la función de creación directamente aquí para no romper el orden
      const { crearMotivo } = await import('../../lib/attendanceService');
      const nuevo = await crearMotivo('Clase dictada (por defecto)');
      // actualizar estado de motivos
      setMotivos([nuevo, ...motivos]);
      return nuevo.codigo_motivo;
    } catch (err) {
      console.error('No se pudo crear motivo por defecto:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const dateObj = new Date(selectedDate);
      // Intentar obtener la semana desde la BD (si existe)
      const numeroSemanaFromDB = await (await import('../../lib/attendanceService')).findSemanaNumeroByFecha(selectedDate);
      const numeroSemana = numeroSemanaFromDB ?? obtenerNumeroSemana(dateObj);
      const isFestivo = await esFestivo(selectedDate);

      // Preparar datos para guardar
      const registroClase = {
        numero_semana: numeroSemana,
        id_aula: parseInt(selectedAula),
        codigo_motivo: !classHeld ? absenceReasonId : null,
        fecha: selectedDate,
        dictada: classHeld,
        is_festivo: isFestivo,
        fecha_reposicion: !classHeld && makeupDate ? makeupDate : null,
      };

      const asistencias = aulaStudents.map(student => ({
        doc_estudiante: student.doc_estudiante,
        asistio: studentAttendance[student.id_estudiante] || false,
      }));

      // Guardar en backend
      // Asegurar que hay un motivo válido en la BD
      const motivoValido = motivos.length > 0 ? motivos[0].codigo_motivo : await ensureDefaultMotivo();
      if (!motivoValido) throw new Error('No hay motivo válido para asignar al registro de clase');

      // Si no existe la semana en la BD, intentar crearla automáticamente
      let numeroSemanaFinal = numeroSemana;
      if (!numeroSemanaFromDB) {
        try {
          const { crearSemanaParaFecha } = await import('../../lib/attendanceService');
          const creado = await crearSemanaParaFecha(selectedDate);
          if (!creado) throw new Error('No se pudo crear la semana automáticamente');
          numeroSemanaFinal = creado;
        } catch (err) {
          throw new Error(`No existe una 'semana' registrada para la fecha ${selectedDate} y no se pudo crear automáticamente: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      await guardarAsistenciasMasivo(
        { ...registroClase, numero_semana: numeroSemanaFinal },
        asistencias,
        motivoValido
      );

      setSuccessMessage('¡Asistencia guardada exitosamente!');
      setStudentAttendance({});
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar asistencia');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Registro de Asistencia</h2>
        <p className="text-gray-600">
          Tomar asistencia de clases y estudiantes
        </p>
      </div>

      {/* Mensajes de error y éxito */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Selección de Clase</CardTitle>
          <CardDescription>Seleccione el aula y la fecha para registrar asistencia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="tutor">Tutor</Label>
                <Select value={selectedTutor} onValueChange={setSelectedTutor} disabled={isLoading}>
                  <SelectTrigger id="tutor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tutores.map(tutor => (
                      <SelectItem key={tutor.id_tutor} value={tutor.id_tutor.toString()}>
                        {tutor.primer_nombre} {tutor.primer_apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="aula">Aula</Label>
              <Select value={selectedAula} onValueChange={setSelectedAula} disabled={isLoading}>
                <SelectTrigger id="aula">
                  <SelectValue placeholder={isLoading ? "Cargando..." : "Seleccione aula"} />
                </SelectTrigger>
                <SelectContent>
                  {tutorAulas.map((aula) => (
                    <SelectItem key={aula.id_aula} value={aula.id_aula.toString()}>
                      {aula.codigo || `Aula ${aula.id_aula}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {aulaSchedule && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <strong>Horario:</strong> {aulaSchedule.dia_semana} - {aulaSchedule.hora_inicio} a {aulaSchedule.hora_fin} ({aulaSchedule.horas_equivalentes}h equivalente)
              </p>
            </div>
          )}

          {selectedAula && !aulaSchedule && !isLoading && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                No hay clase programada para ese día en esta aula
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAula && aulaSchedule && (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Información de la Clase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Checkbox
                  id="classHeld"
                  checked={classHeld}
                  onCheckedChange={(checked) => setClassHeld(checked as boolean)}
                />
                <Label htmlFor="classHeld" className="cursor-pointer">
                  La clase se dictó
                </Label>
              </div>

              {!classHeld && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="absenceReason">Motivo de Ausencia</Label>
                    <Select value={absenceReasonId} onValueChange={setAbsenceReasonId}>
                      <SelectTrigger id="absenceReason">
                        <SelectValue placeholder="Seleccione motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {motivos.map(motivo => (
                          <SelectItem key={motivo.codigo_motivo} value={motivo.codigo_motivo}>
                            {motivo.descripcion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="makeupDate">Fecha de Reposición</Label>
                    <Input 
                      id="makeupDate" 
                      type="date"
                      value={makeupDate}
                      onChange={(e) => setMakeupDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {classHeld && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hoursPlanned">Horas Planeadas</Label>
                    <Input
                      id="hoursPlanned"
                      type="number"
                      step="0.5"
                      min="0"
                      value={hoursPlanned}
                      onChange={(e) => setHoursPlanned(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hoursTaught">Horas Dictadas</Label>
                    <Input
                      id="hoursTaught"
                      type="number"
                      step="0.5"
                      min="0"
                      value={hoursTaught}
                      onChange={(e) => setHoursTaught(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {classHeld && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Asistencia de Estudiantes</CardTitle>
                <CardDescription>{aulaStudents.length} estudiantes en el aula</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-blue-600" />
                    <p className="ml-2 text-gray-600">Cargando estudiantes...</p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Estudiante</TableHead>
                          <TableHead>Documento</TableHead>
                          <TableHead className="text-center">Asistió</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aulaStudents.map((student) => (
                          <TableRow key={student.id_estudiante}>
                            <TableCell>
                              {student.primer_nombre} {student.segundo_nombre || ''} {student.primer_apellido} {student.segundo_apellido || ''}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {student.doc_estudiante}
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox
                                checked={studentAttendance[student.id_estudiante] || false}
                                onCheckedChange={(checked) => {
                                  setStudentAttendance({
                                    ...studentAttendance,
                                    [student.id_estudiante]: checked as boolean,
                                  });
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {aulaStudents.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No hay estudiantes asignados a esta aula</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving || !selectedAula}>
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Guardar Asistencia
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
