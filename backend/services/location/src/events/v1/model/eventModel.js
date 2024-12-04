import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
    },
    ticketsAvailable: {
      type: Number,
      min: 0,
    },
    ticketPrice: {
      type: Number,
      min: 0,
    },
    organizer: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "Events",
  },
);

const Event = mongoose.model("Event", eventSchema);

export { Event };
