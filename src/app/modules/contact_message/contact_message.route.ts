import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ContactMessageValidation } from './contact_message.validation';
import { ContactMessageController } from './contact_message.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/',validateRequest(ContactMessageValidation.createContactMessageZodSchema),ContactMessageController.createMessage)

router.get('/',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),ContactMessageController.getAllMessages)

router.get('/:id',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),ContactMessageController.getSingleMessage)

router.patch('/:id',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),ContactMessageController.readMessage)

router.put('/',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),ContactMessageController.readAllMessages)

router.delete('/:id',auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),ContactMessageController.deleteMessage)

export const ContactMessageRoutes=router