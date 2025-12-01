// routes/SEDE.js
import { Router } from "express";
import { getSedes, createSede } from "../controllers/SEDE.controller.js";

const router = Router();

// GET /api/sedes   (opcional: ?id_ied=1)
router.get("/", getSedes);

// POST /api/sedes
router.post("/", createSede);

export default router;
