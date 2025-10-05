import { Router } from "express";
import { ObservationTipsController } from "../controller/observation-tips.controller";
import { ValidateCodeRequest } from "../middleware/validate-code.request";

const router = Router();
const controller = new ObservationTipsController();

router.get("/", controller.getAll);

router.get("/:code", ValidateCodeRequest, controller.getByPlanet);

export { router as observationTipsRoutes };
