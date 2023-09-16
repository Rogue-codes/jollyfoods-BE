import express from 'express';
import { createResturant, deleteResturant, editResturant, getAllResturant, getResturantByID } from '../../controllers/resturant/resturantController.js';
import { adminAuthMiddleware, } from "../../middleware/authMiddleware.js";

const resturantRoute = express.Router()

resturantRoute.post('/resturant/create', adminAuthMiddleware ,createResturant)
resturantRoute.put('/resturant/edit', adminAuthMiddleware , editResturant)
resturantRoute.get('/resturant/all' , getAllResturant)
resturantRoute.get('/resturant/:id' , getResturantByID)
resturantRoute.delete('/resturant/delete/:id', adminAuthMiddleware , deleteResturant)

export default resturantRoute