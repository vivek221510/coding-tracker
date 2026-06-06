import React,{useState} from 'react'
import api from '../api/axios'
import Navbar from "../components/Navbar";

function ProfileLink() {

  const [formData,setFormData]=useState({
    leetcodeUsername:"",
    codeforcesHandle:"",
    codechefHandle:""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post("/profiles/link",formData);
      console.log(response.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  }

  return (
    <>
    <Navbar/>
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        name="leetcodeUsername"
        placeholder='LeetCode Username'
        onChange={handleChange}
      />

      <input 
        type="text"
        name='codeforcesHandle'
        placeholder='Codeforces Handle'
        onChange={handleChange}
      />

      <input
        type="text"
        name="codechefHandle"
        placeholder="CodeChef Handle"
        onChange={handleChange}
      />

      <button type="submit">
        Save Profiles
      </button>
    </form>
    
    </>
  )
}

export default ProfileLink