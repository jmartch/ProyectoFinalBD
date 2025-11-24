// models/ASIGNARIO_AULA_HORARIO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM ASIGNARIO_AULA_HORARIO");
    return rows;
  },

  getByKeys: async (id_horario, id_aula) => {
    const [rows] = await db.query(
      "SELECT * FROM ASIGNARIO_AULA_HORARIO WHERE id_horario=? AND id_aula=?",
      [id_horario, id_aula]
    );
    return rows[0];
  },

  create: async ({ id_horario, id_aula, fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "INSERT INTO ASIGNARIO_AULA_HORARIO (id_horario, id_aula, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)",
      [id_horario, id_aula, fecha_inicio, fecha_fin]
    );
    return result;
  },

  updateByKeys: async (id_horario, id_aula, { fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "UPDATE ASIGNARIO_AULA_HORARIO SET fecha_inicio=?, fecha_fin=? WHERE id_horario=? AND id_aula=?",
      [fecha_inicio, fecha_fin, id_horario, id_aula]
    );
    return result;
  },

  removeByKeys: async (id_horario, id_aula) => {
    const [result] = await db.query(
      "DELETE FROM ASIGNARIO_AULA_HORARIO WHERE id_horario=? AND id_aula=?",
      [id_horario, id_aula]
    );
    return result;
  }
};
