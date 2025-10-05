import { Router } from 'express';
import { ValidateCodeRequest } from '../middleware/validate-code.request';
import { SyncrhonizeImagesController } from '../controller/images/syncrhonize-images.controller';

const router = Router();

const controllerImages = new SyncrhonizeImagesController();

router.get("/images/:code", ValidateCodeRequest, controllerImages.synchronize);

export { router as synchronizeRoutes };
