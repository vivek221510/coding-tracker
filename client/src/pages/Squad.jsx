import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function Squad() {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSquads = async () => {
    try {
      const response = await api.get("/squads/my-squads");

      setSquads(response.data.data);
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquads();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-1 py-1">
      <Navbar />

      <div className="grid-1">
        {/* Hero Section */}
        <section className="px-8 pt-10 pb-6 border-b border-zinc-900">
          <p className="text-amber-400 uppercase tracking-[0.25em] text-sm">
            Squad HeadQuarters
          </p>

          <h1 className="text-5xl font-bold mt-4">Build. Compete. Dominate</h1>

          <p className="text-zinc-400 mt-4 max-w-2xl text-lg">
            Create squads, invite friends, manage members, and compete together
            on coding platforms
          </p>

          <Link to="/squads/create">
            <button
              className="
                mt-8
                bg-amber-500
                hover:bg-amber-400
                text-black
                font-semibold
                px-6
                py-3
                rounded-xl
                transition-all
              "
            >
              + Create Squad
            </button>
          </Link>
          <Link to="/squads/join" className="p-4">
            <button
              className="
                mt-8
                bg-amber-500
                hover:bg-amber-400
                text-black
                font-semibold
                px-6
                py-3
                rounded-xl
                transition-all
                p-3
              "
            >
              ~Join Squad
            </button>
          </Link>
        </section>

        {/*Content*/}

        <div className="px-8 py-10">
          {loading ? (
            <div className="text-center text-zinc-400">Loading squads..</div>
          ) : squads.length === 0 ? (
            <div
              className="
                            bg-zinc-900
                            border
                            border-zinc-800
                            rounded-3xl
                            p-12
                            text-center
                        "
            >
              <h2 className="text-3xl font-bold">No Squads yet</h2>

              <p className="text-zinc-400 mt-4">
                Create your first squad and start competing with friends
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6">Your Squads</h2>

              <div className="grid lg:grid-cols-2 gap-6">
                {squads.map(squad => (
                  <div
                    key={squad._id}
                    className="
                                        bg-zinc-900
                                        border
                                        border-zinc-800
                                        hover:border-amber-500
                                        rounded-3xl
                                        p-6
                                        transition-all
                                    "
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold">⚔ {squad.name}</h3>

                        <p className="text-zinc-500 mt-2">Squad Arena</p>
                      </div>

                      <span
                        className="
                                                bg-amber-500/10
                                                text-amber-400
                                                px-3
                                                py-1
                                                rounded-full
                                                text-sm

                                            "
                      >
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                      <div>
                        <p className="text-zinc-500 text-sm">Members</p>

                        <h4 className="text-2xl font-bold mt-1">
                          {squad.members.length}
                        </h4>
                      </div>

                      <div>
                        <p className="text-zinc-500 text-sm">Admins</p>

                        <h4 className="text-2xl font-bold mt-1">
                          {squad.admins.length}
                        </h4>
                      </div>

                      <div>
                        <p className="text-zinc-500 text-sm">Privacy</p>

                        <h4 className="text-lg font-semibold mt-2">
                          {squad.isPrivate ? "Private" : "Public"}
                        </h4>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Link
                        to={`/squads/${squad._id}`}
                        className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                text-amber-400
                                                hover:text-amber-300
                                                font-medium
                                            "
                      >
                        Enter Squad →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Squad;
