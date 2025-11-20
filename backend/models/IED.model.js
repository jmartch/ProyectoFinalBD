 // models/IED.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM IED");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM IED WHERE id_IED = ?", [id]);
    return rows[0];
  },

  create: async ({ nombre, telefono, duracion, hora_inicio, hora_fin }) => {
    const [result] = await db.query(
      "INSERT INTO IED (nombre, telefono, duracion, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?)",
      [nombre, telefono, duracion, hora_inicio, hora_fin]
    );
    return { insertId: result.insertId };
  },

  update: async (id, { nombre, telefono, duracion, hora_inicio, hora_fin }) => {
    const [result] = await db.query(
      "UPDATE IED SET nombre=?, telefono=?, duracion=?, hora_inicio=?, hora_fin=? WHERE id_IED=?",
      [nombre, telefono, duracion, hora_inicio, hora_fin, id]
    );
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query("DELETE FROM IED WHERE id_IED = ?", [id]);
    return result;
  }
};
