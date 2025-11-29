// models/TUTOR.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM TUTOR");
    return rows;
  },

  getById: async (id_tutor) => {
    const [rows] = await db.query(
      "SELECT * FROM TUTOR WHERE id_tutor=?",
      [id_tutor]
    );
    return rows[0];
  },

  // Crea un tutor nuevo (asumiendo id_tutor autoincremental)
  create: async () => {
    const [result] = await db.query("INSERT INTO TUTOR () VALUES ()");
    return { insertId: result.insertId };
  },

  // Placeholder de update por si luego agregan columnas al tutor
  update: async (id_tutor, data = {}) => {
    // Actualmente no hay campos que actualizar, pero dejamos el método
    // por compatibilidad. Solo verifica que el tutor exista.
    const [result] = await db.query(
      "UPDATE TUTOR SET id_tutor = id_tutor WHERE id_tutor = ?",
      [id_tutor]
    );
    return result;
  },

  remove: async (id_tutor) => {
    const [result] = await db.query(
      "DELETE FROM TUTOR WHERE id_tutor=?",
      [id_tutor]
    );
    return result;
  }
};
