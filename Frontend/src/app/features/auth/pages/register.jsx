import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if(!loading && user) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    auth.handleRegister({ username, email, password });
    navigate("/mail");
    console.log("Register submit", { username, email, password });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-accent-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card/80 p-8 shadow-2xl backdrop-blur">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Create account
            </p>
            <h1 className="mt-2 text-3xl font-semibold font-bold text-foreground">
              Register
            </h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Start your journey with a new profile.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="text-sm text-foreground/80"
                htmlFor="register-username"
              >
                Username
              </label>
              <input
                id="register-username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="coolusername"
                className="w-full rounded-xl border border-border bg-input/20 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm text-foreground/80"
                htmlFor="register-email"
              >
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-input/20 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm text-foreground/80"
                htmlFor="register-password"
              >
                Password
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-input/20 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-gradient-to-br from-primary to-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/40 transition hover:translate-y-0.5 hover:shadow-primary/60"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-accent transition hover:text-accent/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
