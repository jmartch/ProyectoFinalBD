// backend/models/REGISTRO_TUTOR.model.js
import db from "../config/db.js";

const RegistroTutorModel = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM registro_tutor");
    return rows;
  },

  create: async ({ doc_funcionario, id_tutor, fecha_asignacion }) => {
    await db.query(
      `
      INSERT INTO registro_tutor (doc_funcionario, id_tutor, fecha_asignacion)
      VALUES (?, ?, ?)
      `,
      [doc_funcionario, id_tutor, fecha_asignacion]
    );

    return {
      doc_funcionario,
      id_tutor,
      fecha_asignacion,
    };
  },
};

export default RegistroTutorModel;
