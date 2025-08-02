import express from "express";
const router = express.Router();
import * as authController from "../controllers/authController.js";

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

export default router;
