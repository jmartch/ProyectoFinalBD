// models/REGISTRO_CLASES.model.js
import db from "../config/db.js";

export default {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM registro_clases");
    return rows;
  },

  getById: async (num_registro) => {
    const [rows] = await db.query(
      "SELECT * FROM registro_clases WHERE num_registro = ?",
      [num_registro]
    );
    return rows[0];
  },

  create: async ({
    numero_semana,
    id_aula,
    codigo_motivo,
    fecha,
    dictada,
    is_festivo,
    fecha_reposicion
  }) => {
    const [result] = await db.query(
      `INSERT INTO registro_clases 
       (numero_semana, id_aula, codigo_motivo, fecha, dictada, is_festivo, fecha_reposicion)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        numero_semana,
        id_aula,
        codigo_motivo,
        fecha,
        dictada,
        is_festivo,
        fecha_reposicion
      ]
    );
    return { insertId: result.insertId };
  },

  updateById: async (num_registro, data) => {
    const {
      numero_semana,
      id_aula,
      codigo_motivo,
      fecha,
      dictada,
      is_festivo,
      fecha_reposicion
    } = data;

    const [result] = await db.query(
      `UPDATE registro_clases SET 
        numero_semana = ?, 
        id_aula = ?, 
        codigo_motivo = ?, 
        fecha = ?, 
        dictada = ?, 
        is_festivo = ?, 
        fecha_reposicion = ?
       WHERE num_registro = ?`,
      [
        numero_semana,
        id_aula,
        codigo_motivo,
        fecha,
        dictada,
        is_festivo,
        fecha_reposicion,
        num_registro
      ]
    );
    return result;
  },

  removeById: async (num_registro) => {
    const [result] = await db.query(
      "DELETE FROM registro_clases WHERE num_registro = ?",
      [num_registro]
    );
    return result;
  }
};
