import express from 'express';
import { createResturant, deleteResturant, editResturant, getAllResturant, getResturantByID } from '../../controllers/resturant/resturantController.js';
import { authMiddleware } from "../../middleware/authMiddleware.js";

const resturantRoute = express.Router()

resturantRoute.post('/resturant/create', authMiddleware ,createResturant)
resturantRoute.put('/resturant/edit', authMiddleware , editResturant)
resturantRoute.get('/resturant/all', authMiddleware , getAllResturant)
resturantRoute.get('/resturant/:id', authMiddleware , getResturantByID)
resturantRoute.delete('/resturant/delete/:id', authMiddleware , deleteResturant)

export default resturantRoute