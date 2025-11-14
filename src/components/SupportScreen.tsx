import { MessageSquare, Smile, Users, ArrowLeft, Heart, HelpCircle, Home, Mic } from "lucide-react";

export default function SupportScreen({ onNavigate }: { onNavigate: (screen: "welcome" | "chat" | "coping" | "support" | "voice") => void }) {
  return (
    <div className="min-h-screen bg-[#1a3a31] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-[#2d5045]">
        <button 
          onClick={() => onNavigate("welcome")}
          className="p-2 hover:bg-[#2d5045] rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center">Crisis Support</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* Immediate Help Section */}
          <section className="mb-8">
            <h2 className="mb-4">Immediate Help</h2>
            <p className="text-gray-300 mb-6">
              If you're in immediate danger, please choose one of the options below.
              Your safety is our top priority.
            </p>

            <div className="space-y-4">
              {/* Call Emergency Services */}
              <button className="w-full bg-[#3dd9b8] hover:bg-[#35c4a7] text-black transition-colors rounded-2xl py-4 px-6">
                Call Emergency Services
              </button>

              {/* Text Crisis Line */}
              <button className="w-full bg-[#2d5045] hover:bg-[#3d6055] border-2 border-[#3d6055] transition-colors rounded-2xl py-4 px-6">
                Text Crisis Line
              </button>

              {/* Connect with a Therapist */}
              <button className="w-full bg-[#2d5045] hover:bg-[#3d6055] border-2 border-[#3d6055] transition-colors rounded-2xl py-4 px-6">
                Connect with a Therapist
              </button>
            </div>
          </section>

          {/* Additional Resources */}
          <section className="mb-8">
            <h2 className="mb-4">Resources</h2>
            <div className="space-y-3">
              <div className="bg-[#2d5045] rounded-xl p-4">
                <h3 className="mb-1">National Suicide Prevention Lifeline</h3>
                <p className="text-sm text-gray-300">1-800-273-8255</p>
                <p className="text-xs text-gray-400 mt-2">Available 24/7</p>
              </div>

              <div className="bg-[#2d5045] rounded-xl p-4">
                <h3 className="mb-1">Crisis Text Line</h3>
                <p className="text-sm text-gray-300">Text "HELLO" to 741741</p>
                <p className="text-xs text-gray-400 mt-2">Available 24/7</p>
              </div>

              <div className="bg-[#2d5045] rounded-xl p-4">
                <h3 className="mb-1">SAMHSA National Helpline</h3>
                <p className="text-sm text-gray-300">1-800-662-4357</p>
                <p className="text-xs text-gray-400 mt-2">
                  Treatment referral and information service
                </p>
              </div>
            </div>
          </section>

          {/* Safety Plan */}
          <section>
            <div className="bg-[#4a7565] rounded-2xl p-5">
              <h3 className="mb-2">Create a Safety Plan</h3>
              <p className="text-sm text-gray-200 mb-4">
                A safety plan can help you stay safe during difficult times. Would you
                like to create one now?
              </p>
              <button className="bg-white text-[#1a3a31] hover:bg-gray-100 transition-colors rounded-xl py-2 px-6">
                Create Safety Plan
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-[#0f241e] border-t border-[#2d5045]">
        <div className="max-w-2xl mx-auto flex justify-around items-center py-4">
          <button 
            onClick={() => onNavigate("welcome")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => onNavigate("chat")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <MessageSquare className="w-6 h-6" />
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
            className="flex flex-col items-center gap-1 text-white">
            <HelpCircle className="w-6 h-6 fill-current" />
            <span className="text-xs">Support</span>
          </button>
        </div>
      </nav>
    </div>
  );
}