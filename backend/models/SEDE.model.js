// models/SEDE.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM SEDE");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM SEDE WHERE id_sede = ?", [id]);
    return rows[0];
  },

  create: async ({ id_IED, direccion, tipo }) => {
    const [result] = await db.query(
      "INSERT INTO SEDE (id_IED, direccion) VALUES (?, ?)",
      [id_IED, direccion, tipo]
    );
    return { insertId: result.insertId };
  },

  update: async (id, { id_IED, direccion, tipo }) => {
    const [result] = await db.query(
      "UPDATE SEDE SET id_IED = ?, direccion = ? WHERE id_sede = ?",
      [id_IED, direccion, id, tipo]
    );
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query("DELETE FROM SEDE WHERE id_sede = ?", [id]);
    return result;
  }
};
