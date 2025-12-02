const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
