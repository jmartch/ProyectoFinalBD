// backend/models/ESTUDIANTE.model.js
import db from "../config/db.js";

export default {
  // Lista simple (sin joins)
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM estudiante");
    return rows;
  },

  // Lista con detalle: aula, grado, IED
  getAllWithDetalle: async () => {
    const [rows] = await db.query(`
      SELECT
        e.doc_estudiante,
        e.tipo_doc,
        e.nombre1,
        e.nombre2,
        e.apellido1,
        e.apellido2,
        e.sexo,
        e.correo_acudiente,
        e.telefono_acudiente,
        m.id_aula,
        a.grado,
        i.id_ied,
        i.nombre AS nombre_ied
      FROM estudiante e
      LEFT JOIN matricula m
        ON m.doc_estudiante = e.doc_estudiante
        AND (m.fecha_fin IS NULL OR m.fecha_fin > CURDATE())
      LEFT JOIN aula a
        ON a.id_aula = m.id_aula
      LEFT JOIN sede s
        ON s.id_sede = a.id_sede
      LEFT JOIN ied i
        ON i.id_ied = s.id_ied
    `);
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
      `
      INSERT INTO estudiante 
      (doc_estudiante, tipo_doc, nombre1, nombre2, apellido1, apellido2, sexo, correo_acudiente, telefono_acudiente)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
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
      `
      UPDATE estudiante SET 
        tipo_doc = ?, 
        nombre1 = ?, 
        nombre2 = ?, 
        apellido1 = ?, 
        apellido2 = ?, 
        sexo = ?, 
        correo_acudiente = ?, 
        telefono_acudiente = ?
      WHERE doc_estudiante = ?
      `,
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
