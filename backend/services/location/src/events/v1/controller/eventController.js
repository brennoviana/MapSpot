import { Event } from "../model/eventModel.js";
import { ResponseFormatter } from "../../../utils/sucess.js";
import {
  NotFoundError,
  ErrorHandler,
  DuplicateFieldError,
} from "../../../utils/errors.js";

class EventController {
  async getEvents(req, res) {
    try {
      const events = await Event.find();

      if (events.length === 0) {
        return ErrorHandler.formatResponse(res, new NotFoundError("No events found."));
      }

      return ResponseFormatter.send(res, events, "Events retrieved successfully.");
    } catch (error) {
      ErrorHandler.formatResponse(res, error);
    }
  }

  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findById(id);

      if (!event) {
        return ErrorHandler.formatResponse(res, new NotFoundError("Event not found."));
      }

      return ResponseFormatter.send(res, event, "Event retrieved successfully.");
    } catch (error) {
      ErrorHandler.formatResponse(res, error);
    }
  }

  async createEvent(req, res) {
    try {
      const newEvent = new Event(req.body);
      await newEvent.save();

      return ResponseFormatter.send(res, newEvent, "Event created successfully.", 201);
    } catch (error) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        return ErrorHandler.formatResponse(res, new DuplicateFieldError(duplicateField));
      }

      ErrorHandler.formatResponse(res, error);
    }
  }

  async updateEvent(req, res) {
    try {
      const { id } = req.params;

      const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
        new: true, 
        runValidators: true,
      });

      if (!updatedEvent) {
        return ErrorHandler.formatResponse(res, new NotFoundError("Event not found."));
      }

      return ResponseFormatter.send(res, updatedEvent, "Event updated successfully.");
    } catch (error) {
      ErrorHandler.formatResponse(res, error);
    }
  }

  async deleteEvent(req, res) {
    try {
      const { id } = req.params;

      const event = await Event.findByIdAndDelete(id);

      if (!event) {
        return ErrorHandler.formatResponse(res, new NotFoundError("Event not found."));
      }

      return ResponseFormatter.send(res, null, "Event deleted successfully.");
    } catch (error) {
      ErrorHandler.formatResponse(res, error);
    }
  }
}

const eventController = new EventController();
export { eventController };
