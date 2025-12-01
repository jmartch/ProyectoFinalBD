// backend/models/AULA.model.js
import db from "../config/db.js";

const AULA = {
  getAll: async () => {
    // Puedes seleccionar solo las columnas que necesitas
    const [rows] = await db.query("SELECT id_aula, id_sede, id_programa, grado FROM aula");
    return rows;
  },

  getById: async (id_aula) => {
    const [rows] = await db.query(
      "SELECT id_aula, id_sede, id_programa, grado FROM aula WHERE id_aula = ?",
      [id_aula]
    );
    return rows[0];
  },

  // create SIN id_ied
  create: async ({ id_sede, id_programa, grado }) => {
    const [result] = await db.query(
      "INSERT INTO aula (id_sede, id_programa, grado) VALUES (?, ?, ?)",
      [id_sede, id_programa, grado]
    );
    return { insertId: result.insertId };
  },

  // update SIN id_ied
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

export default AULA;
