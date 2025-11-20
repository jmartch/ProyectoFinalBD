import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { swaggerDocs } from './config/swagger.js';  // ⭐ IMPORTAR SWAGGER
import { initializeDatabase } from './config/db.js';
// import estudianteRoutes from './routes/estudiante.routes.js';
// import iedRoutes from './routes/ied.routes.js';
// import notaRoutes from './routes/nota.routes.js';
// import horarioRoutes from './routes/horario.routes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de la API
// app.use('/api/estudiantes', estudianteRoutes);
// app.use('/api/ieds', iedRoutes);
// app.use('/api/notas', notaRoutes);
// app.use('/api/horarios', horarioRoutes);

async function start() {
  await initializeDatabase();

  const PORT = process.env.PORT || 3000;

  swaggerDocs(app, PORT);

  app.listen(PORT, () => {
    console.log(`🚀 Servidor Global Kids corriendo en puerto ${PORT}`);
    console.log(``);

    ///api-docs
    console.log(`Documentacion de la API disponible en: http://localhost:${PORT}/api-docs`);

    console.log(`🌐 Endpoints disponibles:`);
    console.log(`Estudiantes (DB: estudiante)`);
    console.log(`   GET    http://localhost:${PORT}/api/estudiantes`);
    console.log(`   GET    http://localhost:${PORT}/api/estudiantes/:id`);
    console.log(`   POST   http://localhost:${PORT}/api/estudiantes`);
    console.log(`   PUT    http://localhost:${PORT}/api/estudiantes/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/estudiantes/:id`);
    console.log(``);

    console.log(`IEDs (DB: ied)`);
    console.log(`   GET    http://localhost:${PORT}/api/ieds`);
    console.log(`   GET    http://localhost:${PORT}/api/ieds/:id`);
    console.log(`   POST   http://localhost:${PORT}/api/ieds`);
    console.log(`   PUT    http://localhost:${PORT}/api/ieds/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/ieds/:id`);
    console.log(``);

    console.log(`Notas (DB: nota, detalle_nota)`);
    console.log(`   GET    http://localhost:${PORT}/api/notas/estudiante/:docEstudiante`);
    console.log(`   POST   http://localhost:${PORT}/api/notas`);
    console.log(`   PUT    http://localhost:${PORT}/api/notas/:id`);
    console.log(``);

    console.log(`Asistencia (DB: asistencia, registro_clases)`);
    console.log(`   GET    http://localhost:${PORT}/api/asistencia/estudiante/:docEstudiante`);
    console.log(`   POST   http://localhost:${PORT}/api/asistencia`);
    console.log(``);

    console.log(`Horarios (DB: horario)`);
    console.log(`   GET    http://localhost:${PORT}/api/horarios/aula/:idAula`);
    console.log(`   POST   http://localhost:${PORT}/api/horarios`);
    console.log(``);

    
  });
}

start();