// routes/estudiante.routes.js
import { Router } from "express";
import * as estudianteController from "../controllers/ESTUDIANTE.controller.js";

const router = Router();

router.get("/", estudianteController.getAllEstudiantes);
router.get("/:doc", estudianteController.getEstudianteById);
router.post("/", estudianteController.createEstudiante);
router.put("/:doc", estudianteController.updateEstudiante);
router.delete("/:doc", estudianteController.deleteEstudiante);

export default router; 