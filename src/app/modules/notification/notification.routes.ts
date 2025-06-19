import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { NotificationController } from './notification.controller';

const router = express.Router();

router.route("/")
    .get(auth(),NotificationController.getAllNotifications)
    .put(auth(),NotificationController.readAllNotifications)

router.route("/:id")
    .patch(auth(),NotificationController.readSingleNotification)
    

export const NotificationRoutes = router;
