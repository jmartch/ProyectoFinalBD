import { useState } from 'react';
import { AuthUser, canAccessAdminFunctions } from '../../lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { 
  aulas, tutorAssignments, institutions, students, studentAulaAssignments,
  gradePeriods, gradeComponents, persons
} from '../../lib/mockData';
import { ClipboardCheck, Save } from 'lucide-react';

interface GradesManagerProps {
  authUser: AuthUser;
}

export function GradesManager({ authUser }: GradesManagerProps) {
  const [selectedTutor, setSelectedTutor] = useState<string>(authUser.person.id);
  const [selectedAula, setSelectedAula] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [grades, setGrades] = useState<{ [key: string]: { [key: string]: number } }>({});

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

  // Get available periods for selected aula
  const selectedAulaData = aulas.find(a => a.id === selectedAula);
  const availablePeriods = selectedAulaData
    ? gradePeriods.filter(p => p.programType === selectedAulaData.programType)
    : [];

  // Get components for selected period
  const periodComponents = selectedPeriod
    ? gradeComponents.filter(c => c.periodId === selectedPeriod)
    : [];

  // Get students in selected aula
  const aulaStudents = selectedAula
    ? studentAulaAssignments
        .filter(sa => sa.aulaId === selectedAula && sa.isActive)
        .map(sa => students.find(s => s.id === sa.studentId))
        .filter(Boolean)
    : [];

  const handleGradeChange = (studentId: string, componentId: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;

    setGrades({
      ...grades,
      [studentId]: {
        ...grades[studentId],
        [componentId]: numValue,
      },
    });
  };

  const calculateFinalGrade = (studentId: string): number => {
    if (!periodComponents.length) return 0;
    
    let total = 0;
    periodComponents.forEach(component => {
      const grade = grades[studentId]?.[component.id] || 0;
      total += (grade * component.percentage) / 100;
    });
    return Math.round(total * 10) / 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Calificaciones guardadas exitosamente');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Gestión de Calificaciones</h2>
        <p className="text-gray-600">
          Ingresar y administrar calificaciones de estudiantes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selección de Aula y Período</CardTitle>
          <CardDescription>Seleccione el aula y período académico</CardDescription>
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
              <Label htmlFor="period">Período</Label>
              <Select 
                value={selectedPeriod} 
                onValueChange={setSelectedPeriod}
                disabled={!selectedAula}
              >
                <SelectTrigger id="period">
                  <SelectValue placeholder="Seleccione período" />
                </SelectTrigger>
                <SelectContent>
                  {availablePeriods.map(period => (
                    <SelectItem key={period.id} value={period.id}>
                      {period.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedAulaData && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-4">
                <p className="text-sm">
                  <strong>Aula:</strong> {selectedAulaData.code}
                </p>
                <Badge>{selectedAulaData.programType}</Badge>
                <Badge variant="outline">Grado {selectedAulaData.grade}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAula && selectedPeriod && (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calificaciones por Componente</CardTitle>
                  <CardDescription>
                    {aulaStudents.length} estudiantes - {periodComponents.length} componentes de evaluación
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {periodComponents.length > 0 && aulaStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-white z-10">Estudiante</TableHead>
                        {periodComponents.map(component => (
                          <TableHead key={component.id} className="text-center min-w-[120px]">
                            <div>{component.name}</div>
                            <div className="text-xs text-gray-500">{component.percentage}%</div>
                          </TableHead>
                        ))}
                        <TableHead className="text-center bg-blue-50">
                          <div>Nota Final</div>
                          <div className="text-xs text-gray-500">100%</div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aulaStudents.map((student) => (
                        <TableRow key={student!.id}>
                          <TableCell className="sticky left-0 bg-white z-10">
                            <div>
                              <div>{student!.firstName} {student!.lastName}</div>
                              <div className="text-xs text-gray-500">{student!.documentNumber}</div>
                            </div>
                          </TableCell>
                          {periodComponents.map(component => (
                            <TableCell key={component.id} className="text-center">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-20 text-center"
                                value={grades[student!.id]?.[component.id] || ''}
                                onChange={(e) => handleGradeChange(student!.id, component.id, e.target.value)}
                                placeholder="0-100"
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-center bg-blue-50">
                            <Badge variant="default" className="text-base px-3 py-1">
                              {calculateFinalGrade(student!.id).toFixed(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ClipboardCheck className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>
                    {aulaStudents.length === 0 
                      ? 'No hay estudiantes asignados a esta aula'
                      : 'No hay componentes de evaluación configurados para este período'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {periodComponents.length > 0 && aulaStudents.length > 0 && (
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Guardar Calificaciones
              </Button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
