import { Router } from "express";
import {
  getAllAulaTutor,
  createAulaTutor,
} from "../controllers/AULA_TUTOR.controller.js";

const router = Router();

router.get("/", getAllAulaTutor);
router.post("/", createAulaTutor);

export default router;
