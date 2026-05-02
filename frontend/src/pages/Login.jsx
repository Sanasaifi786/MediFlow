import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slideshow from "../components/Slideshow";

const BASE_URL = "https://mediflow-8qei.onrender.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/app");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased">
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-green-50 px-4 py-8 select-none">
        {/* Parent Container defining exact height and styling */}
        <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch min-h-[580px] border border-slate-100/50">
          {/* Left Section (Login Form Container) */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-between bg-gradient-to-br from-blue-50 via-green-50/30 to-transparent self-stretch">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 bg-clip-text text-transparent tracking-wide font-outfit">
                  Mediflow
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-outfit">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-sm mt-1 mb-6">
                Access your multi-agent clinical dashboard
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 text-rose-600 text-xs border border-rose-100 rounded-xl font-medium">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 tracking-wider uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. arthur.pendragon@mediflow.com"
                    className="w-full px-4 py-3 border border-slate-200/80 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-sm text-slate-800 placeholder:text-slate-400 bg-white"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-600 tracking-wider uppercase">
                      Password
                    </label>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-slate-200/80 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-sm text-slate-800 bg-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold text-sm hover:opacity-95 active:scale-[0.99] transition transform duration-150 shadow-md shadow-blue-200"
                >
                  {isLoggingIn ? "Signing In..." : "Sign In"}
                </button>
              </form>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 text-center flex flex-col gap-2">
              <a
                href="#"
                className="text-xs text-blue-700 font-semibold hover:underline"
              >
                Forgot your password? Reset it here.
              </a>
            </div>
          </div>

          {/* Right Section (Slideshow inherits its parent's height exactly) */}
          <Slideshow />
        </div>
      </div>
    </div>
  );
}
