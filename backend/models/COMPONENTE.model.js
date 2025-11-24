// models/COMPONENTE.model.js
import db from "../config/db.js";

/*
PK: id_componente
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM COMPONENTE");
    return rows;
  },

  getById: async (id_componente) => {
    const [rows] = await db.query(
      "SELECT * FROM COMPONENTE WHERE id_componente = ?",
      [id_componente]
    );
    return rows[0];
  },

  create: async ({ id_componente, nombre, porcentaje }) => {
    const [result] = await db.query(
      "INSERT INTO COMPONENTE (id_componente, nombre, porcentaje) VALUES (?, ?, ?)",
      [id_componente, nombre, porcentaje]
    );
    return { insertId: result.insertId };
  },

  updateById: async (id_componente, { nombre, porcentaje }) => {
    const [result] = await db.query(
      "UPDATE COMPONENTE SET nombre = ?, porcentaje = ? WHERE id_componente = ?",
      [nombre, porcentaje, id_componente]
    );
    return result;
  },

  removeById: async (id_componente) => {
    const [result] = await db.query(
      "DELETE FROM COMPONENTE WHERE id_componente = ?",
      [id_componente]
    );
    return result;
  }
};
