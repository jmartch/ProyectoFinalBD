import db from "../config/db.js";

// GET /api/aula-tutor
export async function getAllAulaTutor(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM aula_tutor");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo aula_tutor" });
  }
}

// POST /api/aula-tutor
export async function createAulaTutor(req, res) {
  const { id_tutor, id_aula, fecha_asignacion } = req.body;

  try {
    const [result] = await db.query(
      `
      INSERT INTO aula_tutor (id_aula, id_tutor, fecha_asignacion)
      VALUES (?, ?, ?)
    `,
      [id_aula, id_tutor, fecha_asignacion]
    );

    res.json({ id_aula, id_tutor, fecha_asignacion });
  } catch (err) {
    res.status(500).json({ message: "Error asignando aula" });
  }
}
