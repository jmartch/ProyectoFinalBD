import pool from "../config/db.js";

const Periodo = {
  // Obtener todos los periodos
  async getAll() {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id_periodo,
        p.fecha_inicio,
        p.fecha_fin
      FROM periodo p
      ORDER BY p.fecha_inicio
      `
    );
    return rows;
  },

  // Obtener periodo por ID
  async getById(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id_periodo,
        p.fecha_inicio,
        p.fecha_fin
      FROM periodo p
      WHERE p.id_periodo = ?
      `,
      [id]
    );
    return rows[0] || null;
  },

  // Periodos activos (fecha actual dentro del rango)
  async getActive() {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id_periodo,
        p.fecha_inicio,
        p.fecha_fin
      FROM periodo p
      WHERE CURDATE() BETWEEN p.fecha_inicio AND p.fecha_fin
      ORDER BY p.fecha_inicio
      `
    );
    return rows;
  },

  // Crear un nuevo periodo
  async create({ fecha_inicio, fecha_fin }) {
    const [result] = await pool.query(
      `
      INSERT INTO periodo (fecha_inicio, fecha_fin)
      VALUES (?, ?)
      `,
      [fecha_inicio, fecha_fin]
    );
    return result;
  },

  // Actualizar un periodo
  async updateById(id, { fecha_inicio, fecha_fin }) {
    const [result] = await pool.query(
      `
      UPDATE periodo
      SET fecha_inicio = ?, fecha_fin = ?
      WHERE id_periodo = ?
      `,
      [fecha_inicio, fecha_fin, id]
    );
    return result;
  },

  // Eliminar un periodo
  async removeById(id) {
    const [result] = await pool.query(
      `
      DELETE FROM periodo
      WHERE id_periodo = ?
      `,
      [id]
    );
    return result;
  },

  // Verificar solapamiento de fechas
  async checkOverlap(fecha_inicio, fecha_fin, excludeId = null) {
    let sql = `
      SELECT 1 AS overlap
      FROM periodo
      WHERE NOT (fecha_fin < ? OR fecha_inicio > ?)
    `;
    const params = [fecha_inicio, fecha_fin];

    if (excludeId) {
      sql += " AND id_periodo <> ?";
      params.push(excludeId);
    }

    const [rows] = await pool.query(sql, params);
    return rows.length > 0;
  },
};

export default Periodo;
    