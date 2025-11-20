// models/ESTUDIANTE.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM ESTUDIANTE");
    return rows;
  },

  getById: async (doc) => {
    const [rows] = await db.query("SELECT * FROM ESTUDIANTE WHERE doc_estudiante = ?", [doc]);
    return rows[0];
  },

  create: async ({ doc_estudiante, tipo_doc, nombre1, nombre2, apellido1, apellido2, correo_acudiente, telefono_acudiente, sexo }) => {
    const [result] = await db.query(
      `INSERT INTO ESTUDIANTE 
       (doc_estudiante, tipo_doc, nombre1, nombre2, apellido1, apellido2, correo_acudiente, telefono_acudiente, sexo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [doc_estudiante, tipo_doc, nombre1, nombre2, apellido1, apellido2, correo_acudiente, telefono_acudiente, sexo]
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
    values.push(doc);
    const sql = `UPDATE ESTUDIANTE SET ${fields.join(", ")} WHERE doc_estudiante = ?`;
    const [result] = await db.query(sql, values);
    return result;
  },

  remove: async (doc) => {
    const [result] = await db.query("DELETE FROM ESTUDIANTE WHERE doc_estudiante = ?", [doc]);
    return result;
  }
};
