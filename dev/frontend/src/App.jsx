import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from 'axios';

import { LandingPage } from "./pages/LandingPage";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { HomePage } from "./pages/HomePage";
import { Profile } from "./pages/Profile";
import { Home } from "./pages/Home";

function useAxiosInterceptor() {
    const navigate = useNavigate();
    
    useEffect(() => {
        const axiosInterceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401 && error.response.data.error === "Token has expired") {
                    alert("Session has expired. Please log in again.");
                    navigate("/signin");
                    return Promise.reject(error);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(axiosInterceptor);
        };
    }, [navigate]);
}

function App() {
    return (
        <>
            <BrowserRouter>
                <RoutesWithInterceptors />
            </BrowserRouter>
        </>
    );
}

function RoutesWithInterceptors() {
    useAxiosInterceptor(); // Set up interceptor with navigation

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/homepage" element={<Home />} />
        </Routes>
    );
}

export default App;
