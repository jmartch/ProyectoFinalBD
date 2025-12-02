const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import { fetchEstudiantesDetalle, type EstudianteDetalle } from './reportService';
export interface IED {
  id_ied: number;
  nombre: string;
  telefono: string;
  duracion: string;
  hora_inicio: string;
  hora_fin: string;
  jornada: string;
}

export async function fetchIEDs(): Promise<IED[]> {
  const res = await fetch(`${API_BASE_URL}/api/ieds`);  // 👈 plural
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
  const res = await fetch(`${API_BASE_URL}/api/ieds`, {  // 👈 plural
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al crear IED");
  }

  const body = await res.json();
  return body.data;
}

// 👉 Tipos para SEDE, PROGRAMA y AULA

export interface Sede {
  id_sede: number;
  id_ied: number;
  direccion: string;
  tipo: string;
}

export interface Programa {
  id_programa: number;
  nombre_programa: string;
}

export interface Aula {
  id_aula: number;
  id_sede: number;
  id_programa: number;
  grado: number;
}

// 👉 Obtener todas las sedes
export async function fetchSedes(): Promise<Sede[]> {
  const res = await fetch(`${API_BASE_URL}/api/sedes`);
  if (!res.ok) throw new Error("Error al obtener sedes");
  return res.json();
}

// 👉 Obtener todos los programas
export async function fetchProgramas(): Promise<Programa[]> {
  const res = await fetch(`${API_BASE_URL}/api/programas`);
  if (!res.ok) throw new Error("Error al obtener programas");
  return res.json();
}

// 👉 Obtener todas las aulas
export async function fetchAulas(): Promise<Aula[]> {
  const res = await fetch(`${API_BASE_URL}/api/aulas`);
  if (!res.ok) throw new Error("Error al obtener aulas");
  return res.json();
}

// 👉 Crear aula nueva
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

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al crear el aula");
  }

  return body.data as Aula;
}

// 👉 Tipos y helpers para TUTORES

export interface TutorRow {
  id_tutor: number;
}

/**
 * Obtener todos los tutores
 */
export async function fetchTutores(): Promise<TutorRow[]> {
  const res = await fetch(`${API_BASE_URL}/api/tutores`);
  if (!res.ok) {
    throw new Error("Error al obtener tutores");
  }
  return res.json();
}

/**
 * Crear un tutor vacío (solo genera id_tutor AUTO_INCREMENT)
 */
export async function createTutor(): Promise<TutorRow> {
  const res = await fetch(`${API_BASE_URL}/api/tutores`, {
    method: "POST",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al crear el tutor");
  }

  // el backend responde: { message, data: { id_tutor } }
  return body.data as TutorRow;
}

/**
 * Eliminar un tutor por id_tutor
 */
export async function deleteTutor(id_tutor: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/tutores/${id_tutor}`, {
    method: "DELETE",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al eliminar el tutor");
  }
}
/* --------------------------------------------------
 * FESTIVOS
 * -------------------------------------------------- */

export interface Festivo {
  id_festivo: number;
  descripcion: string;
  fecha: string; // 'YYYY-MM-DD'
}

// GET /api/festivos
export async function fetchFestivos(): Promise<Festivo[]> {
  const res = await fetch(`${API_BASE_URL}/api/festivos`);
  if (!res.ok) {
    throw new Error("Error al obtener festivos");
  }
  return res.json();
}

// POST /api/festivos
export async function createFestivo(input: {
  descripcion: string;
  fecha: string; // YYYY-MM-DD
}): Promise<Festivo> {
  const res = await fetch(`${API_BASE_URL}/api/festivos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al crear festivo");
  }

  // El controlador responde: { message, data: { id_festivo, descripcion, fecha } }
  return body.data as Festivo;
}

