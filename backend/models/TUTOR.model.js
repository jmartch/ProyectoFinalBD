// backend/models/TUTOR.model.js
import db from "../config/db.js";

const TutorModel = {
  // CRUD básico
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM tutor");
    return rows;
  },

  getById: async (id_tutor) => {
    const [rows] = await db.query(
      "SELECT * FROM tutor WHERE id_tutor = ?",
      [id_tutor]
    );
    return rows[0];
  },

  // Crea un tutor nuevo (id_tutor AUTO_INCREMENT)
  create: async () => {
    const [result] = await db.query("INSERT INTO tutor () VALUES ()");
    return { insertId: result.insertId };
  },

  // Placeholder de update
  update: async (id_tutor, data = {}) => {
    const [result] = await db.query(
      "UPDATE tutor SET id_tutor = id_tutor WHERE id_tutor = ?",
      [id_tutor]
    );
    return result;
  },

  remove: async (id_tutor) => {
    const [result] = await db.query(
      "DELETE FROM tutor WHERE id_tutor = ?",
      [id_tutor]
    );
    return result;
  },

  // 🔹 NUEVO: todos los tutores con detalle (funcionario, usuario, aulas, estudiantes)
  getAllWithDetails: async () => {
    const [rows] = await db.query(`
      SELECT 
        t.id_tutor,
        rt.doc_funcionario,
        f.tipo_doc,
        f.nombre1,
        f.nombre2,
        f.apellido1,
        f.apellido2,
        f.sexo,
        f.correo,
        f.telefono,
        f.fecha_contrato,
        u.usuario AS username,
        u.rol,
        COUNT(DISTINCT at.id_aula) AS aulas_count,
        COUNT(DISTINCT m.doc_estudiante) AS estudiantes_count
      FROM tutor t
      JOIN registro_tutor rt ON rt.id_tutor = t.id_tutor
      JOIN funcionario f ON f.doc_funcionario = rt.doc_funcionario
      LEFT JOIN usuario u ON u.doc_funcionario = f.doc_funcionario
      LEFT JOIN aula_tutor at 
        ON at.id_tutor = t.id_tutor 
       AND (at.fecha_fin IS NULL OR at.fecha_fin > CURRENT_DATE())
      LEFT JOIN matricula m 
        ON m.id_aula = at.id_aula 
       AND (m.fecha_fin IS NULL OR m.fecha_fin > CURRENT_DATE())
      GROUP BY
        t.id_tutor,
        rt.doc_funcionario,
        f.tipo_doc,
        f.nombre1,
        f.nombre2,
        f.apellido1,
        f.apellido2,
        f.sexo,
        f.correo,
        f.telefono,
        f.fecha_contrato,
        u.usuario,
        u.rol
      ORDER BY f.apellido1, f.nombre1;
    `);
    return rows;
  },

  // 🔹 NUEVO: aulas + estudiantes para un tutor (a partir de doc_funcionario)
  getAulasYEstudiantesByDocFuncionario: async (doc_funcionario) => {
    const [rows] = await db.query(
      `
      SELECT
        a.id_aula,
        a.grado,
        s.id_sede,
        s.direccion AS direccion_sede,
        s.tipo AS tipo_sede,
        i.id_ied,
        i.nombre AS nombre_ied,
        e.doc_estudiante,
        e.tipo_doc AS est_tipo_doc,
        e.nombre1 AS est_nombre1,
        e.nombre2 AS est_nombre2,
        e.apellido1 AS est_apellido1,
        e.apellido2 AS est_apellido2,
        e.sexo AS est_sexo,
        e.correo_acudiente,
        e.telefono_acudiente
      FROM registro_tutor rt
      JOIN tutor t ON t.id_tutor = rt.id_tutor
      JOIN aula_tutor at 
        ON at.id_tutor = t.id_tutor
       AND (at.fecha_fin IS NULL OR at.fecha_fin > CURRENT_DATE())
      JOIN aula a ON a.id_aula = at.id_aula
      LEFT JOIN sede s ON s.id_sede = a.id_sede
      LEFT JOIN ied i ON i.id_ied = s.id_ied
      LEFT JOIN matricula m 
        ON m.id_aula = a.id_aula
       AND (m.fecha_fin IS NULL OR m.fecha_fin > CURRENT_DATE())
      LEFT JOIN estudiante e ON e.doc_estudiante = m.doc_estudiante
      WHERE rt.doc_funcionario = ?
      ORDER BY a.id_aula, est_apellido1, est_nombre1;
      `,
      [doc_funcionario]
    );
    return rows;
  },
};

export default TutorModel;
