import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Dashboard from "./features/chat/pages/Dashboard";
import Protected from "./features/auth/components/Protected";
import Register from "./features/auth/pages/register";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route path="/dashboard" element={<Navigate to="/" replace/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
