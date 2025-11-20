// models/ASISTENCIA.model.js
import db from "../config/db.js";

/*
Composite PK: (num_registro, doc_estudiante)
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM ASISTENCIA");
    return rows;
  },

  getByKeys: async (num_registro, doc_estudiante) => {
    const [rows] = await db.query(
      "SELECT * FROM ASISTENCIA WHERE num_registro = ? AND doc_estudiante = ?",
      [num_registro, doc_estudiante]
    );
    return rows[0];
  },

  create: async ({ num_registro, doc_estudiante, asisto }) => {
    const [result] = await db.query(
      "INSERT INTO ASISTENCIA (num_registro, doc_estudiante, asisto) VALUES (?, ?, ?)",
      [num_registro, doc_estudiante, asisto]
    );
    return { insertId: result.insertId };
  },

  

  updateByKeys: async (num_registro, doc_estudiante, { asisto }) => {
    const [result] = await db.query(
      "UPDATE ASISTENCIA SET asisto = ? WHERE num_registro = ? AND doc_estudiante = ?",
      [asisto, num_registro, doc_estudiante]
    );
    return result;
  },

  removeByKeys: async (num_registro, doc_estudiante) => {
    const [result] = await db.query(
      "DELETE FROM ASISTENCIA WHERE num_registro = ? AND doc_estudiante = ?",
      [num_registro, doc_estudiante]
    );
    return result;
  }
};
