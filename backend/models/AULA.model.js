// models/AULA.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM aula");
    return rows;
  },

  getById: async (id_aula) => {
    const [rows] = await db.query(
      "SELECT * FROM aula WHERE id_aula = ?",
      [id_aula]
    );
    return rows[0];
  },

  create: async ({ id_sede, id_programa, grado }) => {
    const [result] = await db.query(
      "INSERT INTO aula (id_sede, id_programa, grado) VALUES (?, ?, ?)",
      [id_sede, id_programa, grado]
    );
    return { insertId: result.insertId };
  },

  update: async (id_aula, { id_sede, id_programa, grado }) => {
    const [result] = await db.query(
      "UPDATE aula SET id_sede = ?, id_programa = ?, grado = ? WHERE id_aula = ?",
      [id_sede, id_programa, grado, id_aula]
    );
    return result;
  },

  remove: async (id_aula) => {
    const [result] = await db.query(
      "DELETE FROM aula WHERE id_aula = ?",
      [id_aula]
    );
    return result;
  },
};
