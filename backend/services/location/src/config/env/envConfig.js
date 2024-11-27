import "dotenv/config";

import "dotenv/config";

export const config = {
  mongoDatabase: process.env.MONGO_DATABASE,
  mongoUsername: process.env.MONGO_USERNAME,
  mongoPassword: process.env.MONGO_PASSWORD,
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  portApi: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
};
