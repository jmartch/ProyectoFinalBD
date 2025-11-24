// models/NOTA.model.js
import db from "../config/db.js";

/*
PK: id_nota
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM NOTA");
    return rows;
  },

  getById: async (id_nota) => {
    const [rows] = await db.query(
      "SELECT * FROM NOTA WHERE id_nota = ?",
      [id_nota]
    );
    return rows[0];
  },

  create: async ({ id_nota, doc_estudiante, id_periodo, definitiva }) => {
    const [result] = await db.query(
      "INSERT INTO NOTA (id_nota, doc_estudiante, id_periodo, definitiva) VALUES (?, ?, ?, ?)",
      [id_nota, doc_estudiante, id_periodo, definitiva]
    );
    return { insertId: result.insertId };
  },

  updateById: async (id_nota, { doc_estudiante, id_periodo, definitiva }) => {
    const [result] = await db.query(
      "UPDATE NOTA SET doc_estudiante = ?, id_periodo = ?, definitiva = ? WHERE id_nota = ?",
      [doc_estudiante, id_periodo, definitiva, id_nota]
    );
    return result;
  },

  removeById: async (id_nota) => {
    const [result] = await db.query(
      "DELETE FROM NOTA WHERE id_nota = ?",
      [id_nota]
    );
    return result;
  }
};
