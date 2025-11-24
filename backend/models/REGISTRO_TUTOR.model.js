// models/REGISTRO_TUTORES.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM REGISTRO_TUTORES");
    return rows;
  },

  getByKeys: async (doc_funcionario, id_tutor) => {
    const [rows] = await db.query(
      "SELECT * FROM REGISTRO_TUTORES WHERE doc_funcionario=? AND id_tutor=?",
      [doc_funcionario, id_tutor]
    );
    return rows[0];
  },

  create: async ({ doc_funcionario, id_tutor, fecha_asignacion }) => {
    const [result] = await db.query(
      "INSERT INTO REGISTRO_TUTORES (doc_funcionario, id_tutor, fecha_asignacion) VALUES (?, ?, ?)",
      [doc_funcionario, id_tutor, fecha_asignacion]
    );
    return result;
  },

  updateByKeys: async (doc_funcionario, id_tutor, { fecha_asignacion }) => {
    const [result] = await db.query(
      "UPDATE REGISTRO_TUTORES SET fecha_asignacion=? WHERE doc_funcionario=? AND id_tutor=?",
      [fecha_asignacion, doc_funcionario, id_tutor]
    );
    return result;
  },

  removeByKeys: async (doc_funcionario, id_tutor) => {
    const [result] = await db.query(
      "DELETE FROM REGISTRO_TUTORES WHERE doc_funcionario=? AND id_tutor=?",
      [doc_funcionario, id_tutor]
    );
    return result;
  }
};
