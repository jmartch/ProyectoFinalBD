import { useEffect, useState } from 'react';
import { AuthUser, canAccessAdminFunctions } from '../../lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users, Filter } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ProgramType, DayOfWeek } from '../../types';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

interface ScheduleCalendarProps {
  authUser: AuthUser;
}

interface CalendarEvent {
  id: string;
  title: string;
  aulaCode: string;
  aulaId: number;
  institutionName: string;
  sedeName: string;
  startTime: string;
  endTime: string;
  dayOfWeek: DayOfWeek;
  programType: ProgramType;
  studentsCount: number;
  grade: string;
}

interface CalendarFiltersResponse {
  userRole: string;
  programs: { id_programa: number; nombre_programa: string }[];
  institutions: { id_ied: number; nombre: string }[];
  aulas: { id_aula: number; code: string; grade: number; programType: ProgramType }[];
  tutors?: { id_tutor: number; fullName: string }[];
  students?: { doc_estudiante: number; fullName: string }[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const mapBackendDayOfWeek = (raw: any): DayOfWeek | null => {
  if (raw === null || raw === undefined) return null;

  if (typeof raw === 'number') {
    switch (raw) {
      case 1: return DayOfWeek.LUNES;
      case 2: return DayOfWeek.MARTES;
      case 3: return DayOfWeek.MIERCOLES;
      case 4: return DayOfWeek.JUEVES;
      case 5: return DayOfWeek.VIERNES;
      case 6: return DayOfWeek.SABADO;
      case 7: 
        
    
        return DayOfWeek.SABADO;

        console.warn('⚠️ dayOfWeek numérico fuera de rango:', raw);
        return null;
    }
  }


  if (typeof raw === 'string') {
    const normalized = raw.trim().toUpperCase();

    switch (normalized) {
      case 'LUNES':
      case 'MONDAY':
      case 'MON':
      case 'L':
        return DayOfWeek.LUNES;

      case 'MARTES':
      case 'TUESDAY':
      case 'TUE':
      case 'MAR':
        return DayOfWeek.MARTES;

      case 'MIERCOLES':
      case 'MIÉRCOLES':
      case 'WEDNESDAY':
      case 'WED':
        return DayOfWeek.MIERCOLES;

      case 'JUEVES':
      case 'THURSDAY':
      case 'THU':
        return DayOfWeek.JUEVES;

      case 'VIERNES':
      case 'FRIDAY':
      case 'FRI':
        return DayOfWeek.VIERNES;

      case 'SABADO':
      case 'SÁBADO':
      case 'SATURDAY':
      case 'SAT':
        return DayOfWeek.SABADO;

      case 'DOMINGO':
      case 'SUNDAY':
      case 'SUN':
        // Igual que arriba: decide qué hacer con domingo.
        // O lo mapeas a SABADO:
        return DayOfWeek.SABADO;
        // O lo ignoras:
        // return null;

      default:
        console.warn('⚠️ dayOfWeek string no reconocido desde backend:', raw);
        return null;
    }
  }

  console.warn('⚠️ dayOfWeek tipo no soportado:', raw);
  return null;
};

const mapBackendProgramType = (raw: any): ProgramType => {
  if (!raw) return ProgramType.INSIDECLASSROOM;
  const normalized = String(raw).trim().toUpperCase();

  if (normalized === 'OUTSIDECLASSROOM') return ProgramType.OUTSIDECLASSROOM;
  return ProgramType.INSIDECLASSROOM;
};

export function ScheduleCalendar({ authUser }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [filterProgram, setFilterProgram] = useState<string>('ALL');
  const [filterInstitution, setFilterInstitution] = useState<string>('ALL');
  const [filterAula, setFilterAula] = useState<string>('ALL');
  const [filterTutor, setFilterTutor] = useState<string>('ALL');
  const [filterStudent, setFilterStudent] = useState<string>('ALL');

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filtersData, setFiltersData] = useState<CalendarFiltersResponse | null>(null);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = canAccessAdminFunctions(authUser.user.role);

  // Helper para sacar doc_funcionario desde authUser
  const getDocFuncionario = () => {
    // Ajusta estos nombres según cómo tengas construido tu AuthUser
    // @ts-ignore
    return authUser.person?.doc_funcionario ?? authUser.person?.document ?? authUser.person?.id;
  };

  // 🔹 1) Cargar filtros desde el backend
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoadingFilters(true);
        setError(null);

        const roleParam = isAdmin ? 'ADMIN' : 'TUTOR';
        const params = new URLSearchParams({ role: roleParam });

        if (!isAdmin) {
          const doc = getDocFuncionario();
          if (doc) params.append('doc_funcionario', String(doc));
        }

        const url = `${API_BASE_URL}/api/calendar/filters?${params.toString()}`;
        console.log('📡 [CALENDAR FILTERS] GET', url);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error al cargar filtros (${res.status})`);

        const data: CalendarFiltersResponse = await res.json();
        console.log('✅ [CALENDAR FILTERS] data:', data);

        setFiltersData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error cargando filtros');
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, [isAdmin, authUser]);

  // 🔹 2) Cargar eventos según rol + filtros
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        setError(null);

        const roleParam = isAdmin ? 'ADMIN' : 'TUTOR';
        const params = new URLSearchParams({ role: roleParam });

        if (!isAdmin) {
          const doc = getDocFuncionario();
          if (doc) params.append('doc_funcionario', String(doc));
        }

        if (filterProgram !== 'ALL') params.append('filterProgram', filterProgram);
        if (filterInstitution !== 'ALL') params.append('filterInstitution', filterInstitution);
        if (filterAula !== 'ALL') params.append('filterAula', filterAula);
        if (isAdmin && filterTutor !== 'ALL') params.append('filterTutor', filterTutor);
        if (isAdmin && filterStudent !== 'ALL') params.append('filterStudent', filterStudent);

        const url = `${API_BASE_URL}/api/calendar/events?${params.toString()}`;
        console.log('📡 [CALENDAR EVENTS] GET', url);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error al cargar eventos (${res.status})`);

