import { Router } from "express";
import { EducationContentController } from "../controller/education-content.controller";
import { ValidateCodeRequest } from "../middleware/validate-code.request";

const router = Router();
const controller = new EducationContentController();

router.get("/", controller.getAll);

router.get("/:code", ValidateCodeRequest, controller.getByPlanet);

export { router as educationContentRoutes };
