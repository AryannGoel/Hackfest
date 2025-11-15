import { getAgoraAIConfig } from "../config/agoraAI";

/**
 * Agora Conversational AI Agent REST API Service
 * Text-based chat implementation with Gemini LLM
 * 
 * Note: This requires valid Agora credentials and Gemini API key
 * For production use, provide real credentials in .env.local
 */

export interface AgoraAIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AgoraAIResponse {
  text: string;
  success: boolean;
  error?: string;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class AgoraAIRestService {
  private conversationHistory: AgoraAIMessage[] = [];
  private agentId: string = "";
  private sessionId: string = "";
  // Using local Vite proxy to bypass CORS
  private baseUrl = "http://localhost:3000";
  // Correct Agora Conversational AI Agent endpoint
  private apiBase = "/api/conversational-ai-agent/v2/projects";
  
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
    // Initialize conversation with system prompt
    this.conversationHistory.push({
      role: "system",
      content: this.systemPrompt
    });
  }

  /**
   * Generate Authorization header using Basic Auth
   * Encodes REST Key:REST Secret in Base64
   */
  private generateAuthHeader(): string {
    const config = getAgoraAIConfig();
    const key = config.restKey;
    const secret = config.restSecret;

    console.log("🔑 Auth Config Check:", {
      hasKey: !!key,
      hasSecret: !!secret,
      keyLength: key?.length,
      secretLength: secret?.length,
    });

    if (!key || !secret) {
      throw new Error("Agora AI REST credentials not configured. Set VITE_AGORA_AI_REST_KEY and VITE_AGORA_AI_REST_SECRET in .env.local");
    }

    // Create auth string: key:secret
    const authString = `${key}:${secret}`;
    // Encode in Base64 using btoa (browser function)
    const encodedAuth = btoa(authString);
    const authHeader = `Basic ${encodedAuth}`;
    
    console.log("🔐 Auth Header Generated:", {
      authHeader: authHeader.substring(0, 20) + "...",
      format: "Basic [Base64(key:secret)]"
    });
    
    return authHeader;
  }

  /**
   * Send a message to Agora AI Conversational Agent
   */
  async sendMessage(userMessage: string): Promise<AgoraAIResponse> {
    try {
      const config = getAgoraAIConfig();
      
      // Add user message to history
      this.conversationHistory.push({
        role: "user",
        content: userMessage
      });

      // Try the chat completions endpoint directly
      const chatEndpoint = `${this.baseUrl}${this.apiBase}/chat/completions`;
      
      console.log("📤 Sending message to Agora AI:", { 
        endpoint: chatEndpoint,
        message: userMessage
      });

      // Build authorization header
      const authString = `${config.restKey}:${config.restSecret}`;
      const encodedAuth = btoa(authString);
      const authHeader = `Basic ${encodedAuth}`;

      const response = await fetch(chatEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "Accept": "application/json",
        },
        body: JSON.stringify({
          messages: this.conversationHistory,
          model: "gemini-pro",
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", response.status, errorText);
        throw new Error(`Agora AI error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("� Response:", data);

      // Extract message from various possible response formats
      let assistantMessage = "";
      if (data.choices && data.choices[0]?.message?.content) {
        assistantMessage = data.choices[0].message.content;
      } else if (data.content) {
        assistantMessage = data.content;
      } else if (data.text) {
        assistantMessage = data.text;
      } else if (data.message) {
        assistantMessage = data.message;
      } else if (typeof data === 'string') {
        assistantMessage = data;
      }

      if (!assistantMessage) {
        throw new Error("No message content in response");
      }

      // Add to history for context
      this.conversationHistory.push({
        role: "assistant",
        content: assistantMessage
      });

      return {
        text: assistantMessage,
        success: true,
        tokenUsage: data.usage
      };
    } catch (error) {
      console.error("❌ Error calling Agora AI:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to get response from Agora AI: ${errorMessage}`);
    }
  }

  /**
   * Send a voice message (optimized for shorter responses)
   */
  async sendVoiceMessage(userMessage: string): Promise<AgoraAIResponse> {
    try {
      const config = getAgoraAIConfig();
      
      // Add user message to history
      this.conversationHistory.push({
        role: "user",
        content: userMessage
      });

      // Use the same chat completions endpoint for voice
      const chatEndpoint = `${this.baseUrl}${this.apiBase}/chat/completions`;
      
      console.log("🎙️ Sending voice message to Agora AI:", { 
        endpoint: chatEndpoint,
        message: userMessage
      });

      // Build authorization header
      const authString = `${config.restKey}:${config.restSecret}`;
      const encodedAuth = btoa(authString);
      const authHeader = `Basic ${encodedAuth}`;

      const response = await fetch(chatEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "Accept": "application/json",
        },
        body: JSON.stringify({
          messages: this.conversationHistory,
          model: "gemini-pro",
          temperature: 0.7,
          max_tokens: 300,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Voice API Error:", response.status, errorText);
        throw new Error(`Agora AI API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("🎙️ Voice Response:", data);

      // Extract message from various possible response formats
      let assistantMessage = "";
      if (data.choices && data.choices[0]?.message?.content) {
        assistantMessage = data.choices[0].message.content;
      } else if (data.content) {
        assistantMessage = data.content;
      } else if (data.text) {
        assistantMessage = data.text;
      } else if (data.message) {
        assistantMessage = data.message;
      } else if (typeof data === 'string') {
        assistantMessage = data;
      }

      if (!assistantMessage) {
        throw new Error("No message content in response");
      }

      // Add to history for context
      this.conversationHistory.push({
        role: "assistant",
        content: assistantMessage
      });

      return {
        text: assistantMessage,
        success: true,
        tokenUsage: data.usage
      };
    } catch (error) {
      console.error("❌ Error calling Agora AI voice:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to get voice response from Agora AI: ${errorMessage}`);
    }
  }

  /**
   * Reset conversation history
   */
  resetConversation(): void {
    this.conversationHistory = [];
    this.conversationHistory.push({
      role: "system",
      content: this.systemPrompt
    });
  }

  /**
   * Get conversation history
   */
  getHistory(): AgoraAIMessage[] {
    return this.conversationHistory;
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.resetConversation();
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    const config = getAgoraAIConfig();
    return !!(config.restKey && config.restSecret);
  }

  /**
   * Get API info for debugging
   */
  getApiInfo(): { 
    baseUrl: string; 
    apiBase: string; 
    configured: boolean;
    agentJoined: boolean;
  } {
    return {
      baseUrl: this.baseUrl,
      apiBase: this.apiBase,
      configured: this.isConfigured(),
      agentJoined: !!this.agentId
    };
  }
}

export default new AgoraAIRestService();
