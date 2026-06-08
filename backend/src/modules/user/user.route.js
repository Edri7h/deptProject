import { Router } from "express";

import UserController from "./user.controller.js";

import AuthMiddleware from "../../middleware/auth.middleware.js";
import RoleMiddleware from "../../middleware/role.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

router.get(
    "/notifications",
    AuthMiddleware.authenticate,
    UserController.getNotifications
);

/*
|--------------------------------------------------------------------------
| Accept Invite
|--------------------------------------------------------------------------
*/

router.post(
    "/accept-invite",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyStudentRole,
    UserController.acceptTeamInvite
);

/*
|--------------------------------------------------------------------------
| Reject Invite
|--------------------------------------------------------------------------
*/

router.post(
    "/reject-invite",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyStudentRole,
    UserController.rejectTeamInvite
);

export default router;
