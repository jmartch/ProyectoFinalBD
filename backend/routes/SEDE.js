// backend/routes/SEDE.js
import { Router } from "express";
import * as sedeController from "../controllers/SEDE.controller.js";

const router = Router();

// GET /api/sedes?iedId=1
router.get("/", sedeController.getSedes);

// POST /api/sedes
router.post("/", sedeController.createSede);

// Opcionales para más adelante:
router.put("/:id", sedeController.updateSede);
router.delete("/:id", sedeController.deleteSede);

export default router;
