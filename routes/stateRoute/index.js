import express from "express";
import {
  createState,
  deleteState,
  getState,
  updateState,
} from "../../controllers/state/stateControllers.js";
import { adminAuthMiddleware } from "../../middleware/authMiddleware.js";
const stateRoute = express.Router();

stateRoute.post("/state/new", adminAuthMiddleware, createState);
stateRoute.put("/state/update/:id", adminAuthMiddleware, updateState);
stateRoute.get("/state/all/", getState);
stateRoute.delete("/state/delete/:id", adminAuthMiddleware, deleteState);

export default stateRoute;
