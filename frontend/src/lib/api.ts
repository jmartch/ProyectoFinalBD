// src/lib/api.ts

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// Debe coincidir con app.use('/api/registro-tutor', ...)
const REGISTRO_TUTOR_PATH = "/api/registro-tutor";

/* --------------------------------------------------
 * IED
 * -------------------------------------------------- */

export interface IED {
  id_ied: number;
  nombre: string;
  telefono: string;
  duracion: string | null;
  hora_inicio: string | null;
  hora_fin: string | null;
  jornada: string | null;
}

export async function fetchIEDs(): Promise<IED[]> {
  const res = await fetch(`${API_BASE_URL}/api/ieds`);
  if (!res.ok) throw new Error("Error al obtener IED");
  return res.json();
}

export async function createIED(data: {
  nombre: string;
  telefono: string;
  duracion: string;
  hora_inicio: string;
  hora_fin: string;
  jornada: string;
}): Promise<IED> {
  const res = await fetch(`${API_BASE_URL}/api/ieds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    throw new Error(body.message || "Error al crear IED");
  }
  return body.data as IED;
}

/* --------------------------------------------------
 * SEDES
 * -------------------------------------------------- */

export interface Sede {
  id_sede: number;
  id_ied: number;
  direccion: string;
  tipo: string;
}

export async function fetchSedes(params?: {
  id_ied?: number | string;
}): Promise<Sede[]> {
  const qs = new URLSearchParams();
  if (params?.id_ied) qs.append("iedId", String(params.id_ied));

  const url = `${API_BASE_URL}/api/sedes${
    qs.toString() ? `?${qs.toString()}` : ""
  }`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener sedes");
  return res.json();
}

/* --------------------------------------------------
 * PROGRAMAS
 * -------------------------------------------------- */

export interface Programa {
  id_programa: number;
  nombre_programa: string;
}

export async function fetchProgramas(): Promise<Programa[]> {
  const res = await fetch(`${API_BASE_URL}/api/programas`);
  if (!res.ok) throw new Error("Error al obtener programas");
  return res.json();
}

/* --------------------------------------------------
 * AULAS
 * -------------------------------------------------- */

export interface Aula {
  id_aula: number;
  id_sede: number | null;
  id_programa: number | null;
  grado: number;
}

export async function fetchAulas(): Promise<Aula[]> {
  const res = await fetch(`${API_BASE_URL}/api/aulas`);
  if (!res.ok) throw new Error("Error al obtener aulas");
  return res.json();
}

export async function createAula(data: {
  id_sede: number;
  id_programa: number;
  grado: number;
}): Promise<Aula> {
  const res = await fetch(`${API_BASE_URL}/api/aulas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    throw new Error(body.message || "Error al crear el aula");
  }

  return body.data as Aula;
}

/* --------------------------------------------------
 * ESTUDIANTES
 * -------------------------------------------------- */

export interface EstudianteBase {
  doc_estudiante: number;
  tipo_doc: string;
  nombre1: string;
  nombre2: string | null;
  apellido1: string;
  apellido2: string | null;
  sexo: string;
  correo_acudiente: string;
  telefono_acudiente: string;
}

export interface EstudianteDetalle extends EstudianteBase {
  id_aula: number | null;
  grado: number | null;
  id_sede: number | null;
  direccion: string | null;
  tipo_sede: string | null;
  id_ied: number | null;
  nombre_ied: string | null;
}

// GET /api/estudiantes/detalle?id_ied=&grado=
export async function fetchEstudiantesDetalle(params?: {
  id_ied?: number | string;
  grado?: number | string;
}): Promise<EstudianteDetalle[]> {
  const qs = new URLSearchParams();
  if (params?.id_ied) qs.append("id_ied", String(params.id_ied));
  if (params?.grado) qs.append("grado", String(params.grado));

  const url = `${API_BASE_URL}/api/estudiantes/detalle${
    qs.toString() ? `?${qs.toString()}` : ""
  }`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener los estudiantes");
  return res.json();
}

export interface CreateEstudianteFullInput {
  doc_estudiante: string;
  tipo_doc: string;
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  sexo: string;
  correo_acudiente: string;
  telefono_acudiente: string;
  id_aula: number;
  fecha_inicio: string; // 'YYYY-MM-DD'
}

// POST /api/estudiantes/full
export async function createEstudianteFull(
  input: CreateEstudianteFullInput
): Promise<EstudianteDetalle> {
  const res = await fetch(`${API_BASE_URL}/api/estudiantes/full`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    throw new Error(body.message || "Error al crear el estudiante");
  }

  return body.data as EstudianteDetalle;
}

/* --------------------------------------------------
 * FUNCIONARIOS + HELPERS PARA TUTORES
 * -------------------------------------------------- */

export interface CreateFuncionarioFromFormInput {
  tipo_doc: string; // CC, TI, CE, PE
  doc: string; // documento del funcionario
  nombre1: string;
  nombre2: string | null;
  apellido1: string;
  apellido2: string | null;
  correo: string;
  telefono: string;
  fecha_contrato: string; // YYYY-MM-DD
  shouldCreateTutor?: boolean;
}

