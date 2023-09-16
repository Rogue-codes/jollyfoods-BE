import express from 'express';
import { createLocation, deleteLocation, getLocation, updateLocation } from '../../controllers/location/locationControllers.js';
import { adminAuthMiddleware } from '../../middleware/authMiddleware.js';

const locationRoute = express.Router()

locationRoute.post('/location/new', adminAuthMiddleware, createLocation)
locationRoute.put('/location/update/:id', adminAuthMiddleware, updateLocation)
locationRoute.get('/location/all', getLocation)
locationRoute.delete('/location/delete/:id', adminAuthMiddleware, deleteLocation)

export default locationRoute;