// routes/AUTH.js
import { Router } from "express";
import { login } from "../controllers/AUTH.controller.js";

const router = Router();

router.post("/login", login);

export default router;
