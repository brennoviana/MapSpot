import { Router } from "express";
import { eventController } from "../controller/eventController.js";
import { eventCreateSchema } from "../schema/eventCreateSchema.js";
import { eventUpdateSchema } from "../schema/eventUpdateSchema.js";
import { validateRequestSchema } from "../../../generic-middlewares/validateRequestSchema.js";

const eventRoutes = Router();

eventRoutes.get("/", eventController.getEvents);

eventRoutes.get(
  "/:id",
  eventController.getEventById,
);

eventRoutes.post(
  "/",
  validateRequestSchema(eventCreateSchema),
  eventController.createEvent,
);

eventRoutes.put(
  "/:id",
  validateRequestSchema(eventUpdateSchema),
  eventController.updateEvent,
);

eventRoutes.delete(
  "/:id",
  eventController.deleteEvent,
);

export { eventRoutes };
