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
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Conected to Postgres');
  } catch (error) {
    console.log(error);
    process.exit(1);
    }
  };
