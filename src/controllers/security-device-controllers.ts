import {Request, Response} from "express";
import {constants} from "http2";

import {jwtService} from "../application/jwt-service";
import {RequestWithParams, TokenTypes} from "../types/common";
import {securityDevicesQueryRepository} from "../repositories/Queries-repo/security-devices-query-repository";
import {securityDevicesService} from "../domain/security-devices-service";
import {getMappedSecurityDevicesViewModel} from "../helpers";


export const securityDeviceControllers = {
    async getSecurityDevices(
        req: Request,
        res: Response
    ) {
        const refreshToken = req?.cookies?.refreshToken;
        if (!refreshToken) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
            return
        }
        const userId = await jwtService.getUserIdByToken({token: refreshToken, type: TokenTypes.refresh});

        if (!userId) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED);
            return
        }

        const result = await securityDevicesQueryRepository.getAllSecurityDevicesByUserId(userId.toString());

        res
            .status(constants.HTTP_STATUS_OK)
            .json(result.map(getMappedSecurityDevicesViewModel));
    },

    async deleteAllSecurityDevicesOmitCurrent(
        req: Request,
        res: Response
    ) {
        const refreshToken = req?.cookies?.refreshToken;

        if (!refreshToken) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }

        const {deviceId, userId} = await jwtService.getDeviceAndUserIdsByRefreshToken(refreshToken) || {};

        if (!userId || !deviceId) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }

        await securityDevicesService.deleteAllSecurityDevicesOmitCurrent({
            deviceId,
            userId
        });

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT)
    },

    async deleteSecurityDeviceById(
        req: RequestWithParams<{ id: string }>,
        res: Response
    ) {
        const refreshToken = req?.cookies?.refreshToken;

        if (!refreshToken) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }

        const {deviceId, userId} = await jwtService.getDeviceAndUserIdsByRefreshToken(refreshToken) || {};

        if (!userId || !deviceId) {
            res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
            return
        }

        const foundDevice = await securityDevicesQueryRepository.findSecurityDeviceById(deviceId);

        if (!foundDevice) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
            return;
        }

        if (foundDevice.userId !== userId.toString()) {
            res.sendStatus(constants.HTTP_STATUS_FORBIDDEN);
            return;
        }

        const result = await securityDevicesService.deleteSecurityDeviceById(deviceId);

        if (!result) {
            res.sendStatus(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    },
};
