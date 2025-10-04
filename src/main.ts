import { log } from '@config/Logger.config';
import { checkDatabase } from '@config/database/Database.config';
import { startHttpServer } from '@config/http/express/server';

const main = async () => {
  try {
    await checkDatabase();
    const [httpServer] = await Promise.all([
      startHttpServer(),
    ]);
    return { httpServer };
  } catch (error) {
    log.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

main();
