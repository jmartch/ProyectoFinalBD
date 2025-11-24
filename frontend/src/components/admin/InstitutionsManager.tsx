import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
import { institutions, sedes } from '../../lib/mockData';
import { Plus, Building2, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function InstitutionsManager() {
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const selectedInst = institutions.find((i) => i.id === selectedInstitution);
  const institutionSedes = sedes.filter((s) => s.institutionId === selectedInstitution);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Gestión de Instituciones</h2>
          <p className="text-gray-600 mt-1">
            Administrar Instituciones Educativas del Distrito (IED) y sus sedes
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Institución
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Institución</DialogTitle>
              <DialogDescription>
                Ingrese la información de la institución educativa
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
                  <Label htmlFor="code">Código</Label>
                  <Input id="code" placeholder="IED001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" placeholder="IED San José" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección Principal</Label>
                <Input id="address" placeholder="Calle 123 #45-67" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" placeholder="6015551234" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="contacto@ied.edu" required />
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
                <Button type="submit">Guardar Institución</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of Institutions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Instituciones Registradas
            </CardTitle>
            <CardDescription>{institutions.length} instituciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {institutions.map((inst) => (
                <button
                  key={inst.id}
                  onClick={() => setSelectedInstitution(inst.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                    selectedInstitution === inst.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{inst.name}</p>
                      <p className="text-sm text-gray-600">{inst.code}</p>
                    </div>
                    <Badge variant={inst.isActive ? 'default' : 'secondary'}>
                      {inst.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Institution Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {selectedInst ? selectedInst.name : 'Seleccione una institución'}
            </CardTitle>
            <CardDescription>
              {selectedInst
                ? 'Detalles y sedes de la institución'
                : 'Seleccione una institución de la lista para ver sus detalles'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedInst ? (
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">
                    <Building2 className="w-4 h-4 mr-2" />
                    Detalles
                  </TabsTrigger>
                  <TabsTrigger value="sedes">
                    <MapPin className="w-4 h-4 mr-2" />
                    Sedes ({institutionSedes.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Código</Label>
                      <p>{selectedInst.code}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Estado</Label>
                      <p>
                        <Badge variant={selectedInst.isActive ? 'default' : 'secondary'}>
                          {selectedInst.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Dirección Principal</Label>
                    <p>{selectedInst.mainAddress}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Teléfono</Label>
                      <p>{selectedInst.phone}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <p>{selectedInst.email}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sedes">
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Sede
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Dirección</TableHead>
                          <TableHead>Tipo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {institutionSedes.map((sede) => (
                          <TableRow key={sede.id}>
                            <TableCell>{sede.name}</TableCell>
                            <TableCell>{sede.address}</TableCell>
                            <TableCell>
                              <Badge variant={sede.isMain ? 'default' : 'secondary'}>
                                {sede.isMain ? 'Principal' : 'Secundaria'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {institutionSedes.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No hay sedes registradas para esta institución</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Seleccione una institución para ver sus detalles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
