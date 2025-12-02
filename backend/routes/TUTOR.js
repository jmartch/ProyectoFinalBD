import { Router } from "express";
import {
  getAllTutores,
  createTutor,
  getTutorAulasYEstudiantes,
} from "../controllers/TUTOR.controller.js";

const router = Router();

// GET /api/tutor
router.get("/", getAllTutores);

// POST /api/tutor
router.post("/", createTutor);

// GET /api/tutor/:id_tutor/aulas-estudiantes
router.get("/:id_tutor/aulas-estudiantes", getTutorAulasYEstudiantes);

export default router;
