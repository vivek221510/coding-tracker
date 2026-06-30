import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import Footer from "../components/Footer";

function SquadLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  const { squadId } = useParams();

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get(`/squads/${squadId}/leaderboard`);

      setLeaderboard(response.data.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-1 py-1">
      <Navbar />

      <div className="grid-1">
        {/* Hero */}

        <section className="px-8 py-10 border-b border-zinc-900">
          <button
            onClick={() => navigate(`/squads/${squadId}`)}
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-zinc-900
              border
              border-zinc-800
              text-zinc-300
              hover:border-yellow-500
              hover:text-yellow-400
              transition-all
            "
          >
            <span className="text-lg">←</span> Back to Squad
          </button>
          <p className="text-yellow-400 uppercase tracking-[0.25em] text-sm">
            Squad Rankings
          </p>

          <h1 className="text-5xl font-bold mt-4">🏆 Leaderboard</h1>
          <p className="text-zinc-100 mt-4">Members: {leaderboard.length}</p>
          <p className="text-zinc-100 mt-4">
            Leader: {leaderboard[0].username}
          </p>
          <p className="text-zinc-100 mt-4">
            Highest Solved: {leaderboard[0].totalSolved}
          </p>
          <p className="text-zinc-400 mt-4">See who is leading the squad.</p>
        </section>

        {/* Leaderboard */}

        <div className="p-8">
          <div
            className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-3xl
            overflow-hidden
          "
          >
            {/* Header */}

            <div
              className="
              grid
              grid-cols-5
              p-5
              border-b
              border-zinc-800
              font-semibold
              text-zinc-400
            "
            >
              <div>Rank</div>
              <div>User</div>
              <div>CF Rating</div>
              <div>LC Rating</div>
              <div>Total Solved</div>
            </div>

            {/* Rows */}

            {leaderboard.length === 0 ? (
              <div className="p-10 text-center text-zinc-400">
                🏆 No rankings available yet. Sync members' coding profiles to
                generate the leaderboard.
              </div>
            ) : (
              leaderboard.map((member, index) => (
                <div
                  key={member.userId}
                  className={`
                    grid
                    grid-cols-5
                    p-5
                    border-b
                    border-zinc-800
                    transition-all
                    
                    ${
                      index == 0
                        ? "bg-yellow-500/10"
                        : index === 1
                          ? "bg-zinc-200/5"
                          : index == 2
                            ? "bg-orange-500/10"
                            : "hover:bg-zinc-800"
                    }
                  `}
                >
                  <div className="font-semibold">
                    {index === 0
                      ? "🥇 1"
                      : index === 1
                        ? "🥈 2"
                        : index === 2
                          ? "🥉 3"
                          : `#${index + 1}`}
                  </div>

                  <div>
                    <p className="font-semibold">{member.username}</p>
                  </div>

                  <div className="text-yellow-400 font-medium">
                    {member.codeforcesRating}
                  </div>

                  <div className="text-violet-400 font-medium">
                    {Math.round(member.leetcodeRating)}
                  </div>
                  <div>{member.totalSolved}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SquadLeaderboard;
