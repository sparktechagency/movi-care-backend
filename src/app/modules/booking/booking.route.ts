import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BookingController } from './booking.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN),
  // validateRequest(BookingValidation.createBookingZodSchema),
  BookingController.bookingService
);
router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  BookingController.getAllBookings
);
router.get(
  '/transactions',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BookingController.getTranscation
)
router.post(
  "/check",
  validateRequest(BookingValidation.createCheckZodSchema),
  BookingController.timeSLotChecker
)
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  validateRequest(BookingValidation.updateBookingZodSchema),
  BookingController.changeStatus
);
router.get(
  '/single/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  BookingController.getBooking
);
router.get('/slots', BookingController.getSlotsOfMonths);
router.get('/time-slots',validateRequest(BookingValidation.getDateTimeSlotsZodSchema),BookingController.getDateTimeSlots)
router.post(
  '/rebook/:id',
  auth(USER_ROLES.USER),
  validateRequest(BookingValidation.createRebookZodSchema),
  BookingController.rebookOrder
);
export const BookingRoutes = router;
