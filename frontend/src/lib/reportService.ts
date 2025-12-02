const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface AulaBrief { id_aula: number; codigo?: string; id_sede?: number; }
export interface RegistroClaseRow { num_registro: number; numero_semana: number; id_aula: number; codigo_motivo: string | null; fecha: string; dictada: number; is_festivo: number; fecha_reposicion: string | null; }
export interface AsistenciaRow { num_registro: number; doc_estudiante: string; asistio: number }
export interface EstudianteDetalle { doc_estudiante: string; primer_nombre: string; segundo_nombre?: string; primer_apellido: string; segundo_apellido?: string; id_aula?: number }

export async function fetchAulas(): Promise<AulaBrief[]> {
  const res = await fetch(`${API_BASE_URL}/api/aulas`);
  if (!res.ok) throw new Error('Error fetching aulas');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function fetchRegistroClasesAll(): Promise<RegistroClaseRow[]> {
  const res = await fetch(`${API_BASE_URL}/api/registro_clases`);
  if (!res.ok) throw new Error('Error fetching registro_clases');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function fetchAsistenciasAll(): Promise<AsistenciaRow[]> {
  const res = await fetch(`${API_BASE_URL}/api/asistencia`);
  if (!res.ok) throw new Error('Error fetching asistencias');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function fetchEstudiantesDetalle(): Promise<EstudianteDetalle[]> {
  const res = await fetch(`${API_BASE_URL}/api/estudiantes/detalle`);
  if (!res.ok) throw new Error('Error fetching estudiantes detalle');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function fetchTutores(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/api/tutores/full`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function fetchAulaTutores(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/api/aula-tutor`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function fetchHorarios(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/api/horarios`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function fetchAsignacionesAulaHorario(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/api/asignacion_aula_horario`);
  if (!res.ok) {
    console.warn('asignacion_aula_horario endpoint not available; returning empty array');
    return [];
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function fetchFuncionarios(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/api/funcionarios`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export default {};
