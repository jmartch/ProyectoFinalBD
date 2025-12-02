// models/PERIODO.model.js
import pool from "../config/db.js";

const Periodo = {
  // Obtener todos los periodos (con info del programa)
  async getAll() {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id_periodo,
        p.id_programa,
        p.fecha_inicio,
        p.fecha_fin,
        prog.nombre_programa AS nombre_programa
      FROM periodo p
      INNER JOIN programa prog 
        ON prog.id_programa = p.id_programa
      ORDER BY p.id_programa, p.fecha_inicio
      `
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id_periodo,
        p.id_programa,
        p.fecha_inicio,
        p.fecha_fin,
        prog.nombre_programa AS nombre_programa
      FROM periodo p
      INNER JOIN programa prog 
        ON prog.id_programa = p.id_programa
      WHERE p.id_periodo = ?
      `,
      [id]
    );
    return rows[0] || null;
  },

  // Periodos "activos" (fecha actual dentro del rango)
  async getActive() {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id_periodo,
        p.id_programa,
        p.fecha_inicio,
        p.fecha_fin,
        prog.nombre_programa AS nombre_programa
      FROM periodo p
      INNER JOIN programa prog 
        ON prog.id_programa = p.id_programa
      WHERE CURDATE() BETWEEN p.fecha_inicio AND p.fecha_fin
      ORDER BY p.id_programa, p.fecha_inicio
      `
    );
    return rows;
  },

  async create({ id_programa, fecha_inicio, fecha_fin }) {
    const [result] = await pool.query(
      `
      INSERT INTO periodo (id_programa, fecha_inicio, fecha_fin)
      VALUES (?, ?, ?)
      `,
      [id_programa, fecha_inicio, fecha_fin]
    );
    return result;
  },

  async updateById(id, { id_programa, fecha_inicio, fecha_fin }) {
    const [result] = await pool.query(
      `
      UPDATE periodo
      SET id_programa = ?, fecha_inicio = ?, fecha_fin = ?
      WHERE id_periodo = ?
      `,
      [id_programa, fecha_inicio, fecha_fin, id]
    );
    return result;
  },

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

  async checkProgramaExists(id_programa) {
    const [rows] = await pool.query(
      `
      SELECT 1 AS existe
      FROM programa
      WHERE id_programa = ?
      LIMIT 1
      `,
      [id_programa]
    );
    return rows.length > 0;
  },

  // Verificar solapamiento de fechas entre periodos
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
