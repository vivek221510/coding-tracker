import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Footer from "../components/Footer";

function JoinSquad() {
  const navigate = useNavigate();

  const [joinCode, setJoinCode] = useState("");

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await api.post("/squads/join-request", {
        joinCode,
      });

      setSuccessMessage(response.data.message);

      setTimeout(() => {
        navigate("/squads");
      }, 1200);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to join squad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-1 py-1">
      <Navbar />

      <div className="flex-1">
        <section className="px-8 py-10 border-b border-zinc-900">
          <p className="text-blue-400 uppercase tracking-[0.25em] text-sm">
            Community
          </p>

          <h1 className="text-5xl font-bold mt-4">Join Squad</h1>

          <p className="text-zinc-400 mt-4 max-w-xl">
            Enter the invite code shared by your squad administrator.
          </p>
        </section>

        <div className="max-w-xl mx-auto p-8">
          {successMessage && (
            <div className="mb-6 rounded-xl border border-green-500 bg-green-500/10 p-4 text-green-400">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-400">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-3xl
              p-8
            "
          >
            <label className="block mb-2 text-zinc-300">Invite Code</label>

            <input
              type="text"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="AB12CD34"
              className="
                w-full
                bg-zinc-950
                border
                border-zinc-800
                rounded-xl
                px-4
                py-3
                tracking-widest
                uppercase
                focus:outline-none
                focus:border-blue-500
              "
            />

            <button
              type="submit"
              disabled={loading}
              className="
                mt-8
                w-full
                bg-blue-600
                hover:bg-blue-700
                py-3
                rounded-xl
                font-semibold
                transition-all
              "
            >
              {loading ? "Joining..." : "Join Squad"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default JoinSquad;
