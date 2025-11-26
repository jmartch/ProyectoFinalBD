// routes/detalleNota.routes.js
import { Router } from "express";
import * as detalleNotaController from "../controllers/DETALLE_NOTA.controller.js";

const router = Router();

router.get("/", detalleNotaController.getAllDetallesNota);
router.get("/:id_nota/:id_componente", detalleNotaController.getDetalleNotaByKeys);
router.post("/", detalleNotaController.createDetalleNota);
router.put("/:id_nota/:id_componente", detalleNotaController.updateDetalleNota);
router.delete("/:id_nota/:id_componente", detalleNotaController.deleteDetalleNota);

export default router;
