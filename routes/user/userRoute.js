import express from "express";
import {
  createUser,
  getUserProfile,
  userLogin,
} from "../../controllers/user/userController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const userRoute = express.Router();

userRoute.post("/user/register", createUser);
userRoute.post("/user/login", userLogin);
userRoute.get("/user/me", authMiddleware, getUserProfile);

export default userRoute;
