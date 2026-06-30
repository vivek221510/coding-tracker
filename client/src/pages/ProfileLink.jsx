import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ProfileLink() {
  const [formData, setFormData] = useState({
    leetcodeUsername: "",
    codeforcesHandle: "",
    codechefHandle: "",
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !formData.leetcodeUsername &&
      !formData.codeforcesHandle &&
      !formData.codechefHandle
    ) {
      setErrorMessage("Please enter at least one profile");
      return;
    }

    try {
      await api.post("/profiles/link", formData);

      if (formData.codeforcesHandle) {
        await api.post("/stats/sync/codeforces");
      }

      if (formData.leetcodeUsername) {
        await api.post("/stats/sync/leetcode");
      }

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-1 py-1">
      <Navbar />

      <div className="grid-1">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <p className="text-violet-500 text-xs font-medium tracking-[0.25em] uppercase">
              Profile Settings
            </p>

            <h1 className="text-4xl font-bold mt-3">Linked Profiles</h1>

            <p className="text-zinc-400 mt-3">
              Connect your coding platforms to sync statistics and track
              progress.
            </p>
          </div>

          {message && (
            <div
              className="
              bg-green-500/10
              border
              border-green-500
              text-green-400
              p-3
              rounded-xl
              mb-4
            "
            >
              {message}
            </div>
          )}

          {errorMessage && (
            <div
              className="
              bg-red-500/10
              border
              border-red-500
              text-red-400
              p-3
              rounded-xl
              mb-4
            "
            >
              {errorMessage}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8"
          >
            <div className="mb-6">
              <label className="block text-zinc-300 mb-2">
                LeetCode Username
              </label>

              <input
                type="text"
                name="leetcodeUsername"
                placeholder="Enter LeetCode username"
                onChange={handleChange}
                value={formData.leetcodeUsername}
                className="
              w-full
              bg-zinc-950
              border
              border-zinc-800
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:border-violet-500
              transition-all
              "
              />
            </div>

            <div className="mb-6">
              <label className="block text-zinc-300 mb-2">
                Codeforces Handle
              </label>

              <input
                type="text"
                name="codeforcesHandle"
                placeholder="Enter Codeforces handle"
                onChange={handleChange}
                value={formData.codeforcesHandle}
                className="
              w-full
              bg-zinc-950
              border
              border-zinc-800
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:border-violet-500
              transition-all
              "
              />
            </div>

            <div className="mb-8">
              <label className="block text-zinc-300 mb-2">
                CodeChef Handle
              </label>

              <input
                type="text"
                name="codechefHandle"
                placeholder="Enter CodeChef handle"
                onChange={handleChange}
                value={formData.codechefHandle}
                className="
              w-full
              bg-zinc-950
              border
              border-zinc-800
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:border-violet-500
              transition-all
              "
              />
            </div>

            <button
              type="submit"
              className="
            bg-violet-600
            hover:bg-violet-700
            px-6
            py-3
            rounded-xl
            font-medium
            transition-all
            "
            >
              Save & Sync Profiles
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfileLink;
