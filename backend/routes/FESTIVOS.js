// routes/festivo.routes.js
import { Router } from "express";
import * as festivoController from "../controllers/FESTIVO.controller.js";

const router = Router();

router.get("/", festivoController.getAllFestivos);
router.get("/activos", festivoController.getActiveFestivos);
router.get("/:id", festivoController.getFestivoById);
router.post("/", festivoController.createFestivo);
router.put("/:id", festivoController.updateFestivo);
router.delete("/:id", festivoController.deleteFestivo);

export default router;
