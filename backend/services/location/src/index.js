import { app } from "./app/app.js";
import { config } from "./config/env/envConfig.js";
import { connectToMongo } from "./config/database/dbConfig.js";

const PORT = config.portApi;

const startServer = async () => {
  await connectToMongo();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
