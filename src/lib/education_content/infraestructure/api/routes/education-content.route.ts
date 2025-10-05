import { Router } from "express";
import { EducationContentController } from "../controller/education-content.controller";
import { ValidateCodeRequest } from "../middleware/validate-code.request";
import { ValidateCursorPaginationRequest } from "../middleware/validate-cursor-paginate.request";

const router = Router();
const controller = new EducationContentController();

router.get("/:code", ValidateCodeRequest, controller.getByPlanet);

router.get("/",ValidateCursorPaginationRequest, controller.getAll);


export { router as educationContentRoutes };
