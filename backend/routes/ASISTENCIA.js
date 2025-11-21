import { Router } from "express";
import * as asistenciaController from "../controllers/ASISTENCIA.controller.js";

const router = Router();

router.get("/", asistenciaController.getAllAsistencias);
router.get("/:num_registro/:doc_estudiante", asistenciaController.getAsistenciaByKeys);
router.post("/", asistenciaController.createAsistencia);
router.put("/:num_registro/:doc_estudiante", asistenciaController.updateAsistencia);
router.delete("/:num_registro/:doc_estudiante", asistenciaController.deleteAsistencia);

export default router;