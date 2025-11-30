// src/TestMatriculas.tsx
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function TestMatriculas() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("✅ TestMatriculas se montó");
    console.log("➡️ llamando a", `${API_BASE_URL}/api/matriculas`);

    fetch(`${API_BASE_URL}/api/matriculas`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        console.log("✅ respuesta /api/matriculas:", json);
        setData(json);
      })
      .catch((err) => {
        console.error("❌ error en fetch:", err);
        setError(err.message);
      });
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <pre className="text-xs bg-slate-900 text-slate-50 p-2 rounded">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
