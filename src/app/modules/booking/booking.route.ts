import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BookingController } from './booking.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';

const router = express.Router();

router.post('/',auth(USER_ROLES.USER),validateRequest(BookingValidation.createBookingZodSchema),BookingController.bookingService)

export const BookingRoutes=router