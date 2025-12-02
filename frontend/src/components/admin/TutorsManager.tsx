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
import { Badge } from "../ui/badge";
import { Plus, UserCog, Key, Users, School } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";

// ================== TIPOS LOCALES (MOCK) ==================

export interface TutorFull {
  doc_funcionario: number;
  tipo_doc: string;
  nombre1: string;
  nombre2?: string | null;
  apellido1: string;
  apellido2?: string | null;
  sexo: "M" | "F" | string;
  correo: string;
  telefono: string;
  fecha_contrato: string;
  id_tutor?: number | null;
  username?: string | null;
}

export interface Aula {
  id_aula: number;
  grado: number;
  nombre_ied?: string;
  direccion_sede?: string;
}

export interface TutorAulaEstudiantes {
  id_aula: number;
  grado: number;
  nombre_ied?: string;
  direccion_sede?: string;
  estudiantes: {
    doc_estudiante: number;
    tipo_doc: string;
    nombre1: string;
    nombre2?: string | null;
    apellido1: string;
    apellido2?: string | null;
    sexo: string;
    correo_acudiente: string;
    telefono_acudiente: string;
  }[];
}

// ================== MOCK DATA ==================

const MOCK_FUNCIONARIOS: TutorFull[] = [
  {
    doc_funcionario: 123456,
    tipo_doc: "CC",
    nombre1: "María",
    nombre2: "Isabel",
    apellido1: "Gutiérrez",
    apellido2: "González",
    sexo: "F",
    correo: "maria.gutierrez@example.com",
    telefono: "3001112233",
    fecha_contrato: "2024-01-15",
    id_tutor: 123456,
    username: "maria.tutor",
  },
  {
    doc_funcionario: 789012,
    tipo_doc: "CC",
    nombre1: "Carlos",
    nombre2: "Andrés",
    apellido1: "Pérez",
    apellido2: "López",
    sexo: "M",
    correo: "carlos.perez@example.com",
    telefono: "3004445566",
    fecha_contrato: "2024-02-10",
    id_tutor: null,
    username: null,
  },
  {
    doc_funcionario: 345678,
    tipo_doc: "CC",
    nombre1: "Lucía",
    nombre2: "Isabel",
    apellido1: "Montoya",
    apellido2: "",
    sexo: "F",
    correo: "lucia.montoya@example.com",
    telefono: "3007778899",
    fecha_contrato: "2024-03-01",
    id_tutor: 345678,
    username: null,
  },
];

const MOCK_AULAS: Aula[] = [
  { id_aula: 1, grado: 3, nombre_ied: "IED San Martín", direccion_sede: "Cra 1 #10-20" },
  { id_aula: 2, grado: 4, nombre_ied: "IED El Prado", direccion_sede: "Calle 50 #43-21" },
  { id_aula: 3, grado: 5, nombre_ied: "IED Miramar", direccion_sede: "Av. Circunvalar" },
];

// asignaciones iniciales: id_tutor → ids de aula
const MOCK_AULAS_POR_TUTOR: Record<number, number[]> = {
  123456: [1, 2],
  345678: [3],
};

const MOCK_ESTUDIANTES_BASE = [
  {
    doc_estudiante: 1001,
    tipo_doc: "TI",
    nombre1: "Juan",
    nombre2: "David",
    apellido1: "Ramírez",
    apellido2: "Suarez",
    sexo: "M",
    correo_acudiente: "acudiente.juan@example.com",
    telefono_acudiente: "3011234567",
  },
  {
    doc_estudiante: 1002,
    tipo_doc: "TI",
    nombre1: "Ana",
    nombre2: "María",
    apellido1: "López",
    apellido2: "Crespo",
    sexo: "F",
    correo_acudiente: "acudiente.ana@example.com",
    telefono_acudiente: "3029876543",
  },
  {
    doc_estudiante: 1003,
    tipo_doc: "TI",
    nombre1: "Pedro",
    nombre2: "",
    apellido1: "García",
    apellido2: "Ríos",
    sexo: "M",
    correo_acudiente: "acudiente.pedro@example.com",
    telefono_acudiente: "3035556677",
  },
];

// Pequeño catálogo local de tipos de documento (para el formulario)
const documentTypes = [
  { id: "TI", code: "TI", name: "Tarjeta de Identidad" },
  { id: "CC", code: "CC", name: "Cédula de Ciudadanía" },
  { id: "CE", code: "CE", name: "Cédula de Extranjería" },
  { id: "PE", code: "PE", name: "Permiso Especial" },
];

