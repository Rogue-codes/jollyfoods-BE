import express from 'express';
import { createLocation, deleteLocation, getLocation, updateLocation } from '../../controllers/location/locationControllers.js';

const locationRoute = express.Router()

locationRoute.post('/location/new', createLocation)
locationRoute.put('/location/update/:id', updateLocation)
locationRoute.get('/location/all', getLocation)
locationRoute.delete('/location/delete/:id', deleteLocation)

export default locationRoute;