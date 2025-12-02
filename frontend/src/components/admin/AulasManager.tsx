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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Plus } from "lucide-react";

import {
  fetchIEDs,
  fetchSedes,
  fetchProgramas,
  fetchAulas,
  createAula,
  type IED,
  type Sede,
  type Programa,
  type Aula,
} from "../../lib/api";

export function AulasManager() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [ieds, setIeds] = useState<IED[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [programas, setProgramas] = useState<Programa[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Filtro por IED
  const [filterIedId, setFilterIedId] = useState<string>("all");

  // Formulario de creación
  const [formIedId, setFormIedId] = useState("");
  const [formSedeId, setFormSedeId] = useState("");
  const [formProgramaId, setFormProgramaId] = useState("");
  const [formGrado, setFormGrado] = useState("4");

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [iedsData, sedesData, programasData, aulasData] =
          await Promise.all([
            fetchIEDs(),
            fetchSedes(),
            fetchProgramas(),
            fetchAulas(),
          ]);

        setIeds(iedsData);
        setSedes(sedesData);
        setProgramas(programasData);
        setAulas(aulasData);
      } catch (err: any) {
        console.error("[AULAS] Error cargando datos:", err);
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Sedes filtradas según la IED seleccionada en el formulario
  const sedesDeIedSeleccionada = formIedId
    ? sedes.filter((s) => s.id_ied === Number(formIedId))
    : sedes;

  // Aulas filtradas por IED (para la tabla)
  const aulasFiltradas =
    filterIedId === "all"
      ? aulas
      : aulas.filter((aula) => {
          const sede = sedes.find((s) => s.id_sede === aula.id_sede);
          return sede && sede.id_ied === Number(filterIedId);
        });

  // Helpers para mostrar nombres en la tabla
  const getIedNombreByAula = (aula: Aula) => {
    const sede = sedes.find((s) => s.id_sede === aula.id_sede);
    const ied = ieds.find((i) => i.id_ied === sede?.id_ied);
    return ied?.nombre ?? "-";
  };

  const getSedeTexto = (aula: Aula) => {
    const sede = sedes.find((s) => s.id_sede === aula.id_sede);
    if (!sede) return "-";
    return `${sede.tipo} - ${sede.direccion}`;
  };

  const getProgramaNombre = (aula: Aula) => {
    const prog = programas.find((p) => p.id_programa === aula.id_programa);
    return prog?.nombre_programa ?? "-";
  };

  const handleSubmitAula = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formIedId || !formSedeId || !formProgramaId || !formGrado) {
      setError("Debes completar todos los campos del formulario.");
      return;
    }

    const payload = {
      id_sede: Number(formSedeId),
      id_programa: Number(formProgramaId),
      grado: Number(formGrado),
    };

    try {
      const nuevaAula = await createAula(payload);
      // Añadir al estado local
      setAulas((prev) => [...prev, nuevaAula]);

      // Limpiar formulario
      setFormIedId("");
      setFormSedeId("");
      setFormProgramaId("");
      setFormGrado("4");
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error("[AULAS] Error al crear aula:", err);
      setError(err.message || "Error al crear el aula");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

            <form className="space-y-4" onSubmit={handleSubmitAula}>
              {/* IED + Sede */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institución (IED)</Label>
                  <Select
                    value={formIedId}
                    onValueChange={(val) => {
                      setFormIedId(val);
                      setFormSedeId(""); // reset sede al cambiar IED
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione institución" />
                    </SelectTrigger>
                    <SelectContent>
                      {ieds.map((ied) => (
                        <SelectItem key={ied.id_ied} value={String(ied.id_ied)}>
                          {ied.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sede</Label>
                  <Select
                    value={formSedeId}
                    onValueChange={setFormSedeId}
                    disabled={!formIedId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          formIedId
                            ? "Seleccione sede"
                            : "Seleccione primero una IED"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {sedesDeIedSeleccionada.map((sede) => (
                        <SelectItem
                          key={sede.id_sede}
                          value={String(sede.id_sede)}
                        >
                          {sede.tipo} - {sede.direccion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Programa + Grado */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Programa</Label>
                  <Select
                    value={formProgramaId}
                    onValueChange={setFormProgramaId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione programa" />
                    </SelectTrigger>
                    <SelectContent>
                      {programas.map((prog) => (
                        <SelectItem
                          key={prog.id_programa}
                          value={String(prog.id_programa)}
                        >
                          {prog.nombre_programa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Grado</Label>
                  <Input
                    type="number"
                    min={1}
                    max={11}
                    value={formGrado}
                    onChange={(e) => setFormGrado(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}

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

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtra las aulas por institución educativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <Label>Institución</Label>
            <Select
              value={filterIedId}
              onValueChange={setFilterIedId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione institución" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las instituciones</SelectItem>
                {ieds.map((ied) => (
                  <SelectItem
                    key={ied.id_ied}
                    value={String(ied.id_ied)}
                  >
                    {ied.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de aulas */}
      <Card>
        <CardHeader>
          <CardTitle>Aulas Registradas</CardTitle>
          <CardDescription>
            {loading
              ? "Cargando aulas..."
              : `${aulasFiltradas.length} aula(s) encontradas`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && !isAddDialogOpen && (
            <p className="text-sm text-red-600 mb-3">{error}</p>
          )}

          {!loading && aulasFiltradas.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay aulas registradas para los filtros seleccionados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Aula</TableHead>
                  <TableHead>Institución</TableHead>
                  <TableHead>Sede</TableHead>
                  <TableHead>Programa</TableHead>
                  <TableHead>Grado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aulasFiltradas.map((aula) => (
                  <TableRow key={aula.id_aula}>
                    <TableCell>{aula.id_aula}</TableCell>
                    <TableCell>{getIedNombreByAula(aula)}</TableCell>
                    <TableCell>{getSedeTexto(aula)}</TableCell>
                    <TableCell>{getProgramaNombre(aula)}</TableCell>
                    <TableCell>{aula.grado}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
