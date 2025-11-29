// models/REGISTRO_TUTORES.model.js
import db from "../config/db.js";

/*
Composite PK: (doc_funcionario, id_tutor, fecha_asignacion)
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM REGISTRO_TUTORES");
    return rows;
  },

  getByKeys: async (doc_funcionario, id_tutor, fecha_asignacion) => {
    const [rows] = await db.query(
      "SELECT * FROM REGISTRO_TUTORES WHERE doc_funcionario = ? AND id_tutor = ? AND fecha_asignacion = ?",
      [doc_funcionario, id_tutor, fecha_asignacion]
    );
    return rows[0];
  },

  create: async ({ doc_funcionario, id_tutor, fecha_asignacion }) => {
    const [result] = await db.query(
      "INSERT INTO REGISTRO_TUTORES (doc_funcionario, id_tutor, fecha_asignacion) VALUES (?, ?, ?)",
      [doc_funcionario, id_tutor, fecha_asignacion]
    );
    return { insertId: result.insertId };
  },

  updateByKeys: async (
    doc_funcionario,
    id_tutor,
    fecha_asignacion,
    { nueva_fecha_asignacion }
  ) => {
    const [result] = await db.query(
      "UPDATE REGISTRO_TUTORES SET fecha_asignacion = ? WHERE doc_funcionario = ? AND id_tutor = ? AND fecha_asignacion = ?",
      [nueva_fecha_asignacion, doc_funcionario, id_tutor, fecha_asignacion]
    );
    return result;
  },

  removeByKeys: async (doc_funcionario, id_tutor, fecha_asignacion) => {
    const [result] = await db.query(
      "DELETE FROM REGISTRO_TUTORES WHERE doc_funcionario = ? AND id_tutor = ? AND fecha_asignacion = ?",
      [doc_funcionario, id_tutor, fecha_asignacion]
    );
    return result;
  }
};
