import { log } from '@config/Logger.config';
import { prismaClient } from './prisma/prisma';

const checkDatabase = async () => {
  try {

    const result = await prismaClient.$executeRaw`SELECT 1`;
    log.info('✅ Database is connected');
  } catch (error) {
    log.error('❌ Database is not connected');
    log.error(error);
  }
};

export { checkDatabase };
