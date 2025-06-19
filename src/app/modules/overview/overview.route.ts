import express from 'express';
import { OverviewController } from './overview.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();
router.get('/user-earnings',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN), OverviewController.getUsersAndEarnings);
export const OverviewRoutes = router;