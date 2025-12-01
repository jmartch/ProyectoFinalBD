// backend/routes/PROGRAMA.js
import { Router } from "express";
import * as programaController from "../controllers/PROGRAMA.controller.js";

const router = Router();

router.get("/", programaController.getAllProgramas);
router.get("/:id", programaController.getProgramaById);
router.post("/", programaController.createPrograma);
router.put("/:id", programaController.updatePrograma);
router.delete("/:id", programaController.deletePrograma);

export default router;
