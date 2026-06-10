import React, {useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function SquadDetails() {
    const { squadId } = useParams()

    const [squad,setSquad] = useState(null)
    const [requests,setRequets] = useState([])
    const [showRequests, setShowRequests] = useState(false);
    const [showMembers, setShowMembers] = useState(false);

    const fetchRequests = async () => {
        try {
            const response = await api.get(
                `/squads/${squadId}/requests`
            )

            setRequets(response.data.data)
        } catch (error) {
            console.log(error.response?.data)
        }
    }

    const promoteMember = async(memberId) => {
        try {
          if (!window.confirm("Promote to admin?")) {
            return;
          }
          
          await api.patch(
            `/squads/${squadId}/promote-admin/${memberId}`
          )

          fetchSquad()
        } catch (error) {
          console.log(error.response?.data)
        }
    }

    const demoteMember = async (memberId) => {
      try {

        if (!window.confirm("Demote this admin?")) {
          return;
        }

        await api.patch(
          `/squads/${squadId}/demote-admin/${memberId}`
        )
      } catch (error) {
        console.log(error.response?.data)
      }
    }

    const removeMember = async (memberId) => {
      try {
        if (!window.confirm("Remove this member?")) {
          return;
        }

        await api.delete(
          `/squads/${squadId}/members/${memberId}`
        )
      } catch (error) {
        console.log(error.response?.data)
      }
    }

    const fetchSquad = async () => {
        try {
            const response = await api.get(
                `/squads/${squadId}`
            )

            setSquad(response.data.data)
        } catch (error) {
            console.log(error.response?.data)
        }
    }

    const acceptRequest = async (requestId) => {
        try {
            await api.patch(
                `/squads/requests/${requestId}/accept`
            );

            fetchRequests();
            fetchSquad();

        } catch (error) {
            console.log(error.response?.data)
        }
    }

    const rejectRequest = async (requestId) => {
        try{
            await api.patch(
                `/squads/requests/${requestId}/reject`
            );
            fetchRequests();
        } catch(error) {
            console.log(error.response?.data);
        }

    }

    useEffect(()=> {
        fetchSquad();
        fetchRequests();
    },[])

    if(!squad) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                    Loading Squad...
                </div>
            </>
        )
    }

    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-zinc-950 text-white">
          {/*Hero*/}

          <section className="px-8 py-10 border-b border-zinc-900">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-amber-400 uppercase tracking-[0.25em] text-sm">
                  Squad Headquarters
                </p>

                <h1 className="text-5xl font-bold mt-4">⚔ {squad.name}</h1>

                <div className="flex gap-3 mt-5">
                  <span>
                    {squad.isPrivate ? "Private Squad" : "Public Squad"}
                  </span>

                  <span>Join Code: {squad.joinCode}</span>
                </div>
              </div>

              {/* Notification Bell */}

              <button
                onClick={() => setShowRequests(!showRequests)}
                className="
                        relative
                        bg-zinc-900
                        border
                        border-zinc-800
                        rounded-xl
                        p-3
                        hover:border-amber-500
                    "
              >
                🔔
                {requests.length > 0 && (
                  <span
                    className="
                            absolute
                            -top-2
                            -right-2
                            bg-red-500
                            w-5
                            h-5
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-xs
                        "
                  >
                    {requests.length}
                  </span>
                )}
              </button>
            </div>
          </section>

          {/*Content*/}

          <div className="p-8 grid lg:grid-cols-3 gap-6">
            {/*Left Side*/}

            <div className="lg:col-span-2 space-y-6">
              {/*Leadership */}

              <div
                className="
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-3xl
                    p-6
                "
              >
                <h2 className="text-2xl font-bold mb-6">Leadership</h2>

                <div className="mb-6">
                  <p className="text-zinc-500 text-sm">Creator</p>

                  <p className="text-xl font-semibold mt-2">
                    👑 {squad.createdBy.username}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 text-sm mb-3">Admins</p>
                  <div className="flex flex-wrap gap-3">
                    {squad.admins.map((admin) => (
                      <div
                        key={admin._id}
                        className="
                            px-4
                            py-2
                            rounded-xl
                            bg-zinc-800
                        "
                      >
                        🛡 {admin.username}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/*Members */}

              <div
                className="
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-3xl
                    p-6
                "
              >
                <h2 className="text-2xl font-bold mb-6">Members</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {squad.members.slice(0, 5).map((member) => (
                    <div
                      key={member.user._id}
                      className="
                        bg-zinc-800
                        px-4
                        py-3
                        rounded-xl
                    "
                    >
                      {member.user.username}
                    </div>
                  ))}
                </div>
                  {squad.members.length > 5 && (
                    <button
                      onClick={() => setShowMembers(true)}
                      className="
                        mt-4
                        text-amber-400
                        hover:text-amber-300
                        font-medium
                      "
                    >
                      View All Members ({squad.members.length})
                    </button>
                  )}
            </div>
              </div>


            {/*Right Side*/}

            <div className="space-y-6">
              <div
                className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-3xl
                  p-6
              "
              >
                <p>🏆 Top Performers</p>
                <div className="mt-5 space-y-4">
                  <div className="flex justify-between">
                    <span>#1 Vivek</span>

                    <span className="text-zinc-400">950</span>
                  </div>

                  <div className="flex justify-between">
                    <span>#2 Rahul</span>
                    <span className="text-zinc-400">900</span>
                  </div>
                  <div className="flex justify-between">
                    <span>#3 Raj</span>
                    <span className="text-zinc-400">850</span>
                  </div>
                </div>

                <button
                  className="
                      w-full
                      mt-6
                      bg-zinc-800
                      hover:bg-zinc-700
                      py-3
                      rounded-xl
                      transition-all
                  "
                >
                  View Leaderboard
                </button>
              </div>
              <div
                className="
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-3xl
                    p-6
                "
              >
                <p className="text-zinc-500">Total Members</p>
                <h2 className="text-5xl font-bold mt-3">
                  {squad.members.length}
                </h2>
              </div>

              <div
                className="
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-3xl
                    p-6
                "
              >
                <p className="text-zinc-500">Admins</p>

                <h2 className="text-5xl font-bold mt-3">
                  {squad.admins.length}
                </h2>
              </div>

              <div
                className="
                    bg-zinc-900
                    border
                    border-amber-500/30
                    rounded-3xl
                    p-6
                "
              >
                <p className="text-amber-400">Squad Status</p>

                <h2 className="text-2xl font-bold mt-3">Active</h2>

                <p className="text-zinc-400 mt-3">Ready for competiton</p>
              </div>
            </div>
          </div>

          {showMembers && (
            <div
              className="
                fixed
                inset-0
                bg-black/60
                flex
                items-center
                justify-center
                z-50
              "
            >
              <div
                className="
                  w-full
                  max-w-2xl
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-3xl
                  p-6
                "
              >
                <div className="flex justify-between items-center mb-6">

                  <h2 className="text-2xl font-bold">
                    Squad Members
                  </h2>

                  <button
                    onClick={() => setShowMembers(false)}
                    className="
                      text-zinc-400
                      hover:text-white
                      text-xl
                    "
                  >
                    ✕
                  </button>

                </div>

                <div
                  className="
                    grid
                    md:grid-cols-2
                    gap-3
                    max-h-[500px]
                    overflow-y-auto
                  "
                >

                  {squad.members.map((member) => {

                    const isCreator =
                      squad.createdBy._id === member.user._id;

                    const isAdmin =
                      squad.admins.some(
                        admin => admin._id === member.user._id
                      );

                      return (
                        <div
                          key={member.user._id}
                          className="
                            bg-zinc-800
                            rounded-xl
                            p-4
                          "
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                {member.user.username}
                              </p>

                              <div className="mt-2">
                                {isCreator && (
                                  <span className="text-yellow-400 text-xs">
                                    👑 Creator
                                  </span>
                                )}

                                {isAdmin && !isCreator && (
                                  <span className="text-blue-400 text-xs">
                                    🛡 Admin
                                  </span>
                                )}

                                {!isAdmin && !isCreator && (
                                  <span className="text-zinc-400 text-xs">
                                    Member
                                  </span>
                                )}
                              </div>

                              <div className="flex gap-2 mt-3">
                                {!isCreator && !isAdmin && (
                                  <button
                                    onClick={() =>
                                      promoteMember(member.user._id)
                                    }
                                    className="
                                      bg-blue-600
                                      hover:bg-blue-700
                                      px-3
                                      py-1
                                      rounded-lg
                                      text-xs
                                    "
                                  >
                                    Promote
                                  </button>
                                )}

                                {isAdmin && !isCreator && (
                                  <button
                                    onClick={() =>
                                      demoteMember(member.user._id)
                                    }
                                    className="
                                      bg-orange-600
                                      hover:bg-orange-700
                                      px-3
                                      py-1
                                      rounded-lg
                                      text-xs
                                    "
                                  >
                                    Demote
                                  </button>
                                )}

                                {!isCreator && (
                                  <button
                                    onClick={() =>
                                      demoteMember(member.user._id)
                                    }
                                    className="
                                      bg-red-600
                                      hover:bg-red-700
                                      px-3
                                      py-1
                                      rounded-lg
                                      text-xs
                                    "
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                </div>
              </div>
            </div>
          )}  

          {showRequests && (
            <div
              className="
                fixed
                inset-0
                bg-black/60
                flex
                items-center
                justify-center
                z-50
            "
            >
              <div
                className="
                    w-full
                    max-w-lg
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-3xl
                    p-6
                "
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Pending Requests</h2>

                  <button
                    onClick={() => setShowRequests(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {requests.length === 0 ? (
                  <p className="text-zinc-400">No pending requests</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {requests.map((request) => (
                      <div
                        key={request._id}
                        className="
                            bg-zinc-800
                            rounded-xl
                            p-4
                        "
                      >
                        <p className="font-semibold">{request.user.username}</p>

                        <p className="text-zinc-500 text-sm">
                          {request.user.email}
                        </p>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => acceptRequest(request._id)}
                            className="
                              bg-green-600
                              hover:bg-green-700
                              px-4
                              py-2
                              rounded-lg
                            "
                          >
                            Accept
                          </button>

                          <button
                            onClick={() => rejectRequest(request._id)}
                            className="
                              bg-red-600
                              hover:bg-red-700
                              px-4
                              py-2
                              rounded-lg
                            "
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );

}

export default SquadDetails;