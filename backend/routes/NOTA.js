// routes/nota.routes.js
import { Router } from "express";
import * as notaController from "../controllers/NOTA.controller.js";

const router = Router();

router.get("/", notaController.getAllNotas);
router.get("/:id", notaController.getNotaById);
router.post("/", notaController.createNota);
router.put("/:id", notaController.updateNota);
router.delete("/:id", notaController.deleteNota);

export default router;
