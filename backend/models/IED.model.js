// models/SEDE.model.js
import db from "../config/db.js";

const Sede = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM sede");
    return rows;
  },

  getByIed: async (id_ied) => {
    const [rows] = await db.query(
      "SELECT * FROM sede WHERE id_ied = ?",
      [id_ied]
    );
    return rows;
  },

  create: async ({ id_ied, direccion, tipo }) => {
    const [result] = await db.query(
      "INSERT INTO sede (id_ied, direccion, tipo) VALUES (?, ?, ?)",
      [id_ied, direccion, tipo]
    );
    return { insertId: result.insertId };
  },

  remove: async (id_sede) => {
    const [result] = await db.query(
      "DELETE FROM sede WHERE id_sede = ?",
      [id_sede]
    );
    return result;
  }
};

export default Sede;
