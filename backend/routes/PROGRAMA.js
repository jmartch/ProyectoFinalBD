// routes/programa.routes.js
import { Router } from "express";
import * as programaController from "../controllers/PROGRAMA.controller.js";

const router = Router();

router.get("/", programaController.getAllProgramas);
router.get("/:id_programa", programaController.getProgramaById);
router.post("/", programaController.createPrograma);
router.put("/:id_programa", programaController.updatePrograma);
router.delete("/:id_programa", programaController.deletePrograma);

export default router;
