import { useEffect, useMemo, useState } from "react";
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
import { Badge } from "../ui/badge";
import { Plus, GraduationCap } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/* ===== Tipos ===== */

type StudentDetail = {
  doc_estudiante: number;
  tipo_doc: string;
  nombre1: string;
  nombre2: string | null;
  apellido1: string;
  apellido2: string | null;
  sexo: "M" | "F";
  correo_acudiente: string;
  telefono_acudiente: string;
  id_aula: number | null;
  grado: number | null;
  id_ied: number | null;
  nombre_ied: string | null;
};

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
  tipo: string;
};

type Aula = {
  id_aula: number;
  id_sede: number;
  id_programa: number;
  grado: number;
};

/* Opciones de selects */

const DOCUMENT_TYPES = [
  { code: "TI", label: "Tarjeta de Identidad (TI)" },
  { code: "RC", label: "Registro Civil (RC)" },
  { code: "CC", label: "Cédula de Ciudadanía (CC)" },
  { code: "CE", label: "Cédula de Extranjería (CE)" },
  { code: "PE", label: "Permiso Especial (PE)" },
];

const GRADES = [4, 5, 9, 10] as const;

/* ===== Componente ===== */

export function StudentsManager() {
  // Datos
  const [students, setStudents] = useState<StudentDetail[]>([]);
  const [ieds, setIeds] = useState<IED[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);

  // Estado de carga y error
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros tabla
  const [filterIed, setFilterIed] = useState<string>("all");
  const [filterGrade, setFilterGrade] = useState<string>("all");

  // Modal nuevo estudiante
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Formulario estudiante
  const [docEstudiante, setDocEstudiante] = useState("");
  const [tipoDoc, setTipoDoc] = useState("");
  const [nombre1, setNombre1] = useState("");
  const [nombre2, setNombre2] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [sexo, setSexo] = useState<"" | "M" | "F">("");
  const [correoAcudiente, setCorreoAcudiente] = useState("");
  const [telefonoAcudiente, setTelefonoAcudiente] = useState("");

  // Detalles de matrícula en el form
  const [formIedId, setFormIedId] = useState<string>("");   // IED elegida
  const [formGrade, setFormGrade] = useState<string>("");   // Grado elegido
  const [formAulaId, setFormAulaId] = useState<string>(""); // Aula elegida

  /* ========= Carga de datos ========= */

  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/api/estudiantes/detalle`);
      if (!res.ok) {
        throw new Error("Error al obtener estudiantes");
      }
      const data: StudentDetail[] = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener estudiantes");
    } finally {
      setLoadingStudents(false);
    }
  };

  const loadIeds = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ieds`);
      if (!res.ok) throw new Error("Error al obtener IED");
      const data: IED[] = await res.json();
      setIeds(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSedesYAulas = async () => {
    try {
      const [resSede, resAula] = await Promise.all([
        fetch(`${API_BASE_URL}/api/sedes`),
        fetch(`${API_BASE_URL}/api/aulas`),
      ]);

      if (!resSede.ok || !resAula.ok) {
        throw new Error("Error al obtener sedes/aulas");
      }

      const sedesData: Sede[] = await resSede.json();
      const aulasData: Aula[] = await resAula.json();

      setSedes(sedesData);
      setAulas(aulasData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStudents();
    loadIeds();
    loadSedesYAulas();
  }, []);

  /* ========= Derivados ========= */

  // Estudiantes filtrados por IED y grado
  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      const matchesIed =
        filterIed === "all" ||
        (st.id_ied != null && st.id_ied.toString() === filterIed);
      const matchesGrade =
        filterGrade === "all" ||
        (st.grado != null && st.grado.toString() === filterGrade);
      return matchesIed && matchesGrade;
    });
  }, [students, filterIed, filterGrade]);

  // Aulas que se muestran en el select del formulario,
  // filtradas por IED y grado escogidos en el form
  const aulasForForm = useMemo(() => {
    return aulas.filter((aula) => {
      const sede = sedes.find((s) => s.id_sede === aula.id_sede);
      if (!sede) return false;

      if (formIedId && sede.id_ied.toString() !== formIedId) return false;
      if (formGrade && aula.grado.toString() !== formGrade) return false;

      return true;
    });
  }, [aulas, sedes, formIedId, formGrade]);

  /* ========= Crear estudiante + matrícula ========= */

  const resetForm = () => {
    setDocEstudiante("");
    setTipoDoc("");
    setNombre1("");
    setNombre2("");
    setApellido1("");
    setApellido2("");
    setSexo("");
    setCorreoAcudiente("");
    setTelefonoAcudiente("");
    setFormIedId("");
    setFormGrade("");
    setFormAulaId("");
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const docNum = Number(docEstudiante);
    if (!docEstudiante || Number.isNaN(docNum)) {
      setError("El documento del estudiante debe ser numérico.");
      return;
    }
    if (!tipoDoc) {
      setError("Debes seleccionar un tipo de documento.");
      return;
    }
    if (!nombre1 || !apellido1) {
      setError("Nombre1 y Apellido1 son obligatorios.");
      return;
    }
    if (!sexo) {
      setError("Debes seleccionar el sexo del estudiante.");
      return;
    }
    if (!correoAcudiente || !telefonoAcudiente) {
      setError("Correo y teléfono del acudiente son obligatorios.");
      return;
    }
    if (!formAulaId) {
      setError("Debes seleccionar un aula para matricular al estudiante.");
      return;
    }

    const studentPayload = {
      doc_estudiante: docNum,
      tipo_doc: tipoDoc,
      nombre1,
      nombre2: nombre2 || null,
      apellido1,
      apellido2: apellido2 || null,
      sexo,
      correo_acudiente: correoAcudiente,
      telefono_acudiente: telefonoAcudiente,
    };

    try {
      // 1) Crear estudiante
      const resEst = await fetch(`${API_BASE_URL}/api/estudiantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentPayload),
      });

      const bodyEst = await resEst.json().catch(() => ({}));
      console.log("[CREATE ESTUDIANTE] status:", resEst.status, bodyEst);

      if (!resEst.ok) {
        throw new Error(bodyEst.message || "Error al crear el estudiante");
      }

      // 2) Crear matrícula ligada al aula seleccionada
      const idAulaNum = Number(formAulaId);
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      const resMat = await fetch(`${API_BASE_URL}/api/matriculas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_aula: idAulaNum,
          doc_estudiante: docNum,
          fecha_inicio: today,
          fecha_fin: null,
        }),
      });

      const bodyMat = await resMat.json().catch(() => ({}));
      console.log("[CREATE MATRICULA] status:", resMat.status, bodyMat);

      if (!resMat.ok) {
        throw new Error(bodyMat.message || "Error al crear la matrícula");
      }

      // 3) Recargar la tabla con el nuevo estudiante
      await loadStudents();

      // Cerrar modal y limpiar
      resetForm();
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al crear estudiante y matrícula");
    }
  };

  /* ========= Render ========= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Gestión de Estudiantes</h2>
          <p className="text-gray-600 mt-1">
            Administrar estudiantes del programa GLOBALENGLISH
          </p>
          {error && (
            <p className="text-sm text-red-500 mt-2">
              {error}
            </p>
          )}
        </div>

        {/* Dialog: Nuevo Estudiante */}
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
              <DialogDescription>
                Ingrese la información del estudiante y el aula donde se matriculará.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleCreateStudent}>
              {/* Documento */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Documento</Label>
                  <Select
                    value={tipoDoc}
                    onValueChange={setTipoDoc}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((dt) => (
                        <SelectItem key={dt.code} value={dt.code}>
                          {dt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Número de Documento</Label>
                  <Input
                    value={docEstudiante}
                    onChange={(e) => setDocEstudiante(e.target.value)}
                    placeholder="1234567890"
                    required
                  />
                </div>
              </div>

              {/* Nombres y apellidos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primer Nombre</Label>
                  <Input
                    value={nombre1}
                    onChange={(e) => setNombre1(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Segundo Nombre (opcional)</Label>
                  <Input
                    value={nombre2}
                    onChange={(e) => setNombre2(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primer Apellido</Label>
                  <Input
                    value={apellido1}
                    onChange={(e) => setApellido1(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Segundo Apellido (opcional)</Label>
                  <Input
                    value={apellido2}
                    onChange={(e) => setApellido2(e.target.value)}
                  />
                </div>
              </div>

              {/* Sexo */}
              <div className="space-y-2">
                <Label>Sexo</Label>
                <Select
                  value={sexo}
                  onValueChange={(v) => setSexo(v as "M" | "F")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Datos del acudiente */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Correo Acudiente</Label>
                  <Input
                    type="email"
                    value={correoAcudiente}
                    onChange={(e) => setCorreoAcudiente(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono Acudiente</Label>
                  <Input
                    value={telefonoAcudiente}
                    onChange={(e) => setTelefonoAcudiente(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Detalles de matrícula: IED, grado, aula */}
              <div className="border-t pt-4 space-y-4">
                <p className="font-medium text-sm">
                  Detalles de matrícula (para filtros de IED y grado)
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Institución (IED)</Label>
                    <Select
                      value={formIedId}
                      onValueChange={(v) => {
                        setFormIedId(v);
                        setFormAulaId("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione institución" />
                      </SelectTrigger>
                      <SelectContent>
                        {ieds.map((ied) => (
                          <SelectItem
                            key={ied.id_ied}
                            value={ied.id_ied.toString()}
                          >
                            {ied.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Grado</Label>
                    <Select
                      value={formGrade}
                      onValueChange={(v) => {
                        setFormGrade(v);
                        setFormAulaId("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione grado" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADES.map((g) => (
                          <SelectItem key={g} value={g.toString()}>
                            {g}º Grado
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Aula</Label>
                  <Select
                    value={formAulaId}
                    onValueChange={setFormAulaId}
                    disabled={!formIedId || !formGrade}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione aula" />
                    </SelectTrigger>
                    <SelectContent>
                      {aulasForForm.map((aula) => {
                        const sede = sedes.find(
                          (s) => s.id_sede === aula.id_sede
                        );
                        const ied = sede
                          ? ieds.find((i) => i.id_ied === sede.id_ied)
                          : undefined;
                        return (
                          <SelectItem
                            key={aula.id_aula}
                            value={aula.id_aula.toString()}
                          >
                            {ied ? `${ied.nombre} - ` : ""}
                            Grado {aula.grado} (Aula #{aula.id_aula})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Solo se muestran aulas que coinciden con la IED y el grado
                    seleccionados.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar Estudiante</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Institución (IED)</Label>
              <Select
                value={filterIed}
                onValueChange={setFilterIed}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las instituciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las instituciones</SelectItem>
                  {ieds.map((ied) => (
                    <SelectItem
                      key={ied.id_ied}
                      value={ied.id_ied.toString()}
                    >
                      {ied.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Grado</Label>
              <Select
                value={filterGrade}
                onValueChange={setFilterGrade}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los grados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grados</SelectItem>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g.toString()}>
                      {g}º Grado
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de estudiantes */}
      <Card>
        <CardHeader>
          <CardTitle>Estudiantes Registrados</CardTitle>
          <CardDescription>
            {loadingStudents
              ? "Cargando estudiantes..."
              : `${filteredStudents.length} estudiante(s) encontrados`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Nombres</TableHead>
                  <TableHead>Apellidos</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Institución</TableHead>
                  <TableHead>Grado</TableHead>
                  <TableHead>Aula</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((st) => (
                  <TableRow key={st.doc_estudiante}>
                    <TableCell>
                      <div className="text-sm">
                        <div>{st.tipo_doc}</div>
                        <div className="text-gray-600">
                          {st.doc_estudiante}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {st.nombre1}
                      {st.nombre2 ? ` ${st.nombre2}` : ""}
                    </TableCell>
                    <TableCell>
                      {st.apellido1}
                      {st.apellido2 ? ` ${st.apellido2}` : ""}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {st.sexo === "M" ? "Masculino" : "Femenino"}
                      </Badge>
                    </TableCell>
                    <TableCell>{st.nombre_ied ?? "Sin institución"}</TableCell>
                    <TableCell>
                      {st.grado != null ? (
                        <Badge variant="outline">Grado {st.grado}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {st.id_aula != null ? `#${st.id_aula}` : "Sin aula"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : !loadingStudents ? (
            <div className="text-center py-12 text-gray-500">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No se encontraron estudiantes con los filtros seleccionados</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
