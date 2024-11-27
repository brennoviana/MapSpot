import mongoose from 'mongoose';
import { config } from '../env/envConfig.js';

export const connectToMongo = async () => {
    try {
        await mongoose.connect(`mongodb://${config.mongoUsername}:${config.mongoPassword}@${config.mongoHost}:${config.mongoPort}/${config.mongoDatabase}?authSource=admin`);
        console.log('Connected to MongoDB successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};