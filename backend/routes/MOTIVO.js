// routes/motivo.routes.js
import { Router } from "express";
import * as motivoController from "../controllers/MOTIVO.controller.js";

const router = Router();

router.get("/", motivoController.getAllMotivos);
router.get("/:codigo", motivoController.getMotivoById);
router.post("/", motivoController.createMotivo);
router.put("/:codigo", motivoController.updateMotivo);
router.delete("/:codigo", motivoController.deleteMotivo);

export default router;
