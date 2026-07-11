import axios from "axios";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import { PlatformProfile } from "../models/PlatformProfile.model.js";
import { PlatformStats } from "../models/PlatformStats.model.js";
import * as cheerio from "cheerio";

const syncCodeforcesStats = asyncHandler(async (req, res) => {
  try {
    const profile = await PlatformProfile.findOne({
      user: req.user._id,
    });

    if (!profile?.codeforcesHandle) {
      throw new ApiError(400, "Codeforces handle not linked");
    }

    const response = await axios.get(
      `https://codeforces.com/api/user.info?handles=${profile.codeforcesHandle}`
    );

    if (response.data.status !== "OK") {
      throw new ApiError(400, "Invalid Codeforces handle");
    }

    const userData = response.data.result[0];

    const submissionsResponse = await axios.get(
      `https://codeforces.com/api/user.status?handle=${profile.codeforcesHandle}`
    );

    const solvedProblems = new Set();

    submissionsResponse.data.result.forEach(submission => {
      if (submission.verdict === "OK") {
        solvedProblems.add(
          `${submission.problem.contestId}-${submission.problem.index}`
        );
      }
    });

    const ratingResponse = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${profile.codeforcesHandle}`
    );

    const totalContests = ratingResponse.data.result.length;

    const stats = await PlatformStats.findOneAndUpdate(
      {
        user: req.user._id,
      },
      {
        user: req.user._id,
        codeforcesRating: userData.rating || 0,
        codeforcesMaxRating: userData.maxRating || 0,
        codeforcesSolved: solvedProblems.size || 0,
        codeforcesTotalContests: totalContests,
        lastSyncedAt: new Date(),
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Codeforces stats synced successfully")
      );
  } catch (error) {
    console.error(error.response?.data || error);
    throw error;
  }
});

const syncLeetcodeStats = asyncHandler(async (req, res) => {
  const profile = await PlatformProfile.findOne({
    user: req.user._id,
  });

  if (!profile?.leetcodeUsername) {
    throw new ApiError(400, "LeetCode username not linked");
  }

  // Solved stats
  const solvedResponse = await axios.post(
    "https://leetcode.com/graphql",
    {
      query: `
                query getUserProfile($username: String!) {
                    matchedUser(username: $username) {
                        submitStats {
                            acSubmissionNum {
                                difficulty
                                count
                            }
                        }
                    }
                }
            `,
      variables: {
        username: profile.leetcodeUsername,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!solvedResponse.data.data.matchedUser) {
    throw new ApiError(400, "Invalid LeetCode username");
  }

  const userData = solvedResponse.data?.data?.matchedUser;

  if (!userData) {
    throw new ApiError(404, "LeetCode user not found");
  }

  const submissions = userData.submitStats.acSubmissionNum;

  const totalSolved =
    submissions.find(item => item.difficulty === "All")?.count || 0;

  const easySolved =
    submissions.find(item => item.difficulty === "Easy")?.count || 0;

  const mediumSolved =
    submissions.find(item => item.difficulty === "Medium")?.count || 0;

  const hardSolved =
    submissions.find(item => item.difficulty === "Hard")?.count || 0;

  // Contest stats
  const contestResponse = await axios.post(
    "https://leetcode.com/graphql",
    {
      query: `
                query userContestRankingInfo($username: String!) {
                    userContestRanking(username: $username) {
                        rating
                        attendedContestsCount
                    }

                    userContestRankingHistory(username: $username) {
                        rating
                    }
                }
            `,
      variables: {
        username: profile.leetcodeUsername,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const contestData = contestResponse.data?.data?.userContestRanking;

  const contestHistory =
    contestResponse.data?.data?.userContestRankingHistory || [];

  const contestRating = contestData?.rating || 0;

  const totalContests = contestData?.attendedContestsCount || 0;

  const maxRating =
    contestHistory.length > 0
      ? Math.max(...contestHistory.map(contest => contest.rating || 0))
      : contestRating;

  const stats = await PlatformStats.findOneAndUpdate(
    {
      user: req.user._id,
    },
    {
      user: req.user._id,

      leetcodeSolved: totalSolved,

      leetcodeEasySolved: easySolved,

      leetcodeMediumSolved: mediumSolved,

      leetcodeHardSolved: hardSolved,

      leetcodeContestRating: contestRating,

      leetcodeMaxRating: maxRating,

      leetcodeTotalContests: totalContests,

      lastSyncedAt: new Date(),
    },
    {
      upsert: true,
      returnDocument: "after",
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "LeetCode stats synced successfully"));
});

const syncCodechefStats = asyncHandler(async (req, res) => {
  const profile = await PlatformProfile.findOne({
    user: req.user._id,
  });

  if (!profile?.codechefHandle) {
    throw new ApiError(400, "Codechef handle not linked");
  }

  const response = await axios.get(
    `https://cp-rating-api.vercel.app/codechef/${profile.codechefHandle}`
  );

  const data = response.data;

  const stats = await PlatformStats.findOneAndUpdate(
    {
      user: req.user._id,
    },
    {
      user: req.user._id,

      codechefRating: data.rating || 0,

      codechefSolved: data.problemsSolved || 0,
      codechefTotalContests: data.participation || 0,
      lastSyncedAt: new Date(),
    },
    {
      upsert: true,
      returnDocument: "after",
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Codechef stats synced successfully"));
});

const getMyStats = asyncHandler(async (req, res) => {
  const stats = await PlatformStats.findOne({
    user: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Stats fetched succesfully"));
});

export {
  syncCodeforcesStats,
  getMyStats,
  syncLeetcodeStats,
  syncCodechefStats,
};
