// Tipos y enums del sistema GLOBALENGLISH

export enum ProgramType {
  INSIDECLASSROOM = 'INSIDECLASSROOM',
  OUTSIDECLASSROOM = 'OUTSIDECLASSROOM'
}

export enum Grade {
  CUARTO = '4',
  QUINTO = '5',
  NOVENO = '9',
  DECIMO = '10'
}

export enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  TUTOR = 'TUTOR'
}

export enum Jornada {
  MANANA = 'MAÑANA',
  TARDE = 'TARDE',
  MIXTA = 'MIXTA',
  UNICA_MANANA = 'ÚNICA MAÑANA',
  UNICA_TARDE = 'ÚNICA TARDE'
}

export enum DayOfWeek {
  LUNES = 'Lunes',
  MARTES = 'Martes',
  MIERCOLES = 'Miércoles',
  JUEVES = 'Jueves',
  VIERNES = 'Viernes',
  SABADO = 'Sábado'
}

export interface User {
  id: string;
  email: string;
  password: string;
  personId: string;
  role: UserRole;
  createdAt: Date;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  documentTypeId: string;
  documentNumber: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  hiredDate?: Date;
  terminationDate?: Date;
}

export interface DocumentType {
  id: string;
  code: string;
  name: string;
}

export interface Institution {
  id: string;
  code: string;
  name: string;
  mainAddress: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface Sede {
  id: string;
  institutionId: string;
  name: string;
  address: string;
  isMain: boolean;
}

export interface Aula {
  id: string;
  code: string;
  institutionId: string;
  sedeId: string;
  grade: Grade;
  programType: ProgramType;
  jornada: Jornada;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Schedule {
  id: string;
  aulaId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:MM formato militar
  endTime: string;
  minutesDuration: number; // 40, 45, 50, 55, 60
  hoursEquivalent: number; // equivalente en horas
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export interface TutorAssignment {
  id: string;
  aulaId: string;
  tutorId: string;
  assignedDate: Date;
  endDate?: Date;
  reason?: string;
  isActive: boolean;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  documentTypeId: string;
  documentNumber: string;
  institutionId: string;
  grade: Grade;
  entryScore?: number;
  exitScore?: number;
  isActive: boolean;
}

export interface StudentAulaAssignment {
  id: string;
  studentId: string;
  aulaId: string;
  assignedDate: Date;
  endDate?: Date;
  reason?: string;
  isActive: boolean;
}

export interface Holiday {
  id: string;
  date: Date;
  name: string;
  isActive: boolean;
}

export interface AbsenceReason {
  id: string;
  code: string;
  description: string;
  requiresMakeup: boolean;
}

export interface ClassAttendance {
  id: string;
  aulaId: string;
  tutorId: string;
  scheduleId: string;
  scheduledDate: Date;
  actualDate?: Date; // fecha real si hubo reposición
  wasHeld: boolean;
  isHoliday: boolean;
  hoursPlanned: number;
  hoursTaught?: number;
  absenceReasonId?: string;
  makeupDate?: Date;
  notes?: string;
  createdAt: Date;
}

export interface StudentAttendance {
  id: string;
  classAttendanceId: string;
  studentId: string;
  wasPresent: boolean;
  notes?: string;
}

export interface GradePeriod {
  id: string;
  programType: ProgramType;
  periodNumber: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface GradeComponent {
  id: string;
  periodId: string;
  name: string;
  percentage: number;
  order: number;
}

export interface StudentGrade {
  id: string;
  studentId: string;
  aulaId: string;
  periodId: string;
  componentId: string;
  grade: number;
  enteredBy: string;
  enteredAt: Date;
}

export interface ProgramWeek {
  id: string;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  year: number;
}
