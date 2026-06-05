import mongoose,{Schema} from "mongoose";

const platformStatsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    leetcodeSolved: {
      type: Number,
      default: 0,
    },

    leetcodeEasySolved: {
      type:Number,
      default:0
    },

    leetcodeMediumSolved: {
      type:Number,
      default:0
    },

    leetcodeHardSolved: {
      type:Number,
      default:0
    },

    leetcodeContestRating: {
      type: Number,
      default: 0,
    },

    leetcodeMaxRating: {
      type: Number,
      default: 0,
    },

    leetcodeTotalContests: {
      type: Number,
      default: 0,
    },

    codeforcesSolved: {
      type: Number,
      default: 0,
    },

    codeforcesRating: {
      type: Number,
      default: 0,
    },

    codeforcesMaxRating: {
      type: Number,
      default: 0,
    },

    codeforcesTotalContests: {
      type: Number,
      default: 0,
    },

    codechefSolved: {
      type: Number,
      default: 0,
    },

    codechefRating: {
      type: Number,
      default: 0,
    },

    codechefMaxRating: {
      type: Number,
      default: 0,
    },

    codechefTotalContests: {
      type: Number,
      default: 0,
    },

    lastSyncedAt: {
      type: Date,
      default: Date.now
    },
  },
  {
    timestamps: true,
  },
);

export const PlatformStats = mongoose.model(
    "PlatformStats",
    platformStatsSchema
)