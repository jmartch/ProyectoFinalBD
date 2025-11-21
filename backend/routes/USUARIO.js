// routes/USUARIO.routes.js
import { Router } from "express";
import * as usuarioController from "../controllers/USUARIO.controller.js";

const router = Router();

router.get("/", usuarioController.getAllUsuarios);
router.get("/:usuario", usuarioController.getUsuarioById);
router.post("/", usuarioController.createUsuario);
router.put("/:usuario", usuarioController.updateUsuario);
router.delete("/:usuario", usuarioController.deleteUsuario);

export default router;