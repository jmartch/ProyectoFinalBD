import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import {
  students,
  institutions,
  studentAulaAssignments,
  aulas,
  documentTypes,
} from '../../lib/mockData';
import { Plus, GraduationCap, MoveRight } from 'lucide-react';
import { Grade } from '../../types';

export function StudentsManager() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [filterInstitution, setFilterInstitution] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');

  let filteredStudents = students;
  if (filterInstitution !== 'all') {
    filteredStudents = filteredStudents.filter((s) => s.institutionId === filterInstitution);
  }
  if (filterGrade !== 'all') {
    filteredStudents = filteredStudents.filter((s) => s.grade === filterGrade);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Gestión de Estudiantes</h2>
          <p className="text-gray-600 mt-1">
            Administrar estudiantes del programa GLOBALENGLISH
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Estudiante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Estudiante</DialogTitle>
              <DialogDescription>Ingrese la información del estudiante</DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setIsAddDialogOpen(false);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombres</Label>
                  <Input id="firstName" placeholder="Juan" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input id="lastName" placeholder="Pérez García" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="docType">Tipo de Documento</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent className="(--radix-select-trigger-width) rounded-lg border border-slate-200 bg-white shadow-lg">
                      {documentTypes.map((dt) => (
                        <SelectItem key={dt.id} value={dt.id}>
                          {dt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="docNumber">Número de Documento</Label>
                  <Input id="docNumber" placeholder="1234567890" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institución</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione institución" />
                    </SelectTrigger>
                    <SelectContent className="(--radix-select-trigger-width) rounded-lg border border-slate-200 bg-white shadow-lg">
                      {institutions.map((inst) => (
                        <SelectItem key={inst.id} value={inst.id}>
                          {inst.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grado</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione grado" />
                    </SelectTrigger>
                    <SelectContent className="(--radix-select-trigger-width) rounded-lg border border-slate-200 bg-white shadow-lg">
                      <SelectItem value="4">4º Grado</SelectItem>
                      <SelectItem value="5">5º Grado</SelectItem>
                      <SelectItem value="9">9º Grado</SelectItem>
                      <SelectItem value="10">10º Grado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aula">Aula</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione aula" />
                    </SelectTrigger>
                    <SelectContent className="(--radix-select-trigger-width) rounded-lg border border-slate-200 bg-white shadow-lg">
                      {aulas.map((aula) => (
                        <SelectItem key={aula.id} value={aula.id}>
                          {aula.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entryScore">Score de Entrada</Label>
                  <Input id="entryScore" type="number" min="0" max="100" placeholder="0-100" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar Estudiante</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-institution">Institución</Label>
              <Select value={filterInstitution} onValueChange={setFilterInstitution}>
                <SelectTrigger id="filter-institution" className="w-full">
                  <SelectValue placeholder="Todas las instituciones" />
                </SelectTrigger>
                <SelectContent className="(--radix-select-trigger-width) rounded-lg border border-slate-200 bg-white shadow-lg">
                  <SelectItem value="all">Todas las instituciones</SelectItem>
                  {institutions.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>
                      {inst.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-grade">Grado</Label>
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger id="filter-grade" className="w-full">
                  <SelectValue placeholder="Todos los grados" />
                </SelectTrigger>
                <SelectContent className="(--radix-select-trigger-width) rounded-lg border border-slate-200 bg-white shadow-lg">
                  <SelectItem value="all">Todos los grados</SelectItem>
                  <SelectItem value="4">4º Grado</SelectItem>
                  <SelectItem value="5">5º Grado</SelectItem>
                  <SelectItem value="9">9º Grado</SelectItem>
                  <SelectItem value="10">10º Grado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Estudiantes Registrados</CardTitle>
          <CardDescription>
            {filteredStudents.length} estudiantes encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombres</TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Institución</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Aula Actual</TableHead>
                <TableHead>Score Entrada</TableHead>
                <TableHead>Score Salida</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const institution = institutions.find((i) => i.id === student.institutionId);
                const docType = documentTypes.find((dt) => dt.id === student.documentTypeId);
                const assignment = studentAulaAssignments.find(
                  (sa) => sa.studentId === student.id && sa.isActive,
                );
                const aula = assignment ? aulas.find((a) => a.id === assignment.aulaId) : null;

                return (
                  <TableRow key={student.id}>
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{docType?.code}</div>
                        <div className="text-gray-600">{student.documentNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>{institution?.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Grado {student.grade}</Badge>
                    </TableCell>
                    <TableCell>{aula?.code || 'Sin asignar'}</TableCell>
                    <TableCell>{student.entryScore || '-'}</TableCell>
                    <TableCell>{student.exitScore || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedStudent(student.id);
                            setIsMoveDialogOpen(true);
                          }}
                        >
                          <MoveRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No se encontraron estudiantes con los filtros seleccionados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Move Student Dialog */}
      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mover Estudiante de Aula</DialogTitle>
            <DialogDescription>
              Seleccione el aula destino. El estudiante solo puede moverse entre aulas del mismo
              nivel.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsMoveDialogOpen(false);
              setSelectedStudent(null);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="targetAula">Aula Destino</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione aula" />
                </SelectTrigger>
                <SelectContent className="(--radix-select-trigger-width) rounded-lg border border-slate-200 bg-white shadow-lg">
                  {aulas.map((aula) => (
                    <SelectItem key={aula.id} value={aula.id}>
                      {aula.code} - Grado {aula.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo del Cambio</Label>
              <Input
                id="reason"
                placeholder="Ej: Cambio de horario, Nivel inadecuado, etc."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsMoveDialogOpen(false);
                  setSelectedStudent(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Mover Estudiante</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
