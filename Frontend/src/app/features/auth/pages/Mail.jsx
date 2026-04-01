import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Mail = () => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  if (!loading && user) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-background text-foreground selection:bg-accent/30 selection:text-accent-foreground">
      <img src="/images/mail.gif" alt="Mail" srcset="" />
    </div>
  );
};

export default Mail;
