import { Router } from "express";
import { ObservationTipsController } from "../controller/observation-tips.controller";
import { ValidateCodeRequest } from "../middleware/validate-code.request";
import { ValidateCursorPaginationRequest } from "../middleware/validate-cursor-paginate.request";

const router = Router();
const controller = new ObservationTipsController();

router.get("/:code", ValidateCodeRequest, controller.getByPlanet);

router.get("/", ValidateCursorPaginationRequest, controller.getAll);

export { router as observationTipsRoutes };
