// backend/models/SEMANA.model.js
import db from "../config/db.js";

const Semana = {
  // Obtener todas las semanas (ordenadas por fecha_inicio)
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT numero_semana, id_periodo, fecha_inicio, fecha_fin FROM semana ORDER BY fecha_inicio ASC"
    );
    return rows;
  },

  // Obtener una semana por su PK
  getById: async (numero_semana) => {
    const [rows] = await db.query(
      "SELECT numero_semana, id_periodo, fecha_inicio, fecha_fin FROM semana WHERE numero_semana = ?",
      [numero_semana]
    );
    return rows[0];
  },

  // Obtener semanas por periodo
  getByPeriodo: async (id_periodo) => {
    const [rows] = await db.query(
      "SELECT numero_semana, id_periodo, fecha_inicio, fecha_fin FROM semana WHERE id_periodo = ? ORDER BY fecha_inicio ASC",
      [id_periodo]
    );
    return rows;
  },

  // Crear una sola semana (para el CRUD básico)
  create: async ({ id_periodo, fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "INSERT INTO semana (id_periodo, fecha_inicio, fecha_fin) VALUES (?, ?, ?)",
      [id_periodo, fecha_inicio, fecha_fin]
    );
    return result;
  },

  // Actualizar una semana
  updateById: async (numero_semana, { id_periodo, fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "UPDATE semana SET id_periodo = ?, fecha_inicio = ?, fecha_fin = ? WHERE numero_semana = ?",
      [id_periodo, fecha_inicio, fecha_fin, numero_semana]
    );
    return result;
  },

  // Eliminar una semana
  removeById: async (numero_semana) => {
    const [result] = await db.query(
      "DELETE FROM semana WHERE numero_semana = ?",
      [numero_semana]
    );
    return result;
  },

  // 🔹 NUEVO: eliminar todas las semanas de un periodo
  deleteByPeriodo: async (id_periodo) => {
    const [result] = await db.query(
      "DELETE FROM semana WHERE id_periodo = ?",
      [id_periodo]
    );
    return result;
  },

  // 🔹 NUEVO: inserción masiva de semanas para un periodo
  bulkCreate: async (id_periodo, semanas) => {
    if (!semanas || semanas.length === 0) {
      return { affectedRows: 0 };
    }

    const values = semanas.map(() => "(?, ?, ?)").join(", ");
    const params = [];
    semanas.forEach(({ fecha_inicio, fecha_fin }) => {
      params.push(id_periodo, fecha_inicio, fecha_fin);
    });

    const [result] = await db.query(
      `INSERT INTO semana (id_periodo, fecha_inicio, fecha_fin) VALUES ${values}`,
      params
    );

    return result;
  },
};

export default Semana;
