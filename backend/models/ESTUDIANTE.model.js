// models/ESTUDIANTE.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM estudiante");
    return rows;
  },

  getById: async (doc_estudiante) => {
    const [rows] = await db.query(
      "SELECT * FROM estudiante WHERE doc_estudiante = ?",
      [doc_estudiante]
    );
    return rows[0];
  },

  create: async (data) => {
    const {
      doc_estudiante,
      tipo_doc,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      sexo,
      correo_acudiente,
      telefono_acudiente,
    } = data;

    const [result] = await db.query(
      `INSERT INTO estudiante 
      (doc_estudiante, tipo_doc, nombre1, nombre2, apellido1, apellido2, sexo, correo_acudiente, telefono_acudiente)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doc_estudiante,
        tipo_doc,
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        sexo,
        correo_acudiente,
        telefono_acudiente,
      ]
    );

    return result;
  },

  update: async (doc_estudiante, data) => {
    const {
      tipo_doc,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      sexo,
      correo_acudiente,
      telefono_acudiente,
    } = data;

    const [result] = await db.query(
      `UPDATE estudiante SET 
        tipo_doc = ?, 
        nombre1 = ?, 
        nombre2 = ?, 
        apellido1 = ?, 
        apellido2 = ?, 
        sexo = ?, 
        correo_acudiente = ?, 
        telefono_acudiente = ?
      WHERE doc_estudiante = ?`,
      [
        tipo_doc,
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        sexo,
        correo_acudiente,
        telefono_acudiente,
        doc_estudiante,
      ]
    );

    return result;
  },

  remove: async (doc_estudiante) => {
    const [result] = await db.query(
      "DELETE FROM estudiante WHERE doc_estudiante = ?",
      [doc_estudiante]
    );
    return result;
  },
};