        const data = await res.json();
        console.log('✅ [CALENDAR EVENTS] respuesta raw:', data);

        // Soporta tanto { events: [...] } como un array directo
        const rawEvents = Array.isArray(data) ? data : (data.events || []);

        const mappedEvents: CalendarEvent[] = (rawEvents || []).map((e: any, idx: number) => {
          const normalizedDay = mapBackendDayOfWeek(e.dayOfWeek);
          const normalizedProgram = mapBackendProgramType(e.programType);

          if (!normalizedDay) {
            console.warn('❗ Evento con dayOfWeek no mapeable, usando LUNES por defecto. Evento:', e);
          }

          const startTimeStr = String(e.startTime ?? '07:00').slice(0, 5);
          const endTimeStr = String(e.endTime ?? '09:00').slice(0, 5);

          return {
            id: String(e.id ?? idx),
            title: e.aulaCode ?? e.title ?? `Aula ${e.aulaId ?? ''}`,
            aulaCode: e.aulaCode ?? `Aula-${e.aulaId ?? idx}`,
            aulaId: Number(e.aulaId ?? 0),
            institutionName: e.institutionName ?? 'Institución sin nombre',
            sedeName: e.sedeName ?? 'Sede sin nombre',
            startTime: startTimeStr,
            endTime: endTimeStr,
            dayOfWeek: normalizedDay ?? DayOfWeek.LUNES,
            programType: normalizedProgram,
            studentsCount: e.studentsCount ?? 0,
            grade: String(e.grade ?? ''),
          };
        });

        console.log('✅ [CALENDAR EVENTS] mapeados:', mappedEvents);
        setEvents(mappedEvents);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error cargando eventos');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [isAdmin, authUser, filterProgram, filterInstitution, filterAula, filterTutor, filterStudent]);

