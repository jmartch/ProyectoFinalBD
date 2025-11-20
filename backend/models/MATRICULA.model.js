// models/MATRICULA.model.js
import db from "../config/db.js";

/*
MATRICULA in diagram: PK,FK id_IED and PK,FK doc_estudiante (composite).
Here we expose helper functions that assume there is also an auto id column optionally;
if your table only has composite PK, use getByKeys/add/removeByKeys.
*/

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM MATRICULA");
    return rows;
  },

  // If you have an auto-increment id column:
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM MATRICULA WHERE id = ?", [id]);
    return rows[0];
  },

  // Use this when PK is composite
  getByKeys: async (id_IED, doc_estudiante) => {
    const [rows] = await db.query(
      "SELECT * FROM MATRICULA WHERE id_IED = ? AND doc_estudiante = ?",
      [id_IED, doc_estudiante]
    );
    return rows[0];
  },

  create: async ({ id_IED, doc_estudiante, fecha }) => {
    const [result] = await db.query(
      "INSERT INTO MATRICULA (id_IED, doc_estudiante, fecha) VALUES (?, ?, ?)",
      [id_IED, doc_estudiante, fecha]
    );
    return { insertId: result.insertId };
  },

  // If composite PK, use updateByKeys
  update: async (id, { id_IED, doc_estudiante, fecha }) => {
    const [result] = await db.query(
      "UPDATE MATRICULA SET id_IED = ?, doc_estudiante = ?, fecha = ? WHERE id = ?",
      [id_IED, doc_estudiante, fecha, id]
    );
    return result;
  },

  updateByKeys: async (id_IED, doc_estudiante, { fecha }) => {
    const [result] = await db.query(
      "UPDATE MATRICULA SET fecha = ? WHERE id_IED = ? AND doc_estudiante = ?",
      [fecha, id_IED, doc_estudiante]
    );
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query("DELETE FROM MATRICULA WHERE id = ?", [id]);
    return result;
  },

  removeByKeys: async (id_IED, doc_estudiante) => {
    const [result] = await db.query(
      "DELETE FROM MATRICULA WHERE id_IED = ? AND doc_estudiante = ?",
      [id_IED, doc_estudiante]
    );
    return result;
  }
};
