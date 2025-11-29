// models/DETALLE_NOTA.model.js
import db from "../config/db.js";

/*
Composite PK: (id_nota, id_componente)
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM detalle_nota");
    return rows;
  },

  getByKeys: async (id_nota, id_componente) => {
    const [rows] = await db.query(
      "SELECT * FROM detalle_nota WHERE id_nota = ? AND id_componente = ?",
      [id_nota, id_componente]
    );
    return rows[0];
  },

  create: async ({ id_nota, id_componente, nota }) => {
    const [result] = await db.query(
      "INSERT INTO detalle_nota (id_nota, id_componente, nota) VALUES (?, ?, ?)",
      [id_nota, id_componente, nota]
    );
    // PK compuesta, no hay insertId útil, pero devolvemos el result por consistencia
    return result;
  },

  updateByKeys: async (id_nota, id_componente, { nota }) => {
    const [result] = await db.query(
      "UPDATE detalle_nota SET nota = ? WHERE id_nota = ? AND id_componente = ?",
      [nota, id_nota, id_componente]
    );
    return result;
  },

  removeByKeys: async (id_nota, id_componente) => {
    const [result] = await db.query(
      "DELETE FROM detalle_nota WHERE id_nota = ? AND id_componente = ?",
      [id_nota, id_componente]
    );
    return result;
  },
};
