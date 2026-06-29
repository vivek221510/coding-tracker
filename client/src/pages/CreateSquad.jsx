import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CreateSquad() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    isPrivate: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Squad name is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/squads/create", formData);

      setSuccessMessage("Squad created successfully");

      setTimeout(() => {
        navigate(`/squads/${response.data.data._id}`);
      }, 1200);
    } catch (error) {
      console.log(error.response?.data);
      console.log(error);

      setErrorMessage(
        error.response?.data?.message || "Unable to create squad."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-950 text-white">
        <section className="px-8 py-10 border-b border-zinc-900">
          <p className="text-emerald-400 uppercase tracking-[0.25em] text-sm">
            Squad Management
          </p>

          <h1 className="text-5xl font-bold mt-4">Create Squad</h1>

          <p>
            Build your own competitive programming community and compete with
            your friends
          </p>
        </section>

        <div className="max-w-2xl mx-auto p-8">
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
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
          >
            <div className="mb-8">
              <label className="mb-2 block text-zinc-300">Squad Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Placement Warriors"
                className="
                            w-full
                            rounded-xl
                            border
                            border-zinc-800
                            bg-zinc-950
                            px-4
                            py-3
                            focus:border-emerald-500
                            focus:outline-none
                            "
              />
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="mb-5 text-xl font-semibold">Visibility</h2>

              <label className="mb-5 flex cursor-pointer gap-4">
                <input
                  type="radio"
                  checked={!formData.isPrivate}
                  onChange={() =>
                    setFormData(prev => ({
                      ...prev,
                      isPrivate: false,
                    }))
                  }
                />
                <div>
                  <p className="font-medium">Pubilc Squad</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Anyone can join your squad instantly.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer gat-4">
                <input
                  type="radio"
                  checked={formData.isPrivate}
                  onChange={() =>
                    setFormData(prev => ({
                      ...prev,
                      isPrivate: true,
                    }))
                  }
                />
                <div>
                  <p className="font-medium">Private Squad</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Members must send a request before joining
                  </p>
                </div>
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="
                            mt-8
                            w-full
                            rounded-xl
                            bg-emerald-600
                            py-3
                            font-semibold
                            transition-all
                            hover:bg-emerald-700
                            disabled:cursor-not-allowed
                            disabled:opacity-70
                        "
            >
              {loading ? "Creating Squad..." : "Create Squad"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateSquad;
