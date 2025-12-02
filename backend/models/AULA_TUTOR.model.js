// backend/models/AULA_TUTOR.model.js
import db from "../config/db.js";

const AulaTutorModel = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM aula_tutor");
    return rows;
  },

  create: async ({ id_aula, id_tutor, fecha_asignacion, fecha_fin = null }) => {
    await db.query(
      `
      INSERT INTO aula_tutor (id_aula, id_tutor, fecha_asignacion, fecha_fin)
      VALUES (?, ?, ?, ?)
      `,
      [id_aula, id_tutor, fecha_asignacion, fecha_fin]
    );

    return {
      id_aula,
      id_tutor,
      fecha_asignacion,
      fecha_fin,
    };
  },
};

export default AulaTutorModel;
