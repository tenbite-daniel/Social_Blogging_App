import express from "express";
const router = express.Router();
import * as authController from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);


router.get("/profile", verifyToken, authController.getProfile);
router.put("/profile", verifyToken, authController.updateProfile);
router.delete("/profile", verifyToken, authController.deleteProfile);

export default router;