// Crea FUNCIONARIO y opcionalmente lo registra como TUTOR
export async function createFuncionarioFromForm(
  input: CreateFuncionarioFromFormInput
) {
  const {
    tipo_doc,
    doc,
    nombre1,
    nombre2,
    apellido1,
    apellido2,
    correo,
    telefono,
    fecha_contrato,
    shouldCreateTutor,
  } = input;

  const payload = {
    doc_funcionario: Number(doc),
    tipo_doc,
    nombre1,
    nombre2,
    apellido1,
    apellido2,
    sexo: "M", // TODO: campo sexo en UI si quieres
    correo,
    telefono,
    fecha_contrato,
  };

  const res = await fetch(`${API_BASE_URL}/api/funcionarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({} as any));

  // Caso especial: ya existe el funcionario (409)
  if (!res.ok) {
    const msg: string = body?.message || "";

    if (res.status === 409 && msg.includes("Ya existe un funcionario")) {
      // 👉 El funcionario ya está en BD. Si queremos crear tutor igual:
      if (shouldCreateTutor) {
        await createTutorFromFuncionario(payload.doc_funcionario);
      }
      // Devolvemos algo "tipo éxito" para que el front no reviente
      return { doc_funcionario: payload.doc_funcionario, yaExistia: true };
    }

    // otros errores sí se lanzan
    throw new Error(msg || "Error al crear funcionario");
  }

  // Si se creó bien el funcionario y queremos además crear tutor
  if (shouldCreateTutor) {
    await createTutorFromFuncionario(payload.doc_funcionario);
  }

  return body.data;
}

/* --------------------------------------------------
 * TUTORES CRUD BÁSICO (tabla TUTOR)
 * -------------------------------------------------- */

export interface TutorRow {
  id_tutor: number;
}

export async function fetchTutores(): Promise<TutorRow[]> {
  const res = await fetch(`${API_BASE_URL}/api/tutores`);
  if (!res.ok) {
    throw new Error("Error al obtener tutores");
  }
  return res.json();
}

// POST /api/tutores -> crea fila en TUTOR (id_tutor AUTO_INCREMENT)
export async function createTutor(): Promise<TutorRow> {
  const res = await fetch(`${API_BASE_URL}/api/tutores`, {
    method: "POST",
  });

  const body = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    throw new Error(body.message || "Error al crear el tutor");
  }

  return body.data as TutorRow;
}

export async function deleteTutor(id_tutor: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/tutores/${id_tutor}`, {
    method: "DELETE",
  });

  const body = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    throw new Error(body.message || "Error al eliminar el tutor");
  }
}

/**
 * Registrar a un FUNCIONARIO como TUTOR:
 *  1. Crea una fila en TUTOR (id_tutor).
 *  2. Crea una fila en REGISTRO_TUTOR con doc_funcionario + id_tutor + fecha_asignacion.
 */
export async function createTutorFromFuncionario(
  doc_funcionario: number
) {
  // 1) Crear fila en TUTOR y obtener id_tutor
  const { id_tutor } = await createTutor();

  // 2) Registrar en REGISTRO_TUTOR
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const res = await fetch(`${API_BASE_URL}${REGISTRO_TUTOR_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      doc_funcionario,
      id_tutor,
      fecha_asignacion: today,
    }),
  });

  const body = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    throw new Error(body.message || "Error al registrar tutor");
  }

  return body.data;
}

/* --------------------------------------------------
 * TUTORES "FULL" + AULAS Y ESTUDIANTES
 * -------------------------------------------------- */

export interface TutorFull {
  id_tutor: number;
  doc_funcionario: number;
  tipo_doc: string;
  nombre1: string;
  nombre2: string | null;
  apellido1: string;
  apellido2: string | null;
  sexo: string;
  correo: string;
  telefono: string;
  fecha_contrato: string;
  username: string | null;
  rol: string | null;
  aulas_count: number;
  estudiantes_count: number;
}

export interface TutorAulaEstudiantes {
  id_aula: number;
  grado: number;
  id_sede: number | null;
  direccion_sede: string | null;
  tipo_sede: string | null;
  id_ied: number | null;
  nombre_ied: string | null;
  estudiantes: {
    doc_estudiante: number;
    tipo_doc: string;
    nombre1: string;
    nombre2: string | null;
    apellido1: string;
    apellido2: string | null;
    sexo: string;
    correo_acudiente: string;
    telefono_acudiente: string;
  }[];
}

// GET /api/tutores/full
export async function fetchTutoresFull(): Promise<TutorFull[]> {
  const res = await fetch(`${API_BASE_URL}/api/tutores/full`);
  if (!res.ok) throw new Error("Error al obtener tutores");
  return res.json();
}

// GET /api/tutores/:doc_funcionario/aulas-estudiantes
export async function fetchTutorAulasYEstudiantes(
  doc_funcionario: number | string
): Promise<TutorAulaEstudiantes[]> {
  const res = await fetch(
    `${API_BASE_URL}/api/tutores/${doc_funcionario}/aulas-estudiantes`
  );
  const body = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    throw new Error(body.message || "Error al obtener aulas y estudiantes");
  }

  return (body.aulas || []) as TutorAulaEstudiantes[];
}

/* --------------------------------------------------
 * ASIGNAR AULA A TUTOR (AULA_TUTOR)
 * -------------------------------------------------- */

// POST /api/aula-tutor
export async function assignAulaToTutor(data: {
  id_tutor: number;
  id_aula: number;
  fecha_asignacion: string; // 'YYYY-MM-DD'
}): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/aula-tutor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    throw new Error(body.message || "Error al asignar aula al tutor");
  }
}
