import express from 'express';
import { paystackPayment } from '../../controllers/payment/index.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const payment = express.Router()

payment.post('/paystack/initiate-payment',authMiddleware, paystackPayment)

export default payment