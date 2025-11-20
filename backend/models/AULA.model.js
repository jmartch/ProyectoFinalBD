// models/AULA.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM AULA");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM AULA WHERE id_aula = ?", [id]);
    return rows[0];
  },

  create: async ({ id_sede, grado, programa }) => {
    const [result] = await db.query(
      "INSERT INTO AULA (id_sede, grado, programa) VALUES (?, ?, ?)",
      [id_sede, grado, programa]
    );
    return { insertId: result.insertId };
  },

  update: async (id, { id_sede, grado, programa }) => {
    const [result] = await db.query(
      "UPDATE AULA SET id_sede = ?, grado = ?, programa = ? WHERE id_aula = ?",
      [id_sede, grado, programa, id]
    );
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query("DELETE FROM AULA WHERE id_aula = ?", [id]);
    return result;
  }
};
