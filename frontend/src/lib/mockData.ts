// Datos de demostración para el sistema GLOBALENGLISH
import {
  User, Person, DocumentType, Institution, Sede, Aula, Schedule,
  TutorAssignment, Student, StudentAulaAssignment, Holiday, AbsenceReason,
  ClassAttendance, StudentAttendance, GradePeriod, GradeComponent,
  StudentGrade, ProgramWeek, UserRole, ProgramType, Grade, Jornada, DayOfWeek
} from '../types';

export const documentTypes: DocumentType[] = [
  { id: '1', code: 'CC', name: 'Cédula de Ciudadanía' },
  { id: '2', code: 'TI', name: 'Tarjeta de Identidad' },
  { id: '3', code: 'CE', name: 'Cédula de Extranjería' },
  { id: '4', code: 'PA', name: 'Pasaporte' },
];

export const persons: Person[] = [
  {
    id: '1',
    firstName: 'María',
    lastName: 'González',
    documentTypeId: '1',
    documentNumber: '1234567890',
    email: 'admin@globalenglish.edu',
    phone: '3001234567',
    role: UserRole.ADMINISTRADOR,
    isActive: true,
    hiredDate: new Date('2025-01-01'),
  },
  {
    id: '2',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    documentTypeId: '1',
    documentNumber: '9876543210',
    email: 'carlos.admin@globalenglish.edu',
    phone: '3009876543',
    role: UserRole.ADMINISTRATIVO,
    isActive: true,
    hiredDate: new Date('2025-01-15'),
  },
  {
    id: '3',
    firstName: 'Ana',
    lastName: 'Martínez',
    documentTypeId: '1',
    documentNumber: '5555555555',
    email: 'ana.tutor@globalenglish.edu',
    phone: '3005555555',
    role: UserRole.TUTOR,
    isActive: true,
    hiredDate: new Date('2025-02-01'),
  },
  {
    id: '4',
    firstName: 'Juan',
    lastName: 'Pérez',
    documentTypeId: '1',
    documentNumber: '6666666666',
    email: 'juan.tutor@globalenglish.edu',
    phone: '3006666666',
    role: UserRole.TUTOR,
    isActive: true,
    hiredDate: new Date('2025-02-01'),
  },
];

export const users: User[] = [
  {
    id: '1',
    email: 'admin@globalenglish.edu',
    password: 'admin123',
    personId: '1',
    role: UserRole.ADMINISTRADOR,
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '2',
    email: 'carlos.admin@globalenglish.edu',
    password: 'admin123',
    personId: '2',
    role: UserRole.ADMINISTRATIVO,
    createdAt: new Date('2025-01-15'),
  },
  {
    id: '3',
    email: 'ana.tutor@globalenglish.edu',
    password: 'tutor123',
    personId: '3',
    role: UserRole.TUTOR,
    createdAt: new Date('2025-02-01'),
  },
  {
    id: '4',
    email: 'juan.tutor@globalenglish.edu',
    password: 'tutor123',
    personId: '4',
    role: UserRole.TUTOR,
    createdAt: new Date('2025-02-01'),
  },
];

export const institutions: Institution[] = [
  {
    id: '1',
    code: 'IED001',
    name: 'IED San José',
    mainAddress: 'Calle 123 #45-67, Barrio Centro',
    phone: '6015551234',
    email: 'contacto@iedsanjose.edu',
    isActive: true,
  },
  {
    id: '2',
    code: 'IED002',
    name: 'IED Simón Bolívar',
    mainAddress: 'Carrera 45 #67-89, Barrio Norte',
    phone: '6015555678',
    email: 'info@iedsimonbolivar.edu',
    isActive: true,
  },
  {
    id: '3',
    code: 'IED003',
    name: 'IED María Montessori',
    mainAddress: 'Avenida 30 #12-34, Barrio Sur',
    phone: '6015559012',
    email: 'secretaria@iedmontessori.edu',
    isActive: true,
  },
];

export const sedes: Sede[] = [
  { id: '1', institutionId: '1', name: 'Sede Principal', address: 'Calle 123 #45-67', isMain: true },
  { id: '2', institutionId: '1', name: 'Sede Norte', address: 'Calle 200 #30-40', isMain: false },
  { id: '3', institutionId: '2', name: 'Sede Principal', address: 'Carrera 45 #67-89', isMain: true },
  { id: '4', institutionId: '3', name: 'Sede Principal', address: 'Avenida 30 #12-34', isMain: true },
  { id: '5', institutionId: '3', name: 'Sede Occidente', address: 'Calle 50 #70-80', isMain: false },
];

