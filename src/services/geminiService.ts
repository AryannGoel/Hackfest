import { getAgoraAIConfig } from "../config/agoraAI";
import { GoogleGenAI } from "@google/genai";

/**
 * Google Gemini AI Service
 * Provides direct integration with Google's Gemini API using official SDK
 */

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

class GeminiService {
  private conversationHistory: Array<{ role: string; content: string }> = [];
  private apiKey: string = "";
  private client: GoogleGenAI | null = null;
  private model = "gemini-2.5-flash";
  
  private systemPrompt = `You are MindBloom, a compassionate mental health support companion. 
Your role is to:
- Listen empathetically to users' concerns
- Provide supportive and non-judgmental responses
- Suggest coping strategies and mental health techniques
- Encourage professional help when necessary
- Keep responses concise (under 150 words)
- Maintain a warm, understanding tone
- Ask clarifying questions to better understand the user's situation

Always prioritize the user's well-being and mental health.`;

  constructor() {
    const config = getAgoraAIConfig();
    this.apiKey = config.geminiApiKey;
    
    if (this.apiKey) {
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
      console.log("✅ Gemini SDK initialized with API key");
    } else {
      console.warn("⚠️ Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env.local");
    }
  }

  /**
   * Check if Gemini API is properly configured
   */
  isConfigured(): boolean {
    return !!this.client;
  }

  /**
   * Send a message to Gemini API using official SDK
   */
  async sendMessage(userMessage: string): Promise<GeminiResponse> {
    try {
      if (!this.client) {
        throw new Error("Gemini API key not configured");
      }

      // Add user message to history
      this.conversationHistory.push({
        role: "user",
        content: userMessage
      });

      // Build conversation with system prompt
      const systemMessage = `${this.systemPrompt}\n\nConversation history:\n${this.conversationHistory
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n')}`;

      console.log("📤 Sending message to Gemini API:", {
        model: this.model,
        messageLength: userMessage.length,
      });

      const response = await this.client.models.generateContent({
        model: this.model,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: systemMessage
              }
            ]
          }
        ]
      });

      console.log("✅ Gemini Response received");

      // Extract message from response
      let assistantMessage = "";
      if (response.text) {
        assistantMessage = response.text;
      } else {
        throw new Error("No message content in Gemini response");
      }

      // Add to history for context
      this.conversationHistory.push({
        role: "assistant",
        content: assistantMessage
      });

      // Limit history to last 10 messages to avoid token limits
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return {
        text: assistantMessage,
        success: true,
      };
    } catch (error) {
      console.error("❌ Error calling Gemini API:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to get response from Gemini: ${errorMessage}`);
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history (for debugging)
   */
  getHistory(): Array<{ role: string; content: string }> {
    return this.conversationHistory;
  }
}

// Export singleton instance
export default new GeminiService();
