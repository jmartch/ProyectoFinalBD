// routes/aulaTutor.routes.js
import { Router } from "express";
import * as aulaTutorController from "../controllers/AULA_TUTOR.controller.js";

const router = Router();

router.get("/", aulaTutorController.getAllVinculaciones);
router.get("/:id_aula/:id_tutor/:fecha_asignacion",aulaTutorController.getVinculacionByKeys);
router.post("/", aulaTutorController.createVinculacion);
router.put("/:id_aula/:id_tutor/:fecha_asignacion",aulaTutorController.updateVinculacionByKeys);
router.delete("/:id_aula/:id_tutor/:fecha_asignacion",aulaTutorController.deleteVinculacionByKeys);

export default router;