export const aulas: Aula[] = [
  {
    id: '1',
    code: 'A-4A-SJ-2025',
    institutionId: '1',
    sedeId: '1',
    grade: Grade.CUARTO,
    programType: ProgramType.INSIDECLASSROOM,
    jornada: Jornada.UNICA_MANANA,
    capacity: 30,
    isActive: true,
    createdAt: new Date('2025-02-01'),
  },
  {
    id: '2',
    code: 'A-5A-SJ-2025',
    institutionId: '1',
    sedeId: '1',
    grade: Grade.QUINTO,
    programType: ProgramType.INSIDECLASSROOM,
    jornada: Jornada.UNICA_MANANA,
    capacity: 28,
    isActive: true,
    createdAt: new Date('2025-02-01'),
  },
  {
    id: '3',
    code: 'A-9A-SB-2025',
    institutionId: '2',
    sedeId: '3',
    grade: Grade.NOVENO,
    programType: ProgramType.OUTSIDECLASSROOM,
    jornada: Jornada.TARDE,
    capacity: 25,
    isActive: true,
    createdAt: new Date('2025-02-01'),
  },
  {
    id: '4',
    code: 'A-10A-MM-2025',
    institutionId: '3',
    sedeId: '4',
    grade: Grade.DECIMO,
    programType: ProgramType.OUTSIDECLASSROOM,
    jornada: Jornada.MANANA,
    capacity: 30,
    isActive: true,
    createdAt: new Date('2025-02-01'),
  },
];

export const schedules: Schedule[] = [
  {
    id: '1',
    aulaId: '1',
    dayOfWeek: DayOfWeek.LUNES,
    startTime: '08:00',
    endTime: '09:00',
    minutesDuration: 60,
    hoursEquivalent: 1,
    isActive: true,
    effectiveFrom: new Date('2025-02-03'),
  },
  {
    id: '2',
    aulaId: '1',
    dayOfWeek: DayOfWeek.MIERCOLES,
    startTime: '08:00',
    endTime: '09:00',
    minutesDuration: 60,
    hoursEquivalent: 1,
    isActive: true,
    effectiveFrom: new Date('2025-02-03'),
  },
  {
    id: '3',
    aulaId: '2',
    dayOfWeek: DayOfWeek.MARTES,
    startTime: '10:00',
    endTime: '10:40',
    minutesDuration: 40,
    hoursEquivalent: 1,
    isActive: true,
    effectiveFrom: new Date('2025-02-03'),
  },
  {
    id: '4',
    aulaId: '2',
    dayOfWeek: DayOfWeek.JUEVES,
    startTime: '10:00',
    endTime: '10:40',
    minutesDuration: 40,
    hoursEquivalent: 1,
    isActive: true,
    effectiveFrom: new Date('2025-02-03'),
  },
  {
    id: '5',
    aulaId: '3',
    dayOfWeek: DayOfWeek.LUNES,
    startTime: '14:00',
    endTime: '16:00',
    minutesDuration: 120,
    hoursEquivalent: 2,
    isActive: true,
    effectiveFrom: new Date('2025-02-03'),
  },
  {
    id: '6',
    aulaId: '3',
    dayOfWeek: DayOfWeek.MIERCOLES,
    startTime: '14:00',
    endTime: '15:30',
    minutesDuration: 90,
    hoursEquivalent: 1.5,
    isActive: true,
    effectiveFrom: new Date('2025-02-03'),
  },
];

export const tutorAssignments: TutorAssignment[] = [
  {
    id: '1',
    aulaId: '1',
    tutorId: '3',
    assignedDate: new Date('2025-02-01'),
    isActive: true,
  },
  {
    id: '2',
    aulaId: '2',
    tutorId: '3',
    assignedDate: new Date('2025-02-01'),
    isActive: true,
  },
  {
    id: '3',
    aulaId: '3',
    tutorId: '4',
    assignedDate: new Date('2025-02-01'),
    isActive: true,
  },
  {
    id: '4',
    aulaId: '4',
    tutorId: '4',
    assignedDate: new Date('2025-02-01'),
    isActive: true,
  },
];

export const students: Student[] = [
  {
    id: '1',
    firstName: 'Pedro',
    lastName: 'Ramírez',
    documentTypeId: '2',
    documentNumber: 'TI1001',
    institutionId: '1',
    grade: Grade.CUARTO,
    entryScore: 45,
    isActive: true,
  },
  {
    id: '2',
    firstName: 'Laura',
    lastName: 'Fernández',
    documentTypeId: '2',
    documentNumber: 'TI1002',
    institutionId: '1',
    grade: Grade.CUARTO,
    entryScore: 52,
    isActive: true,
  },
  {
    id: '3',
    firstName: 'Diego',
    lastName: 'Sánchez',
    documentTypeId: '2',
    documentNumber: 'TI1003',
    institutionId: '1',
    grade: Grade.QUINTO,
    entryScore: 58,
    isActive: true,
  },
  {
    id: '4',
    firstName: 'Camila',
    lastName: 'Torres',
    documentTypeId: '2',
    documentNumber: 'TI2001',
    institutionId: '2',
    grade: Grade.NOVENO,
    entryScore: 65,
    isActive: true,
  },
  {
    id: '5',
    firstName: 'Andrés',
    lastName: 'López',
    documentTypeId: '2',
    documentNumber: 'TI3001',
    institutionId: '3',
    grade: Grade.DECIMO,
    entryScore: 70,
    isActive: true,
  },
];

