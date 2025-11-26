// models/PERIODO.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM periodo");
    return rows;
  },

  getById: async (id_periodo) => {
    const [rows] = await db.query(
      "SELECT * FROM periodo WHERE id_periodo = ?",
      [id_periodo]
    );
    return rows[0];
  },

  create: async ({ fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "INSERT INTO periodo (fecha_inicio, fecha_fin) VALUES (?, ?)",
      [fecha_inicio, fecha_fin]
    );
    return { insertId: result.insertId };
  },

  updateById: async (id_periodo, { fecha_inicio, fecha_fin }) => {
    const [result] = await db.query(
      "UPDATE periodo SET fecha_inicio = ?, fecha_fin = ? WHERE id_periodo = ?",
      [fecha_inicio, fecha_fin, id_periodo]
    );
    return result;
  },

  removeById: async (id_periodo) => {
    const [result] = await db.query(
      "DELETE FROM periodo WHERE id_periodo = ?",
      [id_periodo]
    );
    return result;
  },

  // Periodos "activos" = fecha actual dentro del rango
  getActive: async () => {
    const [rows] = await db.query(
      "SELECT * FROM periodo WHERE CURDATE() BETWEEN fecha_inicio AND fecha_fin"
    );
    return rows;
  },

  // Verificar si un rango [fecha_inicio, fecha_fin] se solapa con otro periodo
  // Si se pasa excludeId, se excluye ese id_periodo (para updates)
  checkOverlap: async (fecha_inicio, fecha_fin, excludeId = null) => {
    let sql = `
      SELECT COUNT(*) AS count
      FROM periodo
      WHERE fecha_inicio <= ? 
        AND fecha_fin   >= ?
    `;
    const params = [fecha_fin, fecha_inicio];

    if (excludeId) {
      sql += " AND id_periodo <> ?";
      params.push(excludeId);
    }

    const [rows] = await db.query(sql, params);
    return rows[0].count > 0;
  }
};
