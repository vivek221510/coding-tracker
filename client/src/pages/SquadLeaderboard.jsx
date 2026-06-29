import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

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
    <>
      <Navbar />

      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Hero */}

        <section className="px-8 py-10 border-b border-zinc-900">
          <p className="text-yellow-400 uppercase tracking-[0.25em] text-sm">
            Squad Rankings
          </p>

          <h1 className="text-5xl font-bold mt-4">🏆 Leaderboard</h1>

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
              grid-cols-4
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
              <div>Total Solved</div>
            </div>

            {/* Rows */}

            {leaderboard.length === 0 ? (
              <div className="p-10 text-center text-zinc-400">
                No leaderboard data found.
              </div>
            ) : (
              leaderboard.map((member, index) => (
                <div
                  key={member.userId}
                  className="
                  grid
                  grid-cols-4
                  p-5
                  border-b
                  border-zinc-800
                  hover:bg-zinc-800
                  transition-all
                "
                >
                  <div className="font-semibold">
                    {index === 0
                      ? "🥇"
                      : index === 1
                        ? "🥈"
                        : index === 2
                          ? "🥉"
                          : `#${index + 1}`}
                  </div>

                  <div>{member.username}</div>

                  <div className="text-yellow-400 font-medium">
                    {member.codeforcesRating}
                  </div>

                  <div>{member.totalSolved}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SquadLeaderboard;
