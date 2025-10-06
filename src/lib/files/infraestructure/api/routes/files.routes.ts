import { Router } from 'express';
import { ValidateCodeAndTypeRequest } from '../middleware/validate-images.request';
import { FilesController } from '../controller/files.controller';

const router = Router();
const controller = new FilesController();

router.get(
    '/:code',
    ValidateCodeAndTypeRequest,
    controller.getByCode
)

export { router as filesRoutes };
