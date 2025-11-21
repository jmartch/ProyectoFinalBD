// routes/REGISTRO_TUTORES.routes.js
import { Router } from "express";
import * as registroTutoresController from "../controllers/REGISTRO_TUTORES.controller.js";

const router = Router();

router.get("/", registroTutoresController.getAllRegistrosTutores);
router.get("/:doc_funcionario/:id_tutor", registroTutoresController.getRegistroTutoresByKeys);
router.post("/", registroTutoresController.createRegistroTutores);
router.put("/:doc_funcionario/:id_tutor", registroTutoresController.updateRegistroTutoresByKeys);
router.delete("/:doc_funcionario/:id_tutor", registroTutoresController.deleteRegistroTutoresByKeys);

export default router;