import { useState, useEffect } from 'react';
import { AuthUser, canAccessAdminFunctions } from '../../lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { ClipboardCheck, Save, Loader2 } from 'lucide-react';

// Importar de reportService (las que ya existían)
import { 
  fetchAulas, 
  fetchTutores, 
  fetchAulaTutores,
  fetchEstudiantesDetalle 
} from '../../lib/reportService';

// Importar de api.ts (las nuevas para calificaciones)
import {
  fetchPeriodos,
  getComponentesByPeriodo,
  getNotaByEstudiante,
  createNota,
  getDetallesNotaByIdNota,
  saveDetalleNota,
  type Periodo,
  type Componente,
} from '../../lib/api';

interface GradesManagerProps {
  authUser: AuthUser;
}

export function GradesManager({ authUser }: GradesManagerProps) {
  const [selectedAula, setSelectedAula] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  
  // Data desde reportService
  const [aulas, setAulas] = useState<any[]>([]);
  const [tutores, setTutores] = useState<any[]>([]);
  const [aulaTutores, setAulaTutores] = useState<any[]>([]);
  const [estudiantes, setEstudiantes] = useState<any[]>([]);
  
  // Data desde api.ts
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [grades, setGrades] = useState<{ [key: string]: { [key: string]: number } }>({});
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = canAccessAdminFunctions(authUser.user.role);
  const tutorId = String((authUser as any)?.person?.id ?? '');

  // Cargar datos iniciales (aulas, tutores, etc.)
  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingData(true);
      try {
        const [aulasData, tutoresData, aulaTutoresData, periodosData] = await Promise.all([
          fetchAulas(),
          fetchTutores(),
          fetchAulaTutores(),
          fetchPeriodos(),
        ]);
        
        setAulas(aulasData);
        setTutores(tutoresData);
        setAulaTutores(aulaTutoresData);
        setPeriodos(periodosData);
      } catch (err) {
        console.error('Error cargando datos iniciales:', err);
        setError('Error al cargar los datos iniciales');
      } finally {
        setLoadingData(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Cargar componentes cuando cambia el período
  useEffect(() => {
    const loadComponentes = async () => {
      if (!selectedPeriod) {
        setComponentes([]);
        return;
      }
      
      try {
        const componentesData = await getComponentesByPeriodo(parseInt(selectedPeriod));
        setComponentes(componentesData);
      } catch (err) {
        console.error('Error cargando componentes:', err);
        setError('Error al cargar los componentes del período');
      }
    };
    
    loadComponentes();
  }, [selectedPeriod]);

  // Cargar estudiantes y sus calificaciones cuando cambia el aula o período
  useEffect(() => {
    const loadEstudiantesYNotas = async () => {
      if (!selectedAula || !selectedPeriod) {
        setEstudiantes([]);
        setGrades({});
        return;
      }
      
      setLoadingEstudiantes(true);
      setError(null);
      
      try {
        // Cargar estudiantes desde reportService
        const todosEstudiantes = await fetchEstudiantesDetalle();
        const estudiantesDelAula = todosEstudiantes.filter(
          (e: any) => String(e.id_aula) === String(selectedAula)
        );
        setEstudiantes(estudiantesDelAula);
        
        // Cargar calificaciones existentes desde api.ts
        const gradesData: { [key: string]: { [key: string]: number } } = {};
        
        for (const estudiante of estudiantesDelAula) {
          const docEstudiante = parseInt(estudiante.doc_estudiante);
          const nota = await getNotaByEstudiante(docEstudiante);
          
          if (nota) {
            const detalles = await getDetallesNotaByIdNota(nota.id_nota);
            gradesData[docEstudiante] = {};
            
            detalles.forEach((detalle) => {
              gradesData[docEstudiante][detalle.id_componente] = detalle.nota;
            });
          }
        }
        
        setGrades(gradesData);
      } catch (err) {
        console.error('Error cargando estudiantes:', err);
        setError('Error al cargar los estudiantes y sus calificaciones');
      } finally {
        setLoadingEstudiantes(false);
      }
    };
    
    loadEstudiantesYNotas();
  }, [selectedAula, selectedPeriod]);

  // Obtener aulas del tutor
  const tutorAulas = aulaTutores
    .filter((at: any) => String(at.id_tutor) === tutorId)
    .map((at: any) => {
      const aula = aulas.find((a: any) => String(a.id_aula) === String(at.id_aula));
      return aula;
    })
    .filter(Boolean);

  const handleGradeChange = (doc_estudiante: string, id_componente: number, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 5) return;

    setGrades({
      ...grades,
      [doc_estudiante]: {
        ...grades[doc_estudiante],
        [id_componente]: numValue,
      },
    });
  };

  const calculateFinalGrade = (doc_estudiante: string): number => {
    if (!componentes.length) return 0;
    
    let total = 0;
    componentes.forEach(componente => {
      const grade = grades[doc_estudiante]?.[componente.id_componente] || 0;
      total += (grade * componente.porcentaje) / 100;
    });
    return Math.round(total * 100) / 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      for (const estudiante of estudiantes) {
        const doc_estudiante = parseInt(estudiante.doc_estudiante);
        
        // Obtener o crear nota para el estudiante
        let nota = await getNotaByEstudiante(doc_estudiante);
        
        if (!nota) {
          const result = await createNota({
            doc_estudiante,
            definitiva: calculateFinalGrade(estudiante.doc_estudiante),
          });
          nota = { 
            id_nota: result.data?.id_nota || result.insertId, 
            doc_estudiante, 
            definitiva: 0 
          };
        }

        // Guardar detalles de nota (calificaciones por componente)
        if (grades[estudiante.doc_estudiante]) {
          for (const componente of componentes) {
            const notaComponente = grades[estudiante.doc_estudiante][componente.id_componente];
            
            if (notaComponente !== undefined) {
              await saveDetalleNota({
                id_nota: nota.id_nota,
                id_componente: componente.id_componente,
                nota: notaComponente,
              });
            }
          }
        }
      }

      alert('✅ Calificaciones guardadas exitosamente');
    } catch (err: any) {
      console.error('Error guardando calificaciones:', err);
      setError(err.message || 'Error al guardar las calificaciones');
      alert('❌ Error: ' + (err.message || 'No se pudieron guardar las calificaciones'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Gestión de Calificaciones</h2>
        <p className="text-gray-600">
          Ingresar y administrar calificaciones de estudiantes
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Selección de Aula y Período</CardTitle>
          <CardDescription>Seleccione el aula y período académico</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aula">Aula</Label>
              <Select 
                value={selectedAula} 
                onValueChange={setSelectedAula}
                disabled={loadingData}
              >
                <SelectTrigger id="aula">
                  <SelectValue placeholder={loadingData ? "Cargando..." : "Seleccione aula"} />
                </SelectTrigger>
                <SelectContent>
                  {aulas.map((aula: any) => (
                    <SelectItem key={aula.id_aula} value={String(aula.id_aula)}>
                      {aula.codigo || `Aula ${aula.id_aula}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select 
                value={selectedPeriod} 
                onValueChange={setSelectedPeriod}
                disabled={!selectedAula || periodos.length === 0}
              >
                <SelectTrigger id="period">
                  <SelectValue placeholder="Seleccione período" />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map(periodo => (
                    <SelectItem key={periodo.id_periodo} value={String(periodo.id_periodo)}>
                      {new Date(periodo.fecha_inicio).toLocaleDateString('es-CO')} - {new Date(periodo.fecha_fin).toLocaleDateString('es-CO')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedAula && selectedPeriod && (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Calificaciones por Componente</CardTitle>
              <CardDescription>
                {estudiantes.length} estudiantes - {componentes.length} componentes de evaluación (Escala 0-5)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingEstudiantes ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">Cargando calificaciones...</span>
                </div>
              ) : componentes.length > 0 && estudiantes.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-white z-10">Estudiante</TableHead>
                        {componentes.map(componente => (
                          <TableHead key={componente.id_componente} className="text-center min-w-[120px]">
                            <div>{componente.nombre}</div>
                            <div className="text-xs text-gray-500">{componente.porcentaje}%</div>
                          </TableHead>
                        ))}
                        <TableHead className="text-center bg-blue-50">
                          <div>Nota Final</div>
                          <div className="text-xs text-gray-500">100%</div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {estudiantes.map((estudiante: any) => (
                        <TableRow key={estudiante.doc_estudiante}>
                          <TableCell className="sticky left-0 bg-white z-10">
                            <div>
                              <div>{estudiante.primer_nombre} {estudiante.segundo_nombre || ''} {estudiante.primer_apellido} {estudiante.segundo_apellido || ''}</div>
                              <div className="text-xs text-gray-500">{estudiante.doc_estudiante}</div>
                            </div>
                          </TableCell>
                          {componentes.map(componente => (
                            <TableCell key={componente.id_componente} className="text-center">
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                className="w-20 text-center"
                                value={grades[estudiante.doc_estudiante]?.[componente.id_componente] || ''}
                                onChange={(e) => handleGradeChange(estudiante.doc_estudiante, componente.id_componente, e.target.value)}
                                placeholder="0-5"
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-center bg-blue-50">
                            <Badge variant="default" className="text-base px-3 py-1">
                              {calculateFinalGrade(estudiante.doc_estudiante).toFixed(2)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ClipboardCheck className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>
                    {estudiantes.length === 0 
                      ? 'No hay estudiantes asignados a esta aula'
                      : 'No hay componentes de evaluación configurados para este período'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {componentes.length > 0 && estudiantes.length > 0 && (
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                type="button" 
                variant="outline"
                disabled={loading}
                onClick={() => {
                  setSelectedAula('');
                  setSelectedPeriod('');
                  setGrades({});
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Calificaciones
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}