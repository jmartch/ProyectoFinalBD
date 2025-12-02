import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import {
  fetchFestivos,
  createFestivo,
  deleteFestivo,
  fetchMotivos,
  createMotivo,
  deleteMotivo,
  fetchSemanas,
  regenerateSemanasCalendar,
  fetchPeriodos,
  createPeriodo,
  updatePeriodo,
  fetchComponentes,
  createComponente,
  updateComponente,
  deleteComponente,
  type Festivo,
  type Motivo,
  type Semana,
  type Periodo as ApiPeriodo,
  type Componente as ApiComponente,
  type ProgramType,
} from "../../lib/api";

import {
  Plus,
  Calendar,
  FileText,
  Clock,
  Award,
  Settings,
} from "lucide-react";

interface GradePeriod {
  id: number;
  programId: number;
  programType: ProgramType;
  periodNumber: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

interface GradeComponent {
  id: number;
  periodId: number;
  name: string;
  percentage: number;
  order: number;
}

export function SystemSettings() {
  // FESTIVOS
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);
  const [holidays, setHolidays] = useState<Festivo[]>([]);
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [holidayError, setHolidayError] = useState<string | null>(null);
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayName, setNewHolidayName] = useState("");

  // MOTIVOS
  const [motivos, setMotivos] = useState<Motivo[]>([]);
  const [loadingMotivos, setLoadingMotivos] = useState(false);
  const [motivosError, setMotivosError] = useState<string | null>(null);
  const [isMotivoDialogOpen, setIsMotivoDialogOpen] = useState(false);
  const [motivoDescripcion, setMotivoDescripcion] = useState("");

  // SEMANAS
  const [semanas, setSemanas] = useState<Semana[]>([]);
  const [loadingSemanas, setLoadingSemanas] = useState(false);
  const [semanasError, setSemanasError] = useState<string | null>(null);
  const [isRegenerarDialogOpen, setIsRegenerarDialogOpen] = useState(false);
  const [regenerarPeriodoId, setRegenerarPeriodoId] = useState<string>("");
  const [regenerarFechaInicio, setRegenerarFechaInicio] = useState<string>("");
  const [regenerarNumSemanas, setRegenerarNumSemanas] = useState<string>("40");

  // PERÍODOS
  const [periods, setPeriods] = useState<GradePeriod[]>([]);
  const [loadingPeriods, setLoadingPeriods] = useState(false);
  const [periodsError, setPeriodsError] = useState<string | null>(null);

  const [isPeriodoDialogOpen, setIsPeriodoDialogOpen] = useState(false);
  const [isEditingPeriodo, setIsEditingPeriodo] = useState(false);
  const [editingPeriodoId, setEditingPeriodoId] = useState<number | null>(null);
  const [newPeriodoProgramaId, setNewPeriodoProgramaId] = useState("");
  const [newPeriodoFechaInicio, setNewPeriodoFechaInicio] = useState("");
  const [newPeriodoFechaFin, setNewPeriodoFechaFin] = useState("");
  const [createPeriodoError, setCreatePeriodoError] = useState<string | null>(
    null
  );

  // COMPONENTES
  const [components, setComponents] = useState<GradeComponent[]>([]);
  const [loadingComponents, setLoadingComponents] = useState(false);
  const [componentsError, setComponentsError] = useState<string | null>(null);

  const [isComponenteDialogOpen, setIsComponenteDialogOpen] = useState(false);
  const [isEditingComponente, setIsEditingComponente] = useState(false);
  const [editingComponenteId, setEditingComponenteId] = useState<number | null>(
    null
  );
  const [componentePeriodoId, setComponentePeriodoId] = useState("");
  const [componenteNombre, setComponenteNombre] = useState("");
  const [componentePorcentaje, setComponentePorcentaje] = useState("");
  const [componenteOrden, setComponenteOrden] = useState("");
  const [componenteError, setComponenteError] = useState<string | null>(null);

  // ===== helpers de carga para reutilizar (GET) =====

  const loadFestivos = async () => {
    try {
      setLoadingHolidays(true);
      setHolidayError(null);
      const data = await fetchFestivos();
      setHolidays(data);
    } catch (err: any) {
      console.error(err);
      setHolidayError(err.message || "Error al cargar los días festivos");
    } finally {
      setLoadingHolidays(false);
    }
  };

  const loadMotivos = async () => {
    try {
      setLoadingMotivos(true);
      setMotivosError(null);
      const data = await fetchMotivos();
      setMotivos(data);
    } catch (err: any) {
      console.error(err);
      setMotivosError(err.message || "Error al obtener motivos");
    } finally {
      setLoadingMotivos(false);
    }
  };

  const loadSemanas = async () => {
    try {
      setLoadingSemanas(true);
      setSemanasError(null);
      const data = await fetchSemanas();
      setSemanas(data);
    } catch (err: any) {
      console.error(err);
      setSemanasError(err.message || "Error al obtener semanas");
    } finally {
      setLoadingSemanas(false);
    }
  };

  const loadPeriods = async () => {
    try {
      setLoadingPeriods(true);
      setPeriodsError(null);

      const data: ApiPeriodo[] = await fetchPeriodos();
      console.log("[SystemSettings] Periodos desde API:", data);

      const sorted = [...data].sort((a, b) => {
        if (a.id_programa !== b.id_programa) {
          return a.id_programa - b.id_programa;
        }
        return a.fecha_inicio.localeCompare(b.fecha_inicio);
      });

      const periodCountByProgram: Record<number, number> = {};
      const mapped: GradePeriod[] = sorted.map((p) => {
        if (!periodCountByProgram[p.id_programa]) {
          periodCountByProgram[p.id_programa] = 1;
        } else {
          periodCountByProgram[p.id_programa] += 1;
        }

        const periodNumber = periodCountByProgram[p.id_programa];

        return {
          id: p.id_periodo,
          programId: p.id_programa,
          programType: p.tipo_programa ?? "INSIDECLASSROOM",
          periodNumber,
          name: p.nombre_programa
            ? `Período ${periodNumber} - ${p.nombre_programa}`
            : `Período ${periodNumber}`,
          startDate: new Date(p.fecha_inicio),
          endDate: new Date(p.fecha_fin),
        };
      });

      console.log("[SystemSettings] Periodos mapeados:", mapped);
      setPeriods(mapped);
    } catch (err: any) {
      console.error(err);
      setPeriodsError(err.message || "Error al cargar períodos");
    } finally {
      setLoadingPeriods(false);
    }
  };

  const loadComponentes = async () => {
    try {
      setLoadingComponents(true);
      setComponentsError(null);
      const data: ApiComponente[] = await fetchComponentes();
      console.log("[SystemSettings] Componentes desde API:", data);

      const mapped: GradeComponent[] = data.map((c) => ({
        id: c.id_componente,
        periodId: c.id_periodo,
        name: c.nombre,
        percentage: c.porcentaje,
        order: (c as any).orden ?? 0,
      }));

      setComponents(mapped);
    } catch (err: any) {
      console.error(err);
      setComponentsError(err.message || "Error al cargar componentes");
    } finally {
      setLoadingComponents(false);
    }
  };

  // ===== useEffects solo llaman a los loaders =====

  useEffect(() => {
    void loadFestivos();
  }, []);

  useEffect(() => {
    void loadMotivos();
  }, []);

  useEffect(() => {
    void loadSemanas();
  }, []);

  useEffect(() => {
    void loadPeriods();
  }, []);

  useEffect(() => {
    void loadComponentes();
  }, []);

  // ===== handlers SEMANAS =====

  const handleRegenerarSemanas = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSemanasError("");

      const payload: any = {
        id_periodo: Number(regenerarPeriodoId),
        fecha_inicio: regenerarFechaInicio,
      };

      if (regenerarNumSemanas && regenerarNumSemanas.trim() !== "") {
        payload.numero_semanas = Number(regenerarNumSemanas);
      }

      const nuevasSemanas = await regenerateSemanasCalendar(payload);
      setSemanas(nuevasSemanas);
      setIsRegenerarDialogOpen(false);
    } catch (err: any) {
      console.error("Error al regenerar semanas:", err);
      setSemanasError(err.message || "Error al regenerar calendario de semanas");
    }
  };

  // ===== handlers MOTIVOS =====

  const handleCreateMotivo = async (e: React.FormEvent) => {
    e.preventDefault();
    setMotivosError(null);

    if (!motivoDescripcion.trim()) {
      setMotivosError("Debe ingresar la descripción del motivo");
      return;
    }

    try {
      const nuevo = await createMotivo({
        descripcion: motivoDescripcion.trim(),
      });

      setMotivos((prev) => [...prev, nuevo]);
      setMotivoDescripcion("");
      setIsMotivoDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      setMotivosError(err.message || "Error al crear motivo");
    }
  };

  const handleDeleteMotivo = async (codigo: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este motivo?")) return;
    try {
      await deleteMotivo(codigo);
      setMotivos((prev) => prev.filter((m) => m.codigo !== codigo));
    } catch (err: any) {
      console.error(err);
      setMotivosError(err.message || "Error al eliminar motivo");
    }
  };

  // ===== handlers FESTIVOS =====

  const handleCreateHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    setHolidayError(null);

    if (!newHolidayDate || !newHolidayName.trim()) {
      setHolidayError("Debe ingresar fecha y nombre del festivo.");
      return;
    }

    try {
      const created = await createFestivo({
        fecha: newHolidayDate,
        descripcion: newHolidayName.trim(),
      });

      setHolidays((prev) => [...prev, created]);
      setNewHolidayDate("");
      setNewHolidayName("");
      setIsHolidayDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      setHolidayError(err.message || "Error al crear el festivo");
    }
  };

  const handleDeleteHoliday = async (id_festivo: number) => {
    try {
      await deleteFestivo(id_festivo);
      setHolidays((prev) => prev.filter((h) => h.id_festivo !== id_festivo));
    } catch (err: any) {
      console.error(err);
      setHolidayError(err.message || "Error al eliminar el festivo");
    }
  };

  // ===== handlers PERÍODOS (crear / editar) =====

  const openCreatePeriodoDialog = () => {
    setIsEditingPeriodo(false);
    setEditingPeriodoId(null);
    setNewPeriodoProgramaId("");
    setNewPeriodoFechaInicio("");
    setNewPeriodoFechaFin("");
    setCreatePeriodoError(null);
    setIsPeriodoDialogOpen(true);
  };

  const openEditPeriodoDialog = (period: GradePeriod) => {
    setIsEditingPeriodo(true);
    setEditingPeriodoId(period.id);
    setNewPeriodoProgramaId(String(period.programId));
    setNewPeriodoFechaInicio(period.startDate.toISOString().slice(0, 10));
    setNewPeriodoFechaFin(period.endDate.toISOString().slice(0, 10));
    setCreatePeriodoError(null);
    setIsPeriodoDialogOpen(true);
  };

  const handleSavePeriodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatePeriodoError(null);

    if (!newPeriodoProgramaId || !newPeriodoFechaInicio || !newPeriodoFechaFin) {
      setCreatePeriodoError(
        "Debe ingresar programa, fecha de inicio y fecha de fin"
      );
      return;
    }

    const payload = {
      id_programa: Number(newPeriodoProgramaId),
      fecha_inicio: newPeriodoFechaInicio,
      fecha_fin: newPeriodoFechaFin,
    };

    try {
      if (isEditingPeriodo && editingPeriodoId != null) {
        // EDITAR
        await updatePeriodo(editingPeriodoId, payload);
      } else {
        // CREAR
        await createPeriodo(payload);
      }

      // Siempre recargamos desde backend para que quede igual a la BD
      await loadPeriods();

      // limpiar formulario
      setIsPeriodoDialogOpen(false);
      setIsEditingPeriodo(false);
      setEditingPeriodoId(null);
      setNewPeriodoProgramaId("");
      setNewPeriodoFechaInicio("");
      setNewPeriodoFechaFin("");
    } catch (err: any) {
      console.error(err);
      setCreatePeriodoError(
        err.message || "Error al guardar período (crear/editar)"
      );
    }
  };

  // ===== handlers COMPONENTES (crear / editar / borrar) =====

  const openCreateComponenteDialog = () => {
    setIsEditingComponente(false);
    setEditingComponenteId(null);
    setComponentePeriodoId("");
    setComponenteNombre("");
    setComponentePorcentaje("");
    setComponenteOrden("");
    setComponenteError(null);
    setIsComponenteDialogOpen(true);
  };

  const openEditComponenteDialog = (component: GradeComponent) => {
    setIsEditingComponente(true);
    setEditingComponenteId(component.id);
    setComponentePeriodoId(String(component.periodId));
    setComponenteNombre(component.name);
    setComponentePorcentaje(String(component.percentage));
    setComponenteOrden(String(component.order));
    setComponenteError(null);
    setIsComponenteDialogOpen(true);
  };

  const handleSaveComponente = async (e: React.FormEvent) => {
    e.preventDefault();
    setComponenteError(null);

    const payload = {
      id_periodo: Number(componentePeriodoId),
      nombre: componenteNombre.trim(),
      porcentaje: Number(componentePorcentaje),
      orden: componenteOrden ? Number(componenteOrden) : undefined,
    };

    if (!payload.id_periodo || !payload.nombre || isNaN(payload.porcentaje)) {
      setComponenteError("Debe completar todos los campos requeridos");
      return;
    }

    try {
      if (isEditingComponente && editingComponenteId != null) {
        await updateComponente(editingComponenteId, payload);
      } else {
        await createComponente(payload);
      }

      await loadComponentes();

      setIsComponenteDialogOpen(false);
      setIsEditingComponente(false);
      setEditingComponenteId(null);
    } catch (err: any) {
      console.error(err);
      setComponenteError(
        err.message || "Error al guardar componente (crear/editar)"
      );
    }
  };

  const handleDeleteComponente = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este componente?")) return;

    try {
      await deleteComponente(id);
      await loadComponentes();
    } catch (err: any) {
      console.error(err);
      setComponenteError(err.message || "Error al eliminar componente");
    }
  };

  // ================== RENDER ==================
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
        </TabsList>

        {/* ========= TAB: FESTIVOS ========= */}
        <TabsContent value="holidays">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Días Festivos</CardTitle>
                  <CardDescription>
                    {loadingHolidays
                      ? "Cargando festivos..."
                      : `Gestionar los días festivos del calendario (${holidays.length})`}
                  </CardDescription>
                  {holidayError && (
                    <p className="text-sm text-red-500 mt-1">
                      {holidayError}
                    </p>
                  )}
                </div>
                <Dialog
                  open={isHolidayDialogOpen}
                  onOpenChange={setIsHolidayDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Festivo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Día Festivo</DialogTitle>
                      <DialogDescription>
                        Ingrese la información del día festivo
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      className="space-y-4"
                      onSubmit={handleCreateHoliday}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="holiday-date">Fecha</Label>
                        <Input
                          id="holiday-date"
                          type="date"
                          required
                          value={newHolidayDate}
                          onChange={(e) =>
                            setNewHolidayDate(e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="holiday-name">
                          Nombre del Festivo
                        </Label>
                        <Input
                          id="holiday-name"
                          placeholder="Día de la Independencia"
                          required
                          value={newHolidayName}
                          onChange={(e) =>
                            setNewHolidayName(e.target.value)
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setIsHolidayDialogOpen(false)
                          }
                        >
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
              {holidays.length === 0 && !loadingHolidays ? (
                <p className="text-sm text-gray-600">
                  No hay festivos registrados.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holidays.map((holiday) => (
                      <TableRow key={holiday.id_festivo}>
                        <TableCell>
                          {new Date(
                            holiday.fecha
                          ).toLocaleDateString("es-CO")}
                        </TableCell>
                        <TableCell>{holiday.descripcion}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleDeleteHoliday(holiday.id_festivo)
                            }
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========= TAB: MOTIVOS DE AUSENCIA ========= */}
        <TabsContent value="absences">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Motivos de Ausencia</CardTitle>
                  <CardDescription>
                    Gestionar los motivos de no asistencia a clase
                  </CardDescription>
                  {motivosError && (
                    <p className="text-sm text-red-500 mt-1">
                      {motivosError}
                    </p>
                  )}
                </div>
                <Dialog
                  open={isMotivoDialogOpen}
                  onOpenChange={setIsMotivoDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Motivo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Motivo de Ausencia</DialogTitle>
                      <DialogDescription>
                        Ingrese la descripción del motivo
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleCreateMotivo}>
                      <div className="space-y-2">
                        <Label htmlFor="motivo-desc">
                          Descripción del motivo
                        </Label>
                        <Input
                          id="motivo-desc"
                          placeholder="Ej: Enfermedad, cita médica, calamidad, etc."
                          required
                          value={motivoDescripcion}
                          onChange={(e) =>
                            setMotivoDescripcion(e.target.value)
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsMotivoDialogOpen(false)}
                        >
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
              {loadingMotivos ? (
                <p className="text-sm text-gray-600">Cargando motivos...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {motivos.map((reason) => (
                      <TableRow key={reason.codigo}>
                        <TableCell>
                          <Badge variant="outline">{reason.codigo}</Badge>
                        </TableCell>
                        <TableCell>{reason.descripcion}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleDeleteMotivo(reason.codigo)
                            }
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {motivos.length === 0 && !loadingMotivos && (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <p className="text-sm text-gray-500 text-center">
                            No hay motivos registrados.
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========= TAB: CALENDARIO DE SEMANAS ========= */}
        <TabsContent value="weeks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calendario de Semanas del Programa</CardTitle>
                  <CardDescription>
                    Calendario de semanas para el seguimiento del programa
                    (puede regenerarse cada año escolar)
                  </CardDescription>
                  {semanasError && (
                    <p className="text-sm text-red-500 mt-1">
                      {semanasError}
                    </p>
                  )}
                </div>
                <Dialog
                  open={isRegenerarDialogOpen}
                  onOpenChange={setIsRegenerarDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Regenerar Calendario
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Regenerar calendario de semanas</DialogTitle>
                      <DialogDescription>
                        Se eliminarán las semanas existentes para ese período y
                        se crearán de nuevo (por defecto 40 semanas).
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleRegenerarSemanas}>
                      <div className="space-y-2">
                        <Label htmlFor="periodo-id">
                          ID del período académico
                        </Label>
                        <Input
                          id="periodo-id"
                          type="number"
                          placeholder="1"
                          value={regenerarPeriodoId}
                          onChange={(e) =>
                            setRegenerarPeriodoId(e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fecha-inicio-semanas">
                          Fecha de inicio de la primera semana
                        </Label>
                        <Input
                          id="fecha-inicio-semanas"
                          type="date"
                          value={regenerarFechaInicio}
                          onChange={(e) =>
                            setRegenerarFechaInicio(e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="num-semanas">
                          Número de semanas (1–60)
                        </Label>
                        <Input
                          id="num-semanas"
                          type="number"
                          min={1}
                          max={60}
                          value={regenerarNumSemanas}
                          onChange={(e) =>
                            setRegenerarNumSemanas(e.target.value)
                          }
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsRegenerarDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">Regenerar</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                {loadingSemanas ? (
                  <p className="text-sm text-gray-600">
                    Cargando semanas del programa...
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Semana #</TableHead>
                        <TableHead>Fecha Inicio</TableHead>
                        <TableHead>Fecha Fin</TableHead>
                        <TableHead>Año</TableHead>
                        <TableHead>Periodo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semanas.map((week, idx) => {
                        const inicio = new Date(week.fecha_inicio);
                        const fin = new Date(week.fecha_fin);
                        const year = inicio.getFullYear();
                        return (
                          <TableRow key={week.numero_semana}>
                            <TableCell>
                              <Badge>Semana {idx + 1}</Badge>
                            </TableCell>
                            <TableCell>
                              {inicio.toLocaleDateString("es-CO")}
                            </TableCell>
                            <TableCell>
                              {fin.toLocaleDateString("es-CO")}
                            </TableCell>
                            <TableCell>{year}</TableCell>
                            <TableCell>{week.id_periodo}</TableCell>
                          </TableRow>
                        );
                      })}
                      {semanas.length === 0 && !loadingSemanas && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <p className="text-sm text-gray-500 text-center">
                              No hay semanas configuradas aún. Usa
                              &quot;Regenerar Calendario&quot; para crear las
                              semanas del año escolar.
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Mostrando {semanas.length} semanas configuradas
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========= TAB: PERÍODOS Y COMPONENTES ========= */}
        <TabsContent value="periods">
          <div className="space-y-6">
            {/* PERÍODOS */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Períodos Académicos</CardTitle>
                    <CardDescription>
                      Gestionar períodos de calificación por tipo de programa
                    </CardDescription>
                    {periodsError && (
                      <p className="text-sm text-red-500 mt-1">
                        {periodsError}
                      </p>
                    )}
                  </div>
                  <Dialog
                    open={isPeriodoDialogOpen}
                    onOpenChange={setIsPeriodoDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={openCreatePeriodoDialog}>
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Período
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {isEditingPeriodo
                            ? "Editar período"
                            : "Crear nuevo período"}
                        </DialogTitle>
                        <DialogDescription>
                          Asigne un programa y un rango de fechas para el
                          período académico.
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        className="space-y-4"
                        onSubmit={handleSavePeriodo}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="periodo-programa">
                            ID del programa
                          </Label>
                          <Input
                            id="periodo-programa"
                            type="number"
                            placeholder="Ej: 1"
                            value={newPeriodoProgramaId}
                            onChange={(e) =>
                              setNewPeriodoProgramaId(e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="periodo-inicio">
                            Fecha de inicio
                          </Label>
                          <Input
                            id="periodo-inicio"
                            type="date"
                            value={newPeriodoFechaInicio}
                            onChange={(e) =>
                              setNewPeriodoFechaInicio(e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="periodo-fin">
                            Fecha de fin
                          </Label>
                          <Input
                            id="periodo-fin"
                            type="date"
                            value={newPeriodoFechaFin}
                            onChange={(e) =>
                              setNewPeriodoFechaFin(e.target.value)
                            }
                            required
                          />
                        </div>

                        {createPeriodoError && (
                          <p className="text-sm text-red-500">
                            {createPeriodoError}
                          </p>
                        )}

                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsPeriodoDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button type="submit">
                            {isEditingPeriodo ? "Actualizar" : "Guardar"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loadingPeriods ? (
                  <p className="text-sm text-gray-600">
                    Cargando períodos...
                  </p>
                ) : periods.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No hay períodos registrados aún.
                  </p>
                ) : (
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
                      {periods.map((period) => (
                        <TableRow key={period.id}>
                          <TableCell>
                            <Badge
                              variant={
                                period.programType === "INSIDECLASSROOM"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {period.programType === "INSIDECLASSROOM"
                                ? "Inside"
                                : "Outside"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            Período {period.periodNumber}
                          </TableCell>
                          <TableCell>{period.name}</TableCell>
                          <TableCell>
                            {period.startDate.toLocaleDateString("es-CO")}
                          </TableCell>
                          <TableCell>
                            {period.endDate.toLocaleDateString("es-CO")}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditPeriodoDialog(period)}
                            >
                              Editar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* COMPONENTES */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Componentes de Calificación</CardTitle>
                    <CardDescription>
                      Gestionar componentes y porcentajes de evaluación
                    </CardDescription>
                    {componentsError && (
                      <p className="text-sm text-red-500 mt-1">
                        {componentsError}
                      </p>
                    )}
                  </div>
                  <Dialog
                    open={isComponenteDialogOpen}
                    onOpenChange={setIsComponenteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={openCreateComponenteDialog}>
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Componente
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {isEditingComponente
                            ? "Editar componente"
                            : "Crear nuevo componente"}
                        </DialogTitle>
                        <DialogDescription>
                          Asigne un período, nombre y porcentaje al componente de
                          evaluación.
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        className="space-y-4"
                        onSubmit={handleSaveComponente}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="componente-periodo">
                            ID del período
                          </Label>
                          <Input
                            id="componente-periodo"
                            type="number"
                            placeholder="Ej: 1"
                            value={componentePeriodoId}
                            onChange={(e) =>
                              setComponentePeriodoId(e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="componente-nombre">
                            Nombre del componente
                          </Label>
                          <Input
                            id="componente-nombre"
                            placeholder="Ej: Evaluación, Talleres, Proyecto"
                            value={componenteNombre}
                            onChange={(e) =>
                              setComponenteNombre(e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="componente-porcentaje">
                            Porcentaje
                          </Label>
                          <Input
                            id="componente-porcentaje"
                            type="number"
                            min={0}
                            max={100}
                            value={componentePorcentaje}
                            onChange={(e) =>
                              setComponentePorcentaje(e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="componente-orden">
                            Orden (opcional)
                          </Label>
                          <Input
                            id="componente-orden"
                            type="number"
                            value={componenteOrden}
                            onChange={(e) =>
                              setComponenteOrden(e.target.value)
                            }
                          />
                        </div>

                        {componenteError && (
                          <p className="text-sm text-red-500">
                            {componenteError}
                          </p>
                        )}

                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              setIsComponenteDialogOpen(false)
                            }
                          >
                            Cancelar
                          </Button>
                          <Button type="submit">
                            {isEditingComponente
                              ? "Actualizar"
                              : "Guardar"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loadingComponents ? (
                  <p className="text-sm text-gray-600">
                    Cargando componentes...
                  </p>
                ) : components.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No hay componentes registrados aún.
                  </p>
                ) : (
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
                      {components.map((component) => {
                        const period = periods.find(
                          (p) => p.id === component.periodId
                        );
                        return (
                          <TableRow key={component.id}>
                            <TableCell>
                              <div className="text-sm">
                                <div>
                                  {period?.name ||
                                    `Período ${component.periodId}`}
                                </div>
                                {period && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {period.programType ===
                                    "INSIDECLASSROOM"
                                      ? "Inside"
                                      : "Outside"}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{component.name}</TableCell>
                            <TableCell>
                              <Badge variant="default">
                                {component.percentage}%
                              </Badge>
                            </TableCell>
                            <TableCell>{component.order}</TableCell>
                            <TableCell className="space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  openEditComponenteDialog(component)
                                }
                              >
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleDeleteComponente(component.id)
                                }
                              >
                                Eliminar
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
