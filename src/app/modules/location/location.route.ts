import express from 'express';
import { LocationController } from './location.controller';
import validateRequest from '../../middlewares/validateRequest';
import { LocationValidation } from './location.validation';

const router = express.Router();

router.get('/cities', LocationController.getCities);
router.get('/city', LocationController.getLocationByQuardiant);
router.post('/travel-info',validateRequest(LocationValidation.createGeneralLocationZodSchema),LocationController.travelGeneralInfo)
export const LocationRoutes = router;