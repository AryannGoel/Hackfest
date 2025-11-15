/**
 * Agora AI REST API Configuration
 */

export const getAgoraAIConfig = () => {
  return {
    restKey: (import.meta as any).env.VITE_AGORA_AI_REST_KEY || "",
    restSecret: (import.meta as any).env.VITE_AGORA_AI_REST_SECRET || "",
    appId: (import.meta as any).env.VITE_AGORA_APP_ID || "",
    geminiApiKey: (import.meta as any).env.VITE_GEMINI_API_KEY || "",
  };
};
