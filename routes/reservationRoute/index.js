import express from 'express';
import { checkoutReservation, createReservation } from '../../controllers/reservation/reservationContoller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const reservationRoute = express.Router()

reservationRoute.post('/reservation/create',authMiddleware, createReservation)
reservationRoute.patch('/reservation/create', checkoutReservation)

export default reservationRoute;