import express from "express";
import {
  createRegion,
  deleteRegion,
  getRegion,
  updateRegion,
} from "../../controllers/region/regionControllers.js";
import { adminAuthMiddleware } from "../../middleware/authMiddleware.js";

const regionRoute = express.Router();

regionRoute.post("/region/new", adminAuthMiddleware, createRegion);
regionRoute.put("/region/update/:id", adminAuthMiddleware, updateRegion);
regionRoute.get("/region/all", getRegion);
regionRoute.delete("/region/delete/:id", adminAuthMiddleware, deleteRegion);

export default regionRoute;
