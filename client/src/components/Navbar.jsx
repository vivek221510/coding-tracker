import { Link,useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
    const navigate=useNavigate()

    const logout = async () => {
        try {
            await api.post("/users/logout")
            navigate("/")

        } catch (error) {
            console.log(error.response?.data)
        }
    };

    return (
        <nav>
            <Link to="/dashboard">
                Dashboard
            </Link>
            {"|"}
            <Link to="/profile-link">
                Profile Link
            </Link>
            {"|"}

            <button onClick={logout}>
                Logout
            </button>
        </nav>
    )
} 