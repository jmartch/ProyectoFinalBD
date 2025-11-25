// models/SEDE.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM SEDE");
    return rows;
  },

  getById: async (id_sede) => {
    const [rows] = await db.query(
      "SELECT * FROM SEDE WHERE id_sede = ?",
      [id_sede]
    );
    return rows[0];
  },

  create: async ({ id_ied, direccion, tipo }) => {
    const [result] = await db.query(
      "INSERT INTO SEDE (id_ied, direccion, tipo) VALUES (?, ?, ?)",
      [id_ied, direccion, tipo]
    );
    return { insertId: result.insertId };
  },

  update: async (id_sede, { id_ied, direccion, tipo }) => {
    const [result] = await db.query(
      "UPDATE SEDE SET id_ied=?, direccion=?, tipo=? WHERE id_sede=?",
      [id_ied, direccion, tipo, id_sede]
    );
    return result;
  },

  remove: async (id_sede) => {
    const [result] = await db.query(
      "DELETE FROM SEDE WHERE id_sede = ?",
      [id_sede]
    );
    return result;
  }
};
