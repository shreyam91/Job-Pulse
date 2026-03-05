import mongoose from 'mongoose';
import config from '../config';
import logger from '../logger';

let isConnected = false;

export async function connectDatabase(): Promise<void> {
    if (isConnected) {
        logger.info('Database already connected');
        return;
    }

    try {
        const conn = await mongoose.connect(config.mongodb.uri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        logger.info(`MongoDB connected: ${conn.connection.host}`);

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting reconnect...');
            isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
            isConnected = true;
        });

    } catch (error) {
        logger.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

export async function disconnectDatabase(): Promise<void> {
    if (!isConnected) return;
    await mongoose.disconnect();
    isConnected = false;
    logger.info('MongoDB disconnected');
}

export { mongoose };
