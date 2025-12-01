// models/TUTOR.model.js
import db from "../config/db.js";

export default {
  // Lista cruda de tutores (solo id_tutor)
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

  // Crea un tutor nuevo (solo genera id_tutor AUTO_INCREMENT)
  create: async () => {
    const [result] = await db.query(
      "INSERT INTO tutor (id_tutor) VALUES (NULL)"
    );
    return { insertId: result.insertId };
  },

  // No-op: solo verifica si existe (no hay más columnas que actualizar)
  update: async (id_tutor, _data = {}) => {
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

  /**
   * Obtiene la info de dashboard para un FUNCIONARIO que es tutor:
   * - id_tutor asociado (via registro_tutor)
   * - aulas activas asignadas (via aula_tutor)
   * - IED, sede, grado, programa, #estudiantes
   * - horarios por aula
   */
  getDashboardDataByFuncionario: async (doc_funcionario) => {
    // 1) Buscar el id_tutor más reciente para ese funcionario
    const [rowsTutor] = await db.query(
      `
      SELECT t.id_tutor
      FROM tutor t
      JOIN registro_tutor rt ON rt.id_tutor = t.id_tutor
      WHERE rt.doc_funcionario = ?
      ORDER BY rt.fecha_asignacion DESC
      LIMIT 1
      `,
      [doc_funcionario]
    );

    if (rowsTutor.length === 0) {
      // No es tutor (o aún no se registró)
      return {
        doc_funcionario,
        id_tutor: null,
        aulas: [],
      };
    }

    const id_tutor = rowsTutor[0].id_tutor;

    // 2) Aulas activas de ese tutor + IED + sede + programa + #estudiantes
    const [rowsAulas] = await db.query(
      `
      SELECT
        a.id_aula,
        a.grado,
        p.id_programa,
        p.nombre_programa,
        s.id_sede,
        s.direccion AS sede_direccion,
        s.tipo AS sede_tipo,
        i.id_ied,
        i.nombre AS ied_nombre,
        COUNT(DISTINCT m.doc_estudiante) AS students_count
      FROM aula_tutor at
      JOIN aula a           ON a.id_aula = at.id_aula
      JOIN sede s           ON s.id_sede = a.id_sede
      JOIN ied i            ON i.id_ied = s.id_ied
      JOIN programa p       ON p.id_programa = a.id_programa
      JOIN registro_tutor rt ON rt.id_tutor = at.id_tutor
      LEFT JOIN matricula m 
        ON m.id_aula = a.id_aula
       AND m.fecha_fin IS NULL
      WHERE at.id_tutor = ?
        AND at.fecha_fin IS NULL
      GROUP BY
        a.id_aula,
        a.grado,
        p.id_programa,
        p.nombre_programa,
        s.id_sede,
        s.direccion,
        s.tipo,
        i.id_ied,
        i.nombre
      `,
      [id_tutor]
    );

    if (rowsAulas.length === 0) {
      return {
        doc_funcionario,
        id_tutor,
        aulas: [],
      };
    }

    const aulaIds = rowsAulas.map((r) => r.id_aula);

    // 3) Horarios de esas aulas (asignaciones activas)
    const placeholders = aulaIds.map(() => "?").join(",");
    const [rowsHorarios] = await db.query(
      `
      SELECT
        aah.id_aula,
        h.id_horario,
        h.dia_semana,
        h.hora_inicio,
        h.horas_duracion
      FROM asignacion_aula_horario aah
      JOIN horario h ON h.id_horario = aah.id_horario
      WHERE aah.id_aula IN (${placeholders})
        AND aah.fecha_fin IS NULL
      `,
      aulaIds
    );

    // 4) Agrupar horarios por aula
    const horariosPorAula = new Map();
    for (const h of rowsHorarios) {
      if (!horariosPorAula.has(h.id_aula)) {
        horariosPorAula.set(h.id_aula, []);
      }
      horariosPorAula.get(h.id_aula).push({
        id_horario: h.id_horario,
        dia_semana: h.dia_semana,
        hora_inicio: h.hora_inicio,
        horas_duracion: h.horas_duracion,
      });
    }

    // 5) Armar estructura final
    const aulas = rowsAulas.map((r) => ({
      id_aula: r.id_aula,
      grado: r.grado,
      programa: r.nombre_programa, // INSIDECLASSROOM / OUTSIDECLASSROOM (o como lo llames)
      students_count: r.students_count,
      sede: {
        id_sede: r.id_sede,
        direccion: r.sede_direccion,
        tipo: r.sede_tipo,
      },
      ied: {
        id_ied: r.id_ied,
        nombre: r.ied_nombre,
      },
      horarios: horariosPorAula.get(r.id_aula) || [],
    }));

    return {
      doc_funcionario,
      id_tutor,
      aulas,
    };
  },
};
