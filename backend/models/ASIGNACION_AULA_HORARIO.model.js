// models/ASIGNACION_AULA_HORARIO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM ASIGNACION_AULA_HORARIO");
    return rows;
  },

  getByKeys: async (id_horario, id_aula, fecha_inicio) => {
    const [rows] = await db.query(
      "SELECT * FROM ASIGNACION_AULA_HORARIO WHERE id_horario=? AND id_aula=? AND fecha_inicio=?",
      [id_horario, id_aula, fecha_inicio]
    );
    return rows[0];
  },

  create: async ({ id_horario, id_aula, fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "INSERT INTO ASIGNACION_AULA_HORARIO (id_horario, id_aula, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)",
      [id_horario, id_aula, fecha_inicio, fecha_fin]
    );
    return result;
  },

  updateByKeys: async (id_horario, id_aula,  fecha_inicio, {fecha_fin }) => {
    const [result] = await db.query(
      "UPDATE ASIGNACION_AULA_HORARIO SET fecha_fin=? WHERE id_horario=? AND id_aula=? AND fecha_inicio=?",
      [fecha_fin, id_horario, id_aula, fecha_inicio]
    );
    return result;
  },

  removeByKeys: async (id_horario, id_aula, fecha_inicio) => {
    const [result] = await db.query(
      "DELETE FROM ASIGNACION_AULA_HORARIO WHERE id_horario=? AND id_aula=? AND fecha_inicio=?",
      [id_horario, id_aula, fecha_inicio]
    );
    return result;
  }
};
