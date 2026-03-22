import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const user = useSelector((state)=>state.auth.user);
  const loading = useSelector((state)=>state.auth.loading);

  if(!loading && user){
    return <Navigate to="/" />
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleLogin({ email, password });
    navigate("/");
    console.log("Login submit", { email, password });
  };

  return (
    <div className="min-h-screen bg-[#0b0a08] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[#ec954e]/40 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(68,48,32,0.35)] backdrop-blur">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#ec954e]">
              Welcome back
            </p>
            <h1 className="mt-2 text-3xl font-semibold font-bold text-slate-50">
              Sign in
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-300">
              Use your email and password to continue.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-200" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#ec954e] bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-[#ec954e] focus:ring-2 focus:ring-[#ec954e]/30"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm text-slate-200"
                htmlFor="login-password"
              >
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#ec954e] bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-[#ec954e] focus:ring-2 focus:ring-[#ec954e]/30"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#ec954e] px-4 py-3 text-sm font-semibold text-slate-50 shadow-lg shadow-[#ec954e]/40 transition hover:translate-y-0.5 hover:shadow-[#ec954e]/60"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            New here?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#ec954e] transition hover:text-[#f7b070]"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
