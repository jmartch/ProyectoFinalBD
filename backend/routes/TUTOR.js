// backend/routes/TUTOR.js
import { Router } from "express";
import * as tutorController from "../controllers/TUTOR.controller.js";

const router = Router();

// Rutas "especiales" primero
router.get("/full", tutorController.getAllTutoresFull);
router.get("/:doc_funcionario/aulas-estudiantes", tutorController.getTutorAulasYEstudiantes);

// CRUD básico
router.get("/", tutorController.getAllTutores);
router.get("/:id", tutorController.getTutorById);
router.post("/", tutorController.createTutor);
router.put("/:id", tutorController.updateTutor);
router.delete("/:id", tutorController.deleteTutor);

export default router;
