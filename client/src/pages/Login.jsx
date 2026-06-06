import React, { useState } from 'react'
import api from "../api/axios";
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigate = useNavigate()

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("")

  const handleSubmit = async(e) => {
    e.preventDefault()

    try {
      const response = await api.post("/users/login",{
        email,
        password
      })

      console.log(response.data);
    } catch (error) {
      console.log(error.response?.data);
    }

    

    navigate("/dashboard");
  }

  

  return (
    <>
      <form onSubmit={handleSubmit}>
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={(e)=> setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e)=> setPassword(e.target.value)}
        />

        <button type="submit">
          Login
        </button>
        
      </form>
    </>
  );
}

export default Login