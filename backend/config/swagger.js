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
      {
        name: 'Estudiantes',
        description: 'Gestión de estudiantes'
      },
      {
        name: 'IEDs',
        description: 'Gestión de Instituciones Educativas'
      },
      {
        name: 'Notas',
        description: 'Gestión de calificaciones y componentes'
      },
      {
        name: 'Asistencia',
        description: 'Registro de asistencia de estudiantes'
      },
      {
        name: 'Horarios',
        description: 'Gestión de horarios y aulas'
      },
      {
        name: 'Funcionarios',
        description: 'Gestión de funcionarios y tutores'
      },
      {
        name: 'Usuarios',
        description: 'Autenticación y gestión de usuarios'
      }
    ],
    components: {
      schemas: {
        Estudiante: {
          type: 'object',
          required: ['doc_estudiante', 'tipo_doc', 'nombre1', 'apellido1', 'correo_acudiente', 'telefono_acudiente'],
          properties: {
            doc_estudiante: {
              type: 'integer',
              description: 'Documento de identidad del estudiante',
              example: 1234567890
            },
            tipo_doc: {
              type: 'string',
              description: 'Tipo de documento',
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
              description: 'Segundo apellido (opcional)',
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
              description: 'Correo electrónico del acudiente',
              example: 'acudiente@email.com'
            },
            telefono_acudiente: {
              type: 'string',
              description: 'Teléfono del acudiente',
              example: '3001234567'
            }
          }
        },
        IED: {
          type: 'object',
          required: ['id_ied', 'nombre', 'telefono'],
          properties: {
            id_ied: {
              type: 'integer',
              description: 'ID de la institución educativa',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Nombre de la IED',
              example: 'Colegio Distrital Francisco de Paula'
            },
            telefono: {
              type: 'string',
              description: 'Teléfono de contacto',
              example: '6012345678'
            },
            duracion: {
              type: 'string',
              format: 'time',
              description: 'Duración de las clases',
              example: '01:00:00'
            },
            hora_inicio: {
              type: 'string',
              format: 'time',
              description: 'Hora de inicio de clases',
              example: '07:00:00'
            },
            hora_fin: {
              type: 'string',
              format: 'time',
              description: 'Hora de finalización de clases',
              example: '14:00:00'
            }
          }
        },
        Nota: {
          type: 'object',
          properties: {
            id_nota: {
              type: 'integer',
              description: 'ID de la nota',
              example: 1
            },
            doc_estudiante: {
              type: 'integer',
              description: 'Documento del estudiante',
              example: 1234567890
            },
            definitiva: {
              type: 'number',
              format: 'float',
              description: 'Nota definitiva calculada automáticamente',
              example: 4.5
            }
          }
        },
        DetalleNota: {
          type: 'object',
          required: ['id_nota', 'id_componente', 'nota'],
          properties: {
            id_nota: {
              type: 'integer',
              description: 'ID de la nota',
              example: 1
            },
            id_componente: {
              type: 'integer',
              description: 'ID del componente evaluado',
              example: 1
            },
            nota: {
              type: 'number',
              format: 'float',
              description: 'Calificación del componente (0-5)',
              example: 4.5
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            mensaje: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'Error al procesar la solicitud'
            },
            error: {
              type: 'string',
              description: 'Detalles del error',
              example: 'Duplicate entry'
            }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        BadRequest: {
          description: 'Solicitud incorrecta',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
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

// Función para inicializar swagger
export const swaggerDocs = (app, PORT) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Global Kids API Docs'
  }));
  console.log(`📄 Swagger docs disponibles en: http://localhost:${PORT}/api-docs`);
};

export default swaggerSpec;