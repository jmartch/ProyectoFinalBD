// routes/registroClases.routes.js
import { Router } from "express";
import * as registroClasesController from "../controllers/REGISTRO_CLASE.controlleR.js";

const router = Router();

router.get("/", registroClasesController.getAllRegistrosClases);
router.get("/:num_registro", registroClasesController.getRegistroClasesById);
router.post("/", registroClasesController.createRegistroClases);
router.put("/:num_registro", registroClasesController.updateRegistroClases);
router.delete("/:num_registro", registroClasesController.deleteRegistroClases);

export default router;
