import { PrismaClient } from '@prisma/client';
const prismaClient = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }],
});
export { prismaClient };
