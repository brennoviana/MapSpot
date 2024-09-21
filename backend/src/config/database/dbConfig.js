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

export const connectToPostgres = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    process.exit(1);
  }
};
