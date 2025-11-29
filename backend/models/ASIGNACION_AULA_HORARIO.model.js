// models/ASIGNACION_AULA_HORARIO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM asignacion_aula_horario");
    return rows;
  },

  getByKeys: async (id_horario, id_aula, fecha_inicio) => {
    const [rows] = await db.query(
      "SELECT * FROM asignacion_aula_horario WHERE id_horario = ? AND id_aula = ? AND fecha_inicio = ?",
      [id_horario, id_aula, fecha_inicio]
    );
    return rows[0];
  },

  create: async ({ id_horario, id_aula, fecha_inicio, fecha_fin }) => {
    // si fecha_fin viene vacío, lo mandamos como null
    const fechaFinValue = fecha_fin || null;

    const [result] = await db.query(
      "INSERT INTO asignacion_aula_horario (id_horario, id_aula, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)",
      [id_horario, id_aula, fecha_inicio, fechaFinValue]
    );
    return result;
  },

  updateByKeys: async (id_horario, id_aula, fecha_inicio, { fecha_fin }) => {
    const [result] = await db.query(
      "UPDATE asignacion_aula_horario SET fecha_fin = ? WHERE id_horario = ? AND id_aula = ? AND fecha_inicio = ?",
      [fecha_fin, id_horario, id_aula, fecha_inicio]
    );
    return result;
  },

  removeByKeys: async (id_horario, id_aula, fecha_inicio) => {
    const [result] = await db.query(
      "DELETE FROM asignacion_aula_horario WHERE id_horario = ? AND id_aula = ? AND fecha_inicio = ?",
      [id_horario, id_aula, fecha_inicio]
    );
    return result;
  },
};
