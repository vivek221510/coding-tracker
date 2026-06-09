import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'

function Register() {

  const navigate = useNavigate();

  const [formData,setFormData] = useState({
    username:"",
    email:"",
    password:""
  })
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await api.post("/users/register",
        formData
      );

      console.log(response.data);
      setSuccessMessage("Account created successfully");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.log(error.response?.data)
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Coding<span className="text-violet-500">Tracker</span>
          </h1>

          <p className="text-zinc-400 mt-3">
            Create your account and start tracking progress.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-zinc-300 mb-2">Username</label>

            <input
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="
              w-full
              bg-zinc-950
              text-white
              border
              border-zinc-800
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:border-violet-500
            "
            />
          </div>

          <div className="mb-4">
            <label className="block text-zinc-300 mb-2">Email</label>

            <input
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="
              w-full
              bg-zinc-950
              text-white
              border
              border-zinc-800
              rounded-xl
              px-4
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
              value={formData.password}
              onChange={handleChange}
              className="
              w-full
              bg-zinc-950
              text-white
              border
              border-zinc-800
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:border-violet-500
            "
            />
          </div>

          {successMessage && (
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
              {successMessage}
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
            Register
          </button>
        </form>

        <p className="text-zinc-400 text-center mt-6">
          Already have an account?
          <a href="/" className="text-violet-500 ml-2 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register