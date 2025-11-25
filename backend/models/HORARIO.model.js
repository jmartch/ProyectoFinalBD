// models/HORARIO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM HORARIO");
    return rows;
  },

  getById: async (id_horario) => {
    const [rows] = await db.query(
      "SELECT * FROM HORARIO WHERE id_horario = ?",
      [id_horario]
    );
    return rows[0];
  },

  create: async ({ dia_semana, hora_inicio, horas_duracion }) => {
    const [result] = await db.query(
      "INSERT INTO HORARIO (dia_semana, hora_inicio, horas_duracion) VALUES (?, ?, ?)",
      [dia_semana, hora_inicio, horas_duracion]
    );
    return { insertId: result.insertId };
  },

  update: async (id_horario, data) => {
    const { dia_semana, hora_inicio, horas_duracion } = data;
    const [result] = await db.query(
      "UPDATE HORARIO SET dia_semana=?, hora_inicio=?, horas_duracion=? WHERE id_horario=?",
      [dia_semana, hora_inicio, horas_duracion, id_horario]
    );
    return result;
  },

  remove: async (id_horario) => {
    const [result] = await db.query(
      "DELETE FROM HORARIO WHERE id_horario=?",
      [id_horario]
    );
    return result;
  }
};
