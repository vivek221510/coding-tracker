import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Dashboard() {

  const navigate= useNavigate();
  
  const [stats,setStats] = useState(null);

  const logout = async () => {
    try {
      await api.post("/users/logout");

      navigate("/");
    } catch (error) {
      console.log(error.response?.data);
    }
    
  };

  const fetchStats = async () => {
    try {
        const response = await api.get(
            "/stats/me"
        );
        setStats(response.data.data);

    } catch(error) {
        console.log(error.response?.data);
    }
};

  const syncCodeforces = async () => {
    try {
      await api.post("/stats/sync/codeforces");

      await fetchStats()

    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const syncLeetcode = async () => {
    try {
      await api.post("/stats/sync/leetcode");
  
      await fetchStats()
    } catch (error) {
      console.log(error.response?.data)
    }
  };

  useEffect(()=>{
    fetchStats()
  },[]);

 if (!stats) {
   return (
     <>
       <Navbar/>
         <div>
           <h1>Dashboard</h1>
           <button onClick={syncCodeforces}>Sync Codeforces</button>

           <button onClick={syncLeetcode}>Sync LeetCode</button>

           <p>No stats synced yet.</p>
         </div>
       
     </>
   );
 }

  return (
    <>
    <Navbar/>
      <div>
        <h1>DashBoard</h1>

        <h2>Leetcode</h2>
        <p>Total: {stats.leetcodeSolved}</p>
        <p>Easy: {stats.leetcodeEasySolved}</p>
        <p>Medium: {stats.leetcodeMediumSolved}</p>
        <p>Hard: {stats.leetcodeHardSolved}</p>
        <p>Rating: {stats.leetcodeContestRating}</p>
        <p>MaxRating: {stats.leetcodeMaxRating}</p>

        <h2>Codeforces</h2>
        <p>Solved:{stats.codeforcesSolved}</p>
        <p>Rating:{stats.codeforcesRating}</p>
        <p>Max Rating:{stats.codeforcesMaxRating}</p>
        <p>Contests:{stats.codeforcesTotalContests}</p>

        <button onClick={syncCodeforces}>Sync Codeforces</button>
        <button onClick={syncLeetcode}>Sync LeetCode</button>

        <button onClick={logout}>Logout</button>
      </div>
    </>
  );
}

export default Dashboard;
