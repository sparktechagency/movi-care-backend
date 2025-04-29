import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ServiceValidation } from './service.validation';
import { ServiceController } from './service.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post('/',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(ServiceValidation.createServiceZodSchema),ServiceController.createService)
router.get('/',ServiceController.getAllService)
router.get('/:id',ServiceController.getService)
router.put('/:id',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(ServiceValidation.updateServiceZodSchema),ServiceController.updateService)
router.delete('/:id',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),ServiceController.deleteService)
export const ServiceRoutes=router