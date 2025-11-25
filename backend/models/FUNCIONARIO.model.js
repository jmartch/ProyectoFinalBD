// models/FUNCIONARIO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM FUNCIONARIO");
    return rows;
  },

  getById: async (doc_funcionario) => {
    const [rows] = await db.query(
      "SELECT * FROM FUNCIONARIO WHERE doc_funcionario=?",
      [doc_funcionario]
    );
    return rows[0];
  },

  create: async (data) => {
    const {
      doc_funcionario,
      tipo_doc,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      sexo,
      correo,
      telefono,
      fecha_contrato
    } = data;

    const [result] = await db.query(
      `INSERT INTO FUNCIONARIO 
      (doc_funcionario, tipo_doc, nombre1, nombre2, apellido1, apellido2, sexo, correo, telefono, fecha_contrato)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doc_funcionario,
        tipo_doc,
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        sexo,
        correo,
        telefono,
        fecha_contrato
      ]
    );

    return result;
  },

  update: async (doc_funcionario, data) => {
    const {
      tipo_doc,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      sexo,
      correo,
      telefono,
      fecha_contrato
    } = data;

    const [result] = await db.query(
      `UPDATE FUNCIONARIO SET 
      tipo_doc=?, nombre1=?, nombre2=?, apellido1=?, apellido2=?, sexo=?, correo=?, telefono=?, fecha_contrato=?
      WHERE doc_funcionario=?`,
      [
        tipo_doc,
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        sexo,
        correo,
        telefono,
        fecha_contrato,
        doc_funcionario
      ]
    );

    return result;
  },

  remove: async (doc_funcionario) => {
    const [result] = await db.query(
      "DELETE FROM FUNCIONARIO WHERE doc_funcionario=?",
      [doc_funcionario]
    );
    return result;
  }
};
