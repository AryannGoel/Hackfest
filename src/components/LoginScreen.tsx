import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Sparkles, Shield, Heart } from "lucide-react";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f241e] to-[#1a3a31] text-white flex flex-col">
      {/* Header */}
      <div className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 bg-[#12eda3] rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#12211c]" />
          </div>
          <h1 className="text-2xl">MindBloom</h1>
        </div>
        <p className="text-sm text-gray-400">Your personal mental health companion</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="w-full max-w-md">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h2 className="mb-2">{isSignUp ? "Create Your Account" : "Welcome Back"}</h2>
            <p className="text-sm text-gray-400">
              {isSignUp 
                ? "Join thousands finding peace and clarity" 
                : "Continue your journey to wellness"}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#2d5045] border border-[#3d6055] rounded-xl py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#12eda3] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#2d5045] border border-[#3d6055] rounded-xl py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#12eda3] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-[#12eda3] hover:text-[#0fd994] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#12eda3] hover:bg-[#0fd994] text-[#12211c] py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#3d6055]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a3a31] text-gray-400">or</span>
            </div>
          </div>

          {/* Continue as Guest */}
          <button
            onClick={onLogin}
            className="w-full bg-[#24473d] hover:bg-[#2d5045] text-white py-3 rounded-xl border border-[#3d6055] transition-all mb-6 flex items-center justify-center"
          >
            Continue as Guest
          </button>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#12eda3] hover:text-[#0fd994] transition-colors"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="px-6 pb-8">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-[#2d5045] rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#12eda3]" />
              </div>
              <p className="text-xs text-gray-400">Private & Secure</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-[#2d5045] rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#12eda3]" />
              </div>
              <p className="text-xs text-gray-400">HIPAA Compliant</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-[#2d5045] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#12eda3]" />
              </div>
              <p className="text-xs text-gray-400">AI Powered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-6 px-6">
        <p className="text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <button className="text-[#12eda3] hover:text-[#0fd994]">Terms of Service</button>
          {" "}and{" "}
          <button className="text-[#12eda3] hover:text-[#0fd994]">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
}
