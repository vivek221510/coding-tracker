import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProfileLink from "../pages/ProfileLink";
import ProtectedRoute from "../components/ProtectedRoutes";
import Squad from "../pages/Squad";
import SquadDetails from "../pages/SquadDetails";
import SquadLeaderboard from "../pages/SquadLeaderboard";
import CreateSquad from "../pages/CreateSquad";
import JoinSquad from "../pages/JoinSquad";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile-link"
        element={
          <ProtectedRoute>
            <ProfileLink />
          </ProtectedRoute>
        }
      />
      <Route
        path="/squads"
        element={
          <ProtectedRoute>
            <Squad />
          </ProtectedRoute>
        }
      />
      <Route
        path="/squads/create"
        element={
          <ProtectedRoute>
            <CreateSquad />
          </ProtectedRoute>
        }
      />

      <Route
        path="/squads/join"
        element={
          <ProtectedRoute>
            <JoinSquad />
          </ProtectedRoute>
        }
      />
      <Route
        path="/squads/:squadId"
        element={
          <ProtectedRoute>
            <SquadDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/squads/:squadId/leaderboard"
        element={
          <ProtectedRoute>
            <SquadLeaderboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
