import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ServiceValidation } from './service.validation';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { ServiceController } from './service.controller';

const router = express.Router();

router.post("/",auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(ServiceValidation.createServiceZodSchema),ServiceController.createService)

router.get('/',ServiceController.getAllServices)
router.get('/:id',ServiceController.getSerice)

router.patch('/:id',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(ServiceValidation.createUpdateServiceZodSchema),ServiceController.updateService)
router.delete('/:id',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),ServiceController.deleteService)

export const ServiceRoutes=router