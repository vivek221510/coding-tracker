import { Navigate } from "react-router-dom";
import api from "../api/axios";
import { useEffect,useState } from "react";


export default function ProtectedRoute({children}) {
    const [isAunthenticated,SetIsAuthenticated] = useState(null);

    useEffect(()=> {
        const checkAuth = async () => {
            try{
                await api.get("/users/current-user");

                SetIsAuthenticated(true);
            }
            catch {
                SetIsAuthenticated(false)
            }
        }

        checkAuth();
    },[])

    if(isAunthenticated===null) {
        return <h1>Loading...</h1>
    }

    return isAunthenticated?children: <Navigate to="/" />

}

