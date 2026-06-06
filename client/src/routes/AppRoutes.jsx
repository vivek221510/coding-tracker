import {Routes,Route} from "react-router-dom"

import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import ProfileLink from "../pages/ProfileLink"
import ProtectedRoute from "../components/ProtectedRoutes"

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
              <ProfileLink/>
            </ProtectedRoute>
          }
        />
      </Routes>
    );
}