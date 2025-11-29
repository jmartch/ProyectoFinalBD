// routes/asignacionAulaHorario.routes.js
import { Router } from "express";
import * as asignacionAulaHorarioController from "../controllers/ASIGNACION_AULA_HORARIO.controller.js";

const router = Router();

// GET /        -> todas las asignaciones
router.get("/", asignacionAulaHorarioController.getAllAsignaciones);

// GET /:id_horario/:id_aula/:fecha_inicio  -> una asignación específica
router.get(
  "/:id_horario/:id_aula/:fecha_inicio",
  asignacionAulaHorarioController.getAsignacionByKeys
);

// POST /       -> crear asignación
router.post("/", asignacionAulaHorarioController.createAsignacion);

// PUT /:id_horario/:id_aula/:fecha_inicio  -> actualizar fecha_fin
router.put(
  "/:id_horario/:id_aula/:fecha_inicio",
  asignacionAulaHorarioController.updateAsignacionByKeys
);

// DELETE /:id_horario/:id_aula/:fecha_inicio -> eliminar asignación
router.delete(
  "/:id_horario/:id_aula/:fecha_inicio",
  asignacionAulaHorarioController.deleteAsignacionByKeys
);

export default router;