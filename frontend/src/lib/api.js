const API_BASE = "http://localhost:3000/api/ied"; // Ajusta el puerto si tu backend usa otro

export async function fetchIEDs() {
  const res = await fetch(`${API_BASE}`);
  if (!res.ok) throw new Error("Error al cargar las IED");
  return await res.json();
}

export async function createIED(data) {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al crear IED");
  return json;
}
