import { Router } from "express";
import * as reportesController from "../controllers/REPORTES.controller.js";

const router = Router();

// Asistencia por estudiante
router.get("/asistencia-estudiante/:doc_estudiante", reportesController.getAsistenciaEstudiante);

// Boletín de calificaciones
router.get("/boletin-calificaciones/:doc_estudiante", reportesController.getBoletinCalificaciones);

export default router;
