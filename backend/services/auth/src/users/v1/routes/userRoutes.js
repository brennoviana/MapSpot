import { Router } from "express";
import { userController } from "../controller/userController.js";
import { userCreateSchema } from "../schema/userCreateSchema.js";
import { validateRequestSchema } from "../../../generic-middlewares/validateRequestSchema.js";
import { authenticateJWT } from "../../../generic-middlewares/authenticateJWT.js";
import { validateUserExists } from "../middlewares/validateUserExists.js";
import { userUpdateSchema } from "../schema/userUpdateSchema.js";
import { upload } from "../middlewares/multerConfig.js";

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
  upload.single("profileImage"),
  validateRequestSchema(userCreateSchema),
  userController.createUser,
);

userRoutes.put(
  "/:id",
  upload.single("profileImage"),
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
