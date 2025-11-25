// models/SEMANA.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM semana");
    return rows;
  },

  getById: async (numero_semana) => {
    const [rows] = await db.query(
      "SELECT * FROM semana WHERE numero_semana = ?",
      [numero_semana]
    );
    return rows[0];
  },

  create: async ({ id_periodo, fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "INSERT INTO semana (id_periodo, fecha_inicio, fecha_fin) VALUES (?, ?, ?)",
      [id_periodo, fecha_inicio, fecha_fin]
    );
    return { insertId: result.insertId };
  },

  updateById: async (numero_semana, { id_periodo, fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "UPDATE semana SET id_periodo = ?, fecha_inicio = ?, fecha_fin = ? WHERE numero_semana = ?",
      [id_periodo, fecha_inicio, fecha_fin, numero_semana]
    );
    return result;
  },

  removeById: async (numero_semana) => {
    const [result] = await db.query(
      "DELETE FROM semana WHERE numero_semana = ?",
      [numero_semana]
    );
    return result;
  }
};
