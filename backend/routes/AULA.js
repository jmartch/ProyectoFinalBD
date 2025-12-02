import { Router } from "express";
import { getAllAulas } from "../controllers/AULA.controller.js";

const router = Router();

router.get("/", getAllAulas);

export default router;
