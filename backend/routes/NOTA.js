// routes/NOTA.routes.js
import { Router } from "express";
import * as NOTA from "../controllers/NOTA.controller.js";

const router = Router();

router.get("/", NOTA.getAllNotas);
router.get("/:id", NOTA.getNotaById);
router.post("/", NOTA.createNota);
router.put("/:id", NOTA.updateNota);
router.delete("/:id", NOTA.deleteNota);

export default router;