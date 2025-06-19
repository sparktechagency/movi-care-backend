import express from 'express';
import { ClientController } from './client.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ClientValidation } from './client.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
const router = express.Router();
router.route('/')
.post(
fileUploadHandler(),
auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ClientValidation.createClientZodSchema),
  ClientController.createClient
)
.get(
    ClientController.getAllClients
)

router.route('/:id')
.patch(
    fileUploadHandler(),
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validateRequest(ClientValidation.updateClientZodSchema),
    ClientController.updateClient
)
.delete(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ClientController.deleteClient
)
export const ClientRoutes = router;
