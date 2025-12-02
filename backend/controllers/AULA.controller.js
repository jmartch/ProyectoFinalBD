// backend/controllers/AULA.controller.js
import db from "../config/db.js";

// GET /api/aula → obtener TODAS las aulas
export async function getAllAulas(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
        id_aula,
        id_sede,
        id_programa,
        grado
      FROM aula
    `);
    res.json(rows);
  } catch (err) {
    console.error("ERROR getAllAulas:", err);
    res.status(500).json({ message: "Error obteniendo aulas" });
  }
}
