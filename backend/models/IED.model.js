// models/IED.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM ied");
    return rows;
  },

  getById: async (id_ied) => {
    const [rows] = await db.query(
      "SELECT * FROM ied WHERE id_ied = ?",
      [id_ied]
    );
    return rows[0];
  },

  create: async ({ nombre, telefono, duracion, hora_inicio, hora_fin, jornada }) => {
    const [result] = await db.query(
      "INSERT INTO ied (nombre, telefono, duracion, hora_inicio, hora_fin, jornada) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, telefono, duracion, hora_inicio, hora_fin, jornada]
    );
    return { insertId: result.insertId };
  },

  update: async (id_ied, { nombre, telefono, duracion, hora_inicio, hora_fin, jornada }) => {
    const [result] = await db.query(
      "UPDATE ied SET nombre = ?, telefono = ?, duracion = ?, hora_inicio = ?, hora_fin = ?, jornada = ? WHERE id_ied = ?",
      [nombre, telefono, duracion, hora_inicio, hora_fin, jornada, id_ied]
    );
    return result;
  },

  remove: async (id_ied) => {
    const [result] = await db.query(
      "DELETE FROM ied WHERE id_ied = ?",
      [id_ied]
    );
    return result;
  }
};
