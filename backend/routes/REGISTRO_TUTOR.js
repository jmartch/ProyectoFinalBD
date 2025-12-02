// backend/routes/REGISTRO_TUTOR.js
import { Router } from "express";
import {
  getAllRegistroTutor,
  createRegistroTutor,
} from "../controllers/REGISTRO_TUTOR.controller.js";

const router = Router();

// GET /api/registro-tutor
router.get("/", getAllRegistroTutor);

// POST /api/registro-tutor
router.post("/", createRegistroTutor);

export default router;
