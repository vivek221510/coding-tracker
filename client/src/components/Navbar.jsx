import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [showSquads, setShowSquads] = useState(false);

  const logout = async () => {
    try {
      await api.post("/users/logout");
      navigate("/");
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 px-8 py-4 flex justify-between items-center">
      <h1 className="text-violet-500 text-xl font-bold">CodingTracker</h1>

      <div className="flex gap-6 items-center">
        <Link to="/dashboard" className="text-zinc-300 hover:text-violet-400">
          Dashboard
        </Link>

        <Link
          to="/profile-link"
          className="text-zinc-300 hover:text-violet-400"
        >
          Profiles
        </Link>

        <div className="relative">
          <button
            onClick={() => setShowSquads(!showSquads)}
            className="text-zinc-300 hover:text-violet-400"
          >
            Squads ▾
          </button>

          {showSquads && (
            <div
              className="
                absolute
                right-0
                mt-3
                w-56
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                shadow-xl
                overflow-hidden
                z-50
            "
            >
              <Link
                to="/squads"
                onClick={() => setShowSquads(false)}
                className="block px-5 py-3 hover:bg-zinc-800
                text-white"
              >
                📂 My Squads
              </Link>

              <Link
                to="/squads/create"
                onClick={() => setShowSquads(false)}
                className="block px-5 py-3 hover:bg-zinc-800
                text-white"
              >
                ➕ Create Squad
              </Link>

              <Link
                to="/squads/join"
                onClick={() => setShowSquads(false)}
                className="block px-5 py-3 hover:bg-zinc-800 text-white"
              >
                🔑 Join Squad
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
