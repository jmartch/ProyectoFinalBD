// models/PROGRAMA.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM programa");
    return rows;
  },

  getById: async (id_programa) => {
    const [rows] = await db.query(
      "SELECT * FROM programa WHERE id_programa = ?",
      [id_programa]
    );
    return rows[0];
  },

  create: async ({ nombre_programa }) => {
    const [result] = await db.query(
      "INSERT INTO programa (nombre_programa) VALUES (?)",
      [nombre_programa]
    );
    return { insertId: result.insertId };
  },

  update: async (id_programa, { nombre_programa }) => {
    const [result] = await db.query(
      "UPDATE programa SET nombre_programa = ? WHERE id_programa = ?",
      [nombre_programa, id_programa]
    );
    return result;
  },

  remove: async (id_programa) => {
    const [result] = await db.query(
      "DELETE FROM programa WHERE id_programa = ?",
      [id_programa]
    );
    return result;
  }
};
