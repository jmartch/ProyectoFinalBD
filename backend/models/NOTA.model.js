// models/NOTA.model.js
import db from "../config/db.js";

/*
PK: id_nota
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM nota");
    return rows;
  },

  getById: async (id_nota) => {
    const [rows] = await db.query(
      "SELECT * FROM nota WHERE id_nota = ?",
      [id_nota]
    );
    return rows[0];
  },

  create: async ({ doc_estudiante, definitiva }) => {
    const [result] = await db.query(
      "INSERT INTO nota (doc_estudiante, definitiva) VALUES (?, ?)",
      [doc_estudiante, definitiva]
    );
    return { insertId: result.insertId };
  },

  updateById: async (id_nota, { doc_estudiante, definitiva }) => {
    const [result] = await db.query(
      "UPDATE nota SET doc_estudiante = ?, definitiva = ? WHERE id_nota = ?",
      [doc_estudiante, definitiva, id_nota]
    );
    return result;
  },

  removeById: async (id_nota) => {
    const [result] = await db.query(
      "DELETE FROM nota WHERE id_nota = ?",
      [id_nota]
    );
    return result;
  }
};
