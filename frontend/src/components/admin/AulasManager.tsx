import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { aulas, institutions, sedes, schedules, tutorAssignments, persons } from '../../lib/mockData';
import { Plus, BookOpen, Clock, UserCheck } from 'lucide-react';
import { ProgramType } from '../../types';

export function AulasManager() {
  const [selectedAula, setSelectedAula] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterInstitution, setFilterInstitution] = useState<string>('all');

  const filteredAulas = filterInstitution === 'all'
    ? aulas
    : aulas.filter(a => a.institutionId === filterInstitution);

  const selectedAulaData = aulas.find(a => a.id === selectedAula);
  const aulaSchedules = schedules.filter(s => s.aulaId === selectedAula && s.isActive);
  const aulaTutor = selectedAulaData
    ? tutorAssignments.find(ta => ta.aulaId === selectedAulaData.id && ta.isActive)
    : null;
  const tutorPerson = aulaTutor ? persons.find(p => p.id === aulaTutor.tutorId) : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Gestión de Aulas</h2>
          <p className="text-gray-600 mt-1">
            Administrar aulas del programa GLOBALENGLISH
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Aula
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Aula</DialogTitle>
              <DialogDescription>
                Ingrese la información del aula ofertada por la institución
              </DialogDescription>
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
                  <Label htmlFor="code">Código del Aula</Label>
                  <Input id="code" placeholder="A-4A-IED-2025" required />
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
                  <Label htmlFor="institution">Institución</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione institución" />
                    </SelectTrigger>
                    <SelectContent className="(--radix-select-trigger-width) rounded-lg border border-slate-200 bg-white shadow-lg">
                      {institutions.map(inst => (
                        <SelectItem key={inst.id} value={inst.id}>
                          {inst.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sede">Sede</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione sede" />
                    </SelectTrigger>
                    <SelectContent className="(--radix-select-trigger-width) rounded-lg border border-slate-200 bg-white shadow-lg">
                      {sedes.map(sede => (
                        <SelectItem key={sede.id} value={sede.id}>
                          {sede.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jornada">Jornada</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione jornada" />
                    </SelectTrigger>
                    <SelectContent className="(--radix-select-trigger-width) rounded-lg border border-slate-200 bg-white shadow-lg">
                      <SelectItem value="MAÑANA">Mañana</SelectItem>
                      <SelectItem value="TARDE">Tarde</SelectItem>
                      <SelectItem value="MIXTA">Mixta</SelectItem>
                      <SelectItem value="UNICA_MANANA">Única Mañana</SelectItem>
                      <SelectItem value="UNICA_TARDE">Única Tarde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidad</Label>
                  <Input id="capacity" type="number" placeholder="30" required />
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
                <Button type="submit">Guardar Aula</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="filter-institution">Institución</Label>
              <Select value={filterInstitution} onValueChange={setFilterInstitution}>
                <SelectTrigger id="filter-institution" className="w-full">
                  <SelectValue placeholder="Todas las instituciones" />
                </SelectTrigger>
                <SelectContent className="(--radix-select-trigger-width)] rounded-lg border border-slate-200 bg-white shadow-lg">
                  <SelectItem value="all">Todas las instituciones</SelectItem>
                  {institutions.map(inst => (
                    <SelectItem key={inst.id} value={inst.id}>
                      {inst.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aulas Table */}
      <Card>
        <CardHeader>
          <CardTitle>Aulas Registradas</CardTitle>
          <CardDescription>{filteredAulas.length} aulas encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Institución</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Programa</TableHead>
                <TableHead>Jornada</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAulas.map((aula) => {
                const institution = institutions.find(i => i.id === aula.institutionId);
                const sede = sedes.find(s => s.id === aula.sedeId);
                const assignment = tutorAssignments.find(ta => ta.aulaId === aula.id && ta.isActive);
                const tutor = assignment ? persons.find(p => p.id === assignment.tutorId) : null;

                return (
                  <TableRow
                    key={aula.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedAula(aula.id)}
                  >
                    <TableCell>{aula.code}</TableCell>
                    <TableCell>{institution?.name}</TableCell>
                    <TableCell>{sede?.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Grado {aula.grade}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={aula.programType === ProgramType.INSIDECLASSROOM ? 'default' : 'secondary'}>
                        {aula.programType === ProgramType.INSIDECLASSROOM ? 'Inside' : 'Outside'}
                      </Badge>
                    </TableCell>
                    <TableCell>{aula.jornada}</TableCell>
                    <TableCell>{aula.capacity}</TableCell>
                    <TableCell>
                      {tutor ? `${tutor.firstName} ${tutor.lastName}` : 'Sin asignar'}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">Ver</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Aula Details Dialog */}
      {selectedAulaData && (
        <Dialog open={!!selectedAula} onOpenChange={() => setSelectedAula(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles del Aula - {selectedAulaData.code}</DialogTitle>
              <DialogDescription>
                Información completa del aula y sus horarios
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Código</Label>
                  <p>{selectedAulaData.code}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Grado</Label>
                  <p>Grado {selectedAulaData.grade}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Programa</Label>
                  <p>
                    <Badge>{selectedAulaData.programType}</Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Jornada</Label>
                  <p>{selectedAulaData.jornada}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Capacidad</Label>
                  <p>{selectedAulaData.capacity} estudiantes</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Estado</Label>
                  <p>
                    <Badge variant={selectedAulaData.isActive ? 'default' : 'secondary'}>
                      {selectedAulaData.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </p>
                </div>
              </div>

              {/* Tutor */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="flex items-center font-medium">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Tutor Asignado
                  </h4>
                  <Button size="sm" variant="outline">
                    Cambiar Tutor
                  </Button>
                </div>
                {tutorPerson ? (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p>{tutorPerson.firstName} {tutorPerson.lastName}</p>
                    <p className="text-sm text-gray-600">{tutorPerson.email}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Sin tutor asignado</p>
                )}
              </div>

              {/* Schedules */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="flex items-center font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    Horarios ({aulaSchedules.length})
                  </h4>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Horario
                  </Button>
                </div>
                <div className="space-y-2">
                  {aulaSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p>{schedule.dayOfWeek}</p>
                        <p className="text-sm text-gray-600">
                          {schedule.startTime} - {schedule.endTime} ({schedule.minutesDuration} min = {schedule.hoursEquivalent}h equivalente)
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">Editar</Button>
                    </div>
                  ))}
                  {aulaSchedules.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No hay horarios configurados
                    </p>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
