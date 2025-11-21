// routes/SEDE.routes.js
import { Router } from "express";
import * as sedeController from "../controllers/SEDE.controller.js";

const router = Router();

router.get("/", sedeController.getAllSedes);
router.get("/:id", sedeController.getSedeById);
router.post("/", sedeController.createSede);
router.put("/:id", sedeController.updateSede);
router.delete("/:id", sedeController.deleteSede);

export default router;