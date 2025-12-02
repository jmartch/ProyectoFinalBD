// src/lib/attendanceService.ts
// Servicio para la integración de Asistencia con el backend

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

/* --------------------------------------------------
 * TIPOS DE DATOS
 * -------------------------------------------------- */

export interface Tutor {
  id_tutor: number;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  doc_tutor: string;
}

export interface Aula {
  id_aula: number;
  codigo: string;
  id_sede: number;
  id_programa: number;
  grado: number;
}

export interface AulaConDetalles extends Aula {
  sede?: { id_sede: number; direccion: string };
  programa?: { id_programa: number; nombre_programa: string };
}

export interface Estudiante {
  id_estudiante: string;
  doc_estudiante: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
}

export interface Horario {
  id_horario: number;
  id_aula: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  horas_equivalentes: number;
}

export interface Motivo {
  codigo_motivo: string;
  descripcion: string;
}

export interface RegistroClase {
  num_registro: number;
  numero_semana: number;
  id_aula: number;
  codigo_motivo?: string | null;
  fecha: string;
  dictada: boolean;
  is_festivo: boolean;
  fecha_reposicion?: string | null;
  horas_planeadas?: number;
  horas_dictadas?: number;
}

export interface RegistroClaseNuevo {
  numero_semana: number;
  id_aula: number;
  codigo_motivo?: string | null;
  fecha: string;
  dictada: boolean;
  is_festivo: boolean;
  fecha_reposicion?: string | null;
}

export interface Asistencia {
  num_registro: number;
  doc_estudiante: string;
  asistio: boolean;
}

export interface AsistenciaRequest {
  registroClase: {
    numero_semana: number;
    id_aula: number;
    codigo_motivo?: string;
    fecha: string;
    dictada: boolean;
    is_festivo: boolean;
    fecha_reposicion?: string;
  };
  asistencias: Array<{
    doc_estudiante: string;
    asistio: boolean;
  }>;
}

/* --------------------------------------------------
 * TUTORES
 * -------------------------------------------------- */

/**
 * Obtener todos los tutores (para admin)
 */
export async function fetchTutores(): Promise<Tutor[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/tutores`);
    if (!res.ok) throw new Error("Error al obtener tutores");

    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("Error en fetchTutores:", error);
    throw error;
  }
}

/* --------------------------------------------------
 * AULAS Y DATOS RELACIONADOS
 * -------------------------------------------------- */

/**
 * Obtener aulas asignadas a un tutor
 */
export async function fetchAulasPorTutor(
  tutorId: string
): Promise<AulaConDetalles[]> {
  try {
    // Obtener asignaciones de tutor
    const resAulasTutor = await fetch(
      `${API_BASE_URL}/api/aula-tutor?tutorId=${tutorId}`
    );
    if (!resAulasTutor.ok)
      throw new Error("Error al obtener aulas del tutor");

    const aulasTutor = await resAulasTutor.json();

    // Para cada aula, obtener los detalles
    const aulasConDetalles: AulaConDetalles[] = [];
    for (const item of aulasTutor) {
      const aula = item.aula || item;
      aulasConDetalles.push({
        ...aula,
        id_aula: aula.id_aula || aula.id,
        codigo: aula.codigo || aula.code,
      });
    }

    return aulasConDetalles;
  } catch (error) {
    console.error("Error en fetchAulasPorTutor:", error);
    throw error;
  }
}

/**
 * Obtener todos los estudiantes de un aula
 */
export async function fetchEstudiantesPorAula(
  aulaId: number | string
): Promise<Estudiante[]> {
  try {
    // El backend no expone directamente estudiantes por aula; usamos
    // el endpoint /api/estudiantes/detalle y filtramos por id_aula
    const res = await fetch(`${API_BASE_URL}/api/estudiantes/detalle`);
    if (!res.ok) throw new Error("Error al obtener estudiantes con detalle");

    const data = await res.json();
    const rows = Array.isArray(data) ? data : data.data || [];

    // Filtrar por aula y mapear a la forma esperada por el frontend
    const estudiantesEnAula: Estudiante[] = rows
      .filter((r: any) => String(r.id_aula) === String(aulaId))
      .map((r: any) => ({
        id_estudiante: r.doc_estudiante, // usamos documento como id
        doc_estudiante: r.doc_estudiante,
        primer_nombre: r.nombre1 || r.primer_nombre || '',
        segundo_nombre: r.nombre2 || r.segundo_nombre || '',
        primer_apellido: r.apellido1 || r.primer_apellido || '',
        segundo_apellido: r.apellido2 || r.segundo_apellido || '',
      }));

    return estudiantesEnAula;
  } catch (error) {
    console.error("Error en fetchEstudiantesPorAula:", error);
    throw error;
  }
}

/**
 * Obtener horario de un aula para un día específico
 */
export async function fetchHorarioPorAulaYDia(
  aulaId: number | string,
  diaSemana: string
): Promise<Horario | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/horarios?aulaId=${aulaId}&diaSemana=${diaSemana}`
    );
    if (!res.ok) throw new Error("Error al obtener horario");

    const data = await res.json();
    const horarios = Array.isArray(data) ? data : data.data || [];
    return horarios.length > 0 ? horarios[0] : null;
  } catch (error) {
    console.error("Error en fetchHorarioPorAulaYDia:", error);
    return null;
  }
}

