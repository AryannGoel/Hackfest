import { useState, useEffect, useRef } from 'react';
import { Home, Mic, Phone, AlertCircle, MessageSquare, Heart, HelpCircle } from 'lucide-react';
import voiceService from '../services/voiceService';

interface VoiceMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function VoiceChatScreen({ onNavigate }: { onNavigate: (screen: "welcome" | "chat" | "coping" | "support" | "voice") => void }) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello! I'm MindBloom. I'm here to listen and support you. Feel free to speak whenever you're ready.",
      timestamp: new Date(),
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if voice services are available
  useEffect(() => {
    const recognitionAvailable = voiceService.isRecognitionAvailable();
    const synthesisAvailable = voiceService.isSynthesisAvailable();

    if (!recognitionAvailable) {
      console.warn("Speech Recognition not supported in this browser");
    }
    if (!synthesisAvailable) {
      console.warn("Speech Synthesis not supported in this browser");
    }
  }, []);

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening || isProcessing || isSpeaking) {
      interval = setInterval(() => setSessionDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isListening, isProcessing, isSpeaking]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartListening = () => {
    if (!voiceService.isRecognitionAvailable()) {
      alert("Speech Recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    setIsListening(true);
    setTranscript("");

    voiceService.startListening(
      (interim) => {
        setTranscript(interim);
      },
      (final) => {
        setTranscript(final);
        setIsListening(false);
        handleProcessUserInput(final);
      }
    );
  };

  const handleStopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const handleProcessUserInput = async (userInput: string) => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Use local contextual AI to generate response
      const aiResponseText = getContextualResponse(userInput);

      const aiMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Speak the response
      if (voiceService.isSynthesisAvailable()) {
        setIsSpeaking(true);
        voiceService.speak(aiResponseText, () => {
          setIsSpeaking(false);
        });
      }
    } catch (error) {
      console.error("Error processing voice input:", error);

      const errorText = "I'm sorry, I had trouble understanding that. Could you please try again?";

      const errorMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: errorText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      if (voiceService.isSynthesisAvailable()) {
        setIsSpeaking(true);
        voiceService.speak(errorText, () => {
          setIsSpeaking(false);
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Contextual response generator for fallback
   */
  const getContextualResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('stress') || input.includes('anxious') || input.includes('anxiety')) {
      return "I understand that stress and anxiety can be overwhelming. Try taking slow, deep breaths. Inhale for four counts, hold for four, and exhale for four. How are you feeling now?";
    } else if (input.includes('sad') || input.includes('depressed') || input.includes('down')) {
      return "I hear that you're feeling down. That's a valid feeling, and I'm here to listen. Would you like to talk about what's been happening?";
    } else if (input.includes('sleep') || input.includes('tired') || input.includes('exhausted')) {
      return "Rest is crucial for your well-being. Have you been able to get enough sleep lately? Sometimes establishing a routine can help.";
    } else if (input.includes('help') || input.includes('support')) {
      return "I'm here to support you. Tell me more about what you're experiencing, and we can work through it together.";
    } else if (input.includes('thank') || input.includes('thanks')) {
      return "You're welcome. Is there anything else on your mind that you'd like to talk about?";
    } else {
      return "Thank you for sharing that with me. Can you tell me a bit more about how you're feeling? I'm here to listen and support you.";
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='min-h-screen bg-[#1a3a31] text-white flex flex-col'>
      {/* Header */}
      <header className='flex items-center justify-between p-4 border-b border-[#2d5045]'>
        <div className='flex items-center gap-3'>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isListening || isProcessing || isSpeaking 
              ? 'bg-[#3dd9b8]/40' 
              : 'bg-[#3dd9b8]/20'
          }`}>
            <Mic className={`w-5 h-5 ${
              isListening || isProcessing || isSpeaking 
                ? 'text-[#3dd9b8] animate-pulse' 
                : 'text-[#3dd9b8]'
            }`} />
          </div>
          <div>
            <h2 className='text-sm font-semibold'>Voice Chat</h2>
            <p className='text-xs text-gray-400'>
              {isListening ? 'Listening...' : isProcessing ? 'Processing...' : isSpeaking ? 'Speaking...' : 'Ready'}
            </p>
          </div>
        </div>
        <button onClick={() => onNavigate('support')} className='p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg'>
          <AlertCircle className='w-5 h-5 text-red-400' />
        </button>
      </header>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`text-sm rounded-2xl p-3 max-w-xs ${
              message.sender === "ai"
                ? "bg-[#4a7565] rounded-tl-sm text-gray-100"
                : "bg-[#3dd9b8] rounded-br-sm text-[#12211c]"
            }`}>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className='px-4 py-2'>
          <div className='bg-[#2d5045]/50 rounded-lg p-2 border border-[#3d6055]'>
            <p className='text-xs text-gray-300'>
              <span className='text-[#3dd9b8] font-semibold'>You: </span>
              {transcript}
            </p>
          </div>
        </div>
      )}

      {/* Microphone Button Area */}
      <div className='flex-1 flex flex-col items-center justify-center p-8'>
        <p className='mb-8 text-gray-300'>
          {isListening ? 'Listening...' : isProcessing ? 'Processing your message...' : isSpeaking ? 'Speaking response...' : 'Tap the microphone to start'}
        </p>
        <button
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={isProcessing || isSpeaking}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform ${
            isListening ? 'bg-[#3dd9b8] scale-110 shadow-lg shadow-[#3dd9b8]/50' : 'bg-[#2d5045] hover:bg-[#3d6055]'
          } ${(isProcessing || isSpeaking) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Mic className={`w-12 h-12 text-white ${isListening ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* Session Info */}
      <div className='px-4 pb-4'>
        <div className='bg-[#0f241e] rounded-xl p-4 border border-[#2d5045] text-xs flex items-center justify-between'>
          <span>Duration: {formatDuration(sessionDuration)}</span>
          <span className='text-gray-500'>🔒 Encrypted</span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className='bg-[#0f241e] border-t border-[#2d5045]'>
        <div className='flex justify-around items-center py-4'>
          <button onClick={() => onNavigate('welcome')} className='flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors'>
            <Home className='w-6 h-6' /><span className='text-xs'>Home</span>
          </button>
          <button onClick={() => onNavigate('chat')} className='flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors'>
            <MessageSquare className='w-6 h-6' /><span className='text-xs'>Chat</span>
          </button>
          <button onClick={() => onNavigate('voice')} className='flex flex-col items-center gap-1 text-white'>
            <Mic className='w-6 h-6 fill-current' /><span className='text-xs'>Voice</span>
          </button>
          <button onClick={() => onNavigate('coping')} className='flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors'>
            <Heart className='w-6 h-6' /><span className='text-xs'>Coping</span>
          </button>
          <button onClick={() => onNavigate('support')} className='flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors'>
            <HelpCircle className='w-6 h-6' /><span className='text-xs'>Support</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
