import express from "express";
import { userRoutes } from "../modules/v1/users/routes/userRoutes.js";
// import { authenticateJWT } from "../generic-middlewares/authenticateJWT.js";

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRoutes);

// Exemplo rota com autenticação
// app.use("/api/v1/posts", authenticateJWT, postRoutes);

export { app };
