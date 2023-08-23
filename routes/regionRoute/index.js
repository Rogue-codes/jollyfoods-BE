import express from 'express';
import { createRegion, deleteRegion, getRegion, updateRegion } from '../../controllers/region/regionControllers.js';

const regionRoute = express.Router()

regionRoute.post('/region/new', createRegion)
regionRoute.put('/region/update/:id', updateRegion)
regionRoute.get('/region/all', getRegion)
regionRoute.delete('/region/delete/:id', deleteRegion)

export default regionRoute;