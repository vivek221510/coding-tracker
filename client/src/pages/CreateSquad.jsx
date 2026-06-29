import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CreateSquad() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-950 text-white p-8">
        <h1 className="text-4xl font-bold">Create Squad</h1>
      </div>
    </>
  );
}

export default CreateSquad;