export const studentAulaAssignments: StudentAulaAssignment[] = [
  {
    id: '1',
    studentId: '1',
    aulaId: '1',
    assignedDate: new Date('2025-02-01'),
    isActive: true,
  },
  {
    id: '2',
    studentId: '2',
    aulaId: '1',
    assignedDate: new Date('2025-02-01'),
    isActive: true,
  },
  {
    id: '3',
    studentId: '3',
    aulaId: '2',
    assignedDate: new Date('2025-02-01'),
    isActive: true,
  },
  {
    id: '4',
    studentId: '4',
    aulaId: '3',
    assignedDate: new Date('2025-02-01'),
    isActive: true,
  },
  {
    id: '5',
    studentId: '5',
    aulaId: '4',
    assignedDate: new Date('2025-02-01'),
    isActive: true,
  },
];

export const holidays: Holiday[] = [
  { id: '1', date: new Date('2025-01-01'), name: 'Año Nuevo', isActive: true },
  { id: '2', date: new Date('2025-01-06'), name: 'Día de los Reyes Magos', isActive: true },
  { id: '3', date: new Date('2025-03-24'), name: 'Día de San José', isActive: true },
  { id: '4', date: new Date('2025-04-17'), name: 'Jueves Santo', isActive: true },
  { id: '5', date: new Date('2025-04-18'), name: 'Viernes Santo', isActive: true },
  { id: '6', date: new Date('2025-05-01'), name: 'Día del Trabajo', isActive: true },
  { id: '7', date: new Date('2025-07-20'), name: 'Día de la Independencia', isActive: true },
];

export const absenceReasons: AbsenceReason[] = [
  { id: '1', code: 'FEST', description: 'Día Festivo', requiresMakeup: true },
  { id: '2', code: 'PERS', description: 'Motivo Personal', requiresMakeup: true },
  { id: '3', code: 'ENFE', description: 'Enfermedad', requiresMakeup: true },
  { id: '4', code: 'CAPA', description: 'Capacitación', requiresMakeup: false },
  { id: '5', code: 'FUMA', description: 'Fuerza Mayor', requiresMakeup: true },
];

export const gradePeriods: GradePeriod[] = [
  {
    id: '1',
    programType: ProgramType.INSIDECLASSROOM,
    periodNumber: 1,
    name: 'Primer Período',
    startDate: new Date('2025-02-03'),
    endDate: new Date('2025-04-30'),
  },
  {
    id: '2',
    programType: ProgramType.INSIDECLASSROOM,
    periodNumber: 2,
    name: 'Segundo Período',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-07-31'),
  },
  {
    id: '3',
    programType: ProgramType.OUTSIDECLASSROOM,
    periodNumber: 1,
    name: 'Primer Período',
    startDate: new Date('2025-02-03'),
    endDate: new Date('2025-04-30'),
  },
  {
    id: '4',
    programType: ProgramType.OUTSIDECLASSROOM,
    periodNumber: 2,
    name: 'Segundo Período',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-07-31'),
  },
];

export const gradeComponents: GradeComponent[] = [
  { id: '1', periodId: '1', name: 'Participación', percentage: 20, order: 1 },
  { id: '2', periodId: '1', name: 'Tareas', percentage: 30, order: 2 },
  { id: '3', periodId: '1', name: 'Evaluaciones', percentage: 30, order: 3 },
  { id: '4', periodId: '1', name: 'Proyecto Final', percentage: 20, order: 4 },
  { id: '5', periodId: '3', name: 'Asistencia y Participación', percentage: 25, order: 1 },
  { id: '6', periodId: '3', name: 'Actividades', percentage: 25, order: 2 },
  { id: '7', periodId: '3', name: 'Quizzes', percentage: 25, order: 3 },
  { id: '8', periodId: '3', name: 'Examen Final', percentage: 25, order: 4 },
];

export const programWeeks: ProgramWeek[] = Array.from({ length: 40 }, (_, i) => {
  const startDate = new Date('2025-02-03');
  startDate.setDate(startDate.getDate() + (i * 7));
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  return {
    id: String(i + 1),
    weekNumber: i + 1,
    startDate,
    endDate,
    year: 2025,
  };
});

export const classAttendances: ClassAttendance[] = [];
export const studentAttendances: StudentAttendance[] = [];
export const studentGrades: StudentGrade[] = [];
