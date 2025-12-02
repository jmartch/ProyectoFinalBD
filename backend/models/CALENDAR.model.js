// models/CALENDAR.model.js
import db from '../config/db.js';

/**
 * Obtiene los eventos del calendario según el rol y los filtros.
 * options:
 *  - role: 'ADMIN' | 'ADMINISTRATIVO' | 'TUTOR'
 *  - doc_funcionario?: string (obligatorio si role = 'TUTOR')
 *  - filterProgram?: string      // INSIDECLASSROOM | OUTSIDECLASSROOM
 *  - filterInstitution?: string  // id_ied
 *  - filterAula?: string         // id_aula
 *  - filterTutor?: string        // id_tutor
 *  - filterStudent?: string      // doc_estudiante
 */
export async function fetchCalendarEvents(options) {
  const {
    role,
    doc_funcionario,
    filterProgram,
    filterInstitution,
    filterAula,
    filterTutor,
    filterStudent,
  } = options;

  const params = [];
  let where = 'WHERE 1=1';

  // 🔐 Filtrado por rol
  if (role === 'TUTOR') {
    // Solo aulas del tutor (funcionario) logueado
    where += ' AND f.doc_funcionario = ?';
    params.push(doc_funcionario);
  }

  // 🎛 Filtros opcionales
  if (filterProgram && filterProgram !== 'ALL') {
    // Asumimos que nombre_programa almacena INSIDECLASSROOM / OUTSIDECLASSROOM
    where += ' AND p.nombre_programa = ?';
    params.push(filterProgram);
  }

  if (filterInstitution && filterInstitution !== 'ALL') {
    where += ' AND i.id_ied = ?';
    params.push(filterInstitution);
  }

  if (filterAula && filterAula !== 'ALL') {
    where += ' AND a.id_aula = ?';
    params.push(filterAula);
  }

  if (filterTutor && filterTutor !== 'ALL') {
    // Filtra por id_tutor (lo que manda el front)
    where += ' AND t.id_tutor = ?';
    params.push(filterTutor);
  }

  if (filterStudent && filterStudent !== 'ALL') {
    where += ' AND m.doc_estudiante = ?';
    params.push(filterStudent);
  }

  const [rows] = await db.query(
    `
    SELECT
      a.id_aula,
      a.grado,
      p.nombre_programa AS nombre_programa,
      i.id_ied,
      i.nombre AS nombre_ied,
      s.id_sede,
      s.direccion AS direccion_sede,
      h.id_horario,
      h.dia_semana,
      TIME_FORMAT(h.hora_inicio, '%H:%i') AS hora_inicio,
      TIME_FORMAT(
        ADDTIME(h.hora_inicio, SEC_TO_TIME(h.horas_duracion * 3600)),
        '%H:%i'
      ) AS hora_fin,
      COUNT(DISTINCT m.doc_estudiante) AS studentsCount
    FROM aula a
    JOIN sede s ON a.id_sede = s.id_sede
    JOIN ied i ON s.id_ied = i.id_ied
    JOIN programa p ON a.id_programa = p.id_programa
    JOIN asignacion_aula_horario aah ON a.id_aula = aah.id_aula
    JOIN horario h ON aah.id_horario = h.id_horario
    LEFT JOIN matricula m ON m.id_aula = a.id_aula
    LEFT JOIN aula_tutor at2 ON at2.id_aula = a.id_aula
    LEFT JOIN tutor t ON t.id_tutor = at2.id_tutor
    LEFT JOIN registro_tutor rt ON rt.id_tutor = t.id_tutor
    LEFT JOIN funcionario f ON f.doc_funcionario = rt.doc_funcionario
    ${where}
    GROUP BY
      a.id_aula,
      a.grado,
      p.nombre_programa,
      i.id_ied,
      i.nombre,
      s.id_sede,
      s.direccion,
      h.id_horario,
      h.dia_semana,
      h.hora_inicio,
      h.horas_duracion
    ORDER BY
      FIELD(h.dia_semana, 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'),
      h.hora_inicio;
    `,
    params
  );

  return rows;
}

/**
 * Obtiene las opciones de filtros según el rol.
 * - ADMIN / ADMINISTRATIVO: ve todo
 * - TUTOR: solo aulas asociadas a ese tutor
 */
export async function fetchCalendarFilters({ role, doc_funcionario }) {
  // Programas
  const [programs] = await db.query(
    'SELECT id_programa, nombre_programa FROM programa ORDER BY nombre_programa'
  );

  // IEDs
  const [institutions] = await db.query(
    'SELECT id_ied, nombre FROM ied ORDER BY nombre'
  );

  // Aulas (todas o solo las del tutor)
  let aulasQuery = `
    SELECT 
      a.id_aula,
      a.grado,
      p.nombre_programa AS nombre_programa
    FROM aula a
    JOIN sede s ON a.id_sede = s.id_sede
    JOIN ied i ON s.id_ied = i.id_ied
    JOIN programa p ON a.id_programa = p.id_programa
  `;
  const aulasParams = [];

  if (role === 'TUTOR' && doc_funcionario) {
    aulasQuery += `
      JOIN aula_tutor at2 ON at2.id_aula = a.id_aula
      JOIN tutor t ON t.id_tutor = at2.id_tutor
      JOIN registro_tutor rt ON rt.id_tutor = t.id_tutor
      WHERE rt.doc_funcionario = ?
    `;
    aulasParams.push(doc_funcionario);
  }

  aulasQuery += ' ORDER BY a.id_aula';

  const [aulas] = await db.query(aulasQuery, aulasParams);

  // Solo admin/adminstrativo ve tutores y estudiantes
  let tutors = [];
  let students = [];

  if (role === 'ADMIN' || role === 'ADMINISTRATIVO') {
    const [tutorsRows] = await db.query(`
      SELECT DISTINCT
        t.id_tutor,
        f.nombre1,
        f.nombre2,
        f.apellido1,
        f.apellido2
      FROM funcionario f
      JOIN registro_tutor rt ON rt.doc_funcionario = f.doc_funcionario
      JOIN tutor t ON t.id_tutor = rt.id_tutor
      ORDER BY f.apellido1, f.nombre1
    `);
    tutors = tutorsRows;

    const [studentsRows] = await db.query(`
      SELECT
        e.doc_estudiante,
        e.nombre1,
        e.nombre2,
        e.apellido1,
        e.apellido2
      FROM estudiante e
      ORDER BY e.apellido1, e.nombre1
    `);
    students = studentsRows;
  }

  return { programs, institutions, aulas, tutors, students };
}
