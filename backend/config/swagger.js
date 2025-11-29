// config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Global Kids API',
      version: '1.0.0',
      description: 'Documentación de la API para el sistema de gestión educativa Global Kids',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo'
      },
    ],
    tags: [
      { name: 'Estudiantes', description: 'Gestión de estudiantes' },
      { name: 'IEDs', description: 'Gestión de Instituciones Educativas' },
      { name: 'Sedes', description: 'Gestión de sedes educativas' },
      { name: 'Programas', description: 'Gestión de programas académicos' },
      { name: 'Notas', description: 'Gestión de calificaciones y componentes' },
      { name: 'Asistencia', description: 'Registro de asistencia de estudiantes y clases' },
      { name: 'Horarios', description: 'Gestión de horarios, semanas y festivos' },
      { name: 'Funcionarios', description: 'Gestión de funcionarios y tutores' },
      { name: 'Usuarios', description: 'Autenticación y gestión de usuarios' }
    ],
    components: {
      schemas: {
        // ==================== ESTUDIANTE ====================
        Estudiante: {
          type: 'object',
          required: ['doc_estudiante', 'tipo_doc', 'nombre1', 'apellido1', 'apellido2', 'sexo'],
          properties: {
            doc_estudiante: {
              type: 'string',
              description: 'Documento de identidad del estudiante',
              example: '1000123456'
            },
            tipo_doc: {
              type: 'string',
              description: 'Tipo de documento',
              enum: ['TI', 'CC', 'CE', 'RC', 'PE'],
              example: 'TI'
            },
            nombre1: {
              type: 'string',
              description: 'Primer nombre',
              example: 'Juan'
            },
            nombre2: {
              type: 'string',
              description: 'Segundo nombre (opcional)',
              example: 'Carlos'
            },
            apellido1: {
              type: 'string',
              description: 'Primer apellido',
              example: 'Pérez'
            },
            apellido2: {
              type: 'string',
              description: 'Segundo apellido',
              example: 'González'
            },
            sexo: {
              type: 'string',
              enum: ['M', 'F'],
              description: 'Sexo del estudiante',
              example: 'M'
            },
            correo_acudiente: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del acudiente (opcional)',
              example: 'acudiente@email.com'
            },
            telefono_acudiente: {
              type: 'string',
              description: 'Teléfono del acudiente (opcional, 7-15 dígitos)',
              example: '3001234567'
            }
          }
        },

        // ==================== FUNCIONARIO ====================
        Funcionario: {
          type: 'object',
          required: ['doc_funcionario', 'tipo_doc', 'nombre1', 'apellido1', 'apellido2', 'sexo', 'fecha_contrato'],
          properties: {
            doc_funcionario: {
              type: 'string',
              description: 'Documento del funcionario',
              example: '1012345678'
            },
            tipo_doc: {
              type: 'string',
              enum: ['TI', 'CC', 'CE', 'PE'],
              description: 'Tipo de documento',
              example: 'CC'
            },
            nombre1: { type: 'string', example: 'María' },
            nombre2: { type: 'string', example: 'Isabel' },
            apellido1: { type: 'string', example: 'Gutiérrez' },
            apellido2: { type: 'string', example: 'González' },
            sexo: {
              type: 'string',
              enum: ['M', 'F'],
              example: 'F'
            },
            correo: {
              type: 'string',
              format: 'email',
              description: 'Correo institucional o personal',
              example: 'profesor@colegio.edu'
            },
            telefono: {
              type: 'string',
              description: 'Teléfono de contacto (7-15 dígitos)',
              example: '3209876543'
            },
            fecha_contrato: {
              type: 'string',
              format: 'date',
              description: 'Fecha de inicio del contrato (no puede ser futura)',
              example: '2024-01-15'
            }
          }
        },

        // ==================== IED ====================
        IED: {
          type: 'object',
          properties: {
            id_IED: {
              type: 'integer',
              description: 'ID autoincremental de la institución educativa',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Nombre de la institución',
              example: 'Institución Educativa Distrital Global Kids'
            },
            telefono: {
              type: 'string',
              description: 'Teléfono de contacto (opcional)',
              example: '6053456789'
            },
            duracion: {
              type: 'integer',
              description: 'Duración estándar de las clases (en minutos)',
              example: 60
            },
            hora_inicio: {
              type: 'string',
              format: 'time',
              description: 'Hora de inicio de la jornada (HH:MM:SS)',
              example: '07:00:00'
            },
            hora_fin: {
              type: 'string',
              format: 'time',
              description: 'Hora de finalización de la jornada (HH:MM:SS)',
              example: '13:00:00'
            },
            jornada: {
              type: 'string',
              description: 'Nombre de la jornada (Mañana, Tarde, Única, etc.)',
              example: 'Mañana'
            }
          }
        },

        // ==================== SEDE ====================
        Sede: {
          type: 'object',
          properties: {
            id_sede: {
              type: 'integer',
              description: 'ID autoincremental de la sede',
              example: 1
            },
            id_IED: {
              type: 'integer',
              description: 'ID de la institución educativa a la que pertenece',
              example: 1
            },
            direccion: {
              type: 'string',
              description: 'Dirección física de la sede',
              example: 'Calle 45 #32-10 Barrio Centro'
            },
            tipo: {
              type: 'string',
              description: 'Tipo de sede (principal, alterna, rural, etc.)',
              example: 'Principal'
            }
          },
          required: ['id_IED', 'direccion', 'tipo']
        },

        // ==================== PROGRAMA ====================
        Programa: {
          type: 'object',
          properties: {
            id_programa: {
              type: 'integer',
              description: 'ID autoincremental del programa',
              example: 1
            },
            nombre_programa: {
              type: 'string',
              description: 'Nombre del programa académico',
              example: 'Inglés para niños Global Kids'
            }
          },
          required: ['nombre_programa']
        },

        // ==================== HORARIO ====================
        Horario: {
          type: 'object',
          properties: {
            id_horario: {
              type: 'integer',
              description: 'ID del horario',
              example: 1
            },
            dia_semana: {
              type: 'string',
              description: 'Día de la semana',
              enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
              example: 'Lunes'
            },
            hora_inicio: {
              type: 'string',
              format: 'time',
              description: 'Hora de inicio (HH:MM:SS)',
              example: '08:00:00'
            },
            horas_duracion: {
              type: 'number',
              description: 'Duración en horas (1-24)',
              example: 2
            }
          },
          required: ['dia_semana', 'hora_inicio', 'horas_duracion']
        },

        // ==================== PERIODO ====================
        Periodo: {
          type: 'object',
          properties: {
            id_periodo: {
              type: 'integer',
              description: 'ID del periodo académico',
              example: 1
            },
            fecha_inicio: {
              type: 'string',
              format: 'date',
              description: 'Fecha de inicio del periodo',
              example: '2024-01-15'
            },
            fecha_fin: {
              type: 'string',
              format: 'date',
              description: 'Fecha de fin del periodo',
              example: '2024-06-15'
            }
          },
          required: ['fecha_inicio', 'fecha_fin']
        },

        // ==================== SEMANA ====================
        Semana: {
          type: 'object',
          properties: {
            numero_semana: {
              type: 'integer',
              description: 'Número de semana dentro del periodo',
              example: 3
            },
            id_periodo: {
              type: 'integer',
              description: 'ID del periodo al que pertenece la semana',
              example: 1
            },
            fecha_inicio: {
              type: 'string',
              format: 'date',
              description: 'Fecha de inicio de la semana',
              example: '2024-02-01'
            },
            fecha_fin: {
              type: 'string',
              format: 'date',
              description: 'Fecha de fin de la semana',
              example: '2024-02-07'
            }
          },
          required: ['id_periodo', 'fecha_inicio', 'fecha_fin']
        },

        // ==================== FESTIVO ====================
        Festivo: {
          type: 'object',
          properties: {
            fecha: {
              type: 'string',
              format: 'date',
              description: 'Fecha del día festivo (PK)',
              example: '2024-03-25'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del festivo',
              example: 'Día de la Independencia'
            }
          },
          required: ['fecha']
        },

        // ==================== MOTIVO (inasistencia/clase) ====================
        Motivo: {
          type: 'object',
          properties: {
            codigo: {
              type: 'string',
              description: 'Código del motivo (PK, máx. 10 caracteres)',
              example: 'ENFERM'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del motivo',
              example: 'Inasistencia por enfermedad'
            }
          },
          required: ['codigo', 'descripcion']
        },

        // ==================== COMPONENTE (nota) ====================
        Componente: {
          type: 'object',
          properties: {
            id_componente: {
              type: 'integer',
              description: 'ID del componente de evaluación',
              example: 1
            },
            id_periodo: {
              type: 'integer',
              description: 'ID del periodo al que pertenece el componente',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Nombre del componente (Talleres, Parcial, etc.)',
              example: 'Talleres'
            },
            porcentaje: {
              type: 'number',
              description: 'Porcentaje que aporta a la nota definitiva (0-100)',
              example: 30
            }
          }
        },

        // ==================== NOTA ====================
        Nota: {
          type: 'object',
          properties: {
            id_nota: {
              type: 'integer',
              description: 'ID de la nota (PK)',
              example: 1
            },
            doc_estudiante: {
              type: 'string',
              description: 'Documento del estudiante',
              example: '1000123456'
            },
            id_periodo: {
              type: 'integer',
              description: 'ID del periodo académico',
              example: 1
            },
            definitiva: {
              type: 'number',
              format: 'float',
              description: 'Nota definitiva (0.0 - 5.0)',
              example: 4.5
            }
          }
        },

        // ==================== DETALLE_NOTA ====================
        DetalleNota: {
          type: 'object',
          properties: {
            id_nota: {
              type: 'integer',
              description: 'ID de la nota',
              example: 1
            },
            id_componente: {
              type: 'integer',
              description: 'ID del componente evaluado',
              example: 2
            },
            nota: {
              type: 'number',
              format: 'float',
              description: 'Calificación del componente (0-5)',
              example: 4.0
            }
          },
          required: ['id_nota', 'id_componente', 'nota']
        },

        // ==================== REGISTRO_CLASES ====================
        RegistroClases: {
          type: 'object',
          properties: {
            num_registro: {
              type: 'integer',
              description: 'ID autoincremental del registro',
              example: 10
            },
            numero_semana: {
              type: 'integer',
              description: 'Número de la semana',
              example: 3
            },
            id_aula: {
              type: 'integer',
              description: 'ID del aula donde se dicta la clase',
              example: 5
            },
            codigo: {
              type: 'string',
              description: 'Código del motivo (si aplica, FK a MOTIVO.codigo)',
              example: 'ENFERM'
            },
            fecha: {
              type: 'string',
              format: 'date',
              description: 'Fecha programada de la clase',
              example: '2024-03-01'
            },
            dictada: {
              type: 'boolean',
              description: 'Indica si la clase fue efectivamente dictada',
              example: true
            },
            is_festivo: {
              type: 'boolean',
              description: 'Indica si la fecha coincide con un día festivo',
              example: false
            },
            fecha_reposicion: {
              type: 'string',
              format: 'date',
              nullable: true,
              description: 'Fecha de reposición (si la clase no fue dictada)',
              example: '2024-03-10'
            }
          }
        },

        // ==================== TUTOR ====================
        Tutor: {
          type: 'object',
          properties: {
            id_tutor: {
              type: 'integer',
              description: 'ID del tutor (PK, autoincremental)',
              example: 1
            }
          }
        },

        // ==================== REGISTRO_TUTORES ====================
        RegistroTutores: {
          type: 'object',
          properties: {
            doc_funcionario: {
              type: 'string',
              description: 'Documento del funcionario que ejerce como tutor',
              example: '1012345678'
            },
            id_tutor: {
              type: 'integer',
              description: 'ID del registro de tutoría',
              example: 1
            },
            fecha_asignacion: {
              type: 'string',
              format: 'date',
              description: 'Fecha en la que se asigna la tutoría (no futura)',
              example: '2024-02-10'
            }
          },
          required: ['doc_funcionario', 'id_tutor', 'fecha_asignacion']
        },

        // ==================== USUARIO ====================
        Usuario: {
          type: 'object',
          properties: {
            usuario: {
              type: 'string',
              description: 'Nombre de usuario (login)',
              example: 'mgutierrez'
            },
            doc_funcionario: {
              type: 'string',
              description: 'Documento del funcionario asociado',
              example: '1012345678'
            },
            contraseña: {
              type: 'string',
              description: 'Contraseña en texto plano (solo para entrada)',
              example: 'Secreta123!',
              writeOnly: true
            },
            rol: {
              type: 'string',
              description: 'Rol del usuario en el sistema',
              enum: ['admin', 'profesor', 'coordinador', 'secretario'],
              example: 'admin'
            }
          },
          required: ['usuario', 'doc_funcionario', 'contraseña', 'rol']
        },

        // ==================== ERROR GENÉRICO ====================
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error legible',
              example: 'Error al procesar la solicitud'
            },
            error: {
              type: 'string',
              description: 'Detalle técnico del error (opcional)',
              example: 'ER_DUP_ENTRY'
            }
          }
        },
      },

      responses: {
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        BadRequest: {
          description: 'Solicitud incorrecta',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        Conflict: {
          description: 'Conflicto con el estado actual del recurso (duplicados, FK, etc.)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },

    // ==================== PATHS (ENDPOINTS) ====================
    paths: {
      // -------- ESTUDIANTES --------
      '/estudiantes': {
        get: {
          tags: ['Estudiantes'],
          summary: 'Obtener todos los estudiantes',
          responses: {
            200: {
              description: 'Listado de estudiantes',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Estudiante' } }
                }
              }
            },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        post: {
          tags: ['Estudiantes'],
          summary: 'Crear un nuevo estudiante',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Estudiante' }
              }
            }
          },
          responses: {
            201: {
              description: 'Estudiante creado exitosamente',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Estudiante' }
                }
              }
            },
            400: { $ref: '#/components/responses/BadRequest' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/estudiantes/{doc}': {
        get: {
          tags: ['Estudiantes'],
          summary: 'Obtener un estudiante por documento',
          parameters: [
            {
              name: 'doc',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Documento del estudiante'
            }
          ],
          responses: {
            200: {
              description: 'Estudiante encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Estudiante' }
                }
              }
            },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        put: {
          tags: ['Estudiantes'],
          summary: 'Actualizar información de un estudiante',
          parameters: [
            {
              name: 'doc',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Documento del estudiante'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Estudiante' }
              }
            }
          },
          responses: {
            200: {
              description: 'Estudiante actualizado correctamente',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Estudiante' }
                }
              }
            },
            400: { $ref: '#/components/responses/BadRequest' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        delete: {
          tags: ['Estudiantes'],
          summary: 'Eliminar un estudiante',
          parameters: [
            {
              name: 'doc',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Documento del estudiante'
            }
          ],
          responses: {
            200: { description: 'Estudiante eliminado exitosamente' },
            404: { $ref: '#/components/responses/NotFound' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },

      // -------- FUNCIONARIOS --------
      '/funcionarios': {
        get: {
          tags: ['Funcionarios'],
          summary: 'Obtener todos los funcionarios',
          responses: {
            200: {
              description: 'Listado de funcionarios',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Funcionario' } }
                }
              }
            },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        post: {
          tags: ['Funcionarios'],
          summary: 'Crear un funcionario',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Funcionario' }
              }
            }
          },
          responses: {
            201: { description: 'Funcionario creado' },
            400: { $ref: '#/components/responses/BadRequest' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/funcionarios/{doc}': {
        get: {
          tags: ['Funcionarios'],
          summary: 'Obtener funcionario por documento',
          parameters: [
            {
              name: 'doc',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Documento del funcionario'
            }
          ],
          responses: {
            200: {
              description: 'Funcionario encontrado',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Funcionario' } }
              }
            },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        put: {
          tags: ['Funcionarios'],
          summary: 'Actualizar funcionario',
          parameters: [
            {
              name: 'doc',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Documento del funcionario'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Funcionario' } }
            }
          },
          responses: {
            200: { description: 'Funcionario actualizado' },
            400: { $ref: '#/components/responses/BadRequest' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        delete: {
          tags: ['Funcionarios'],
          summary: 'Eliminar funcionario',
          parameters: [
            {
              name: 'doc',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Documento del funcionario'
            }
          ],
          responses: {
            200: { description: 'Funcionario eliminado' },
            404: { $ref: '#/components/responses/NotFound' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },

      // -------- IEDs --------
      '/ieds': {
        get: {
          tags: ['IEDs'],
          summary: 'Obtener todas las IED',
          responses: {
            200: {
              description: 'Listado de instituciones educativas',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/IED' } }
                }
              }
            },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        post: {
          tags: ['IEDs'],
          summary: 'Crear una IED',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/IED' }
              }
            }
          },
          responses: {
            201: { description: 'IED creada' },
            400: { $ref: '#/components/responses/BadRequest' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/ieds/{id}': {
        get: {
          tags: ['IEDs'],
          summary: 'Obtener IED por ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID de la IED'
            }
          ],
          responses: {
            200: {
              description: 'IED encontrada',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/IED' } }
              }
            },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        put: {
          tags: ['IEDs'],
          summary: 'Actualizar IED',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID de la IED'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/IED' } }
            }
          },
          responses: {
            200: { description: 'IED actualizada' },
            400: { $ref: '#/components/responses/BadRequest' },
            404: { $ref: '#/components/responses/NotFound' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        delete: {
          tags: ['IEDs'],
          summary: 'Eliminar IED',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID de la IED'
            }
          ],
          responses: {
            200: { description: 'IED eliminada' },
            404: { $ref: '#/components/responses/NotFound' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },

      // -------- SEDES --------
      '/sedes': {
        get: {
          tags: ['Sedes'],
          summary: 'Obtener todas las sedes',
          responses: {
            200: {
              description: 'Listado de sedes',
              content: {
                'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Sede' } } }
              }
            },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        post: {
          tags: ['Sedes'],
          summary: 'Crear una sede',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Sede' } }
            }
          },
          responses: {
            201: { description: 'Sede creada' },
            400: { $ref: '#/components/responses/BadRequest' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/sedes/{id}': {
        get: {
          tags: ['Sedes'],
          summary: 'Obtener sede por ID',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'Sede encontrada' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        put: {
          tags: ['Sedes'],
          summary: 'Actualizar sede',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Sede' } }
            }
          },
          responses: {
            200: { description: 'Sede actualizada' },
            400: { $ref: '#/components/responses/BadRequest' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        delete: {
          tags: ['Sedes'],
          summary: 'Eliminar sede',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'Sede eliminada' },
            404: { $ref: '#/components/responses/NotFound' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },

      // -------- PROGRAMAS --------
      '/programas': {
        get: {
          tags: ['Programas'],
          summary: 'Obtener todos los programas',
          responses: {
            200: {
              description: 'Listado de programas',
              content: {
                'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Programa' } } }
              }
            },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        post: {
          tags: ['Programas'],
          summary: 'Crear un programa',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Programa' } }
            }
          },
          responses: {
            201: { description: 'Programa creado' },
            400: { $ref: '#/components/responses/BadRequest' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/programas/{id_programa}': {
        get: {
          tags: ['Programas'],
          summary: 'Obtener programa por ID',
          parameters: [
            { name: 'id_programa', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'Programa encontrado' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        put: {
          tags: ['Programas'],
          summary: 'Actualizar programa',
          parameters: [
            { name: 'id_programa', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Programa' } }
            }
          },
          responses: {
            200: { description: 'Programa actualizado' },
            400: { $ref: '#/components/responses/BadRequest' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        delete: {
          tags: ['Programas'],
          summary: 'Eliminar programa',
          parameters: [
            { name: 'id_programa', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'Programa eliminado' },
            404: { $ref: '#/components/responses/NotFound' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },

      // -------- NOTAS --------
      '/notas': {
        get: {
          tags: ['Notas'],
          summary: 'Obtener todas las notas',
          responses: {
            200: {
              description: 'Listado de notas',
              content: {
                'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Nota' } } }
              }
            },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        post: {
          tags: ['Notas'],
          summary: 'Crear una nota',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Nota' } } }
          },
          responses: {
            201: { description: 'Nota creada' },
            400: { $ref: '#/components/responses/BadRequest' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/notas/{id}': {
        get: {
          tags: ['Notas'],
          summary: 'Obtener nota por ID',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'Nota encontrada' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        put: {
          tags: ['Notas'],
          summary: 'Actualizar nota',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Nota' } } }
          },
          responses: {
            200: { description: 'Nota actualizada' },
            400: { $ref: '#/components/responses/BadRequest' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        delete: {
          tags: ['Notas'],
          summary: 'Eliminar nota',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'Nota eliminada' },
            404: { $ref: '#/components/responses/NotFound' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },

      // -------- DETALLES DE NOTA --------
      '/detalles-nota': {
        get: {
          tags: ['Notas'],
          summary: 'Obtener todos los detalles de nota',
          responses: {
            200: {
              description: 'Listado de detalles de nota',
              content: {
                'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/DetalleNota' } } }
              }
            },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        post: {
          tags: ['Notas'],
          summary: 'Crear detalle de nota',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/DetalleNota' } } }
          },
          responses: {
            201: { description: 'Detalle de nota creado' },
            400: { $ref: '#/components/responses/BadRequest' },
            404: { $ref: '#/components/responses/NotFound' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/detalles-nota/{id_nota}/{id_componente}': {
        get: {
          tags: ['Notas'],
          summary: 'Obtener detalle de nota por nota y componente',
          parameters: [
            { name: 'id_nota', in: 'path', required: true, schema: { type: 'integer' } },
            { name: 'id_componente', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'Detalle encontrado' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        put: {
          tags: ['Notas'],
          summary: 'Actualizar detalle de nota',
          parameters: [
            { name: 'id_nota', in: 'path', required: true, schema: { type: 'integer' } },
            { name: 'id_componente', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/DetalleNota' } } }
          },
          responses: {
            200: { description: 'Detalle actualizado' },
            400: { $ref: '#/components/responses/BadRequest' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        delete: {
          tags: ['Notas'],
          summary: 'Eliminar detalle de nota',
          parameters: [
            { name: 'id_nota', in: 'path', required: true, schema: { type: 'integer' } },
            { name: 'id_componente', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: {
            200: { description: 'Detalle eliminado' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },

      // -------- USUARIOS --------
      '/usuarios': {
        get: {
          tags: ['Usuarios'],
          summary: 'Obtener todos los usuarios (sin contraseñas)',
          responses: {
            200: {
              description: 'Listado de usuarios',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      allOf: [
                        { $ref: '#/components/schemas/Usuario' },
                        {
                          type: 'object',
                          properties: { contraseña: { readOnly: true } }
                        }
                      ]
                    }
                  }
                }
              }
            },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        post: {
          tags: ['Usuarios'],
          summary: 'Crear un usuario',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } }
          },
          responses: {
            201: { description: 'Usuario creado' },
            400: { $ref: '#/components/responses/BadRequest' },
            404: { $ref: '#/components/responses/NotFound' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      },
      '/usuarios/{usuario}': {
        get: {
          tags: ['Usuarios'],
          summary: 'Obtener usuario por nombre de usuario',
          parameters: [
            { name: 'usuario', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Usuario encontrado' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        put: {
          tags: ['Usuarios'],
          summary: 'Actualizar usuario (rol, contraseña, doc_funcionario)',
          parameters: [
            { name: 'usuario', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } }
          },
          responses: {
            200: { description: 'Usuario actualizado' },
            400: { $ref: '#/components/responses/BadRequest' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        },
        delete: {
          tags: ['Usuarios'],
          summary: 'Eliminar usuario',
          parameters: [
            { name: 'usuario', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Usuario eliminado' },
            404: { $ref: '#/components/responses/NotFound' },
            409: { $ref: '#/components/responses/Conflict' },
            500: { $ref: '#/components/responses/ServerError' }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../config/*.js'),
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerDocs = (app, PORT) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Global Kids API Docs'
  }));
  console.log(`📄 Swagger docs disponibles en: http://localhost:${PORT}/api-docs`);
};

export default swaggerSpec;
