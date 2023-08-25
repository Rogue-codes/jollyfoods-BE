import jwt from "jsonwebtoken";
import User from "../models/user/UserModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        status: "Failed",
        message: "Unauthorized: Token not found",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "Failed",
        message: "Unauthorized: Token not found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(403).json({
        status: "Failed",
        message: "Unauthorized: Invalid token",
      });
    }

    // Attach user object to the request for further use
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({
      status: "Failed",
      message: "Invalid token",
    });
  }
};
