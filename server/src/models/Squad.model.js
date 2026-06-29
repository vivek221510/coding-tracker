import mongoose, { Schema } from "mongoose";

const squadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    joinCode: {
      type: String,
      unique: true,
    },

    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Squad = mongoose.model("Squad", squadSchema);
