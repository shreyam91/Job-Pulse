import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { connectDatabase } from './shared/database';
import { errorHandler, notFoundHandler } from './api/middleware/errorHandler';
import routes from './api/routes';
import logger from './shared/logger';
import config from './shared/config';
import { jobScheduler } from './shared/scheduler';

async function createApp() {
    const app = express();

    // ─── Security ─────────────────────────────────────────────────────────────
    app.use(helmet());
    app.use(cors({
        origin: config.cors.allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
    }));

    // ─── Rate Limiting ────────────────────────────────────────────────────────
    const limiter = rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
        message: { success: false, message: 'Too many requests, please try again later' },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/api', limiter);

    // ─── Body Parsing ─────────────────────────────────────────────────────────
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // ─── HTTP Logging ─────────────────────────────────────────────────────────
    const morganStream = {
        write: (message: string) => logger.info(message.trim()),
    };
    app.use(morgan('combined', { stream: morganStream }));

    // ─── Static Files (uploaded resumes) ─────────────────────────────────────
    app.use('/uploads', express.static(path.join(process.cwd(), config.upload.dir)));

    // ─── API Routes ───────────────────────────────────────────────────────────
    app.use('/api', routes);

    // ─── Not Found ────────────────────────────────────────────────────────────
    app.use(notFoundHandler);

    // ─── Error Handler ────────────────────────────────────────────────────────
    app.use(errorHandler);

    return app;
}

async function bootstrap() {
    try {
        await connectDatabase();
        logger.info('Database connected successfully');

        const app = await createApp();
        const port = config.port;

        app.listen(port, () => {
            logger.info(`API Server running on http://localhost:${port}`);
            logger.info(`   Environment: ${config.env}`);
            logger.info(`   MongoDB: ${config.mongodb.uri.split('@')[1] || 'connected'}`);
            
            // Start the job scheduler after server is ready
            jobScheduler.start();
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            logger.info('SIGTERM received. Shutting down gracefully...');
            jobScheduler.stop();
            const { disconnectDatabase } = await import('./shared/database');
            await disconnectDatabase();
            process.exit(0);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

bootstrap();

// Hot reload trigger
