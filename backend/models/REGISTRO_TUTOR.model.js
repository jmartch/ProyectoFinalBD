// models/REGISTRO_TUTORES.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM REGISTRO_TUTORES");
    return rows;
  },

  getByKeys: async (doc_funcionario, id_tutor, fecha_asignacion) => {
    const [rows] = await db.query(
      "SELECT * FROM REGISTRO_TUTOR WHERE doc_funcionario=? AND id_tutor=? AND fecha_asignacion=?",
      [doc_funcionario, id_tutor, fecha_asignacion]
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

  updateByKeys: async (doc_funcionario, id_tutor, fecha_asignacion, { new_fecha_asignacion }) => {
    const [result] = await db.query(
      "UPDATE REGISTRO_TUTOR SET fecha_asignacion=? WHERE doc_funcionario=? AND id_tutor=? AND fecha_asignacion=?",
      [new_fecha_asignacion, doc_funcionario, id_tutor, fecha_asignacion]
    );
    return result;
  },

  removeByKeys: async (doc_funcionario, id_tutor, fecha_asignacion) => {
    const [result] = await db.query(
      "DELETE FROM REGISTRO_TUTOR WHERE doc_funcionario=? AND id_tutor=? AND fecha_asignacion=?",
      [doc_funcionario, id_tutor, fecha_asignacion]
    );
    return result;
  }
};
