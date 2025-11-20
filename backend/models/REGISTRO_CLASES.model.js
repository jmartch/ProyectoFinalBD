// models/REGISTRO_CLASES.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM REGISTRO_CLASES");
    return rows;
  },

  getById: async (num) => {
    const [rows] = await db.query("SELECT * FROM REGISTRO_CLASES WHERE num_registro = ?", [num]);
    return rows[0];
  },

  create: async ({ id_aula, codigo, fecha, is_festivo, dictada, fecha_reposicion }) => {
    const [result] = await db.query(
      `INSERT INTO REGISTRO_CLASES (id_aula, codigo, fecha, is_festivo, dictada, fecha_reposicion)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_aula, codigo, fecha, is_festivo, dictada, fecha_reposicion]
    );
    return { insertId: result.insertId };
  },

  update: async (num, data) => {
    const fields = [];
    const values = [];
    for (const [k, v] of Object.entries(data)) {
      fields.push(`${k} = ?`);
      values.push(v);
    }
    values.push(num);
    const sql = `UPDATE REGISTRO_CLASES SET ${fields.join(", ")} WHERE num_registro = ?`;
    const [result] = await db.query(sql, values);
    return result;
  },

  remove: async (num) => {
    const [result] = await db.query("DELETE FROM REGISTRO_CLASES WHERE num_registro = ?", [num]);
    return result;
  }
};
