// routes/funcionario.routes.js
import { Router } from "express";
import * as funcionarioController from "../controllers/FUNCIONARIO.controller.js";

const router = Router();

router.get("/", funcionarioController.getAllFuncionarios);
router.get("/:doc", funcionarioController.getFuncionarioById);
router.post("/", funcionarioController.createFuncionario);
router.put("/:doc", funcionarioController.updateFuncionario);
router.delete("/:doc", funcionarioController.deleteFuncionario);

export default router;
