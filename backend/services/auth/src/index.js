import { app } from "./app/app.js";
import { config } from "./config/env/envConfig.js";
import { connectToPostgres } from "./config/database/dbConfig.js";

const PORT = config.portApi;

const startServer = async () => {
  await connectToPostgres();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
