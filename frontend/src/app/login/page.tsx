"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-black/95 text-white">
      {/* Left - Hero */}
      <div className="relative flex-1 flex items-center justify-center px-6 lg:px-12">
        {/* Header */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500 grid place-items-center text-white text-sm">✈️</div>
          <span className="text-lg font-semibold">AeroDeliver</span>
        </div>

        {/* Support */}
        <div className="absolute top-6 right-6 flex items-center gap-2 text-gray-300">
          <span className="text-base">❓</span>
          <span>Support</span>
        </div>

        {/* Content */}
        <div className="max-w-xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/10 border border-white/10 grid place-items-center text-3xl">✈️</div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Drone-First
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"> Delivery Network</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 px-2">
            Fast, reliable, and environmentally friendly deliveries.
          </p>

          {/* Features */}
          <div className="text-left space-y-3 text-gray-300 max-w-md mx-auto">
            <div className="flex items-center gap-3"><span className="text-lg">⏱️</span><span>Delivery in 15-30 minutes</span></div>
            <div className="flex items-center gap-3"><span className="text-lg">📦</span><span>Safe & secure packaging</span></div>
            <div className="flex items-center gap-3"><span className="text-lg">📍</span><span>24/7 real-time tracking</span></div>
          </div>

          {/* Visual */}
          <div className="mt-8 w-full h-48 rounded-xl bg-white/5 border border-white/10" />
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-black/95">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-1">Welcome back</h2>
          <p className="text-gray-300 mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black text-white placeholder:text-gray-400 border border-white/10 rounded-lg py-3 pl-10 pr-3 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black text-white placeholder:text-gray-400 border border-white/10 rounded-lg py-3 px-3 outline-none focus:border-purple-500"
              />
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-purple-600"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">Forgot password?</Link>
            </div>

            {/* Sign in */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-400 tracking-widest">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="border border-white/10 rounded-lg py-3 bg-transparent text-white/90 hover:bg-purple-500/20 transition-colors">🌐 Google</button>
              <button type="button" className="border border-white/10 rounded-lg py-3 bg-transparent text-white/90 hover:bg-purple-500/20 transition-colors"> Twitter</button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-400">
              Don&apos;t have an account? {" "}
              <Link href="/signup" className="text-purple-400 hover:text-purple-300">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}