import { Router } from "express";
import { getUserProfile, loginUser, registerUser } from "../controller/authController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", auth, getUserProfile);

export default router;