import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongoUsername: process.env.MONGO_USERNAME,
  mongoPassword: process.env.MONGO_PASSWORD,
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  mongoDatabase: process.env.MONGO_DATABASE,
  portApi: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET
};