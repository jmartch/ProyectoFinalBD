// models/MOTIVO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM motivo");
    return rows;
  },

  getById: async (codigo) => {
    const [rows] = await db.query(
      "SELECT * FROM motivo WHERE codigo = ?",
      [codigo]
    );
    return rows[0];
  },

  create: async ({ descripcion }) => {
    const [result] = await db.query(
      "INSERT INTO motivo (descripcion) VALUES (?)",
      [descripcion]
    );
    return { insertId: result.insertId };
  },

  updateById: async (codigo, { descripcion }) => {
    const [result] = await db.query(
      "UPDATE motivo SET descripcion = ? WHERE codigo = ?",
      [descripcion, codigo]
    );
    return result;
  },

  removeById: async (codigo) => {
    const [result] = await db.query(
      "DELETE FROM motivo WHERE codigo = ?",
      [codigo]
    );
    return result;
  }
};
