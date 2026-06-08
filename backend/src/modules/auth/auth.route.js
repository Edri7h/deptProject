import {Router} from 'express';
import AuthController from './auth.controller.js';
import AuthMiddleware from '../../middleware/auth.middleware.js';
const router=Router();


router.post("/login",AuthController.login)

router.post("/logout", AuthController.logout)

router.get("/me", AuthMiddleware.authenticate, AuthController.me)

router.get(
  "/student/dashboard",
    AuthMiddleware.authenticate,
  AuthController.getDashboardData
);

router.get(
  "/professor/dashboard",
  AuthMiddleware.authenticate,
  AuthController.getProfessorDashboardData
);


export default router;
