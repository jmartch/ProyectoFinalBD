// routes/TUTOR.routes.js
import { Router } from "express";
import * as tutorController from "../controllers/TUTOR.controller.js";

const router = Router();

// Dashboard de un funcionario (que actúa como tutor)
router.get(
  "/dashboard/:doc_funcionario",
  tutorController.getTutorDashboardData
);

// CRUD básico
router.get("/", tutorController.getAllTutores);
router.get("/:id", tutorController.getTutorById);
router.post("/", tutorController.createTutor);
router.put("/:id", tutorController.updateTutor);
router.delete("/:id", tutorController.deleteTutor);

export default router;
