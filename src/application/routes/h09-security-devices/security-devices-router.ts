import {Router} from "express";

import {securityDeviceControllers} from "../../../controllers/security-device-controllers";
import {settings} from "../../../settings";
import {paramIdValidationMiddleware} from "../../../middlewares/paramId-validation-middleware";


export const securityDevicesRouter = Router({});

securityDevicesRouter.get(
    '/',
    securityDeviceControllers.getSecurityDevices
);

securityDevicesRouter.delete(
    '/',
    securityDeviceControllers.deleteAllSecurityDevicesOmitCurrent
);

securityDevicesRouter.delete(
    `/:id(${settings.ID_PATTERN_BY_DB_TYPE})`,
    paramIdValidationMiddleware,
    securityDeviceControllers.deleteSecurityDeviceById
);
