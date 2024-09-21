import { Sequelize } from "sequelize";
import { config } from "../env/envConfig.js";

export const sequelize = new Sequelize(
  config.postgresDatabase,
  config.postgresUsername,
  config.postgresPassword,
  {
    host: config.postgresHost,
    port: Number(config.postgresPort),
    dialect: "postgres",
  },
);

let retryCount = 0;
const maxRetries = 3;

export const connectToPostgres = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    retryCount = 0;
  } catch (error) {
    retryCount++;
    if (retryCount < maxRetries) {
      setTimeout(connectToPostgres, 5000);
    } else {
      process.exit(1);
    }
  }
};
