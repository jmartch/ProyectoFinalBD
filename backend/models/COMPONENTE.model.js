// models/COMPONENTE.model.js
import db from "../config/db.js";

/*
PK: id_componente
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM componente");
    return rows;
  },

  getById: async (id_componente) => {
    const [rows] = await db.query(
      "SELECT * FROM componente WHERE id_componente = ?",
      [id_componente]
    );
    return rows[0];
  },

  create: async ({ id_periodo, nombre, porcentaje }) => {
    const [result] = await db.query(
      "INSERT INTO componente (id_periodo, nombre, porcentaje) VALUES (?, ?, ?)",
      [id_periodo, nombre, porcentaje]
    );
    return { insertId: result.insertId };
  },

  update: async (id_componente, { id_periodo, nombre, porcentaje }) => {
    const [result] = await db.query(
      "UPDATE componente SET id_periodo = ?, nombre = ?, porcentaje = ? WHERE id_componente = ?",
      [id_periodo, nombre, porcentaje, id_componente]
    );
    return result;
  },

  remove: async (id_componente) => {
    const [result] = await db.query(
      "DELETE FROM componente WHERE id_componente = ?",
      [id_componente]
    );
    return result;
  },
};
