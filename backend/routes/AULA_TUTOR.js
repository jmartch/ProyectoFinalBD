// backend/routes/AULA_TUTOR.js
import { Router } from "express";
import {
  getAllAulaTutor,
  createAulaTutor,
} from "../controllers/AULA_TUTOR.controller.js";

const router = Router();

// GET /api/aula-tutor
router.get("/", getAllAulaTutor);

// POST /api/aula-tutor
router.post("/", createAulaTutor);

export default router;