  // 🔹 Helpers de calendario
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 domingo, 1 lunes, ...

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getDayName = (date: Date): DayOfWeek => {
    const dayIndex = date.getDay(); // 0 domingo, 1 lunes, ...

    switch (dayIndex) {
      case 1: return DayOfWeek.LUNES;
      case 2: return DayOfWeek.MARTES;
      case 3: return DayOfWeek.MIERCOLES;
      case 4: return DayOfWeek.JUEVES;
      case 5: return DayOfWeek.VIERNES;
      case 6: return DayOfWeek.SABADO;
      case 0:
      default:
        return DayOfWeek.LUNES; // fallback
    }
  };

  const getEventsForDay = (date: Date): CalendarEvent[] => {
    const dayName = getDayName(date);
    const list = events.filter(event => event.dayOfWeek === dayName);
    // console.log('📅 [DAY EVENTS]', date.toDateString(), dayName, list);
    return list;
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') newDate.setMonth(newDate.getMonth() - 1);
      else newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const isToday = (date: Date, day: number) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      day === today.getDate();
  };

  const isSameDay = (date1: Date, date2: Date, day: number) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      day === date2.getDate();
  };

  const getProgramColor = (programType: ProgramType) => {
    return programType === ProgramType.INSIDECLASSROOM
      ? 'bg-blue-100 border-blue-300 text-blue-800'
      : 'bg-purple-100 border-purple-300 text-purple-800';
  };

  const getProgramColorDark = (programType: ProgramType) => {
    return programType === ProgramType.INSIDECLASSROOM
      ? 'bg-blue-500'
      : 'bg-purple-500';
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const todayEvents = getEventsForDay(selectedDate);

  const insideEvents = todayEvents.filter(e => e.programType === ProgramType.INSIDECLASSROOM);
  const outsideEvents = todayEvents.filter(e => e.programType === ProgramType.OUTSIDECLASSROOM);

  const timeSlots = Array.from({ length: 15 }, (_, i) => i + 6); // 6:00–20:00

  const getEventStyle = (event: CalendarEvent) => {
    const [startHour, startMin] = event.startTime.split(':').map(Number);
    const [endHour, endMin] = event.endTime.split(':').map(Number);

    const startDecimal = startHour + (startMin || 0) / 60;
    const endDecimal = endHour + (endMin || 0) / 60;
    const duration = Math.max(endDecimal - startDecimal, 0.5); // mínimo 0.5h

    const top = ((startDecimal - 6) * 60) + 'px';
    const height = (duration * 60) + 'px';

    return { top, height };
  };

  const dayEventsMonth = (day: number) => {
    const date = new Date(year, month, day);
    return getEventsForDay(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Calendario de Clases</h2>
        <p className="text-gray-600">
          {isAdmin
            ? 'Visualiza todas las clases programadas del programa GLOBALENGLISH'
            : 'Visualiza tu horario de clases programadas'}
        </p>
        {isAdmin && (
          <Badge variant="outline" className="mt-2 bg-amber-50 text-amber-700 border-amber-300">
            Vista Administrador - Mostrando todas las aulas del sistema
          </Badge>
        )}
        {(loadingEvents || loadingFilters) && (
          <p className="text-xs text-gray-500 mt-1">Cargando datos del calendario...</p>
        )}
        {error && (
          <p className="text-xs text-red-500 mt-1">⚠️ {error}</p>
        )}
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <CardTitle className="text-base">Filtros de Visualización</CardTitle>
          </div>
          <CardDescription>
            Filtra el calendario por programa, institución, aula, tutor o estudiante
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-program">Programa</Label>
              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger id="filter-program">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los programas</SelectItem>
                  <SelectItem value={ProgramType.INSIDECLASSROOM}>INSIDECLASSROOM (4º-5º)</SelectItem>
                  <SelectItem value={ProgramType.OUTSIDECLASSROOM}>OUTSIDECLASSROOM (9º-10º)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-institution">Institución</Label>
              <Select value={filterInstitution} onValueChange={setFilterInstitution}>
                <SelectTrigger id="filter-institution">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas las instituciones</SelectItem>
                  {filtersData?.institutions.map(inst => (
                    <SelectItem key={inst.id_ied} value={String(inst.id_ied)}>
                      {inst.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-aula">Aula</Label>
              <Select value={filterAula} onValueChange={setFilterAula}>
                <SelectTrigger id="filter-aula">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas las aulas</SelectItem>
                  {filtersData?.aulas.map(aula => (
                    <SelectItem key={aula.id_aula} value={String(aula.id_aula)}>
                      {aula.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="filter-tutor">Tutor</Label>
                <Select value={filterTutor} onValueChange={setFilterTutor}>
                  <SelectTrigger id="filter-tutor">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los tutores</SelectItem>
                    {filtersData?.tutors?.map(tutor => (
                      <SelectItem key={tutor.id_tutor} value={String(tutor.id_tutor)}>
                        {tutor.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="filter-student">Estudiante</Label>
                <Select value={filterStudent} onValueChange={setFilterStudent}>
                  <SelectTrigger id="filter-student">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los estudiantes</SelectItem>
                    {filtersData?.students?.map(student => (
                      <SelectItem key={student.doc_estudiante} value={String(student.doc_estudiante)}>
                        {student.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {(filterProgram !== 'ALL' || filterInstitution !== 'ALL' || filterAula !== 'ALL' || filterTutor !== 'ALL' || filterStudent !== 'ALL') && (
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {filterProgram !== 'ALL' && (
                  <Badge variant="secondary">
                    {filterProgram === ProgramType.INSIDECLASSROOM ? 'INSIDECLASSROOM' : 'OUTSIDECLASSROOM'}
                  </Badge>
                )}
                {filterInstitution !== 'ALL' && filtersData && (
                  <Badge variant="secondary">
                    {filtersData.institutions.find(i => String(i.id_ied) === filterInstitution)?.nombre || 'Institución'}
                  </Badge>
                )}
                {filterAula !== 'ALL' && filtersData && (
                  <Badge variant="secondary">
                    {filtersData.aulas.find(a => String(a.id_aula) === filterAula)?.code || 'Aula'}
                  </Badge>
                )}
                {isAdmin && filterTutor !== 'ALL' && filtersData && (
                  <Badge variant="secondary">
                    {filtersData.tutors?.find(t => String(t.id_tutor) === filterTutor)?.fullName || 'Tutor'}
                  </Badge>
                )}
                {isAdmin && filterStudent !== 'ALL' && filtersData && (
                  <Badge variant="secondary">
                    {filtersData.students?.find(s => String(s.doc_estudiante) === filterStudent)?.fullName || 'Estudiante'}
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterProgram('ALL');
                  setFilterInstitution('ALL');
                  setFilterAula('ALL');
                  setFilterTutor('ALL');
                  setFilterStudent('ALL');
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="week" className="w-full">
        <TabsList>
          <TabsTrigger value="week">Vista Semanal</TabsTrigger>
          <TabsTrigger value="month">Vista Mensual</TabsTrigger>
        </TabsList>

        {/* VISTA SEMANAL */}
        <TabsContent value="week" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Day Schedule - Left Side */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {selectedDate.toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </CardTitle>
                      <CardDescription>
                        {todayEvents.length} {todayEvents.length === 1 ? 'clase programada' : 'clases programadas'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setDate(newDate.getDate() - 1);
                          setSelectedDate(newDate);
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDate(new Date())}
                      >
                        Hoy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setDate(newDate.getDate() + 1);
                          setSelectedDate(newDate);
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {todayEvents.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No hay clases programadas para este día</p>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Time grid */}
                      <div className="space-y-0">
                        {timeSlots.map((hour) => (
                          <div key={hour} className="relative h-[60px] border-b border-gray-100">
                            <div className="absolute -left-2 -top-2 text-xs text-gray-500 bg-white px-1">
                              {hour}:00
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Events overlay */}
                      <div className="absolute top-0 left-12 right-0 bottom-0">
                        {todayEvents.map((event) => {
                          const style = getEventStyle(event);
                          return (
                            <div
                              key={event.id}
                              className={`absolute left-0 right-2 rounded-lg border-l-4 p-2 ${
                                event.programType === ProgramType.INSIDECLASSROOM
                                  ? 'bg-blue-50 border-blue-500'
                                  : 'bg-purple-50 border-purple-500'
                              }`}
                              style={style}
                            >
                              <div className="text-sm">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">{event.aulaCode}</span>
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${
                                      event.programType === ProgramType.INSIDECLASSROOM
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-purple-100 text-purple-700'
                                    }`}
                                  >
                                    {event.grade}º
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {event.startTime} - {event.endTime}
                                  </div>
                                  <div className="flex items-center gap-1 truncate">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{event.sedeName}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {event.studentsCount} estudiantes
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Mini Calendar - Right Side */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {monthNames[month]} {year}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateMonth('prev')}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateMonth('next')}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {weekDayNames.map((day, i) => (
                      <div key={i} className="text-center text-xs text-gray-500 pb-2">
                        {day}
                      </div>
                    ))}

                    {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const date = new Date(year, month, day);
                      const dayEvents = getEventsForDay(date);
                      const hasEvents = dayEvents.length > 0;
                      const isSelected = isSameDay(selectedDate, currentDate, day);
                      const isTodayDate = isToday(currentDate, day);

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(new Date(year, month, day))}
                          className={`aspect-square rounded-full flex flex-col items-center justify-center text-sm relative hover:bg-gray-100 transition-colors ${
                            isSelected
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : isTodayDate
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : ''
                          }`}
                        >
                          <span>{day}</span>
                          {hasEvents && !isSelected && !isTodayDate && (
                            <div className="flex gap-0.5 mt-0.5">
                              {dayEvents.some(e => e.programType === ProgramType.INSIDECLASSROOM) && (
                                <div className="w-1 h-1 rounded-full bg-blue-500" />
                              )}
                              {dayEvents.some(e => e.programType === ProgramType.OUTSIDECLASSROOM) && (
                                <div className="w-1 h-1 rounded-full bg-purple-500" />
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Summary Cards */}
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">INSIDECLASSROOM</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl mb-1">{insideEvents.length}</div>
                  <p className="text-xs text-gray-600">
                    {insideEvents.length === 1 ? 'clase hoy' : 'clases hoy'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">OUTSIDECLASSROOM</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl mb-1">{outsideEvents.length}</div>
                  <p className="text-xs text-gray-600">
                    {outsideEvents.length === 1 ? 'clase hoy' : 'clases hoy'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* VISTA MENSUAL */}
        <TabsContent value="month" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {monthNames[month]} {year}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Hoy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                  <div key={day} className="text-center text-sm text-gray-600 pb-2">
                    {day}
                  </div>
                ))}

                {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[120px] border border-gray-100 rounded-lg bg-gray-50" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = dayEventsMonth(day);
                  const isTodayDate = isToday(currentDate, day);

                  return (
                    <div
                      key={day}
                      className={`min-h-[120px] border rounded-lg p-2 ${
                        isTodayDate ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm ${isTodayDate ? 'font-bold text-blue-600' : ''}`}>
                          {day}
                        </span>
                        {isTodayDate && (
                          <Badge variant="default" className="text-xs bg-blue-500">
                            Hoy
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded border-l-2 ${getProgramColor(event.programType)} ${
                              event.programType === ProgramType.INSIDECLASSROOM
                                ? 'border-blue-500'
                                : 'border-purple-500'
                            }`}
                          >
                            <div className="truncate">
                              {event.startTime} {event.aulaCode}
                            </div>
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 pl-1">
                            +{dayEvents.length - 3} más
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Leyenda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500" />
                  <span className="text-sm">INSIDECLASSROOM (4º-5º)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-500" />
                  <span className="text-sm">OUTSIDECLASSROOM (9º-10º)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
