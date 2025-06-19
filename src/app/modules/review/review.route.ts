import express from 'express';
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';
const router = express.Router();

router.route("/")
    .post(auth(),auth(USER_ROLES.USER),validateRequest(ReviewValidation.createReviewZodSchema), ReviewController.sendReview)
    .get(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN,USER_ROLES.USER), ReviewController.getAllReviews)
router.route("/featured")
    .get(ReviewController.getFeaturesReviews)

router.route("/review/:id")
    .delete(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ReviewController.deleteReview)
    .patch(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ReviewController.makeFeaturedReview)
export const ReviewRoutes = router;