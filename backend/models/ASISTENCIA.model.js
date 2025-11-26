// models/ASISTENCIA.model.js
import db from "../config/db.js";

/*
Composite PK: (num_registro, doc_estudiante)
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM asistencia");
    return rows;
  },

  getByKeys: async (num_registro, doc_estudiante) => {
    const [rows] = await db.query(
      "SELECT * FROM asistencia WHERE num_registro = ? AND doc_estudiante = ?",
      [num_registro, doc_estudiante]
    );
    return rows[0];
  },

  create: async ({ num_registro, doc_estudiante, asistio }) => {
    const [result] = await db.query(
      "INSERT INTO asistencia (num_registro, doc_estudiante, asistio) VALUES (?, ?, ?)",
      [num_registro, doc_estudiante, asistio]
    );
    // al ser PK compuesta no hay insertId útil, pero dejamos el result por consistencia
    return result;
  },

  updateByKeys: async (num_registro, doc_estudiante, { asistio }) => {
    const [result] = await db.query(
      "UPDATE asistencia SET asistio = ? WHERE num_registro = ? AND doc_estudiante = ?",
      [asistio, num_registro, doc_estudiante]
    );
    return result;
  },

  removeByKeys: async (num_registro, doc_estudiante) => {
    const [result] = await db.query(
      "DELETE FROM asistencia WHERE num_registro = ? AND doc_estudiante = ?",
      [num_registro, doc_estudiante]
    );
    return result;
  },
};
