// routes/REGISTRO_CLASES.routes.js
import { Router } from "express";
import * as registroClasesController from "../controllers/REGISTRO_CLASES.controller.js";

const router = Router();

router.get("/", registroClasesController.getAllRegistrosClases);
router.get("/:num", registroClasesController.getRegistroClasesById);
router.post("/", registroClasesController.createRegistroClases);
router.put("/:num", registroClasesController.updateRegistroClases);
router.delete("/:num", registroClasesController.deleteRegistroClases);

export default router;