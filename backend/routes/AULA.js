// routes/aula.routes.js
import { Router } from "express";
import * as aulaController from "../controllers/AULA.controller.js";

const router = Router();

router.get("/", aulaController.getAllAulas);
router.get("/:id", aulaController.getAulaById);
router.post("/", aulaController.createAula);
router.put("/:id", aulaController.updateAula);
router.delete("/:id", aulaController.deleteAula);

export default router;