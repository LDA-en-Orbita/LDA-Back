import { Router } from 'express';
import { SpaceMissionsController } from '../controller/space_missions.controller';
import { ValidateCodeRequest } from '../middleware/validate-code.request';
import { ValidateCursorPaginationRequest } from '../middleware/validadte-cursor-paginate.request';

const router = Router();
const controller = new SpaceMissionsController();

router.get(
    '/:code',
    ValidateCodeRequest,
    controller.getByPlanet
)

router.get(
    '/',
    ValidateCursorPaginationRequest,
    controller.getAll
)

export { router as spaceMissionsRoutes };
