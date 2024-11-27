import express from "express";
import { eventRoutes } from "../events/v1/routes/eventRoutes.js";
import cors from "cors";
import { authenticateJWT } from "../generic-middlewares/authenticateJWT.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/v1/event", authenticateJWT, eventRoutes);

export { app };
