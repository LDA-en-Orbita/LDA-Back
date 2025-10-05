import { educationContentRoutes } from '@src/lib/education_content/infraestructure/api/routes/education-content.route';
import { filesRoutes } from '@src/lib/files/infraestructure/api/routes/files.routes';
import { observationTipsRoutes } from '@src/lib/observation_tips/infraestructure/api/routes/observation-tips.route';
import { synchronizeRoutes } from '@src/lib/synchronize/infraestructure/api/routes/syncrhonize.route';
import express from 'express';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { planetRoutes } from 'src/lib/planets/infraestructure/api/routes/planets.route';
import { spaceMissionsRoutes } from 'src/lib/space_missions/infraestructure/api/routes/space_missions.route';

const route = express.Router();

route.use('/planets', planetRoutes);

route.use('/space_missions', spaceMissionsRoutes);

route.use('/education-content', educationContentRoutes);

route.use('/observation-tips', observationTipsRoutes);

route.use('/synchronize', synchronizeRoutes);

route.use('/files', filesRoutes);


route.get('/ping', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'pong' });
});

export default route;
