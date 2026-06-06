import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Dashboard() {

  const navigate= useNavigate();
  
  const [stats,setStats] = useState(null);

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
        const response = await api.get(
            "/stats/me"
        );
        setStats(response.data.data);

    } catch(error) {
        console.log(error.response?.data);
    }
};

  const syncCodeforces = async () => {
    try {
      await api.post("/stats/sync/codeforces");

      await fetchStats()

    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const syncLeetcode = async () => {
    try {
      await api.post("/stats/sync/leetcode");
  
      await fetchStats()
    } catch (error) {
      console.log(error.response?.data)
    }
  };

  useEffect(()=>{
    fetchStats()
  },[]);

 if (!stats) {
   return (
     <>
       <Navbar/>
         <div>
           <h1 >
            Dashboard
          </h1>
           <button onClick={syncCodeforces}>Sync Codeforces</button>

           <button onClick={syncLeetcode}>Sync LeetCode</button>

           <p>No stats synced yet.</p>
         </div>
       
     </>
   );
 }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-zinc-950 text-zinc-100 px-8 py-10">
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
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Current Goal</h2>

            <span className="text-zinc-400">CF 1200</span>
          </div>

          <div className="w-full bg-zinc-800 h-2 rounded-full">
            <div
              className="bg-violet-500 h-2 rounded-full"
              style={{
                width: `${Math.min(
                  ((stats.codeforcesRating || 0) / 1200) * 100,
                  100,
                )}%`,
              }}
            />
          </div>

          <p className="text-zinc-400 mt-3">
            {stats.codeforcesRating || 0} / 1200
          </p>
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
    </>
  );
}

export default Dashboard;
