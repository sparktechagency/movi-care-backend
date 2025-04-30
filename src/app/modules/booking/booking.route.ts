import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BookingController } from './booking.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';

const router = express.Router();

router.post('/',auth(USER_ROLES.USER),validateRequest(BookingValidation.createBookingZodSchema),BookingController.bookingService)
router.get('/user-booking',auth(USER_ROLES.USER),BookingController.getUSerBookings)
router.get('/',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),BookingController.getAllBookings)
router.patch('/:id',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.USER),validateRequest(BookingValidation.updateBookingZodSchema),BookingController.changeStatus)
router.get('/single/:id',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN,USER_ROLES.USER),BookingController.getBooking)
router.get('/slots',validateRequest(BookingValidation.getSlotsZodSchema),BookingController.getSlotsOfMonths)
export const BookingRoutes=router