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

// ------- SEDES ---------
export interface Sede {
  id_sede: number;
  id_ied: number;
  direccion: string;
  tipo: string; // Principal / Secundaria / etc.
}

export async function fetchSedesByIed(id_ied: number): Promise<Sede[]> {
  const res = await fetch(
    `${API_BASE_URL}/api/sedes?id_ied=${encodeURIComponent(id_ied)}`
  );
  if (!res.ok) throw new Error("Error al obtener sedes");
  return res.json();
}

export async function createSede(data: {
  id_ied: number;
  direccion: string;
  tipo: string;
}): Promise<Sede> {
  const res = await fetch(`${API_BASE_URL}/api/sedes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al crear sede");
  }

  const body = await res.json();
  return body.data;
}
