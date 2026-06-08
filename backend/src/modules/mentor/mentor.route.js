import { Router } from "express";

import MentorController
from "./mentor.controller.js";

import AuthMiddleware
from "../../middleware/auth.middleware.js";

import RoleMiddleware
from "../../middleware/role.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Student Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/search-professor",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyStudentRole,
    MentorController.searchProfessor
);

router.post(
    "/request",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyStudentRole,
    MentorController.sendMentorRequest
);

router.get(
    "/sent-requests",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyStudentRole,
    MentorController.getSentMentorRequests
);

router.delete(
    "/request/:requestId",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyStudentRole,
    MentorController.cancelMentorRequest
);

/*
|--------------------------------------------------------------------------
| Professor Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/requests",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyProfessorRole,
    MentorController.getMentorRequests
);

router.post(
    "/accept",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyProfessorRole,
    MentorController.acceptMentorRequest
);

router.post(
    "/reject",
    AuthMiddleware.authenticate,
    RoleMiddleware.verifyProfessorRole,
    MentorController.rejectMentorRequest
);

export default router;