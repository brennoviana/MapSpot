import { Router } from "express";
import { eventController } from "../controller/eventController.js";
import { eventCreateSchema } from "../schema/eventCreateSchema.js";
import { validateRequestSchema } from "../../../generic-middlewares/validateRequestSchema.js";

const eventRoutes = Router();

eventRoutes.get("/", eventController.getEvents);

eventRoutes.get(
  "/:id",
  // validateUserExists,
  eventController.getEventById,
);

eventRoutes.post(
  "/",
  validateRequestSchema(eventCreateSchema),
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
