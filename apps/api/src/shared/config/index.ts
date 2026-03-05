import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try multiple paths to find .env
const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '../../../.env'),
    path.join(__dirname, '../../.env'),
];
const envPath = envPaths.find(p => fs.existsSync(p)) || envPaths[0];
dotenv.config({ path: envPath });

const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),

    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/aijob',
    },

    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        tls: process.env.REDIS_TLS === 'true',
    },

    gemini: {
        apiKey: process.env.GEMINI_API_KEY || '',
    },

    upload: {
        dir: process.env.UPLOAD_DIR || 'uploads',
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    },

    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
        max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    },

    cron: {
        scraper: process.env.SCRAPER_CRON || '0 */6 * * *',
        cleanup: process.env.CLEANUP_CRON || '0 2 * * *',
    },

    logging: {
        level: process.env.LOG_LEVEL || 'info',
        dir: process.env.LOG_DIR || 'logs',
    },

    cors: {
        allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    },
} as const;

export default config;