/* --------------------------------------------------
 * MOTIVOS DE AUSENCIA
 * -------------------------------------------------- */

/**
 * Obtener todos los motivos de ausencia
 */
export async function fetchMotivos(): Promise<Motivo[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/motivos`);
    if (!res.ok) throw new Error("Error al obtener motivos");

    const data = await res.json();
    const rows = Array.isArray(data) ? data : data.data || [];
    // Mapear campo 'codigo' (backend) a 'codigo_motivo' usado en frontend
    return rows.map((r: any) => ({ codigo_motivo: String(r.codigo ?? r.codigo_motivo ?? r.id), descripcion: r.descripcion }));
  } catch (error) {
    console.error("Error en fetchMotivos:", error);
    return [];
  }
}

/**
 * Obtener todas las semanas registradas en el sistema
 */
export async function fetchSemanas(): Promise<Array<{ numero_semana: number; id_periodo: number; fecha_inicio: string; fecha_fin: string }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/semanas`);
    if (!res.ok) throw new Error('Error al obtener semanas');
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Error en fetchSemanas:', error);
    return [];
  }
}

/**
 * Buscar la semana que contiene una fecha (YYYY-MM-DD). Retorna el numero_semana o null.
 */
export async function findSemanaNumeroByFecha(fecha: string): Promise<number | null> {
  try {
    const semanas = await fetchSemanas();
    const target = new Date(fecha);
    for (const s of semanas) {
      const inicio = new Date(s.fecha_inicio);
      const fin = new Date(s.fecha_fin);
      if (target >= inicio && target <= fin) return Number(s.numero_semana);
    }
    return null;
  } catch (error) {
    console.error('Error en findSemanaNumeroByFecha:', error);
    return null;
  }
}

/**
 * Obtener periodos activos (llama a /api/periodo/activos)
 */
export async function fetchActivePeriodo(): Promise<{ id_periodo: number; fecha_inicio: string; fecha_fin: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/periodos/activos`);
    if (!res.ok) return null;
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data.data || [];
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error en fetchActivePeriodo:', error);
    return null;
  }
}

/**
 * Crear un periodo que cubra el mes de la fecha dada (inicio = primer día del mes, fin = último día del mes).
 * Retorna el objeto creado { id_periodo, fecha_inicio, fecha_fin } o null.
 */
export async function crearPeriodoParaFecha(fecha: string): Promise<{ id_periodo: number; fecha_inicio: string; fecha_fin: string } | null> {
  try {
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-indexed
    const first = new Date(year, month, 1).toISOString().slice(0, 10);
    const last = new Date(year, month + 1, 0).toISOString().slice(0, 10);

    const res = await fetch(`${API_BASE_URL}/api/periodos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fecha_inicio: first, fecha_fin: last })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({} as any));
      throw new Error(body.message || 'Error creando periodo');
    }

    const body = await res.json();
    const data = body.data || body;
    return { id_periodo: Number(data.id_periodo || data.insertId), fecha_inicio: first, fecha_fin: last };
  } catch (error) {
    console.error('Error en crearPeriodoParaFecha:', error);
    return null;
  }
}

/**
 * Crear una semana que contiene la fecha dada.
 * Calcula el lunes (inicio) y domingo (fin) de la semana, y crea la semana en la BD
 * usando el periodo activo si existe.
 * Retorna el numero_semana creado o null en error.
 */
