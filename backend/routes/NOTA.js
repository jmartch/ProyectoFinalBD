// routes/nota.routes.js
import { Router } from "express";
import * as notaController from "../controllers/NOTA.controller.js";

const router = Router();
// Obtener notas por estudiante (Nuevo endpoint)
router.get("/estudiante/:doc_estudiante", notaController.getNotasByEstudiante);

router.get("/", notaController.getAllNotas);
router.get("/:id", notaController.getNotaById);
router.post("/", notaController.createNota);
router.put("/:id", notaController.updateNota);
router.delete("/:id", notaController.deleteNota);

export default router;
