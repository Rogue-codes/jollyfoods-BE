import express from "express";
import {
  createState,
  deleteState,
  getState,
  updateState,
} from "../../controllers/state/stateControllers.js";
const stateRoute = express.Router();

stateRoute.post("/state/new", createState);
stateRoute.put("/state/update/:id", updateState);
stateRoute.get("/state/all/", getState);
stateRoute.delete("/state/delete/:id", deleteState);

export default stateRoute;
