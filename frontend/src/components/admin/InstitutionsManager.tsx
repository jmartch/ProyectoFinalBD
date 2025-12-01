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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Plus, Building2, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type IED = {
  id_ied: number;
  nombre: string;
  telefono: string;
  duracion: string | null;
  hora_inicio: string | null;
  hora_fin: string | null;
  jornada: string | null;
};

type Sede = {
  id_sede: number;
  id_ied: number;
  direccion: string;
  tipo: string; // "Principal" | "Secundaria" | etc.
};

export function InstitutionsManager() {
  const [ieds, setIeds] = useState<IED[]>([]);
  const [selectedIedId, setSelectedIedId] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddSedeDialogOpen, setIsAddSedeDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [loadingIeds, setLoadingIeds] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SEDES
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loadingSedes, setLoadingSedes] = useState(false);

  // Form IED
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [duracion, setDuracion] = useState("02:00");
  const [horaInicio, setHoraInicio] = useState("07:00");
  const [horaFin, setHoraFin] = useState("17:00");
  const [jornada, setJornada] = useState("Jornada Única");

  // Form Sede
  const [sedeDireccion, setSedeDireccion] = useState("");
  const [sedeTipo, setSedeTipo] = useState("Principal");

  const selectedIed =
    ieds.find((i) => i.id_ied === selectedIedId) || null;

  const toHHMMSS = (value: string) =>
    value && value.length === 5 ? `${value}:00` : value;

  // Cargar IEDs al montar
  useEffect(() => {
    const loadIeds = async () => {
      try {
        setLoadingIeds(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/api/ieds`);
        if (!res.ok) throw new Error("Error al obtener IED");

        const data: IED[] = await res.json();
        setIeds(data);

        // Opcional: seleccionar la primera IED automáticamente
        if (data.length > 0 && selectedIedId === null) {
          setSelectedIedId(data[0].id_ied);
        }
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las instituciones (IED)");
      } finally {
        setLoadingIeds(false);
      }
    };

    loadIeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cargar TODAS las sedes y luego filtrar por IED seleccionada
  useEffect(() => {
    const loadSedes = async () => {
      if (!selectedIedId) {
        setSedes([]);
        return;
      }

      try {
        setLoadingSedes(true);

        // 👇 Traemos todas las sedes
        const res = await fetch(`${API_BASE_URL}/api/sedes`);
        if (!res.ok) throw new Error("Error al obtener sedes");

        const data: Sede[] = await res.json();

        // 👇 Filtramos solo las sedes de la IED seleccionada
        const filtered = data.filter(
          (sede) => sede.id_ied === selectedIedId
        );
        setSedes(filtered);
      } catch (err) {
        console.error(err);
        // Si quieres, aquí podrías setear un error específico de sedes
      } finally {
        setLoadingSedes(false);
      }
    };

    loadSedes();
  }, [selectedIedId]);

  // Crear IED
  const handleSubmitIED = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      nombre,
      telefono,
      duracion: toHHMMSS(duracion),
      hora_inicio: toHHMMSS(horaInicio),
      hora_fin: toHHMMSS(horaFin),
      jornada,
    };

    console.log("Enviando a /api/ieds:", payload);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ieds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      console.log("Respuesta backend (IED):", res.status, body);

      if (!res.ok) {
        setError(body.message || "Error al crear la IED");
        return;
      }

      const nuevaIed: IED = body.data;
      setIeds((prev) => [...prev, nuevaIed]);

      // limpiar form
      setNombre("");
      setTelefono("");
      setDuracion("02:00");
      setHoraInicio("07:00");
      setHoraFin("17:00");
      setJornada("Jornada Única");

      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error de red al crear la IED");
    }
  };

  // Crear SEDE
  const handleSubmitSede = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIedId) {
      setError("Debes seleccionar primero una IED para agregar sedes.");
      return;
    }

    const payload = {
      id_ied: selectedIedId,
      direccion: sedeDireccion,
      tipo: sedeTipo,
    };

    console.log("Enviando a /api/sedes:", payload);

    try {
      const res = await fetch(`${API_BASE_URL}/api/sedes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      console.log("Respuesta backend (Sede):", res.status, body);

      if (!res.ok) {
        setError(body.message || "Error al crear la sede");
        return;
      }

      const nuevaSede: Sede = body.data;

      // 👇 Como ya estamos filtrando por IED, solo agregamos si coincide
      if (nuevaSede.id_ied === selectedIedId) {
        setSedes((prev) => [...prev, nuevaSede]);
      }

      setSedeDireccion("");
      setSedeTipo("Principal");
      setIsAddSedeDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error de red al crear la sede");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Gestión de Instituciones (IED)</h2>
          <p className="text-gray-600 mt-1">
            Administrar Instituciones Educativas del Distrito (IED) y sus sedes
          </p>
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </div>

        {/* Dialog Nueva IED */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva IED
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nueva IED</DialogTitle>
              <DialogDescription>
                Ingrese la información de la institución educativa
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmitIED}>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="IED Global Kids"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="3000000000"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jornada">Jornada</Label>
                  <Input
                    id="jornada"
                    placeholder="Jornada Única"
                    required
                    value={jornada}
                    onChange={(e) => setJornada(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duracion">Duración (HH:MM)</Label>
                  <Input
                    id="duracion"
                    type="time"
                    step={60}
                    required
                    value={duracion}
                    onChange={(e) => setDuracion(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora_inicio">Hora inicio</Label>
                  <Input
                    id="hora_inicio"
                    type="time"
                    step={60}
                    required
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora_fin">Hora fin</Label>
                  <Input
                    id="hora_fin"
                    type="time"
                    step={60}
                    required
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                  />
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
                <Button type="submit">Guardar IED</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de IED */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>IED Registradas</CardTitle>
            <CardDescription>
              {loadingIeds
                ? "Cargando instituciones..."
                : `${ieds.length} instituciones`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ieds.map((inst) => (
                <button
                  key={inst.id_ied}
                  onClick={() => {
                    setSelectedIedId(inst.id_ied);
                    setActiveTab("details");
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedIedId === inst.id_ied
                      ? "bg-blue-50 border-blue-300"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{inst.nombre}</p>
                      <p className="text-sm text-gray-600">
                        Tel: {inst.telefono}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {inst.jornada ?? "Sin jornada"}
                    </Badge>
                  </div>
                </button>
              ))}

              {!loadingIeds && ieds.length === 0 && (
                <p className="text-sm text-gray-500">
                  No hay instituciones registradas todavía.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalle de IED + SEDES */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedIed ? selectedIed.nombre : "Seleccione una institución"}
            </CardTitle>
            <CardDescription>
              {selectedIed
                ? "Detalles y sedes de la institución"
                : "Seleccione una institución de la lista para ver sus detalles"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedIed ? (
              <Tabs
                defaultValue="details"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="details">
                    <Building2 className="w-4 h-4 mr-2" />
                    Detalles
                  </TabsTrigger>
                  <TabsTrigger value="sedes">
                    <MapPin className="w-4 h-4 mr-2" />
                    {/* sedes ya viene filtrado */}
                    Sedes ({sedes.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">ID IED</Label>
                      <p>{selectedIed.id_ied}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Teléfono</Label>
                      <p>{selectedIed.telefono}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Duración</Label>
                      <p>{selectedIed.duracion ?? "-"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Hora inicio
                      </Label>
                      <p>{selectedIed.hora_inicio ?? "-"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Hora fin</Label>
                      <p>{selectedIed.hora_fin ?? "-"}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Jornada</Label>
                    <p>{selectedIed.jornada ?? "-"}</p>
                  </div>
                </TabsContent>

                <TabsContent value="sedes">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        {loadingSedes
                          ? "Cargando sedes..."
                          : sedes.length === 0
                          ? "No hay sedes registradas para esta IED."
                          : "Sedes registradas para esta IED."}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setIsAddSedeDialogOpen(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Sede
                      </Button>
                    </div>

                    {sedes.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Dirección</TableHead>
                            <TableHead>Tipo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sedes.map((sede) => (
                            <TableRow key={sede.id_sede}>
                              <TableCell>{sede.direccion}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    sede.tipo === "Principal"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {sede.tipo}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}

                    {sedes.length === 0 && !loadingSedes && (
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

      {/* Dialog para crear SEDE */}
      <Dialog
        open={isAddSedeDialogOpen}
        onOpenChange={setIsAddSedeDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Sede</DialogTitle>
            <DialogDescription>
              Agrega una nueva sede para{" "}
              {selectedIed?.nombre || "la IED seleccionada"}
            </DialogDescription>
          </DialogHeader>

          {!selectedIed && (
            <p className="text-sm text-red-500 mb-2">
              Debes seleccionar una IED antes de crear una sede.
            </p>
          )}

          <form className="space-y-4" onSubmit={handleSubmitSede}>
            <div className="space-y-2">
              <Label htmlFor="sede-direccion">Dirección</Label>
              <Input
                id="sede-direccion"
                placeholder="Calle 123 #45-67"
                required
                value={sedeDireccion}
                onChange={(e) => setSedeDireccion(e.target.value)}
                disabled={!selectedIed}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sede-tipo">Tipo de Sede</Label>
              <Select
                value={sedeTipo}
                onValueChange={setSedeTipo}
                disabled={!selectedIed}
              >
                <SelectTrigger id="sede-tipo">
                  <SelectValue placeholder="Seleccione el tipo de sede" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Principal">Sede Principal</SelectItem>
                  <SelectItem value="Secundaria">Sede Secundaria</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                La sede principal es la ubicación central de la institución.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddSedeDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!selectedIed}>
                <Plus className="w-4 h-4 mr-2" />
                Guardar Sede
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}