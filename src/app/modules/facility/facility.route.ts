import express from 'express';
import { FacilityController } from './facility.controller';
import validateRequest from '../../middlewares/validateRequest';
import { FacilityValidation } from './facility.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();
router
  .route('/')
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    fileUploadHandler(),
    validateRequest(FacilityValidation.createFacilityZodSchema),
    FacilityController.createFacility
  )
  .get(FacilityController.getAllFacilities);

router
  .route('/:id')
  .get(FacilityController.getSingleFacility)
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    fileUploadHandler(),
    validateRequest(FacilityValidation.updateFacilityZodSchema),
    FacilityController.updateFacility
  )
  .delete(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    FacilityController.deleteFacility
  );

export const FacilityRoutes = router;