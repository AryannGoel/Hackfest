import { useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MessageSquare, Heart, HelpCircle, ArrowLeft, Image, Home, Mic, Send, Zap } from "lucide-react";
import agoraAIRestService from "../services/agoraAIRestService";
import geminiService from "../services/geminiService";

type AIProvider = "agora" | "gemini";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  provider?: AIProvider;
}

export default function ChatScreen({ onNavigate }: { onNavigate: (screen: "welcome" | "chat" | "coping" | "support" | "voice") => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hi there, I'm MindBloom. I'm here to listen and help you navigate through any emotional distress you might be experiencing. How are you feeling today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiProvider, setAiProvider] = useState<AIProvider>("gemini");
  const [showProviderMenu, setShowProviderMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      let aiResponse;
      
      // Select AI provider
      if (aiProvider === "gemini") {
        if (!geminiService.isConfigured()) {
          throw new Error("Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env.local");
        }
        aiResponse = await geminiService.sendMessage(inputValue);
      } else {
        aiResponse = await agoraAIRestService.sendMessage(inputValue);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponse.text,
        timestamp: new Date(),
        provider: aiProvider,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling AI service:", error);
      
      // Show actual error to user for transparency
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: error instanceof Error 
          ? `Sorry, I encountered an issue: ${error.message}. Please check your connection and credentials.`
          : "Sorry, I encountered a technical issue. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a3a31] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-[#2d5045]">
        <button 
          onClick={() => onNavigate("welcome")}
          className="p-2 hover:bg-[#2d5045] rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center">MindBloom Chat</h1>
        
        {/* AI Provider Selector */}
        <div className="relative">
          <button 
            onClick={() => setShowProviderMenu(!showProviderMenu)}
            className="p-2 hover:bg-[#2d5045] rounded-lg transition-colors flex items-center gap-2"
            title={`Using ${aiProvider === 'gemini' ? 'Google Gemini' : 'Agora AI'}`}
          >
            <Zap className="w-5 h-5 text-[#3dd9b8]" />
            <span className="text-xs font-semibold">{aiProvider === 'gemini' ? 'Gemini' : 'Agora'}</span>
          </button>
          
          {showProviderMenu && (
            <div className="absolute top-full right-0 mt-2 bg-[#0f241e] border border-[#2d5045] rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setAiProvider("gemini");
                  setShowProviderMenu(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  aiProvider === "gemini" 
                    ? "bg-[#3dd9b8] text-[#12211c] font-semibold" 
                    : "hover:bg-[#2d5045] text-gray-300"
                }`}
              >
                🔷 Google Gemini
              </button>
              <button
                onClick={() => {
                  setAiProvider("agora");
                  setShowProviderMenu(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  aiProvider === "agora" 
                    ? "bg-[#3dd9b8] text-[#12211c] font-semibold" 
                    : "hover:bg-[#2d5045] text-gray-300"
                }`}
              >
                🟢 Agora AI
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              {message.sender === "ai" && (
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758274539654-23fa349cc090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcGVhY2VmdWwlMjB3b21hbnxlbnwxfHx8fDE3NjI4NTY5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="MindBloom Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              )}
              <div className={`flex-1 ${message.sender === "user" ? "flex justify-end" : ""}`}>
                <div className={`text-sm mb-1 ${message.sender === "user" ? "text-right text-gray-400" : "text-gray-300"}`}>
                  {message.sender === "ai" ? "MindBloom" : "You"}
                </div>
                <div
                  className={`rounded-2xl p-4 max-w-xs md:max-w-md lg:max-w-lg ${
                    message.sender === "ai"
                      ? "bg-[#4a7565] rounded-tl-sm"
                      : "bg-[#3dd9b8] rounded-br-sm text-[#12211c]"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#3dd9b8]/20" />
              </div>
              <div className="flex-1">
                <div className="text-sm mb-1 text-gray-300">MindBloom</div>
                <div className="bg-[#4a7565] rounded-2xl rounded-tl-sm p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-[#2d5045]">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#2d5045] rounded-full px-6 py-4 flex items-center gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-400"
            />
            <button 
              type="button"
              className="p-2 hover:bg-[#3d6055] rounded-lg transition-colors">
              <Image className="w-5 h-5 text-gray-400" />
            </button>
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2 hover:bg-[#3dd9b8]/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-[#3dd9b8]" />
            </button>
          </div>
        </div>
      </form>

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
            className="flex flex-col items-center gap-1 text-white">
            <MessageSquare className="w-6 h-6 fill-current" />
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