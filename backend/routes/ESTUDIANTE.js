// backend/routes/ESTUDIANTE.js
import { Router } from "express";
import {
  getAllEstudiantes,
  getAllEstudiantesDetalle,
  getEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
} from "../controllers/ESTUDIANTE.controller.js";

const router = Router();

// 👇 IMPORTANTE: /detalle va ANTES de "/:doc"
router.get("/detalle", getAllEstudiantesDetalle);

router.get("/", getAllEstudiantes);
router.get("/:doc", getEstudianteById);
router.post("/", createEstudiante);
router.put("/:doc", updateEstudiante);
router.delete("/:doc", deleteEstudiante);

export default router;
