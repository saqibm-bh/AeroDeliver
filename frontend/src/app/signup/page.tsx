"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [sendUpdates, setSendUpdates] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
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

        {/* Support + Sign in */}
        <div className="absolute top-6 right-6 flex items-center gap-6 text-gray-300">
          <Link href="/login" className="font-medium hover:text-white">Sign In</Link>
          <div className="flex items-center gap-2"><span className="text-base">❓</span><span>Support</span></div>
        </div>

        {/* Content */}
        <div className="max-w-xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/10 border border-white/10 grid place-items-center text-3xl">✈️</div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">Welcome to AeroDeliver</h1>
          <p className="text-gray-300 text-lg mb-8 px-2">
            Join the future of delivery. Get your orders delivered in minutes, not hours.
          </p>

          {/* Bullets */}
          <div className="text-left space-y-3 text-gray-300 max-w-md mx-auto">
            <div className="flex items-center gap-3"><span>⚡</span><span>Lightning-fast 15-minute deliveries</span></div>
            <div className="flex items-center gap-3"><span>🛡️</span><span>Safe delivery to your doorstep</span></div>
            <div className="flex items-center gap-3"><span>✅</span><span>Fully insured and tracked</span></div>
          </div>

          {/* Rating */}
          <div className="mt-6 text-gray-300 flex items-center justify-center gap-2">
            <span>Join 50,000+ satisfied customers</span>
          </div>
          <div className="flex justify-center gap-1 text-yellow-400 text-lg">★ ★ ★ ★ ★</div>
          <p className="text-xs text-gray-400 mt-1">4.8/5 average rating</p>

          {/* Visual */}
          <div className="mt-8 w-full h-48 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-600" />
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12 bg-black/95">
        <div className="w-full max-w-md max-h-[100vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-1">Create your account</h2>
          <p className="text-gray-300 text-sm mb-4">Join thousands enjoying fast drone deliveries</p>

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Name */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">First name</label>
                <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="John" className="w-full bg-black text-white placeholder:text-gray-400 border border-white/10 rounded-md py-2 px-3 outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Last name</label>
                <input value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="Doe" className="w-full bg-black text-white placeholder:text-gray-400 border border-white/10 rounded-md py-2 px-3 outline-none focus:border-purple-500" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="john@example.com" className="w-full bg-black text-white placeholder:text-gray-400 border border-white/10 rounded-md py-2 pl-9 pr-3 outline-none focus:border-purple-500" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Phone number</label>
              <input type="tel" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} placeholder="(555) 000-0000" className="w-full bg-black text-white placeholder:text-gray-400 border border-white/10 rounded-md py-2 px-3 outline-none focus:border-purple-500" />
            </div>



            {/* Passwords */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-black text-white placeholder:text-gray-400 border border-white/10 rounded-md py-2 px-3 outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Confirm password</label>
              <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-black text-white placeholder:text-gray-400 border border-white/10 rounded-md py-2 px-3 outline-none focus:border-purple-500" />
            </div>

            {/* Toggles */}
            <div className="flex items-center justify-between text-sm text-gray-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={agreeToTerms} onChange={(e)=>setAgreeToTerms(e.target.checked)} className="w-4 h-4 accent-purple-600" />
                I agree to the Terms
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={sendUpdates} onChange={(e)=>setSendUpdates(e.target.checked)} className="w-4 h-4 accent-purple-600" />
                Email me updates
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
              Create account
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

            <p className="text-center text-sm text-gray-400">
              Already have an account? <Link href="/login" className="text-purple-400 hover:text-purple-300">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}