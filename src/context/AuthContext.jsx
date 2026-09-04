import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { AuthContext } from "./contextValue";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        axiosClient
        .get("/auth/me",)
        .then((res) => setUser(res.data))
        .catch(() => {
            localStorage.removeItem("token");
            setUser(null);
        })
        .finally(() => setLoading(false));
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };
    return (
       <AuthContext.Provider value={{ user, setUser, loading, logout }}>    
        {children}
       </AuthContext.Provider>          
    );
}

