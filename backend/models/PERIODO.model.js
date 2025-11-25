// models/PERIODO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM periodo");
    return rows;
  },

  getById: async (id_periodo) => {
    const [rows] = await db.query(
      "SELECT * FROM periodo WHERE id_periodo = ?",
      [id_periodo]
    );
    return rows[0];
  },

  create: async ({ fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "INSERT INTO periodo (fecha_inicio, fecha_fin) VALUES (?, ?)",
      [fecha_inicio, fecha_fin]
    );
    return { insertId: result.insertId };
  },

  updateById: async (id_periodo, { fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "UPDATE periodo SET fecha_inicio = ?, fecha_fin = ? WHERE id_periodo = ?",
      [fecha_inicio, fecha_fin, id_periodo]
    );
    return result;
  },

  removeById: async (id_periodo) => {
    const [result] = await db.query(
      "DELETE FROM periodo WHERE id_periodo = ?",
      [id_periodo]
    );
    return result;
  }
};
