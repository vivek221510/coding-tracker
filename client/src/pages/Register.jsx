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

      navigate("/");

    } catch (error) {
      console.log(error.response?.data)
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          name='username'
          placeholder='Username'
          onChange={handleChange}
        />
        <input 
          type="email"
          name='email'
          placeholder='Email'
          onChange={handleChange}
        />
        <input 
          type="password"
          name='password'
          placeholder='Password'
          onChange={handleChange}
        />

        <button type="submit">
          Register
        </button>
        
      </form>
    </>
  )
}

export default Register