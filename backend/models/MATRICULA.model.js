// models/MATRICULA.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM matricula");
    return rows;
  },

  getByKeys: async (doc_estudiante, id_aula, fecha_inicio, fecha_fin, score_entrada, score_salida) => {
    const [rows] = await db.query(
      "SELECT * FROM matricula WHERE doc_estudiante = ? AND id_aula = ? AND fecha_inicio = ? AND fecha_fin = ? AND score_entrada = ? AND score_salida = ?",
      [doc_estudiante, id_aula, fecha_inicio, fecha_fin, score_entrada, score_salida]
    );
    return rows[0];
  },

  create: async ({ doc_estudiante, id_aula, fecha_inicio, fecha_fin, score_entrada, score_salida }) => {
    const [result] = await db.query(
      "INSERT INTO matricula (doc_estudiante, id_aula, fecha_inicio, fecha_fin, score_entrada, score_salida) VALUES (?, ?, ?, ?, ?, ?)",
      [doc_estudiante, id_aula, fecha_inicio, fecha_fin, score_entrada, score_salida]
    );
    return result;
  },

  updateByKeys: async (doc_estudiante, id_aula, fecha_inicio, { fecha_fin, score_entrada, score_salida }) => {
    const [result] = await db.query(
      "UPDATE matricula SET fecha_inicio = ?, fecha_fin = ? WHERE doc_estudiante = ? AND id_aula = ? AND fecha_inicio = ? AND score_entrada = ? AND score_salida = ?",
      [fecha_fin, score_entrada, score_salida, doc_estudiante, id_aula, fecha_inicio]
    );
    return result;
  },

  removeByKeys: async (doc_estudiante, id_aula, fecha_inicio) => {
    const [result] = await db.query(
      "DELETE FROM matricula WHERE doc_estudiante = ? AND id_aula = ? AND fecha_inicio = ?",
      [doc_estudiante, id_aula, fecha_inicio]
    );
    return result;
  }
};
