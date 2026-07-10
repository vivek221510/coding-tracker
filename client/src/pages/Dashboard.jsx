import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [goalType, setGoalType] = useState(
    localStorage.getItem("goalType") || "codeforces"
  );

  const [goalValue, setGoalValue] = useState(() => {
    const type = localStorage.getItem("goalType") || "codeforces";

    return Number(localStorage.getItem(`${type}Goal`)) || 0;
  });

  const handleGoalChange = e => {
    const value = e.target.value;
    setGoalType(value);
    localStorage.setItem("goalType", value);
    setGoalValue(Number(localStorage.getItem(`${value}Goal`)) || 0);
  };

  const saveGoal = () => {
    if (goalValue <= 0) return;

    localStorage.setItem(`${goalType}Goal`, goalValue);
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");

      navigate("/");
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/stats/me");
      setStats(response.data.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setStats(null);
        return;
      }

      console.log(error.response?.data);
    }
  };

  const syncCodeforces = async () => {
    try {
      await api.post("/stats/sync/codeforces");

      await fetchStats();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const syncLeetcode = async () => {
    try {
      await api.post("/stats/sync/leetcode");

      await fetchStats();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
          <div className="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">
            <div className="text-6xl mb-6">🚀</div>

            <h1 className="text-4xl font-bold">Welcome to CodingTracker</h1>

            <p className="text-zinc-400 mt-4">
              Connect your coding profiles to unlock your dashboard, track
              contests and compare with your squad.
            </p>

            <button
              onClick={() => navigate("/profile-link")}
              className="
              mt-8
              bg-violet-600
              hover:bg-violet-700
              px-8
              py-3
              rounded-xl
              font-medium
            "
            >
              Link Profiles
            </button>
          </div>
        </div>
      </>
    );
  }

  const currentValue =
    goalType === "codeforces"
      ? stats.codeforcesRating || 0
      : goalType === "leetcode"
        ? Math.round(stats.leetcodeContestRating || 0)
        : (stats.leetcodeSolved || 0) + (stats.codeforcesSolved || 0);

  const progress =
    goalValue > 0 ? Math.min((currentValue / goalValue) * 100, 100) : 0;

  const hasGoal = goalValue > 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-1 py-1">
      <Navbar />

      <div className="flex-1">
        {/* Header */}

        <div className="mb-10">
          <p className="text-violet-500 text-xs font-medium tracking-[0.25em] uppercase">
            Competitive Programming Dashboard
          </p>

          <h1 className="text-5xl font-bold mt-3">Track. Improve. Repeat.</h1>

          <p className="text-zinc-400 mt-4 max-w-2xl">
            Monitor your coding journey across platforms and stay focused on
            your next milestone.
          </p>
        </div>

        {/* Top Metrics */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-violet-500 transition-all">
            <h2 className="text-4xl font-bold">
              {(stats.leetcodeSolved || 0) + (stats.codeforcesSolved || 0)}
            </h2>

            <p className="text-zinc-400 mt-2">Total Solved</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-violet-500 transition-all">
            <h2 className="text-4xl font-bold">
              {Math.round(stats.leetcodeContestRating || 0)}
            </h2>

            <p className="text-zinc-400 mt-2">LeetCode Rating</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-violet-500 transition-all">
            <h2 className="text-4xl font-bold">
              {stats.codeforcesRating || 0}
            </h2>

            <p className="text-zinc-400 mt-2">Codeforces Rating</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-violet-500 transition-all">
            <h2 className="text-4xl font-bold">
              {(stats.leetcodeTotalContests || 0) +
                (stats.codeforcesTotalContests || 0)}
            </h2>

            <p className="text-zinc-400 mt-2">Contests</p>
          </div>
        </div>

        {/* Platform Cards */}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-violet-500 transition-all">
            <h2 className="text-2xl font-semibold mb-6">LeetCode</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <h3 className="text-3xl font-bold">
                  {stats.leetcodeEasySolved}
                </h3>

                <p className="text-zinc-400 text-sm">Easy</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  {stats.leetcodeMediumSolved}
                </h3>

                <p className="text-zinc-400 text-sm">Medium</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  {stats.leetcodeHardSolved}
                </h3>

                <p className="text-zinc-400 text-sm">Hard</p>
              </div>
            </div>

            <div className="space-y-2 text-zinc-300">
              <p>Rating: {Math.round(stats.leetcodeContestRating || 0)}</p>

              <p>Max Rating: {Math.round(stats.leetcodeMaxRating || 0)}</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-violet-500 transition-all">
            <h2 className="text-2xl font-semibold mb-6">Codeforces</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <h3 className="text-3xl font-bold">{stats.codeforcesSolved}</h3>

                <p className="text-zinc-400 text-sm">Solved</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">{stats.codeforcesRating}</h3>

                <p className="text-zinc-400 text-sm">Rating</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  {stats.codeforcesTotalContests}
                </h3>

                <p className="text-zinc-400 text-sm">Contests</p>
              </div>
            </div>

            <div className="space-y-2 text-zinc-300">
              <p>Max Rating: {stats.codeforcesMaxRating}</p>
            </div>
          </div>
        </div>

        {/* Goal Card */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">🎯 Next Milestone</h2>

            <select
              value={goalType}
              onChange={handleGoalChange}
              className="
                bg-zinc-950
                border
                border-zinc-700
                rounded-lg
                px-3
                py-2
              "
            >
              <option value="codeforces">Codeforces Rating</option>

              <option value="leetcode">LeetCode Rating</option>

              <option value="problems">Problems Solved</option>
            </select>
          </div>

          <div className="flex gap-3 mb-6">
            <input
              type="number"
              value={goalValue}
              onChange={e => setGoalValue(Number(e.target.value))}
              placeholder="Enter Goal"
              className="
                flex-1
                bg-zinc-950
                border
                border-zinc-700
                rounded-lg
                px-4
                py-2
              "
            />

            <button
              onClick={saveGoal}
              className="
        bg-violet-600
        hover:bg-violet-700
        px-5
        rounded-lg
      "
            >
              Save
            </button>
          </div>

          {hasGoal ? (
            <>
              <div className="flex justify-between mb-3">
                <span className="text-3xl font-bold">{currentValue}</span>

                <span className="text-zinc-400">Goal: {goalValue}</span>
              </div>

              <div className="w-full bg-zinc-800 h-3 rounded-full">
                <div
                  className="bg-violet-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p className="text-zinc-400 mt-4">
                {Math.max(goalValue - currentValue, 0)}{" "}
                {goalType === "problems" ? "problems" : "rating"} remaining
              </p>
            </>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-700 p-6 text-center">
              <div className="text-4xl mb-3">🎯</div>

              <h3 className="text-xl font-semibold">No goal set yet</h3>

              <p className="text-zinc-400 mt-2">
                Enter your target above and click
                <span className="text-violet-400 font-medium"> Save</span> to
                start tracking your progress.
              </p>
            </div>
          )}
        </div>
        {/* Actions */}

        <div className="flex flex-wrap gap-4">
          <button
            onClick={syncCodeforces}
            className="bg-blue-900 border border-zinc-800 hover:bg-violet-500 px-5 py-3 rounded-xl transition-all"
          >
            Sync Codeforces
          </button>

          <button
            onClick={syncLeetcode}
            className="bg-blue-900 border border-zinc-800 hover:bg-violet-500 px-5 py-3 rounded-xl transition-all"
          >
            Sync LeetCode
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
