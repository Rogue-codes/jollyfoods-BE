import express from "express";
import {
  createUser,
  getUserProfile,
  resendToken,
  userLogin,
  verifyEmail,
} from "../../controllers/user/userController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const userRoute = express.Router();

userRoute.post("/user/register", createUser);
userRoute.post("/user/login", userLogin);
userRoute.get("/user/me", authMiddleware, getUserProfile);
userRoute.post("/user/account/verify", verifyEmail);
userRoute.post("/user/verify/resend-token", resendToken);

export default userRoute;
