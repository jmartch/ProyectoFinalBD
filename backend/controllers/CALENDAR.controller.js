import {
  fetchCalendarEvents,
  fetchCalendarFilters,
} from '../models/CALENDAR.model.js';

// GET /api/calendar/events
export const getCalendarEvents = async (req, res, next) => {
  try {
    const {
      role,
      doc_funcionario,
      filterProgram,
      filterInstitution,
      filterAula,
      filterTutor,
      filterStudent,
    } = req.query;

    if (!role) {
      return res
        .status(400)
        .json({ error: 'El parámetro "role" es obligatorio' });
    }

    if (role === 'TUTOR' && !doc_funcionario) {
      return res.status(400).json({
        error: 'Para role = "TUTOR" debes enviar también "doc_funcionario"',
      });
    }

    const rows = await fetchCalendarEvents({
      role,
      doc_funcionario,
      filterProgram,
      filterInstitution,
      filterAula,
      filterTutor,
      filterStudent,
    });

    // Adaptamos al formato que espera el front (CalendarEvent[])
    const events = rows.map((row) => ({
      id: `${row.id_aula}-${row.id_horario}`,
      aulaId: row.id_aula,
      aulaCode: `AULA ${row.id_aula}`, // si luego agregas columna "code" en aula, cámbialo aquí
      institutionName: row.nombre_ied,
      sedeName: row.direccion_sede,
      startTime: row.hora_inicio,
      endTime: row.hora_fin,
      dayOfWeek: row.dia_semana,          // 'LUNES', 'MARTES', ...
      programType: row.nombre_programa,   // 'INSIDECLASSROOM' / 'OUTSIDECLASSROOM'
      studentsCount: row.studentsCount,
      grade: row.grado,
    }));

    res.json({
      events,
      userRole: role,
      totalClasses: events.length,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/calendar/filters
export const getCalendarFiltersController = async (req, res, next) => {
  try {
    const { role, doc_funcionario } = req.query;

    if (!role) {
      return res
        .status(400)
        .json({ error: 'El parámetro "role" es obligatorio' });
    }

    const data = await fetchCalendarFilters({ role, doc_funcionario });

    const programs = data.programs || [];
    const institutions = data.institutions || [];

    // Adaptar aulas al shape que usa el front
    const aulas = (data.aulas || []).map((aula) => ({
      id_aula: aula.id_aula,
      code: aula.code || `AULA ${aula.id_aula}`, // placeholder hasta que tengas un campo real
      grade: aula.grado,
      programType: aula.nombre_programa,        // INSIDECLASSROOM / OUTSIDECLASSROOM
    }));

    let tutors;
    if (data.tutors && data.tutors.length > 0) {
      tutors = data.tutors.map((t) => ({
        id_tutor: t.id_tutor,
        fullName:
          t.fullName ||
          [t.nombre1, t.nombre2, t.apellido1, t.apellido2]
            .filter(Boolean)
            .join(' '),
      }));
    }

    let students;
    if (data.students && data.students.length > 0) {
      students = data.students.map((s) => ({
        doc_estudiante: s.doc_estudiante,
        fullName:
          s.fullName ||
          [s.nombre1, s.nombre2, s.apellido1, s.apellido2]
            .filter(Boolean)
            .join(' '),
      }));
    }

    res.json({
      userRole: role,
      programs,
      institutions,
      aulas,
      tutors,
      students,
    });
  } catch (error) {
    next(error);
  }
};