export async function crearSemanaParaFecha(fecha: string): Promise<number | null> {
  try {
    // obtener periodo activo
    let periodo = await fetchActivePeriodo();
    // si no hay periodo activo, intentamos crear uno que cubra el mes de la fecha
    if (!periodo) {
      const creadoPeriodo = await crearPeriodoParaFecha(fecha);
      if (!creadoPeriodo) throw new Error('No hay periodo activo y no se pudo crear uno automáticamente');
      periodo = creadoPeriodo;
    }

    const d = new Date(fecha);
    // calcular lunes (inicio de semana)
    const day = d.getDay(); // 0 domingo, 1 lunes...
    const diffToMonday = (day + 6) % 7; // 0-> monday offset
    const monday = new Date(d);
    monday.setDate(d.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const yyyy = (dt: Date) => dt.toISOString().slice(0, 10);

    const res = await fetch(`${API_BASE_URL}/api/semanas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_periodo: periodo.id_periodo, fecha_inicio: yyyy(monday), fecha_fin: yyyy(sunday) })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({} as any));
      throw new Error(body.message || 'Error creando semana');
    }

    const body = await res.json();
    const data = body.data || body;
    return Number(data.numero_semana || data.insertId || null);
  } catch (error) {
    console.error('Error en crearSemanaParaFecha:', error);
    return null;
  }
}

/**
 * Crear un motivo (si no hay ninguno en la BD)
 */
export async function crearMotivo(descripcion: string): Promise<Motivo> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/motivos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descripcion }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({} as any));
      throw new Error(body.message || 'Error al crear motivo');
    }

    const data = await res.json();
    // El controlador devuelve { data: { codigo, descripcion } }
    const row = data.data || data;
    return { codigo_motivo: String(row.codigo), descripcion: row.descripcion };
  } catch (error) {
    console.error('Error en crearMotivo:', error);
    throw error;
  }
}

/* --------------------------------------------------
 * REGISTRO DE CLASES Y ASISTENCIA
 * -------------------------------------------------- */

/**
 * Crear un registro de clase
 */
export async function crearRegistroClase(
  registroData: RegistroClaseNuevo
): Promise<{ num_registro: number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/registro_clases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numero_semana: registroData.numero_semana,
        id_aula: registroData.id_aula,
        codigo_motivo: registroData.codigo_motivo,
        fecha: registroData.fecha,
        dictada: registroData.dictada,
        is_festivo: registroData.is_festivo,
        fecha_reposicion: registroData.fecha_reposicion,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({} as any));
      throw new Error(body.message || "Error al crear registro de clase");
    }

    const data = await res.json();
    return data.data || { num_registro: data.insertId };
  } catch (error) {
    console.error("Error en crearRegistroClase:", error);
    throw error;
  }
}

/**
 * Guardar asistencia de un estudiante
 */
export async function guardarAsistencia(
  numRegistro: number,
  docEstudiante: string,
  asistio: boolean
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/asistencia`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        num_registro: numRegistro,
        doc_estudiante: docEstudiante,
        asistio,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al guardar asistencia");
    }
  } catch (error) {
    console.error("Error en guardarAsistencia:", error);
    throw error;
  }
}

/**
 * Guardar múltiples asistencias de una clase
 */
export async function guardarAsistenciasMasivo(
  registroClase: RegistroClaseNuevo,
  asistencias: Array<{ doc_estudiante: string; asistio: boolean }>,
  motivoPorDefecto?: string
): Promise<void> {
  try {
    // Si la clase se dictó pero no hay motivo, usar el primer motivo disponible
    // o un código genérico
    let codigoMotivo = registroClase.codigo_motivo;
    
    if (!codigoMotivo) {
      // Si no hay motivo asignado, usar '1' como default
      codigoMotivo = motivoPorDefecto || '1';
    }

    // Primero crear el registro de clase
    const registroCreado = await crearRegistroClase({
      ...registroClase,
      codigo_motivo: codigoMotivo,
    });
    const numRegistro = registroCreado.num_registro;

    // Luego guardar todas las asistencias
    const promesas = asistencias.map((asist) =>
      guardarAsistencia(numRegistro, asist.doc_estudiante, asist.asistio)
    );

    await Promise.all(promesas);
  } catch (error) {
    console.error("Error en guardarAsistenciasMasivo:", error);
    throw error;
  }
}

/**
 * Obtener semana número a partir de una fecha
 */
export function obtenerNumeroSemana(fecha: Date): number {
  const primerDia = new Date(fecha.getFullYear(), 0, 1);
  const dias = Math.floor(
    (fecha.getTime() - primerDia.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((dias + primerDia.getDay() + 1) / 7);
}

/**
 * Obtener nombre del día de la semana en español
 */
export function obtenerDiaSemana(fecha: Date): string {
  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];
  return dias[fecha.getDay()];
}

/**
 * Verificar si una fecha es festivo
 */
export async function esFestivo(fecha: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/festivos?fecha=${fecha}`
    );
    if (!res.ok) return false;

    const data = await res.json();
    return Array.isArray(data) ? data.length > 0 : false;
  } catch (error) {
    console.error("Error verificando festivo:", error);
    return false;
  }
}
