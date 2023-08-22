import express from 'express';
import { createState } from '../../controllers/state/stateControllers.js';
const stateRoute = express.Router();

stateRoute.post('/state/new', createState)

export default stateRoute