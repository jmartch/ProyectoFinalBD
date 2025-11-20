// models/HORARIO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM HORARIO");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM HORARIO WHERE id_horario = ?", [id]);
    return rows[0];
  },

  create: async ({ id_aula, dia_semana, hora_inicio, horas_duracion }) => {
    const [result] = await db.query(
      "INSERT INTO HORARIO (id_aula, dia_semana, hora_inicio, horas_duracion) VALUES (?, ?, ?, ?)",
      [id_aula, dia_semana, hora_inicio, horas_duracion]
    );
    return { insertId: result.insertId };
  },

  update: async (id, { id_aula, dia_semana, hora_inicio, horas_duracion }) => {
    const [result] = await db.query(
      "UPDATE HORARIO SET id_aula = ?, dia_semana = ?, hora_inicio = ?, horas_duracion = ? WHERE id_horario = ?",
      [id_aula, dia_semana, hora_inicio, horas_duracion, id]
    );
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query("DELETE FROM HORARIO WHERE id_horario = ?", [id]);
    return result;
  }
};
