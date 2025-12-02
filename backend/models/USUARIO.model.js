// models/USUARIO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM usuario");
    return rows;
  },

  getById: async (usuario) => {
    const [rows] = await db.query("SELECT * FROM usuario WHERE usuario = ?", [
      usuario,
    ]);
    return rows[0];
  },

  create: async ({ usuario, doc_funcionario, contraseña, rol }) => {
    const [result] = await db.query(
      "INSERT INTO usuario (usuario, doc_funcionario, contraseña, rol) VALUES (?, ?, ?, ?)",
      [usuario, doc_funcionario, contraseña, rol]
    );
    return result;
  },

  update: async (usuario, data) => {
    // Construimos UPDATE dinámico según lo que venga en data
    const fields = [];
    const values = [];

    if (data.doc_funcionario !== undefined) {
      fields.push("doc_funcionario = ?");
      values.push(data.doc_funcionario);
    }
    if (data.contraseña !== undefined) {
      fields.push("contraseña = ?");
      values.push(data.contraseña);
    }
    if (data.rol !== undefined) {
      fields.push("rol = ?");
      values.push(data.rol);
    }

    if (fields.length === 0) {
      // nada que actualizar
      return { affectedRows: 0 };
    }

    values.push(usuario);
    const [result] = await db.query(
      `UPDATE usuario SET ${fields.join(", ")} WHERE usuario = ?`,
      values
    );
    return result;
  },

  remove: async (usuario) => {
    const [result] = await db.query(
      "DELETE FROM usuario WHERE usuario = ?",
      [usuario]
    );
    return result;
  },
};
