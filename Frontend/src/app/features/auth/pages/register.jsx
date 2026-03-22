import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Register submit", { username, email, password });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="min-h-screen bg-[#0b0a08] text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/20 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(244,63,94,0.2)] backdrop-blur">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#ec954e]">
                Create account
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-50">
                Register
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Start your journey with a new profile.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  className="text-sm text-slate-200"
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
                  className="w-full rounded-xl border border-[#ec954e] bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-[#443020] focus:ring-2 focus:ring-[#443020]/30"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm text-slate-200"
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
                  className="w-full rounded-xl border border-[#ec954e] bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-[#443020] focus:ring-2 focus:ring-[#443020]/30"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm text-slate-200"
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
                  className="w-full rounded-xl border border-[#ec954e] bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-[#ec954e] focus:ring-2 focus:ring-[#ec954e]/30"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#ec954e] px-4 py-3 text-sm font-semibold text-slate-50 shadow-lg shadow-[#ec954e]/40 transition hover:translate-y-0.5 hover:shadow-[#ec954e]/60"
              >
                Create account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#ec954e] transition hover:text-[#f7b070]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
