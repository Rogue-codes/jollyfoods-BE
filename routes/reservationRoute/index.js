import express from 'express';
import { createReservation } from '../../controllers/reservation/reservationContoller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const reservationRoute = express.Router()

reservationRoute.post('/reservation/create',authMiddleware, createReservation)

export default reservationRoute;