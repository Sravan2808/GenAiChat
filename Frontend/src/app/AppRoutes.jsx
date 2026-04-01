import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Protected from "./features/auth/components/Protected";
import Mail from "./features/auth/pages/Mail";


const AppRoutes = () => {
  const LoginPage = lazy(() => import("./features/auth/pages/Login"));
  const DashboardPage = lazy(() => import("./features/chat/pages/Dashboard"));
  const RegisterPage = lazy(() => import("./features/auth/pages/register"));
  const UiPage = lazy(() => import("./features/auth/pages/Ui"));
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <Suspense fallback="Loading...">
            <LoginPage />
          </Suspense>
        } />
        <Route path="/register" element={
          <Suspense fallback="Loading...">
            <RegisterPage />
          </Suspense>
        } />
        <Route path="/ui" element={
          <Suspense fallback="Loading...">
            <UiPage />
          </Suspense>
        } />
        <Route path="/mail" element={
          <Suspense fallback="Loading...">
            <Mail />
          </Suspense>
        } />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <DashboardPage />
            </Protected>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
