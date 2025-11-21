// routes/MATRICULA.routes.js
import { Router } from "express";
import * as matriculaController from "../controllers/MATRICULA.controller.js";

const router = Router();

router.get("/", matriculaController.getAllMatriculas);
router.get("/:id_IED/:doc_estudiante", matriculaController.getMatriculaByKeys);
router.post("/", matriculaController.createMatricula);
router.put("/:id_IED/:doc_estudiante", matriculaController.updateMatriculaByKeys);
router.delete("/:id_IED/:doc_estudiante", matriculaController.deleteMatriculaByKeys);

export default router;