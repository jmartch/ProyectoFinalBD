// models/TUTOR.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM TUTOR");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM TUTOR WHERE id_tutor = ?", [id]);
    return rows[0];
  },

  create: async ({ id_tutor }) => {
    const [result] = await db.query("INSERT INTO TUTOR (id_tutor) VALUES (?)", [id_tutor]);
    return { insertId: result.insertId };
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    for (const [k, v] of Object.entries(data)) {
      fields.push(`${k} = ?`);
      values.push(v);
    }
    values.push(id);
    const sql = `UPDATE TUTOR SET ${fields.join(", ")} WHERE id_tutor = ?`;
    const [result] = await db.query(sql, values);
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query("DELETE FROM TUTOR WHERE id_tutor = ?", [id]);
    return result;
  }
};
