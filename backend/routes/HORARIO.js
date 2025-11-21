// routes/HORARIO.routes.js
import { Router } from "express";
import { 
  getAllHorarios, 
  getHorarioById, 
  createHorario, 
  updateHorario, 
  deleteHorario 
} from "../controllers/HORARIO.controller.js";

const router = Router();

router.get("/", getAllHorarios);
router.get("/:id", getHorarioById);
router.post("/", createHorario);
router.put("/:id", updateHorario);
router.delete("/:id", deleteHorario);

export default router;