// routes/componente.routes.js
import { Router } from "express";
import * as componenteController from "../controllers/COMPONENTE.controller.js";

const router = Router();

router.get("/", componenteController.getAllComponentes);
router.get("/:id", componenteController.getComponenteById);
router.post("/", componenteController.createComponente);
router.put("/:id", componenteController.updateComponente);
router.delete("/:id", componenteController.deleteComponente);

export default router;
