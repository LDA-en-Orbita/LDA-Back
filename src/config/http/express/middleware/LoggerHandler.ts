import { log } from '@config/Logger.config';
import morgan from 'morgan';

export const loggerHandler = morgan(':method :url :status :response-time ms', {
  stream: {
    write: (message) => log.info(`🌐 ${message.trim()}`),
  },
});
