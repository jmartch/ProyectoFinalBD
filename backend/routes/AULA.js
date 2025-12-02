import { Router } from "express";
import {
  getAllAulas,
  getAulaById,
  createAula,
  updateAula,
  deleteAula,
} from "../controllers/AULA.controller.js";

const router = Router();

router.get("/", getAllAulas);
router.get("/:id", getAulaById);
router.post("/", createAula);
router.put("/:id", updateAula);
router.delete("/:id", deleteAula);

export default router;
