import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import TwoFactor from "./pages/TwoFactor";
import ThemeToggle from "./components/ThemeToggle.tsx";
import Home from "./pages/Home";
import Verify from "./pages/Verify";
import ResetPassword from "./pages/ResetPassword.tsx";

function App() {
    return (
        <>
            <ThemeToggle />{
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/2fa" element={<TwoFactor />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

            </Routes>}
        </>

    );
}

export default App
