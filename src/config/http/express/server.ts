import { config } from '@config/Environment.config';
import { log } from '@config/Logger.config';
import { errorHandler } from '@config/http/express/middleware/ErrorHandler';
import { responseHandler as responseFormatHandler } from '@config/http/express/middleware/ResponseHandler';
import express from 'express';
import { corsHandler } from './middleware/CorsHandler';
import { loggerHandler } from './middleware/LoggerHandler';
import route from './router';
import { bodyParser } from './middleware/BodyParse';

const configureMiddlewares = (app: express.Application) => {
  app.use(corsHandler);
  app.use(bodyParser);
  app.use(responseFormatHandler);
  app.use(loggerHandler);
  app.use('/api/v1', route);
  app.use(errorHandler);
};

export function startHttpServer() {
  const app = express();
  configureMiddlewares(app);
  const PORT = config.PORT;
  app.listen(PORT, () => {
    log.info(`🚀 HTTP Server is running Successfully on port ${PORT}`);
  });
}
