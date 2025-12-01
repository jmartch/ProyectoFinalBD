// backend/models/SEDE.model.js
import db from "../config/db.js";

const SEDE = {
  // Obtener todas las sedes
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT id_sede, id_ied, direccion, tipo FROM sede"
    );
    return rows;
  },

  // Obtener una sede por id
  getById: async (id_sede) => {
    const [rows] = await db.query(
      "SELECT id_sede, id_ied, direccion, tipo FROM sede WHERE id_sede = ?",
      [id_sede]
    );
    return rows[0];
  },

  // Crear sede
  create: async ({ id_ied, direccion, tipo }) => {
    const [result] = await db.query(
      "INSERT INTO sede (id_ied, direccion, tipo) VALUES (?, ?, ?)",
      [id_ied, direccion, tipo]
    );
    return { insertId: result.insertId };
  },

  // Actualizar sede
  update: async (id_sede, { id_ied, direccion, tipo }) => {
    const [result] = await db.query(
      "UPDATE sede SET id_ied = ?, direccion = ?, tipo = ? WHERE id_sede = ?",
      [id_ied, direccion, tipo, id_sede]
    );
    return result;
  },

  // Eliminar sede
  remove: async (id_sede) => {
    const [result] = await db.query(
      "DELETE FROM sede WHERE id_sede = ?",
      [id_sede]
    );
    return result;
  },
};

export default SEDE;
