// routes/periodo.routes.js
import { Router } from "express";
import * as periodoController from "../controllers/PERIODO.controller.js";

const router = Router();

router.get("/", periodoController.getAllPeriodos);
router.get("/activos", periodoController.getActivePeriodos);
router.get("/:id", periodoController.getPeriodoById);
router.post("/", periodoController.createPeriodo);
router.put("/:id", periodoController.updatePeriodo);
router.delete("/:id", periodoController.deletePeriodo);

export default router;
