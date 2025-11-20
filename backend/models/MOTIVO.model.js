// models/MOTIVO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM MOTIVO");
    return rows;
  },

  getById: async (codigo) => {
    const [rows] = await db.query("SELECT * FROM MOTIVO WHERE codigo = ?", [codigo]);
    return rows[0];
  },

  create: async ({ codigo, descripcion }) => {
    const [result] = await db.query(
      "INSERT INTO MOTIVO (codigo, descripcion) VALUES (?, ?)",
      [codigo, descripcion]
    );
    return { insertId: result.insertId };
  },

  update: async (codigo, { descripcion }) => {
    const [result] = await db.query("UPDATE MOTIVO SET descripcion = ? WHERE codigo = ?", [descripcion, codigo]);
    return result;
  },

  remove: async (codigo) => {
    const [result] = await db.query("DELETE FROM MOTIVO WHERE codigo = ?", [codigo]);
    return result;
  }
};
