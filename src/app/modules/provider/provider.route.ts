import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { ProviderValidation } from "./provider.validation";
import { ProviderController } from "./provider.controller";
import fileUploadHandler from "../../middlewares/fileUploadHandler";

const router = express.Router();

router.post("/",auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(ProviderValidation.createProviderZodSchema),ProviderController.createProvider)
router.get("/",ProviderController.getAllProviders)
router.get("/:id",ProviderController.getALlProvidersByService)
router.put("/:id",auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(ProviderValidation.createUpdateProviderZodSchema),ProviderController.updateProvider)
router.delete("/:id",auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),ProviderController.deleteProvider)
export const ProviderRoutes=router;