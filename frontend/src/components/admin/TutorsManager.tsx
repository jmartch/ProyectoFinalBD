import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { persons, tutorAssignments, aulas, documentTypes } from '../../lib/mockData';
import { Plus, UserCog } from 'lucide-react';
import { UserRole } from '../../types';

export function TutorsManager() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const tutors = persons.filter(p => p.role === UserRole.TUTOR);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Gestión de Tutores</h2>
          <p className="text-gray-600 mt-1">
            Administrar tutores y personal del programa
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Tutor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Contratar Nuevo Personal</DialogTitle>
              <DialogDescription>
                Ingrese la información de la persona a contratar
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              setIsAddDialogOpen(false);
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombres</Label>
                  <Input id="firstName" placeholder="María" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input id="lastName" placeholder="González López" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="docType">Tipo de Documento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(dt => (
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="tutor@globalenglish.edu" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" placeholder="3001234567" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rol/Perfil</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TUTOR">Tutor</SelectItem>
                      <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hiredDate">Fecha de Contratación</Label>
                  <Input id="hiredDate" type="date" required />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Contratar Personal</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tutors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Contratado</CardTitle>
          <CardDescription>{tutors.length} tutores activos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Aulas Asignadas</TableHead>
                <TableHead>Fecha Contratación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutors.map((tutor) => {
                const docType = documentTypes.find(dt => dt.id === tutor.documentTypeId);
                const assignments = tutorAssignments.filter(ta => ta.tutorId === tutor.id && ta.isActive);
                
                return (
                  <TableRow key={tutor.id}>
                    <TableCell>
                      {tutor.firstName} {tutor.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{docType?.code}</div>
                        <div className="text-gray-600">{tutor.documentNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>{tutor.email}</TableCell>
                    <TableCell>{tutor.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{assignments.length} aulas</Badge>
                    </TableCell>
                    <TableCell>
                      {tutor.hiredDate?.toLocaleDateString('es-CO')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={tutor.isActive ? 'default' : 'secondary'}>
                        {tutor.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">Ver</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {tutors.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <UserCog className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No hay tutores registrados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Personnel Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl">
                {persons.filter(p => p.role === UserRole.TUTOR && p.isActive).length}
              </div>
              <p className="text-sm text-gray-600 mt-1">Tutores Activos</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl">
                {persons.filter(p => p.role === UserRole.ADMINISTRATIVO && p.isActive).length}
              </div>
              <p className="text-sm text-gray-600 mt-1">Administrativos</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl">
                {persons.filter(p => p.role === UserRole.ADMINISTRADOR && p.isActive).length}
              </div>
              <p className="text-sm text-gray-600 mt-1">Administradores</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
