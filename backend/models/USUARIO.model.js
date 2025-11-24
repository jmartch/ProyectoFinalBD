// models/USUARIO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM USUARIO");
    return rows;
  },

  getById: async (usuario) => {
    const [rows] = await db.query(
      "SELECT * FROM USUARIO WHERE usuario=?",
      [usuario]
    );
    return rows[0];
  },

  create: async ({ usuario, doc_funcionario, contraseña, rol }) => {
    const [result] = await db.query(
      "INSERT INTO USUARIO (usuario, doc_funcionario, contraseña, rol) VALUES (?, ?, ?, ?)",
      [usuario, doc_funcionario, contraseña, rol]
    );
    return result;
  },

  update: async (usuario, data) => {
    const { doc_funcionario, contraseña, rol } = data;
    const [result] = await db.query(
      "UPDATE USUARIO SET doc_funcionario=?, contraseña=?, rol=? WHERE usuario=?",
      [doc_funcionario, contraseña, rol, usuario]
    );
    return result;
  },

  remove: async (usuario) => {
    const [result] = await db.query(
      "DELETE FROM USUARIO WHERE usuario=?",
      [usuario]
    );
    return result;
  }
};