// PUT /api/festivos/:id
export async function updateFestivo(
  id_festivo: number,
  input: { descripcion: string; fecha: string }
): Promise<Festivo> {
  const res = await fetch(`${API_BASE_URL}/api/festivos/${id_festivo}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al actualizar festivo");
  }

  return body.data as Festivo;
}

// DELETE /api/festivos/:id
export async function deleteFestivo(id_festivo: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/festivos/${id_festivo}`, {
    method: "DELETE",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al eliminar festivo");
  }
}

/* --------------------------------------------------
 * MOTIVOS DE AUSENCIA
 * -------------------------------------------------- */

export interface Motivo {
  codigo: number;
  descripcion: string;
}

// GET /api/motivos
export async function fetchMotivos(): Promise<Motivo[]> {
  const res = await fetch(`${API_BASE_URL}/api/motivos`);
  if (!res.ok) {
    throw new Error("Error al obtener motivos");
  }
  return res.json();
}

// POST /api/motivos
export async function createMotivo(input: {
  descripcion: string;
}): Promise<Motivo> {
  const res = await fetch(`${API_BASE_URL}/api/motivos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al crear motivo");
  }

  return body.data as Motivo;
}

// DELETE /api/motivos/:codigo
export async function deleteMotivo(codigo: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/motivos/${codigo}`, {
    method: "DELETE",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al eliminar motivo");
  }
}

/* --------------------------------------------------
 * SEMANAS DEL PROGRAMA
 * -------------------------------------------------- */

export interface Semana {
  numero_semana: number;
  id_periodo: number;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin: string;    // YYYY-MM-DD
}

// GET /api/semanas
export async function fetchSemanas(): Promise<Semana[]> {
  const res = await fetch(`${API_BASE_URL}/api/semanas/semanas`);
  if (!res.ok) {
    throw new Error("Error al obtener semanas");
  }
  return res.json();
}

// POST /api/semanas/regenerar
export async function regenerateSemanasCalendar(input: {
  id_periodo: number;
  fecha_inicio: string;      // YYYY-MM-DD
  numero_semanas?: number;   // default: 40 en el backend
}): Promise<Semana[]> {
  const res = await fetch(`${API_BASE_URL}/api/semanas/semanas/regenerar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al regenerar calendario de semanas");
  }

  // El backend devuelve { message, data: Semana[] }
  return (body.data || []) as Semana[];
}

/* --------------------------------------------------
 * PERÍODOS ACADÉMICOS
 * -------------------------------------------------- */

export type ProgramType = "INSIDECLASSROOM" | "OUTSIDECLASSROOM" | string;

export interface Periodo {
  id_periodo: number;
  fecha_inicio: string;      // YYYY-MM-DD
  fecha_fin: string;         // YYYY-MM-DD
  id_programa: number;
  nombre_programa?: string;  // viene del JOIN con programa (opcional)
  tipo_programa?: ProgramType; // INSIDECLASSROOM / OUTSIDECLASSROOM (opcional)
}

// GET /api/periodos
export async function fetchPeriodos(): Promise<Periodo[]> {
  const res = await fetch(`${API_BASE_URL}/api/periodos/`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Error al obtener períodos");
  }
  return res.json();
}

// POST /api/periodos
export async function createPeriodo(input: {
  fecha_inicio: string;
  fecha_fin: string;
  id_programa: number;
}): Promise<Periodo> {
  const res = await fetch(`${API_BASE_URL}/api/periodos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al crear período");
  }

  // El backend que me mostraste responde:
  // { message, data: { id_periodo, fecha_inicio, fecha_fin, id_programa } }
  return body.data as Periodo;
}

// PUT /api/periodos/:id (por si luego editas desde el front)
export async function updatePeriodo(
  id_periodo: number,
  input: { fecha_inicio: string; fecha_fin: string; id_programa: number }
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/periodos/${id_periodo}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al actualizar período");
  }
}

// DELETE /api/periodos/:id
export async function deletePeriodo(id_periodo: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/periodos/${id_periodo}`, {
    method: "DELETE",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al eliminar período");
  }
}
// --------------------------------------------------
// COMPONENTES DE CALIFICACIÓN
// --------------------------------------------------

export interface Componente {
  id_componente: number;
  id_periodo: number;
  nombre: string;
  porcentaje: number;
  orden?: number;
}

// GET /api/componentes
export async function fetchComponentes(): Promise<Componente[]> {
  const res = await fetch(`${API_BASE_URL}/api/componentes`);
  if (!res.ok) {
    throw new Error("Error al obtener componentes");
  }
  return res.json();
}

// POST /api/componentes
export async function createComponente(input: {
  id_periodo: number;
  nombre: string;
  porcentaje: number;
  orden?: number;
}): Promise<Componente> {
  const res = await fetch(`${API_BASE_URL}/api/componentes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al crear componente");
  }

  // { message, data: { id_componente, id_periodo, nombre, porcentaje } }
  return body.data as Componente;
}

