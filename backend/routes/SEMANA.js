// routes/SEMANA.routes.js
import { Router } from "express";
import * as semanaController from "../controllers/SEMANA.controller.js";

const router = Router();

router.get("/", semanaController.getAllSemanas);
router.get("/:numero_semana", semanaController.getSemanaById);
router.post("/", semanaController.createSemana);
router.put("/:numero_semana", semanaController.updateSemana);
router.delete("/:numero_semana", semanaController.deleteSemana);

export default router;
