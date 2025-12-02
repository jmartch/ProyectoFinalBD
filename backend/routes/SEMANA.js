// routes/SEMANA.js
import express from "express";
import {
  getAllSemanas,
  getSemanaById,
  createSemana,
  updateSemana,
  deleteSemana,
  regenerarCalendarioSemanas,
} from "../controllers/SEMANA.controller.js";

const router = express.Router();

// CRUD de semanas
router.get("/semanas", getAllSemanas);
router.get("/semanas/:numero_semana", getSemanaById);
router.post("/semanas", createSemana);
router.put("/semanas/:numero_semana", updateSemana);
router.delete("/semanas/:numero_semana", deleteSemana);

// 🔁 REGENERAR CALENDARIO
router.post("/semanas/regenerar", regenerarCalendarioSemanas);

export default router;
