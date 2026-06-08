import { Router } from "express";
import ProjectController from "./project.controller.js"
import authMiddleware from "../../middleware/auth.middleware.js";
const router=Router();


router.get("/get",authMiddleware.authenticate,ProjectController.getAvailableProjects)


export default router;