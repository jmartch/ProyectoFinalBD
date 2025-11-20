// models/PERIODO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM PERIODO");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM PERIODO WHERE id_periodo = ?", [id]);
    return rows[0];
  },

  create: async ({ fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "INSERT INTO PERIODO (fecha_inicio, fecha_fin) VALUES (?, ?)",
      [fecha_inicio, fecha_fin]
    );
    return { insertId: result.insertId };
  },

  update: async (id, { fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "UPDATE PERIODO SET fecha_inicio = ?, fecha_fin = ? WHERE id_periodo = ?",
      [fecha_inicio, fecha_fin, id]
    );
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query("DELETE FROM PERIODO WHERE id_periodo = ?", [id]);
    return result;
  }
};
