// models/DETALLE_NOTA.model.js
import db from "../config/db.js";

/*
Composite PK: (id_nota, id_componente)
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM DETALLE_NOTA");
    return rows;
  },

  getByKeys: async (id_nota, id_componente) => {
    const [rows] = await db.query(
      "SELECT * FROM DETALLE_NOTA WHERE id_nota = ? AND id_componente = ?",
      [id_nota, id_componente]
    );
    return rows[0];
  },

  create: async ({ id_nota, id_componente, valor }) => {
    const [result] = await db.query(
      "INSERT INTO DETALLE_NOTA (id_nota, id_componente, valor) VALUES (?, ?, ?)",
      [id_nota, id_componente, valor]
    );
    return { insertId: result.insertId };
  },

  updateByKeys: async (id_nota, id_componente, { valor }) => {
    const [result] = await db.query(
      "UPDATE DETALLE_NOTA SET valor = ? WHERE id_nota = ? AND id_componente = ?",
      [valor, id_nota, id_componente]
    );
    return result;
  },

  removeByKeys: async (id_nota, id_componente) => {
    const [result] = await db.query(
      "DELETE FROM DETALLE_NOTA WHERE id_nota = ? AND id_componente = ?",
      [id_nota, id_componente]
    );
    return result;
  }
};
