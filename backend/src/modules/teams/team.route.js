import { Router } from "express";

import TeamController from "./team.controller.js";

import AuthMiddleware from "../../middleware/auth.middleware.js";
import RoleMiddleware from "../../middleware/role.middleware.js";

const router = Router();

router.post(
    "/create",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyStudentRole,
    TeamController.createTeam
);

router.get(
    "/search-student",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyStudentRole,
    TeamController.searchStudent
);

router.post(
    "/:teamId/invite",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyStudentRole,
    TeamController.sendTeamInvite
);

router.get(
    "/my-team",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyStudentRole,
    TeamController.getMyTeam
);

router.get(
    "/sent-invites",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyStudentRole,
    TeamController.getSentInvites
);

router.delete(
    "/invite/:requestId",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyStudentRole,
    TeamController.cancelInvite
);

export default router;