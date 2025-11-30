import { useState } from 'react';
import { AuthUser, canAccessAdminFunctions } from '../../lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  aulas, 
  tutorAssignments, 
  institutions, 
  sedes, 
  schedules, 
  students, 
  studentAulaAssignments,
  classAttendances,
  persons
} from '../../lib/mockData';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users, Filter } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ProgramType, DayOfWeek, UserRole } from '../../types';
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
  aulaId: string;
  institutionName: string;
  sedeName: string;
  startTime: string;
  endTime: string;
  dayOfWeek: DayOfWeek;
  programType: ProgramType;
  studentsCount: number;
  grade: string;
}

export function ScheduleCalendar({ authUser }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterProgram, setFilterProgram] = useState<string>('ALL');
  const [filterInstitution, setFilterInstitution] = useState<string>('ALL');
  const [filterAula, setFilterAula] = useState<string>('ALL');
  const [filterTutor, setFilterTutor] = useState<string>('ALL');
  const [filterStudent, setFilterStudent] = useState<string>('ALL');
  const isAdmin = canAccessAdminFunctions(authUser.user.role);

  // Get tutor's assigned aulas and create events
  const getEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    
    // Si es admin, mostrar todas las aulas; si es tutor, solo sus aulas
    let relevantAulas = isAdmin 
      ? aulas.filter(a => a.isActive)
      : tutorAssignments
          .filter(ta => ta.tutorId === authUser.person.id && ta.isActive)
          .map(ta => aulas.find(a => a.id === ta.aulaId))
          .filter(Boolean);

    // Apply filters
    if (filterProgram !== 'ALL') {
      relevantAulas = relevantAulas.filter(a => a?.programType === filterProgram);
    }
    if (filterInstitution !== 'ALL') {
      relevantAulas = relevantAulas.filter(a => a?.institutionId === filterInstitution);
    }
    if (filterAula !== 'ALL') {
      relevantAulas = relevantAulas.filter(a => a?.id === filterAula);
    }
    if (filterTutor !== 'ALL') {
      const tutorAulaIds = tutorAssignments
        .filter(ta => ta.tutorId === filterTutor && ta.isActive)
        .map(ta => ta.aulaId);
      relevantAulas = relevantAulas.filter(a => a && tutorAulaIds.includes(a.id));
    }
    if (filterStudent !== 'ALL') {
      const studentAulaIds = studentAulaAssignments
        .filter(sa => sa.studentId === filterStudent && sa.isActive)
        .map(sa => sa.aulaId);
      relevantAulas = relevantAulas.filter(a => a && studentAulaIds.includes(a.id));
    }

    relevantAulas.forEach(aula => {
      if (!aula) return;
      
      const institution = institutions.find(i => i.id === aula.institutionId);
      const sede = sedes.find(s => s.id === aula.sedeId);
      const aulaSchedules = schedules.filter(s => s.aulaId === aula.id && s.isActive);
      const aulaStudents = studentAulaAssignments
        .filter(sa => sa.aulaId === aula.id && sa.isActive)
        .map(sa => students.find(s => s.id === sa.studentId))
        .filter(Boolean);

      aulaSchedules.forEach(schedule => {
        events.push({
          id: `${aula.id}-${schedule.id}`,
          title: aula.code,
          aulaCode: aula.code,
          aulaId: aula.id,
          institutionName: institution?.name || '',
          sedeName: sede?.name || '',
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          dayOfWeek: schedule.dayOfWeek,
          programType: aula.programType,
          studentsCount: aulaStudents.length,
          grade: aula.grade,
        });
      });
    });

    return events;
  };

  const events = getEvents();

  // Helper functions for calendar
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getDayName = (date: Date): DayOfWeek => {
    const days = [
      DayOfWeek.LUNES,
      DayOfWeek.MARTES,
      DayOfWeek.MIERCOLES,
      DayOfWeek.JUEVES,
      DayOfWeek.VIERNES,
      DayOfWeek.SABADO
    ];
    // JavaScript's getDay() returns 0 for Sunday, 1 for Monday, etc.
    // We adjust it to match our enum (Monday = 0)
    const dayIndex = date.getDay();
    if (dayIndex === 0) return DayOfWeek.LUNES; // Skip Sunday for now
    return days[dayIndex - 1];
  };

  const getEventsForDay = (date: Date): CalendarEvent[] => {
    const dayName = getDayName(date);
    return events.filter(event => event.dayOfWeek === dayName);
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
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

  // Group events by program type
  const insideEvents = todayEvents.filter(e => e.programType === ProgramType.INSIDECLASSROOM);
  const outsideEvents = todayEvents.filter(e => e.programType === ProgramType.OUTSIDECLASSROOM);

  // Time slots for day view (6 AM to 8 PM)
  const timeSlots = Array.from({ length: 15 }, (_, i) => i + 6);

  const getEventStyle = (event: CalendarEvent) => {
    // Parse time to get position
    const [startHour, startMin] = event.startTime.split(':').map(Number);
    const [endHour, endMin] = event.endTime.split(':').map(Number);
    
    const startDecimal = startHour + startMin / 60;
    const endDecimal = endHour + endMin / 60;
    const duration = endDecimal - startDecimal;
    
    // Position relative to 6 AM
    const top = ((startDecimal - 6) * 60) + 'px';
    const height = (duration * 60) + 'px';
    
    return { top, height };
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
                  {institutions.map(inst => (
                    <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
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
                  {aulas.filter(a => a.isActive).map(aula => (
                    <SelectItem key={aula.id} value={aula.id}>{aula.code}</SelectItem>
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
                    {persons.filter(p => p.role === UserRole.TUTOR).map(tutor => (
                      <SelectItem key={tutor.id} value={tutor.id}>
                        {tutor.firstName} {tutor.lastName}
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
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
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
                {filterInstitution !== 'ALL' && (
                  <Badge variant="secondary">
                    {institutions.find(i => i.id === filterInstitution)?.name}
                  </Badge>
                )}
                {filterAula !== 'ALL' && (
                  <Badge variant="secondary">
                    {aulas.find(a => a.id === filterAula)?.code}
                  </Badge>
                )}
                {filterTutor !== 'ALL' && (
                  <Badge variant="secondary">
                    {persons.find(p => p.id === filterTutor)?.firstName} {persons.find(p => p.id === filterTutor)?.lastName}
                  </Badge>
                )}
                {filterStudent !== 'ALL' && (
                  <Badge variant="secondary">
                    {students.find(s => s.id === filterStudent)?.firstName} {students.find(s => s.id === filterStudent)?.lastName}
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

        <TabsContent value="week" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Day Schedule - Left Side (iOS style) */}
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
                    {/* Week day headers */}
                    {weekDayNames.map((day, i) => (
                      <div key={i} className="text-center text-xs text-gray-500 pb-2">
                        {day}
                      </div>
                    ))}
                    
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    
                    {/* Days of month */}
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
                {/* Week day headers */}
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                  <div key={day} className="text-center text-sm text-gray-600 pb-2">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[120px] border border-gray-100 rounded-lg bg-gray-50" />
                ))}
                
                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(year, month, day);
                  const dayEvents = getEventsForDay(date);
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
                            <div className="truncate">{event.startTime} {event.aulaCode}</div>
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