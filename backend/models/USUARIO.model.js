// models/USUARIO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM USUARIO");
    return rows;
  },

  getById: async (usuario) => {
    const [rows] = await db.query("SELECT * FROM USUARIO WHERE usuario = ?", [usuario]);
    return rows[0];
  },

  create: async ({ usuario, id_funcionario, contraseña, rol }) => {
    const [result] = await db.query(
      "INSERT INTO USUARIO (usuario, id_funcionario, contraseña, rol) VALUES (?, ?, ?, ?)",
      [usuario, id_funcionario, contraseña, rol]
    );
    return { insertId: result.insertId };
  },

  update: async (usuario, data) => {
    const fields = [];
    const values = [];
    for (const [k, v] of Object.entries(data)) {
      fields.push(`${k} = ?`);
      values.push(v);
    }
    values.push(usuario);
    const sql = `UPDATE USUARIO SET ${fields.join(", ")} WHERE usuario = ?`;
    const [result] = await db.query(sql, values);
    return result;
  },

  remove: async (usuario) => {
    const [result] = await db.query("DELETE FROM USUARIO WHERE usuario = ?", [usuario]);
    return result;
  }
};
