import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { PlatformProfile } from "../models/PlatformProfile.model.js";

const linkProfile = asyncHandler(async (req, res) => {
  const { leetcodeUsername, codeforcesHandle, codechefHandle } = req.body;

  if (
    !leetcodeUsername?.trim() &&
    !codeforcesHandle?.trim() &&
    !codechefHandle?.trim()
  ) {
    throw new ApiError(400, "At least one profile is required");
  }

  const profile = await PlatformProfile.findOneAndUpdate(
    {
      user: req.user._id,
    },
    {
      user: req.user._id,
      leetcodeUsername,
      codeforcesHandle,
      codechefHandle,
    },
    {
      returnDocument: true,
      upsert: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile linked successfully"));
});

export { linkProfile };
