// models/MATRICULA.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM matricula");
    return rows;
  },

  getByKeys: async (doc_estudiante, id_ied) => {
    const [rows] = await db.query(
      "SELECT * FROM matricula WHERE doc_estudiante = ? AND id_ied = ?",
      [doc_estudiante, id_ied]
    );
    return rows[0];
  },

  create: async ({ doc_estudiante, id_ied, fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "INSERT INTO matricula (doc_estudiante, id_ied, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)",
      [doc_estudiante, id_ied, fecha_inicio, fecha_fin]
    );
    return result;
  },

  updateByKeys: async (doc_estudiante, id_ied, { fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "UPDATE matricula SET fecha_inicio = ?, fecha_fin = ? WHERE doc_estudiante = ? AND id_ied = ?",
      [fecha_inicio, fecha_fin, doc_estudiante, id_ied]
    );
    return result;
  },

  removeByKeys: async (doc_estudiante, id_ied) => {
    const [result] = await db.query(
      "DELETE FROM matricula WHERE doc_estudiante = ? AND id_ied = ?",
      [doc_estudiante, id_ied]
    );
    return result;
  }
};