export function TutorsManager() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] =
    useState(false);

  // Lista de tutores/personal (mock)
  const [tutores, setTutores] = useState<TutorFull[]>([]);
  const [loadingTutores, setLoadingTutores] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- Formularios: contratar personal ----------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [docType, setDocType] = useState<string>("");
  const [docNumber, setDocNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sex, setSex] = useState<string>(""); // M / F
  const [role, setRole] = useState<string>("TUTOR"); // TUTOR / ADMINISTRATIVO
  const [hiredDate, setHiredDate] = useState<string>("");

  // ---------- Credenciales ----------
  const [selectedTutorForCredentials, setSelectedTutorForCredentials] =
    useState<TutorFull | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credentialsError, setCredentialsError] = useState<string | null>(
    null,
  );
  const [savingCredentials, setSavingCredentials] = useState(false);

  // ---------- Aulas & Estudiantes ----------
  const [isAulasDialogOpen, setIsAulasDialogOpen] = useState(false);
  const [selectedTutorForAulas, setSelectedTutorForAulas] =
    useState<TutorFull | null>(null);
  const [aulasEstudiantes, setAulasEstudiantes] = useState<
    TutorAulaEstudiantes[]
  >([]);
  const [loadingAulas, setLoadingAulas] = useState(false);
  const [errorAulas, setErrorAulas] = useState<string | null>(null);

  // ---------- Asignar aula ----------
  const [isAssignAulaDialogOpen, setIsAssignAulaDialogOpen] =
    useState(false);
  const [selectedTutorForAssign, setSelectedTutorForAssign] =
    useState<TutorFull | null>(null);
  const [aulasDisponibles, setAulasDisponibles] = useState<Aula[]>([]);
  const [selectedAulaId, setSelectedAulaId] = useState<string>("");

  // Estado de asignaciones (mock) id_tutor → ids de aula
  const [aulasPorTutor, setAulasPorTutor] = useState<
    Record<number, number[]>
  >({});

  // ================== Cargar datos MOCK al montar ==================
  useEffect(() => {
    setLoadingTutores(true);
    try {
      // simulamos fetchTutoresFull
      setTutores(MOCK_FUNCIONARIOS);
      setAulasDisponibles(MOCK_AULAS);
      setAulasPorTutor({ ...MOCK_AULAS_POR_TUTOR });
    } catch (err: any) {
      console.error(err);
      setError("Error al cargar datos locales (mock)");
    } finally {
      setLoadingTutores(false);
    }
  }, []);

  // Helper para construir nombre completo
  const getNombreCompleto = (t: TutorFull) => {
    const partes = [
      t.nombre1,
      t.nombre2 || "",
      t.apellido1,
      t.apellido2 || "",
    ]
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    return partes;
  };

  // Helper para rol inferido según si tiene registro en la tabla TUTOR
  const getRol = (t: TutorFull) =>
    t.id_tutor ? "Tutor" : "Administrativo";

  const totalTutores = tutores.filter((t) => getRol(t) === "Tutor").length;
  const totalAdministrativos = tutores.filter(
    (t) => getRol(t) === "Administrativo",
  ).length;

  const soloTutores = tutores.filter((t) => getRol(t) === "Tutor");

  // ================== Contratar nuevo personal (SOLO STATE) ==================
  const handleSubmitNuevoPersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !docType ||
      !docNumber.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !hiredDate ||
      !sex
    ) {
      setError("Por favor complete todos los campos obligatorios.");
      return;
    }

    // Separamos nombre1 / nombre2 y apellido1 / apellido2
    const [nombre1, ...restNombres] = firstName.trim().split(" ");
    const nombre2 = restNombres.join(" ") || null;
    const [apellido1, ...restApellidos] = lastName.trim().split(" ");
    const apellido2 = restApellidos.join(" ") || null;

    const doc = Number(docNumber);

    const nuevo: TutorFull = {
      doc_funcionario: doc,
      tipo_doc: docType,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      sexo: sex,
      correo: email,
      telefono: phone,
      fecha_contrato: hiredDate,
      id_tutor: role === "TUTOR" ? doc : null,
      username: null,
    };

    setTutores((prev) => [...prev, nuevo]);

    // Inicializamos sus aulas vacías si es tutor
    if (role === "TUTOR") {
      setAulasPorTutor((prev) => ({
        ...prev,
        [doc]: prev[doc] ?? [],
      }));
    }

    // Limpiar formulario
    setFirstName("");
    setLastName("");
    setDocType("");
    setDocNumber("");
    setEmail("");
    setPhone("");
    setSex("");
    setRole("TUTOR");
    setHiredDate("");
    setIsAddDialogOpen(false);
  };

  // ================== Ver aulas & estudiantes (MOCK) ==================
  const handleOpenAulasDialog = async (tutor: TutorFull) => {
    setSelectedTutorForAulas(tutor);
    setIsAulasDialogOpen(true);
    setErrorAulas(null);
    setLoadingAulas(true);

    try {
      const idTutor = tutor.id_tutor ?? tutor.doc_funcionario;
      const idsAulas = aulasPorTutor[idTutor] || [];

      const data: TutorAulaEstudiantes[] = idsAulas.map((id_aula, idx) => {
        const aula = MOCK_AULAS.find((a) => a.id_aula === id_aula);
        if (!aula) return null;

        // asignamos 2 estudiantes de ejemplo a cada aula
        const base1 = MOCK_ESTUDIANTES_BASE[(idx * 2) % MOCK_ESTUDIANTES_BASE.length];
        const base2 =
          MOCK_ESTUDIANTES_BASE[(idx * 2 + 1) % MOCK_ESTUDIANTES_BASE.length];

        return {
          id_aula: aula.id_aula,
          grado: aula.grado,
          nombre_ied: aula.nombre_ied,
          direccion_sede: aula.direccion_sede,
          estudiantes: [base1, base2],
        };
      }).filter((x): x is TutorAulaEstudiantes => x !== null);

      setAulasEstudiantes(data);
    } catch (err: any) {
      console.error(err);
      setErrorAulas("Error al cargar datos locales (mock) de aulas");
    } finally {
      setLoadingAulas(false);
    }
  };

  // ================== Asignar aula a tutor (solo mock/state) ==================
  const handleOpenAssignAulaDialog = async (tutor: TutorFull) => {
    setSelectedTutorForAssign(tutor);
    setIsAssignAulaDialogOpen(true);
    setSelectedAulaId("");
    setError(null);
  };

  const handleSubmitAssignAula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutorForAssign || !selectedAulaId) {
      setError("Debe seleccionar un aula");
      return;
    }

    const idTutor = selectedTutorForAssign.id_tutor ?? selectedTutorForAssign.doc_funcionario;
    const idAula = Number(selectedAulaId);

    setAulasPorTutor((prev) => {
      const actuales = prev[idTutor] || [];
      if (actuales.includes(idAula)) {
        return prev; // ya asignada
      }
      return {
        ...prev,
        [idTutor]: [...actuales, idAula],
      };
    });

    setIsAssignAulaDialogOpen(false);
    setSelectedTutorForAssign(null);
    setSelectedAulaId("");
  };

  // ================== Guardar credenciales (solo mock/state) ==================
  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialsError(null);

    if (!selectedTutorForCredentials) return;

    if (!username.trim() || !password.trim()) {
      setCredentialsError("Usuario y contraseña son obligatorios.");
      return;
    }

    try {
      setSavingCredentials(true);

      setTutores((prev) =>
        prev.map((t) =>
          t.doc_funcionario === selectedTutorForCredentials.doc_funcionario
            ? { ...t, username: t.username || username.trim() }
            : t,
        ),
      );

      setIsCredentialsDialogOpen(false);
      setUsername("");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      setCredentialsError("Error al guardar credenciales (mock)");
    } finally {
      setSavingCredentials(false);
    }
  };

  // ================== Render ==================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Gestión de Tutores</h2>
          <p className="text-gray-600 mt-1">
            Administrar tutores y personal del programa
          </p>
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Asignar Tutor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Contratar Nuevo Personal
              </DialogTitle>
              <DialogDescription>
                Ingrese la información de la persona a contratar
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={handleSubmitNuevoPersonal}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombres</Label>
                  <Input
                    id="firstName"
                    placeholder="María"
                    required
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    placeholder="González López"
                    required
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="docType">
                    Tipo de Documento
                  </Label>
                  <Select
                    value={docType}
                    onValueChange={setDocType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((dt) => (
                        <SelectItem key={dt.id} value={dt.id}>
                          {dt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="docNumber">
                    Número de Documento
                  </Label>
                  <Input
                    id="docNumber"
                    placeholder="1234567890"
                    required
                    value={docNumber}
                    onChange={(e) =>
                      setDocNumber(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tutor@globalenglish.edu"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="3001234567"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sex">Sexo</Label>
                  <Select
                    value={sex}
                    onValueChange={setSex}
                  >
                    <SelectTrigger id="sex">
                      <SelectValue placeholder="Seleccione sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="F">
                        Femenino
                      </SelectItem>
                      <SelectItem value="M">
                        Masculino
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol/Perfil</Label>
                  <Select
                    value={role}
                    onValueChange={setRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TUTOR">
                        Tutor
                      </SelectItem>
                      <SelectItem value="ADMINISTRATIVO">
                        Administrativo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hiredDate">
                  Fecha de Contratación
                </Label>
                <Input
                  id="hiredDate"
                  type="date"
                  required
                  value={hiredDate}
                  onChange={(e) =>
                    setHiredDate(e.target.value)
                  }
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Contratar Personal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="tutors">
        <TabsList>
          <TabsTrigger value="tutors">
            Personal del Programa
          </TabsTrigger>
          <TabsTrigger value="credentials">
            Tutores Contratados
          </TabsTrigger>
        </TabsList>

        {/* ================== TAB: PERSONAL DEL PROGRAMA ================== */}
        <TabsContent value="tutors" className="space-y-6">
          {/* Tabla de Personal */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Contratado</CardTitle>
              <CardDescription>
                {loadingTutores
                  ? "Cargando tutores..."
                  : `${tutores.length} personas registradas`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Sexo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Fecha Contratación</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tutores.map((tutor) => (
                    <TableRow
                      key={String(tutor.doc_funcionario)}
                    >
                      <TableCell>
                        {getNombreCompleto(tutor)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{tutor.tipo_doc}</div>
                          <div className="text-gray-600">
                            {tutor.doc_funcionario}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{tutor.sexo}</TableCell>
                      <TableCell>{tutor.correo}</TableCell>
                      <TableCell>{tutor.telefono}</TableCell>
                      <TableCell>
                        {tutor.fecha_contrato
                          ? new Date(
                              tutor.fecha_contrato,
                            ).toLocaleDateString("es-CO")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getRol(tutor)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getRol(tutor) === "Tutor" ? (
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleOpenAulasDialog(tutor)
                              }
                            >
                              <Users className="w-4 h-4 mr-1" />
                              Ver aulas / estudiantes
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleOpenAssignAulaDialog(
                                  tutor,
                                )
                              }
                            >
                              <School className="w-4 h-4 mr-1" />
                              Asignar aula
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">
                            No aplica
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {!loadingTutores && tutores.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <UserCog className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No hay personal registrado</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumen de Personal */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl">
                    {totalTutores}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Tutores
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl">
                    {totalAdministrativos}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Administrativos
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl">0</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Administradores
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================== TAB: TUTORES CONTRATADOS (CREDENCIALES) ================== */}
        <TabsContent value="credentials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asignar tutor(es)</CardTitle>
              <CardDescription>
                Gestión de credenciales de acceso para tutores
                contratados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Última Conexión</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {soloTutores.map((tutor) => (
                    <TableRow
                      key={String(tutor.doc_funcionario)}
                    >
                      <TableCell>
                        {getNombreCompleto(tutor)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{tutor.tipo_doc}</div>
                          <div className="text-gray-600">
                            {tutor.doc_funcionario}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {tutor.username || "-"}
                      </TableCell>
                      <TableCell>
                        {/* No tenemos lastLogin todavía */}
                        {tutor.username ? "N/A" : "Nunca"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tutor.username
                              ? "default"
                              : "secondary"
                          }
                        >
                          {tutor.username
                            ? "Configurado"
                            : "Pendiente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTutorForCredentials(
                                tutor,
                              );
                              setUsername(tutor.username || "");
                              setPassword("");
                              setCredentialsError(null);
                              setIsCredentialsDialogOpen(true);
                            }}
                          >
                            <Key className="w-4 h-4 mr-2" />
                            {tutor.username
                              ? "Editar"
                              : "Configurar"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Credentials Dialog */}
          <Dialog
            open={isCredentialsDialogOpen}
            onOpenChange={setIsCredentialsDialogOpen}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Credenciales de Tutor</DialogTitle>
                <DialogDescription>
                  Información de acceso para el tutor
                </DialogDescription>
              </DialogHeader>
              {selectedTutorForCredentials && (
                <form
                  className="space-y-4"
                  onSubmit={handleSubmitCredentials}
                >
                  {credentialsError && (
                    <p className="text-sm text-red-500">
                      {credentialsError}
                    </p>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700">
                      Tutor:{" "}
                      {getNombreCompleto(
                        selectedTutorForCredentials,
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Doc:{" "}
                      {
                        selectedTutorForCredentials.doc_funcionario
                      }{" "}
                      ({selectedTutorForCredentials.tipo_doc})
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">
                        Nombre de Usuario
                      </Label>
                      <Input
                        id="username"
                        placeholder="tutor123"
                        required
                        disabled={
                          !!selectedTutorForCredentials.username
                        }
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        Contraseña
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        required
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setIsCredentialsDialogOpen(false)
                      }
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={savingCredentials}>
                      {savingCredentials
                        ? "Guardando..."
                        : "Guardar Credenciales"}
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>

      {/* ========== DIALOG: Aulas & Estudiantes del tutor ========== */}
      <Dialog
        open={isAulasDialogOpen}
        onOpenChange={setIsAulasDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Aulas y estudiantes a cargo
            </DialogTitle>
            <DialogDescription>
              {selectedTutorForAulas
                ? `Tutor: ${getNombreCompleto(
                    selectedTutorForAulas,
                  )}`
                : "Seleccione un tutor"}
            </DialogDescription>
          </DialogHeader>
          {errorAulas && (
            <p className="text-sm text-red-500 mb-2">
              {errorAulas}
            </p>
          )}
          {loadingAulas ? (
            <p className="text-sm text-gray-600">
              Cargando aulas y estudiantes...
            </p>
          ) : aulasEstudiantes.length === 0 ? (
            <p className="text-sm text-gray-600">
              Este tutor no tiene aulas asignadas o estudiantes
              matriculados.
            </p>
          ) : (
            <div className="space-y-4">
              {aulasEstudiantes.map((aula) => (
                <Card key={aula.id_aula} className="border-blue-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          Aula #{aula.id_aula} - Grado {aula.grado}
                        </CardTitle>
                        <CardDescription>
                          {aula.nombre_ied || "IED"}{" "}
                          {aula.direccion_sede &&
                            `- ${aula.direccion_sede}`}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {aula.estudiantes.length} estudiantes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {aula.estudiantes.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No hay estudiantes matriculados en esta aula.
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Documento</TableHead>
                            <TableHead>Sexo</TableHead>
                            <TableHead>Correo Acudiente</TableHead>
                            <TableHead>Teléfono Acudiente</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {aula.estudiantes.map((est) => {
                            const nombreCompleto = [
                              est.nombre1,
                              est.nombre2 || "",
                              est.apellido1,
                              est.apellido2 || "",
                            ]
                              .join(" ")
                              .replace(/\s+/g, " ")
                              .trim();

                            return (
                              <TableRow
                                key={est.doc_estudiante}
                              >
                                <TableCell>
                                  {nombreCompleto}
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div>{est.tipo_doc}</div>
                                    <div className="text-gray-600">
                                      {est.doc_estudiante}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{est.sexo}</TableCell>
                                <TableCell>
                                  {est.correo_acudiente}
                                </TableCell>
                                <TableCell>
                                  {est.telefono_acudiente}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ========== DIALOG: Asignar aula a tutor ========== */}
      <Dialog
        open={isAssignAulaDialogOpen}
        onOpenChange={setIsAssignAulaDialogOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Asignar aula a tutor</DialogTitle>
            <DialogDescription>
              {selectedTutorForAssign
                ? `Tutor: ${getNombreCompleto(
                    selectedTutorForAssign,
                  )}`
                : "Seleccione un tutor"}
            </DialogDescription>
          </DialogHeader>
          {selectedTutorForAssign && (
            <form
              className="space-y-4"
              onSubmit={handleSubmitAssignAula}
            >
              <div className="space-y-2">
                <Label htmlFor="aula-select">Aula</Label>
                <Select
                  value={selectedAulaId}
                  onValueChange={setSelectedAulaId}
                >
                  <SelectTrigger id="aula-select">
                    <SelectValue placeholder="Seleccione un aula" />
                  </SelectTrigger>
                  <SelectContent>
                    {aulasDisponibles.map((a) => (
                      <SelectItem
                        key={a.id_aula}
                        value={String(a.id_aula)}
                      >
                        Aula #{a.id_aula} - Grado {a.grado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setIsAssignAulaDialogOpen(false)
                  }
                >
                  Cancelar
                </Button>
                <Button type="submit">Asignar Aula</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TutorsManager;
