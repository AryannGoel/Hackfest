import { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatScreen from "./components/ChatScreen";
import CopingScreen from "./components/CopingScreen";
import SupportScreen from "./components/SupportScreen";
import VoiceChatScreen from "./components/VoiceChatScreen";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "chat" | "coping" | "support" | "voice">("welcome");

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="relative">
      {/* Screen Display */}
      {currentScreen === "welcome" && <WelcomeScreen onNavigate={setCurrentScreen} />}
      {currentScreen === "chat" && <ChatScreen onNavigate={setCurrentScreen} />}
      {currentScreen === "voice" && <VoiceChatScreen onNavigate={setCurrentScreen} />}
      {currentScreen === "coping" && <CopingScreen onNavigate={setCurrentScreen} />}
      {currentScreen === "support" && <SupportScreen onNavigate={setCurrentScreen} />}
    </div>
  );
}