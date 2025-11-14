// Image asset - replace with your actual image path
const imgDepth4Frame0 = "https://images.unsplash.com/photo-1758274539654-23fa349cc090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0&q=80&w=1080";

import { Heart, MessageCircle, Shield, Clock, Sparkles, Users, HelpCircle, Home, Mic } from "lucide-react";

export default function WelcomeScreen({ onNavigate }: { onNavigate: (screen: "welcome" | "chat" | "coping" | "support" | "voice") => void }) {
  return (
    <div className="bg-[#12211c] min-h-screen w-full text-white overflow-y-auto flex flex-col">
      {/* Hero Section with Background Image */}
      <div className="relative min-h-[400px] w-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute bg-[#12211c] inset-0" />
          <img 
            alt="" 
            className="absolute max-w-none object-cover size-full opacity-60" 
            src={imgDepth4Frame0} 
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#12211c]/40 to-[#12211c]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] px-6 pt-16 pb-8">
          <div className="flex items-center gap-2 mb-6 bg-[#3dd9b8]/20 backdrop-blur-sm px-4 py-2 rounded-full border border-[#3dd9b8]/30">
            <Sparkles className="w-4 h-4 text-[#3dd9b8]" />
            <span className="text-sm text-[#3dd9b8]">AI-Powered Emotional Support</span>
          </div>
          
          <h1 className="text-center mb-4">Welcome to MindBloom</h1>
          
          <p className="text-center text-gray-300 max-w-md mb-8">
            Your personal emotional companion, here to support you through every moment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 w-full max-w-[480px] px-4">
            <button 
              onClick={() => onNavigate("chat")}
              className="bg-[#12eda3] hover:bg-[#0fd994] text-[#12211c] h-12 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center">
              Get Started
            </button>
            <button className="bg-[#24473d] hover:bg-[#2d5045] text-white h-12 rounded-xl border border-[#3d6055] transition-all flex items-center justify-center">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-[#3dd9b8]/20 rounded-full flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-[#3dd9b8]" />
            </div>
            <div className="text-xs text-gray-300">24/7 Available</div>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-[#3dd9b8]/20 rounded-full flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-[#3dd9b8]" />
            </div>
            <div className="text-xs text-gray-300">100% Confidential</div>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-[#3dd9b8]/20 rounded-full flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-[#3dd9b8]" />
            </div>
            <div className="text-xs text-gray-300">10k+ Users</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center mb-6">How MindBloom Supports You</h2>
          
          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="bg-[#1a3a31] border border-[#2d5045] rounded-2xl p-5 hover:border-[#3dd9b8]/50 transition-colors">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#3dd9b8]/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#3dd9b8]" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">Empathetic Conversations</h3>
                  <p className="text-sm text-gray-400">
                    Talk freely with our AI companion that understands your emotions and responds with genuine care.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1a3a31] border border-[#2d5045] rounded-2xl p-5 hover:border-[#3dd9b8]/50 transition-colors">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#3dd9b8]/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#3dd9b8]" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">Personalized Coping Strategies</h3>
                  <p className="text-sm text-gray-400">
                    Access tailored mindfulness exercises, breathing techniques, and self-care activities.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1a3a31] border border-[#2d5045] rounded-2xl p-5 hover:border-[#3dd9b8]/50 transition-colors">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#3dd9b8]/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#3dd9b8]" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">Crisis Support Resources</h3>
                  <p className="text-sm text-gray-400">
                    Immediate access to professional help and emergency resources when you need them most.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial/Quote Section */}
      <div className="px-6 pb-8">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#2d5045] to-[#1a3a31] border border-[#3dd9b8]/30 rounded-2xl p-6">
          <div className="text-center">
            <div className="text-4xl mb-4 text-[#3dd9b8]">"</div>
            <p className="text-gray-300 italic mb-4">
              You're not alone. MindBloom is here to listen, understand, and guide you toward emotional wellness, one conversation at a time.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-[#3dd9b8] fill-current" />
              <span className="text-sm text-[#3dd9b8]">Always here for you</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-8" />

      {/* Bottom Navigation */}
      <nav className="bg-[#0f241e] border-t border-[#2d5045] mt-auto">
        <div className="max-w-2xl mx-auto flex justify-around items-center py-4">
          <button 
            onClick={() => onNavigate("welcome")}
            className="flex flex-col items-center gap-1 text-white">
            <Home className="w-6 h-6 fill-current" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => onNavigate("chat")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">Chat</span>
          </button>
          <button 
            onClick={() => onNavigate("voice")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Mic className="w-6 h-6" />
            <span className="text-xs">Voice</span>
          </button>
          <button 
            onClick={() => onNavigate("coping")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Heart className="w-6 h-6" />
            <span className="text-xs">Coping</span>
          </button>
          <button 
            onClick={() => onNavigate("support")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <HelpCircle className="w-6 h-6" />
            <span className="text-xs">Support</span>
          </button>
        </div>
      </nav>
    </div>
  );
}