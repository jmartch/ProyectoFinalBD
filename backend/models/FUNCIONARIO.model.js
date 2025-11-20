// models/FUNCIONARIO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM FUNCIONARIO");
    return rows;
  },

  getById: async (doc) => {
    const [rows] = await db.query("SELECT * FROM FUNCIONARIO WHERE doc_funcionario = ?", [doc]);
    return rows[0];
  },

  create: async ({ doc_funcionario, tipo_doc, nombre1, nombre2, apellido1, apellido2, correo, telefono, sexo, fecha_contrato }) => {
    const [result] = await db.query(
      `INSERT INTO FUNCIONARIO
       (doc_funcionario, tipo_doc, nombre1, nombre2, apellido1, apellido2, correo, telefono, sexo, fecha_contrato)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [doc_funcionario, tipo_doc, nombre1, nombre2, apellido1, apellido2, correo, telefono, sexo, fecha_contrato]
    );
    return { insertId: result.insertId };
  },

  update: async (doc, data) => {
    const fields = [];
    const values = [];
    for (const [k, v] of Object.entries(data)) {
      fields.push(`${k} = ?`);
      values.push(v);
    }
    if (fields.length === 0) return;
    values.push(doc);
    const sql = `UPDATE FUNCIONARIO SET ${fields.join(", ")} WHERE doc_funcionario = ?`;
    const [result] = await db.query(sql, values);
    return result;
  },

  remove: async (doc) => {
    const [result] = await db.query("DELETE FROM FUNCIONARIO WHERE doc_funcionario = ?", [doc]);
    return result;
  }
};