// PUT /api/componentes/:id
export async function updateComponente(
  id_componente: number,
  input: {
    id_periodo: number;
    nombre: string;
    porcentaje: number;
    orden?: number;
  }
): Promise<Componente> {
  const res = await fetch(`${API_BASE_URL}/api/componentes/${id_componente}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al actualizar componente");
  }

  return body.data as Componente;
}

// DELETE /api/componentes/:id
export async function deleteComponente(id_componente: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/componentes/${id_componente}`, {
    method: "DELETE",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al eliminar componente");
  }
}

/* --------------------------------------------------
 * NOTAS Y DETALLES DE NOTAS
 * -------------------------------------------------- */

export interface Nota {
  id_nota: number;
  doc_estudiante: number;
  definitiva: number;
}

export interface DetalleNota {
  id_detalle_nota: number;
  id_nota: number;
  id_componente: number;
  nota: number;
}

// GET /api/notas/estudiante/:doc_estudiante
export async function getNotaByEstudiante(doc_estudiante: number): Promise<Nota | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/notas/estudiante/${doc_estudiante}`);
    if (!res.ok) return null;
    const body = await res.json();
    return body.data || null;
  } catch (err) {
    console.error('Error fetching nota:', err);
    return null;
  }
}

// POST /api/notas
export async function createNota(input: {
  doc_estudiante: number;
  definitiva: number;
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/notas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al crear nota");
  }

  return body;
}

// GET /api/detalles-nota/:id_nota
export async function getDetallesNotaByIdNota(id_nota: number): Promise<DetalleNota[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/detalles-nota/${id_nota}`);
    if (!res.ok) return [];
    const body = await res.json();
    return (body.data || body) as DetalleNota[];
  } catch (err) {
    console.error('Error fetching detalles nota:', err);
    return [];
  }
}

// POST /api/detalles-nota
export async function saveDetalleNota(input: {
  id_nota: number;
  id_componente: number;
  nota: number;
}): Promise<DetalleNota> {
  const res = await fetch(`${API_BASE_URL}/api/detalles-nota`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al guardar detalle de nota");
  }

  return body.data as DetalleNota;
}

