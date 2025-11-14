import React, { useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MessageSquare, Heart, HelpCircle, ArrowLeft, Image, Home, Mic, Send, WifiOff, RotateCcw, CheckCircle2 } from "lucide-react";
import agoraAIRestService from "../services/agoraAIRestService";

type AgoraResponse = { text: string };

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  error?: boolean;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
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
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check Agora AI connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      setConnectionStatus("checking");
      const configured = agoraAIRestService.isConfigured();
      setIsConnected(configured);
      setConnectionStatus(configured ? "connected" : "disconnected");
    };
    checkConnection();
  }, []);

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
      // Update connection status
      setConnectionStatus("checking");
      
      // Call Agora AI REST Service
      const aiResponse = await agoraAIRestService.sendMessage(inputValue);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponse.text,
        timestamp: new Date(),
        tokenUsage: aiResponse.tokenUsage,
      };

      setMessages(prev => [...prev, aiMessage]);
      setConnectionStatus("connected");
      setIsConnected(true);
    } catch (error) {
      console.error("Error calling Agora AI:", error);
      setConnectionStatus("disconnected");
      setIsConnected(false);
      
      // Show user-friendly error message
      let errorText = "Sorry, I encountered a technical issue. Please try again.";
      
      if (error instanceof Error) {
        const errorMsg = error.message;
        
        // Handle specific error types with better messages
        if (errorMsg.includes("quota") || errorMsg.includes("429")) {
          errorText = `⚠️ OpenAI API Quota Exceeded\n\nYour OpenAI account has run out of credits or billing is not set up.\n\nTo fix this:\n1. Check your usage: https://platform.openai.com/usage\n2. Add payment method: https://platform.openai.com/account/billing\n3. Upgrade your plan if needed\n\nOnce billing is set up, the chat will work again!`;
        } else if (errorMsg.includes("401") || errorMsg.includes("authentication")) {
          errorText = `🔑 Authentication Error\n\nYour OpenAI API key is invalid or missing.\n\nPlease check:\n1. Your .env.local file has VITE_OPENAI_API_KEY set\n2. The API key is correct\n3. Restart your dev server after changing .env.local`;
        } else if (errorMsg.includes("endpoint") || errorMsg.includes("404")) {
          errorText = `🔗 Endpoint Not Found\n\n${errorMsg}\n\nPlease check your VITE_AGORA_AI_API_BASE_URL in .env.local`;
        } else {
          errorText = `Sorry, I encountered an issue: ${errorMsg}`;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: errorText,
        timestamp: new Date(),
        error: true,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = () => {
    if (window.confirm("Are you sure you want to clear the conversation history?")) {
      agoraAIRestService.clearHistory();
      setMessages([
        {
          id: "1",
          sender: "ai",
          text: "Hi there, I'm MindBloom. I'm here to listen and help you navigate through any emotional distress you might be experiencing. How are you feeling today?",
          timestamp: new Date(),
        }
      ]);
    }
  };

  const handleRetryConnection = async () => {
    setConnectionStatus("checking");
    const configured = agoraAIRestService.isConfigured();
    setIsConnected(configured);
    setConnectionStatus(configured ? "connected" : "disconnected");
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
        <div className="flex-1 flex flex-col items-center gap-1">
          <h1 className="text-center">MindBloom Chat</h1>
          <div className="flex items-center gap-2 text-xs">
            {connectionStatus === "checking" && (
              <div className="flex items-center gap-1 text-gray-400">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                <span>Checking connection...</span>
              </div>
            )}
            {connectionStatus === "connected" && (
              <div className="flex items-center gap-1 text-green-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Agora AI Connected</span>
              </div>
            )}
            {connectionStatus === "disconnected" && (
              <div className="flex items-center gap-1 text-red-400">
                <WifiOff className="w-3 h-3" />
                <span>Not Connected</span>
                <button
                  onClick={handleRetryConnection}
                  className="ml-2 p-1 hover:bg-[#2d5045] rounded transition-colors"
                  title="Retry connection"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleClearConversation}
          className="p-2 hover:bg-[#2d5045] rounded-lg transition-colors"
          title="Clear conversation"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
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
                      ? message.error
                        ? "bg-red-900/30 border border-red-500/50 rounded-tl-sm"
                        : "bg-[#4a7565] rounded-tl-sm"
                      : "bg-[#3dd9b8] rounded-br-sm text-[#12211c]"
                  }`}
                >
                  <p className={message.error ? "text-red-200" : ""}>{message.text}</p>
                  {message.tokenUsage && message.sender === "ai" && (
                    <div className="mt-2 pt-2 border-t border-gray-600/50 text-xs text-gray-400">
                      Tokens: {message.tokenUsage.totalTokens} (prompt: {message.tokenUsage.promptTokens}, completion: {message.tokenUsage.completionTokens})
                    </div>
                  )}
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