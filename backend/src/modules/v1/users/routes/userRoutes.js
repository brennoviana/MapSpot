import { Router } from "express";
import { userController } from "../controller/userController.js";
import { userCreateSchema } from "../schema/userCreateSchema.js";
import { validateRequestSchema } from "../../../../generic-middlewares/validateRequestSchema.js";
import { authenticateJWT } from "../../../../generic-middlewares/authenticateJWT.js";
import { validateUserExists } from "../middlewares/validateUserExists.js";
import { userUpdateSchema } from "../schema/userUpdateSchema.js";

const userRoutes = Router();

userRoutes.get("/", authenticateJWT, userController.getUsers);

userRoutes.get(
  "/:id",
  authenticateJWT,
  validateUserExists,
  userController.getUserById,
);

userRoutes.post(
  "/",
  validateRequestSchema(userCreateSchema),
  userController.createUser,
);

userRoutes.put(
  "/:id",
  authenticateJWT,
  validateUserExists,
  validateRequestSchema(userUpdateSchema),
  userController.updateUser,
);

userRoutes.delete(
  "/:id",
  authenticateJWT,
  validateUserExists,
  userController.deleteUser,
);

userRoutes.post("/login", userController.loginUser);

export { userRoutes };
