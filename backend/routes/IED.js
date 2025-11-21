// routes/ied.routes.js
import { Router } from "express";
import * as iedController from "../controllers/IED.controller.js";

const router = Router();

router.get("/", iedController.getAllIEDs);
router.get("/:id", iedController.getIEDById);
router.post("/", iedController.createIED);
router.put("/:id", iedController.updateIED);
router.delete("/:id", iedController.deleteIED);

export default router;