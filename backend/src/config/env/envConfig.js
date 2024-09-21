import "dotenv/config";

export const config = {
  postgresDatabase: process.env.POSTGRES_DATABASE,
  postgresUsername: process.env.POSTGRES_USER,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresHost: process.env.POSTGRES_HOST_DB,
  postgresPort: process.env.POSTGRES_PORT,
  portApi: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
};
