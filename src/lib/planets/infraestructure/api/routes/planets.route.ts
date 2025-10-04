import { Router } from 'express';
import { PlanetsController } from '../controller/planets.controller';
import { ValidateCodeRequest } from '../middleware/validate-code.request';

const router = Router();
const controller = new PlanetsController();

router.get(
    '/:code',
    ValidateCodeRequest,
    controller.getByCode
)

router.get(
    '/',
    controller.getAll
)

export { router as planetRoutes };
