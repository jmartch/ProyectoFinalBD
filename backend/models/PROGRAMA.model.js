// models/PROGRAMA.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM PROGRAMA");
    return rows;
  },

  getById: async (id_programa) => {
    const [rows] = await db.query(
      "SELECT * FROM PROGRAMA WHERE id_programa = ?",
      [id_programa]
    );
    return rows[0];
  },

  create: async ({ nombre_programa }) => {
    const [result] = await db.query(
      "INSERT INTO PROGRAMA (nombre_programa) VALUES (?)",
      [nombre_programa]
    );
    return { insertId: result.insertId };
  },

  update: async (id_programa, { nombre_programa }) => {
    const [result] = await db.query(
      "UPDATE PROGRAMA SET nombre_programa=? WHERE id_programa=?",
      [nombre_programa, id_programa]
    );
    return result;
  },

  remove: async (id_programa) => {
    const [result] = await db.query(
      "DELETE FROM PROGRAMA WHERE id_programa=?",
      [id_programa]
    );
    return result;
  }
};
