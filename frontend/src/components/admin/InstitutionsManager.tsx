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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";

// 👇 NUEVO: usamos el cliente de API
import type { IED } from "../../lib/api";
import { fetchIEDs, createIED } from "../../lib/api";

export function InstitutionsManager() {
  const [ieds, setIeds] = useState<IED[]>([]);
  const [selectedIedId, setSelectedIedId] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddSedeDialogOpen, setIsAddSedeDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [loadingIeds, setLoadingIeds] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulario para crear IED
  const [iedForm, setIedForm] = useState({
    nombre: "",
    telefono: "",
    duracion: "02:00",      // HH:MM para el input
    hora_inicio: "07:00",
    hora_fin: "17:00",
    jornada: "Jornada Única",
  });

  const selectedIed = ieds.find((i) => i.id_ied === selectedIedId) || null;

  // Helper para convertir "HH:MM" a "HH:MM:SS"
  const toHHMMSS = (value: string) =>
    value && value.length === 5 ? `${value}:00` : value;

  // 1. Cargar IED al montar el componente
  useEffect(() => {
    const loadIeds = async () => {
      try {
        setLoadingIeds(true);
        setError(null);
        const data = await fetchIEDs();
        setIeds(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las instituciones (IED)");
      } finally {
        setLoadingIeds(false);
      }
    };

    loadIeds();
  }, []);

  // 2. Crear IED desde el formulario
  const handleSubmitIED = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const newIed = await createIED({
        nombre: iedForm.nombre,
        telefono: iedForm.telefono,
        duracion: toHHMMSS(iedForm.duracion),
        hora_inicio: toHHMMSS(iedForm.hora_inicio),
        hora_fin: toHHMMSS(iedForm.hora_fin),
        jornada: iedForm.jornada,
      });

      setIeds((prev) => [...prev, newIed]);
      setIedForm({
        nombre: "",
        telefono: "",
        duracion: "02:00",
        hora_inicio: "07:00",
        hora_fin: "17:00",
        jornada: "Jornada Única",
      });
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "No se pudo guardar la IED");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Gestión de Instituciones (IED)</h2>
          <p className="text-gray-600 mt-1">
            Administrar Instituciones Educativas del Distrito (IED)
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
                  value={iedForm.nombre}
                  onChange={(e) =>
                    setIedForm((f) => ({ ...f, nombre: e.target.value }))
                  }
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
                    value={iedForm.telefono}
                    onChange={(e) =>
                      setIedForm((f) => ({ ...f, telefono: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jornada">Jornada</Label>
                  <Input
                    id="jornada"
                    placeholder="Jornada Única"
                    required
                    value={iedForm.jornada}
                    onChange={(e) =>
                      setIedForm((f) => ({ ...f, jornada: e.target.value }))
                    }
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
                    value={iedForm.duracion}
                    onChange={(e) =>
                      setIedForm((f) => ({ ...f, duracion: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora_inicio">Hora inicio</Label>
                  <Input
                    id="hora_inicio"
                    type="time"
                    step={60}
                    required
                    value={iedForm.hora_inicio}
                    onChange={(e) =>
                      setIedForm((f) => ({ ...f, hora_inicio: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora_fin">Hora fin</Label>
                  <Input
                    id="hora_fin"
                    type="time"
                    step={60}
                    required
                    value={iedForm.hora_fin}
                    onChange={(e) =>
                      setIedForm((f) => ({ ...f, hora_fin: e.target.value }))
                    }
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

        {/* Detalle de IED */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedIed ? selectedIed.nombre : "Seleccione una institución"}
            </CardTitle>
            <CardDescription>
              {selectedIed
                ? "Detalles de la institución"
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
                    Sedes
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
                      <Label className="text-xs text-gray-500">
                        Duración
                      </Label>
                      <p>{selectedIed.duracion ?? "-"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Hora inicio
                      </Label>
                      <p>{selectedIed.hora_inicio ?? "-"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Hora fin
                      </Label>
                      <p>{selectedIed.hora_fin ?? "-"}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Jornada</Label>
                    <p>{selectedIed.jornada ?? "-"}</p>
                  </div>
                </TabsContent>

                <TabsContent value="sedes">
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>
                      Las sedes se conectan después cuando tengamos los
                      endpoints de la tabla <code>sede</code>.
                    </p>
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

      {/* Dialog de sedes lo dejamos sin lógica por ahora */}
      <Dialog
        open={isAddSedeDialogOpen}
        onOpenChange={setIsAddSedeDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Sede</DialogTitle>
            <DialogDescription>
              Aquí luego se conectará con /api/sede
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-gray-500">
            Por ahora estamos probando solo la creación de IED.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
