import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { swaggerDocs } from './config/swagger.js';
import { initializeDatabase } from './config/db.js';

import estudianteRoutes from './routes/ESTUDIANTE.js';
import iedRoutes from './routes/IED.js';
import notaRoutes from './routes/NOTA.js';
import horarioRoutes from './routes/HORARIO.js';
import asistenciaRoutes from './routes/ASISTENCIA.js';
import aulaRoutes from './routes/AULA.js';
import tutorRoutes from './routes/TUTOR.js';
import sedeRoutes from './routes/SEDE.js';
import periodoRoutes from './routes/PERIODO.js';
import usuarioRoutes from './routes/USUARIO.js';
import motivoRoutes from './routes/MOTIVO.js';
import matriculaRoutes from './routes/MATRICULA.js';
import registroClasesRoutes from './routes/REGISTRO_CLASES.js';
import registroTutoresRoutes from './routes/REGISTRO_TUTOR.js';
import componenteRoutes from './routes/COMPONENTE.js';
import funcionarioRoutes from './routes/FUNCIONARIO.js';
import detalleNotaRoutes from './routes/DETALLE_NOTA.js';
import aulaTutorRoutes from "./routes/AULA_TUTOR.js";
import programaRoutes from "./routes/PROGRAMA.js";
import semanaRoutes from "./routes/SEMANA.js";


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API (ajusta las rutas base si lo deseas)
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/ieds', iedRoutes);
app.use('/api/notas', notaRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/aulas', aulaRoutes);
app.use('/api/tutores', tutorRoutes);
app.use('/api/sedes', sedeRoutes);
app.use('/api/periodos', periodoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/motivos', motivoRoutes);
app.use('/api/matriculas', matriculaRoutes);
app.use('/api/registro_clases', registroClasesRoutes);
app.use('/api/registro_tutores', registroTutoresRoutes);
app.use('/api/componentes', componenteRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/detalle_nota', detalleNotaRoutes);
app.use("/api/aula-tutor", aulaTutorRoutes);
app.use("/api/programas", programaRoutes);
app.use("/api/semanas", semanaRoutes);


// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

async function start() {
  await initializeDatabase();

  const PORT = process.env.PORT || 3000;

  swaggerDocs(app, PORT);

  app.listen(PORT, () => {
    console.log(`🚀 Servidor Global Kids corriendo en puerto ${PORT}`);
    console.log(`Documentación: http://localhost:${PORT}/api-docs`);
    console.log(`Endpoints base montados en /api/*`);
  });
}

start();