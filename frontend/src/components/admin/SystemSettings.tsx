import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { holidays, absenceReasons, documentTypes, programWeeks, gradePeriods, gradeComponents } from '../../lib/mockData';
import { Plus, Calendar, FileText, Clock, Award, Settings } from 'lucide-react';

export function SystemSettings() {
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Configuración del Sistema</h2>
        <p className="text-gray-600">
          Administrar parámetros y configuraciones del programa
        </p>
      </div>

      <Tabs defaultValue="holidays">
        <TabsList>
          <TabsTrigger value="holidays">
            <Calendar className="w-4 h-4 mr-2" />
            Festivos
          </TabsTrigger>
          <TabsTrigger value="absences">
            <FileText className="w-4 h-4 mr-2" />
            Motivos de Ausencia
          </TabsTrigger>
          <TabsTrigger value="weeks">
            <Clock className="w-4 h-4 mr-2" />
            Calendario de Semanas
          </TabsTrigger>
          <TabsTrigger value="periods">
            <Award className="w-4 h-4 mr-2" />
            Períodos y Componentes
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Tipos de Documento
          </TabsTrigger>
        </TabsList>

        {/* Holidays Tab */}
        <TabsContent value="holidays">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Días Festivos</CardTitle>
                  <CardDescription>Gestionar los días festivos del calendario</CardDescription>
                </div>
                <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Festivo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Día Festivo</DialogTitle>
                      <DialogDescription>Ingrese la información del día festivo</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={(e) => {
                      e.preventDefault();
                      setIsHolidayDialogOpen(false);
                    }}>
                      <div className="space-y-2">
                        <Label htmlFor="holiday-date">Fecha</Label>
                        <Input id="holiday-date" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="holiday-name">Nombre del Festivo</Label>
                        <Input id="holiday-name" placeholder="Día de la Independencia" required />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsHolidayDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">Guardar</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holidays.map((holiday) => (
                    <TableRow key={holiday.id}>
                      <TableCell>{holiday.date.toLocaleDateString('es-CO')}</TableCell>
                      <TableCell>{holiday.name}</TableCell>
                      <TableCell>
                        <Badge variant={holiday.isActive ? 'default' : 'secondary'}>
                          {holiday.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Absence Reasons Tab */}
        <TabsContent value="absences">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Motivos de Ausencia</CardTitle>
                  <CardDescription>Gestionar los motivos de no asistencia a clase</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Motivo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>¿Requiere Reposición?</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absenceReasons.map((reason) => (
                    <TableRow key={reason.id}>
                      <TableCell>
                        <Badge variant="outline">{reason.code}</Badge>
                      </TableCell>
                      <TableCell>{reason.description}</TableCell>
                      <TableCell>
                        <Badge variant={reason.requiresMakeup ? 'default' : 'secondary'}>
                          {reason.requiresMakeup ? 'Sí' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Program Weeks Tab */}
        <TabsContent value="weeks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calendario de Semanas del Programa</CardTitle>
                  <CardDescription>
                    Calendario de semanas para el seguimiento del programa (se crea una sola vez)
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Regenerar Calendario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Semana #</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead>Año</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programWeeks.slice(0, 10).map((week) => (
                      <TableRow key={week.id}>
                        <TableCell>
                          <Badge>Semana {week.weekNumber}</Badge>
                        </TableCell>
                        <TableCell>{week.startDate.toLocaleDateString('es-CO')}</TableCell>
                        <TableCell>{week.endDate.toLocaleDateString('es-CO')}</TableCell>
                        <TableCell>{week.year}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Mostrando 10 de {programWeeks.length} semanas configuradas
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Periods and Components Tab */}
        <TabsContent value="periods">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Períodos Académicos</CardTitle>
                    <CardDescription>Gestionar períodos de calificación por tipo de programa</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Período
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Programa</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradePeriods.map((period) => (
                      <TableRow key={period.id}>
                        <TableCell>
                          <Badge variant={period.programType === 'INSIDECLASSROOM' ? 'default' : 'secondary'}>
                            {period.programType === 'INSIDECLASSROOM' ? 'Inside' : 'Outside'}
                          </Badge>
                        </TableCell>
                        <TableCell>Período {period.periodNumber}</TableCell>
                        <TableCell>{period.name}</TableCell>
                        <TableCell>{period.startDate.toLocaleDateString('es-CO')}</TableCell>
                        <TableCell>{period.endDate.toLocaleDateString('es-CO')}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost">Editar</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Componentes de Calificación</CardTitle>
                    <CardDescription>Gestionar componentes y porcentajes de evaluación</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Componente
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead>Componente</TableHead>
                      <TableHead>Porcentaje</TableHead>
                      <TableHead>Orden</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradeComponents.map((component) => {
                      const period = gradePeriods.find(p => p.id === component.periodId);
                      return (
                        <TableRow key={component.id}>
                          <TableCell>
                            <div className="text-sm">
                              <div>{period?.name}</div>
                              <Badge variant="outline" className="text-xs">
                                {period?.programType === 'INSIDECLASSROOM' ? 'Inside' : 'Outside'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{component.name}</TableCell>
                          <TableCell>
                            <Badge variant="default">{component.percentage}%</Badge>
                          </TableCell>
                          <TableCell>{component.order}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost">Editar</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Document Types Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tipos de Documento</CardTitle>
                  <CardDescription>Gestionar tipos de documentos de identidad</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Tipo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentTypes.map((docType) => (
                    <TableRow key={docType.id}>
                      <TableCell>
                        <Badge variant="outline">{docType.code}</Badge>
                      </TableCell>
                      <TableCell>{docType.name}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
