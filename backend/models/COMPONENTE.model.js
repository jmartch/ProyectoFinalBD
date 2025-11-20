// models/COMPONENTE.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM COMPONENTE");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM COMPONENTE WHERE id_componente = ?", [id]);
    return rows[0];
  },

  create: async ({ id_periodo, nombre, porcentaje }) => {
    const [result] = await db.query(
      "INSERT INTO COMPONENTE (id_periodo, nombre, porcentaje) VALUES (?, ?, ?)",
      [id_periodo, nombre, porcentaje]
    );
    return { insertId: result.insertId };
  },

  update: async (id, { id_periodo, nombre, porcentaje }) => {
    const [result] = await db.query(
      "UPDATE COMPONENTE SET id_periodo = ?, nombre = ?, porcentaje = ? WHERE id_componente = ?",
      [id_periodo, nombre, porcentaje, id]
    );
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query("DELETE FROM COMPONENTE WHERE id_componente = ?", [id]);
    return result;
  }
};
