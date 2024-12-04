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
      maxlength: 200
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      maxlength: 50,
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
