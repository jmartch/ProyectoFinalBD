import db from "../config/db.js";

// ======================
// GET TODOS LOS TUTORES
// ======================
export async function getAllTutores(req, res) {
  try {
    const [rows] = await db.query("SELECT id_tutor FROM tutor");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo tutores" });
  }
}

// ======================
// CREAR TUTOR (solo id)
// ======================
export async function createTutor(req, res) {
  try {
    const [result] = await db.query("INSERT INTO tutor () VALUES ()");
    res.json({ id_tutor: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error creando tutor" });
  }
}

// ================================
// AULAS + ESTUDIANTES POR TUTOR
// ================================
export async function getTutorAulasYEstudiantes(req, res) {
  const { id_tutor } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        a.id_aula,
        a.grado,
        e.doc_estudiante,
        e.tipo_doc,
        e.nombre1,
        e.nombre2,
        e.apellido1,
        e.apellido2,
        e.sexo
      FROM aula_tutor at
      JOIN aula a ON a.id_aula = at.id_aula
      LEFT JOIN matricula m ON m.id_aula = a.id_aula AND (m.fecha_fin IS NULL)
      LEFT JOIN estudiante e ON e.doc_estudiante = m.doc_estudiante
      WHERE at.id_tutor = ?
      ORDER BY a.id_aula
    `,
      [id_tutor]
    );

    const map = new Map();

    rows.forEach((r) => {
      if (!map.has(r.id_aula)) {
        map.set(r.id_aula, {
          id_aula: r.id_aula,
          grado: r.grado,
          estudiantes: [],
        });
      }
      if (r.doc_estudiante) {
        map.get(r.id_aula).estudiantes.push({
          doc_estudiante: r.doc_estudiante,
          tipo_doc: r.tipo_doc,
          nombre1: r.nombre1,
          nombre2: r.nombre2,
          apellido1: r.apellido1,
          apellido2: r.apellido2,
          sexo: r.sexo,
        });
      }
    });

    res.json([...map.values()]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error consultando aulas del tutor" });
  }
}
