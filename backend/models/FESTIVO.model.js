// models/FESTIVO.model.js
import db from "../config/db.js";

/*
PK: fecha (DATE)
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM FESTIVO");
    return rows;
  },

  getByDate: async (fecha) => {
    const [rows] = await db.query(
      "SELECT * FROM FESTIVO WHERE fecha = ?",
      [fecha]
    );
    return rows[0];
  },

  create: async ({ fecha, descripcion }) => {
    const [result] = await db.query(
      "INSERT INTO FESTIVO (fecha, descripcion) VALUES (?, ?)",
      [fecha, descripcion]
    );
    return { insertId: result.insertId };
  },

  updateByDate: async (fecha, { descripcion }) => {
    const [result] = await db.query(
      "UPDATE FESTIVO SET descripcion = ? WHERE fecha = ?",
      [descripcion, fecha]
    );
    return result;
  },

  removeByDate: async (fecha) => {
    const [result] = await db.query(
      "DELETE FROM FESTIVO WHERE fecha = ?",
      [fecha]
    );
    return result;
  }
};
