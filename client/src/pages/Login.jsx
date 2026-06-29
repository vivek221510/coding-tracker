import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      console.log(response.data);

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">CodingTracker</h1>

          <p className="text-zinc-400 mt-3">Track. Improve. Repeat.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-zinc-300 mb-2">Email</label>

            <input
              type="email"
              name="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
              }}
              className="
              w-full
              bg-zinc-950
              border
              border-zinc-800
              rounded-xl
              px-4
              text-white
              py-3
              focus:outline-none
              focus:border-violet-500
            "
            />
          </div>

          <div className="mb-6">
            <label className="block text-zinc-300 mb-2">Password</label>

            <input
              type="password"
              name="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
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
                text-white
                "
            />
          </div>

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

          <button
            type="submit"
            className="
              w-full
              bg-violet-600
              hover:bg-violet-700
              py-3
              rounded-xl
              font-medium
              transition-all
            "
          >
            Login
          </button>

          <p className="text-zinc-400 text-center mt-6">
            Do not have account?
            <a
              href="/register"
              className="text-violet-500 ml-2 hover:underline"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
