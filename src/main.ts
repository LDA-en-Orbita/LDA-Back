import { log } from '@config/Logger.config';
import { startHttpServer } from '@config/http/express/server';

const main = async () => {
    try {
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
