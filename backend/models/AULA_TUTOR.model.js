// models/AULA_TUTOR.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM aula_tutor");
    return rows;
  },

  getByKeys: async (id_aula, id_tutor, fecha_asignacion) => {
    const [rows] = await db.query(
      "SELECT * FROM aula_tutor WHERE id_aula = ? AND id_tutor = ? AND fecha_asignacion = ?",
      [id_aula, id_tutor, fecha_asignacion]
    );
    return rows[0];
  },

  create: async ({ id_aula, id_tutor, fecha_asignacion, fecha_fin }) => {
    const fechaFinValue = fecha_fin || null;

    const [result] = await db.query(
      "INSERT INTO aula_tutor (id_aula, id_tutor, fecha_asignacion, fecha_fin) VALUES (?, ?, ?, ?)",
      [id_aula, id_tutor, fecha_asignacion, fechaFinValue]
    );
    return result;
  },

  updateByKeys: async (id_aula, id_tutor, fecha_asignacion, { fecha_fin }) => {
    const [result] = await db.query(
      "UPDATE aula_tutor SET fecha_fin = ? WHERE id_aula = ? AND id_tutor = ? AND fecha_asignacion = ?",
      [fecha_fin, id_aula, id_tutor, fecha_asignacion]
    );
    return result;
  },

  removeByKeys: async (id_aula, id_tutor, fecha_asignacion) => {
    const [result] = await db.query(
      "DELETE FROM aula_tutor WHERE id_aula = ? AND id_tutor = ? AND fecha_asignacion = ?",
      [id_aula, id_tutor, fecha_asignacion]
    );
    return result;
  },
};
