import { Router } from "express";
import { eventController } from "../controller/eventController.js";
// import { userCreateSchema } from "../schema/eventCreateSchema.js";
// import { validateRequestSchema } from "../../../generic-middlewares/validateRequestSchema.js";
import { authenticateJWT } from "../../../generic-middlewares/authenticateJWT.js";
// import { validateUserExists } from "../middlewares/validateUserExists.js";
// import { userUpdateSchema } from "../schema/userUpdateSchema.js";

const eventRoutes = Router();

eventRoutes.get("/", authenticateJWT, eventController.getEvents);

eventRoutes.get(
  "/:id",
  authenticateJWT,
  // validateUserExists,
  eventController.getEventById,
);

eventRoutes.post(
  "/",
  // validateRequestSchema(userCreateSchema),
  eventController.createEvent,
);

// userRoutes.put(
//   "/:id",
//   upload.single("profileImage"),
//   authenticateJWT,
//   validateUserExists,
//   validateRequestSchema(userUpdateSchema),
//   userController.updateUser,
// );

// userRoutes.delete(
//   "/:id",
//   authenticateJWT,
//   validateUserExists,
//   userController.deleteUser,
// );

export { eventRoutes };
