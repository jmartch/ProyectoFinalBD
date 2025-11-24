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

  create: async () => {
    const [result] = await db.query("INSERT INTO TUTOR () VALUES ()");
    return { insertId: result.insertId };
  },

  remove: async (id_tutor) => {
    const [result] = await db.query(
      "DELETE FROM TUTOR WHERE id_tutor=?",
      [id_tutor]
    );
    return result;
  }
};
