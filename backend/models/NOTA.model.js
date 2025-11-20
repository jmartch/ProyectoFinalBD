// models/NOTA.model.js
import db from "../config/db.js";

/*
NOTA: PK id_nota, FK doc_estudiante
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM NOTA");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM NOTA WHERE id_nota = ?", [id]);
    return rows[0];
  },

  create: async ({ doc_estudiante, definitiva }) => {
    const [result] = await db.query(
      "INSERT INTO NOTA (doc_estudiante, definitiva) VALUES (?, ?)",
      [doc_estudiante, definitiva]
    );
    return { insertId: result.insertId };
  },

  update: async (id, { doc_estudiante, definitiva }) => {
    const [result] = await db.query(
      "UPDATE NOTA SET doc_estudiante = ?, definitiva = ? WHERE id_nota = ?",
      [doc_estudiante, definitiva, id]
    );
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query("DELETE FROM NOTA WHERE id_nota = ?", [id]);
    return result;
  }
};
