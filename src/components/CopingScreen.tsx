import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MessageSquare, Heart, HelpCircle, ArrowLeft, Home, Mic } from "lucide-react";

export default function CopingScreen({ onNavigate }: { onNavigate: (screen: "welcome" | "chat" | "coping" | "support" | "voice") => void }) {
  return (
    <div className="min-h-screen bg-[#1a3a31] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-[#2d5045]">
        <button 
          onClick={() => onNavigate("welcome")}
          className="p-2 hover:bg-[#2d5045] rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center">Coping</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* Quick Relief Section */}
          <section className="mb-8">
            <h2 className="mb-6">Quick Relief</h2>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {/* Mindfulness Card */}
              <div className="flex-shrink-0 w-48">
                <div className="bg-[#f5ebe3] rounded-3xl overflow-hidden mb-3 aspect-square flex items-center justify-center">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758274539654-23fa349cc090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcGVhY2VmdWwlMjB3b21hbnxlbnwxfHx8fDE3NjI4NTY5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Mindfulness"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm">Mindfulness Prompt</h3>
              </div>

              {/* Breathing Exercise Card */}
              <div className="flex-shrink-0 w-48">
                <div className="bg-[#f5ebe3] rounded-3xl overflow-hidden mb-3 aspect-square flex items-center justify-center">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1713428856080-43fc975d2496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhdGhpbmclMjBleGVyY2lzZSUyMGNhbG18ZW58MXx8fHwxNzYyODYzMzI0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Breathing Exercise"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm">Breathing Exercise</h3>
              </div>

              {/* Soothing Music Card */}
              <div className="flex-shrink-0 w-48">
                <div className="bg-[#f5ebe3] rounded-3xl overflow-hidden mb-3 aspect-square flex items-center justify-center">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1641391400773-dcdd2f5ab7a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzYyODc4MDk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Soothing Music"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm">Soothing Music</h3>
              </div>
            </div>
          </section>

          {/* Explore Coping Strategies Section */}
          <section>
            <h2 className="mb-6">Explore Coping Strategies</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Journaling */}
              <div className="bg-[#2d5045] border-2 border-[#3d6055] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#f5ebe3] rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1594997652537-2e2dce4ebf28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsaW5nJTIwbm90ZWJvb2slMjB3cml0aW5nfGVufDF8fHx8MTc2MjgzMDY1MHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Journaling"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3>Journaling</h3>
              </div>

              {/* Yoga */}
              <div className="bg-[#2d5045] border-2 border-[#3d6055] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#f5ebe3] rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1641391400773-dcdd2f5ab7a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzYyODc4MDk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Yoga"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3>Yoga</h3>
              </div>

              {/* Nature Walk */}
              <div className="bg-[#2d5045] border-2 border-[#3d6055] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#f5ebe3] rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1738171711912-c99d65c88cda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjB3YWxrJTIwZm9yZXN0fGVufDF8fHx8MTc2MjgzODM0MHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Nature Walk"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3>Nature Walk</h3>
              </div>

              {/* Connect with Friends */}
              <div className="bg-[#2d5045] border-2 border-[#3d6055] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#f5ebe3] rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1600963893836-107ae28e1712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwaGFwcHklMjB0b2dldGhlcnxlbnwxfHx8fDE3NjI5MzQ5MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Connect with Friends"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3>Connect with Friends</h3>
              </div>
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
            className="flex flex-col items-center gap-1 text-white">
            <Heart className="w-6 h-6 fill-current" />
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