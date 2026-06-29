import mongoose, { Schema } from "mongoose";

const squadRequestSchema = new Schema(
  {
    squad: {
      type: Schema.Types.ObjectId,
      ref: "Squad",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const SquadRequest = mongoose.model("SquadRequest", squadRequestSchema);
