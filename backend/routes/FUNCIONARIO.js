// routes/HORARIO.routes.js
import { Router } from "express";
import * as horarioController from "../controllers/HORARIO.controller.js";

const router = Router();

router.get("/", horarioController.getAllHorarios);
router.get("/:id", horarioController.getHorarioById);
router.post("/", horarioController.createHorario);
router.put("/:id", horarioController.updateHorario);
router.delete("/:id", horarioController.deleteHorario);

export default router;