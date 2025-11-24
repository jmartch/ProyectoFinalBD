import { useState } from 'react';
import { AuthUser, canAccessAdminFunctions } from '../../lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { aulas, tutorAssignments, institutions, students, studentAulaAssignments, schedules, absenceReasons, persons } from '../../lib/mockData';
import { Calendar, Check, X, AlertCircle } from 'lucide-react';
import { DayOfWeek } from '../../types';

interface AttendanceManagerProps {
  authUser: AuthUser;
}

export function AttendanceManager({ authUser }: AttendanceManagerProps) {
  const [selectedTutor, setSelectedTutor] = useState<string>(authUser.person.id);
  const [selectedAula, setSelectedAula] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [studentAttendance, setStudentAttendance] = useState<{ [key: string]: boolean }>({});
  const [classHeld, setClassHeld] = useState<boolean>(true);
  const [absenceReasonId, setAbsenceReasonId] = useState<string>('');
  const [hoursPlanned, setHoursPlanned] = useState<number>(1);
  const [hoursTaught, setHoursTaught] = useState<number>(1);

  const isAdmin = canAccessAdminFunctions(authUser.user.role);
  const tutors = persons.filter(p => p.role === 'TUTOR');

  // Get aulas for selected tutor
  const tutorAulas = tutorAssignments
    .filter(ta => ta.tutorId === selectedTutor && ta.isActive)
    .map(ta => {
      const aula = aulas.find(a => a.id === ta.aulaId);
      const institution = aula ? institutions.find(i => i.id === aula.institutionId) : null;
      return { aula, institution };
    })
    .filter(item => item.aula);

  // Get students in selected aula
  const aulaStudents = selectedAula
    ? studentAulaAssignments
        .filter(sa => sa.aulaId === selectedAula && sa.isActive)
        .map(sa => students.find(s => s.id === sa.studentId))
        .filter(Boolean)
    : [];

  // Get schedule for selected date
  const selectedAulaData = aulas.find(a => a.id === selectedAula);
  const dateObj = new Date(selectedDate);
  const dayOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dateObj.getDay()];
  const aulaSchedule = selectedAulaData
    ? schedules.find(s => s.aulaId === selectedAula && s.dayOfWeek === dayOfWeek && s.isActive)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Asistencia guardada exitosamente');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Registro de Asistencia</h2>
        <p className="text-gray-600">
          Tomar asistencia de clases y estudiantes
        </p>
      </div>

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
                <Select value={selectedTutor} onValueChange={setSelectedTutor}>
                  <SelectTrigger id="tutor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tutors.map(tutor => (
                      <SelectItem key={tutor.id} value={tutor.id}>
                        {tutor.firstName} {tutor.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="aula">Aula</Label>
              <Select value={selectedAula} onValueChange={setSelectedAula}>
                <SelectTrigger id="aula">
                  <SelectValue placeholder="Seleccione aula" />
                </SelectTrigger>
                <SelectContent>
                  {tutorAulas.map(({ aula, institution }) => (
                    <SelectItem key={aula!.id} value={aula!.id}>
                      {aula!.code} - {institution?.name}
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
                <strong>Horario:</strong> {aulaSchedule.dayOfWeek} - {aulaSchedule.startTime} a {aulaSchedule.endTime} ({aulaSchedule.hoursEquivalent}h equivalente)
              </p>
            </div>
          )}

          {selectedAula && !aulaSchedule && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                No hay clase programada para el {dayOfWeek} en esta aula
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
                        {absenceReasons.map(reason => (
                          <SelectItem key={reason.id} value={reason.id}>
                            {reason.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="makeupDate">Fecha de Reposición</Label>
                    <Input id="makeupDate" type="date" />
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
                      value={hoursPlanned}
                      onChange={(e) => setHoursPlanned(parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hoursTaught">Horas Dictadas</Label>
                    <Input
                      id="hoursTaught"
                      type="number"
                      step="0.5"
                      value={hoursTaught}
                      onChange={(e) => setHoursTaught(parseFloat(e.target.value))}
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
                      <TableRow key={student!.id}>
                        <TableCell>
                          {student!.firstName} {student!.lastName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {student!.documentNumber}
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={studentAttendance[student!.id] || false}
                            onCheckedChange={(checked) => {
                              setStudentAttendance({
                                ...studentAttendance,
                                [student!.id]: checked as boolean,
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
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">
              <Check className="w-4 h-4 mr-2" />
              Guardar Asistencia
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}