import express from 'express';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { planetRoutes } from 'src/lib/planets/infraestructure/api/routes/planets.route';

const route = express.Router();

route.use('/planets', planetRoutes);

route.get('/ping', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'pong' });
});

export default route;
