// models/FESTIVO.model.js
import db from "../config/db.js";

/*
PK real: id_festivo (AUTO_INCREMENT recomendado)
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM festivo");
    return rows;
  },

  getById: async (id_festivo) => {
    const [rows] = await db.query(
      "SELECT * FROM festivo WHERE id_festivo = ?",
      [id_festivo]
    );
    return rows[0];
  },

  // Festivos activos: fecha >= hoy
  getActive: async () => {
    const [rows] = await db.query(
      "SELECT * FROM festivo WHERE fecha >= CURDATE() ORDER BY fecha ASC"
    );
    return rows;
  },

  create: async ({ fecha, descripcion }) => {
    const [result] = await db.query(
      "INSERT INTO festivo (fecha, descripcion) VALUES (?, ?)",
      [fecha, descripcion]
    );
    return { insertId: result.insertId };
  },

  updateById: async (id_festivo, { fecha, descripcion }) => {
    const [result] = await db.query(
      "UPDATE festivo SET fecha = ?, descripcion = ? WHERE id_festivo = ?",
      [fecha, descripcion, id_festivo]
    );
    return result;
  },

  removeById: async (id_festivo) => {
    const [result] = await db.query(
      "DELETE FROM festivo WHERE id_festivo = ?",
      [id_festivo]
    );
    return result;
  },
};