// GET /api/componentes/periodo/:id_periodo
export async function getComponentesByPeriodo(id_periodo: number): Promise<Componente[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/componentes?id_periodo=${id_periodo}`);
    if (!res.ok) return [];
    const body = await res.json();
    return (body.data || body) as Componente[];
  } catch (err) {
    console.error('Error fetching componentes:', err);
    return [];
  }
}

/* --------------------------------------------------
 * REPORTES
 * -------------------------------------------------- */

export interface ReporteAsistenciaEstudiante {
  numero_semana: number;
  fecha: string;
  dictada: boolean;
  asistio: boolean;
}

export interface BoletinCalificaciones {
  estudiante: {
    doc_estudiante: number;
    nombre1: string;
    apellido1: string;
    nombre_ied: string;
    grado: number;
  };
  periodos: Array<{
    periodo: Periodo;
    componentes: Array<{
      componente: Componente;
      nota: number;
    }>;
    definitiva: number;
  }>;
  promedioGeneral: number;
}

// GET /api/reportes/asistencia-estudiante/:doc_estudiante
export async function getReporteAsistenciaEstudiante(
  doc_estudiante: number,
  fecha_inicio?: string,
  fecha_fin?: string
): Promise<ReporteAsistenciaEstudiante[]> {
  try {
    let url = `${API_BASE_URL}/api/reportes/asistencia-estudiante/${doc_estudiante}`;
    const params = new URLSearchParams();
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);
    if (params.toString()) url += '?' + params.toString();

    const res = await fetch(url);
    if (!res.ok) return [];
    const body = await res.json();
    return (body.data || body) as ReporteAsistenciaEstudiante[];
  } catch (err) {
    console.error('Error fetching attendance report:', err);
    return [];
  }
}

// GET /api/reportes/boletin-calificaciones/:doc_estudiante
export async function getBoletinCalificaciones(doc_estudiante: number): Promise<BoletinCalificaciones | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/reportes/boletin-calificaciones/${doc_estudiante}`);
    if (!res.ok) return null;
    const body = await res.json();
    return (body.data || body) as BoletinCalificaciones;
  } catch (err) {
    console.error('Error fetching boletin:', err);
    return null;
  }
}

// ============================================
// TUTORES - GESTIÓN COMPLETA (ADICIONAL)
// ============================================

export interface TutorFull {
  id_tutor: number;
  doc_funcionario: string;
  tipo_doc: string;
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  correo: string;
  telefono: string;
  fecha_contrato: string;
  username?: string;
  aulas_count: number;
  estudiantes_count: number;
}

export interface TutorAulaEstudiantes {
  id_aula: number;
  grado: number;
  nombre_ied?: string;
  direccion_sede?: string;
  estudiantes: Array<{
    doc_estudiante: number;
    tipo_doc: string;
    nombre1: string;
    nombre2?: string;
    apellido1: string;
    apellido2?: string;
    sexo: string;
    correo_acudiente?: string;
    telefono_acudiente?: string;
  }>;
}

// GET /api/tutores/full - Obtener tutores con conteo de aulas y estudiantes
export async function fetchTutoresFull(): Promise<TutorFull[]> {
  const res = await fetch(`${API_BASE_URL}/api/tutores/full`);
  if (!res.ok) {
    throw new Error("Error al obtener tutores completos");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

// GET /api/tutores/:doc_funcionario/aulas-estudiantes
export async function fetchTutorAulasYEstudiantes(
  doc_funcionario: string
): Promise<TutorAulaEstudiantes[]> {
  const res = await fetch(
    `${API_BASE_URL}/api/tutores/${doc_funcionario}/aulas-estudiantes`
  );
  if (!res.ok) {
    throw new Error("Error al obtener aulas y estudiantes del tutor");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

// POST /api/aula-tutor - Asignar aula a tutor
export async function assignAulaToTutor(input: {
  id_tutor: number;
  id_aula: number;
  fecha_asignacion: string; // YYYY-MM-DD
  fecha_fin?: string; // YYYY-MM-DD (opcional)
}): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/aula-tutor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al asignar aula a tutor");
  }
}

// POST /api/funcionarios/crear-con-tutor - Crear funcionario y opcionalmente tutor
export async function createFuncionarioFromForm(input: {
  tipo_doc: string;
  doc: string;
  nombre1: string;
  nombre2?: string | null;
  apellido1: string;
  apellido2?: string | null;
  correo: string;
  telefono: string;
  fecha_contrato: string; // YYYY-MM-DD
  shouldCreateTutor: boolean;
}): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/funcionarios/crear-con-tutor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Error al crear funcionario");
  }
}