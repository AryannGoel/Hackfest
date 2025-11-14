import { getAgoraAIConfig } from "../config/agoraAI";

/**
 * Agora Conversational AI Agent REST API Service
 * Text-based chat implementation with direct LLM API integration
 * 
 * Supports:
 * - OpenAI API (https://api.openai.com/v1/chat/completions)
 * - Google Gemini API (via custom endpoint)
 * - Custom LLM endpoints
 * 
 * Configuration: Set VITE_AGORA_AI_API_BASE_URL to your LLM endpoint
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
  
  // Get base URL - use custom API base URL if provided, otherwise use Agora's official API
  private getBaseUrl(): string {
    const config = getAgoraAIConfig();
    if (config.apiBaseUrl) {
      return config.apiBaseUrl;
    }
    // Use Agora's official API base URL
    // For development with proxy, use relative URL; for production, use full URL
    if (import.meta.env.DEV) {
      // In development, use relative URL to leverage Vite proxy (bypasses CORS)
      return "";
    }
    return "https://api.agora.io";
  }
  
  // Agora Conversational AI Agent API base path
  private getAgoraApiBase(): string {
    return "/api/conversational-ai-agent/v2";
  }
  
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
  /**
   * Detect LLM provider type from endpoint URL
   */
  private detectLLMProvider(endpoint: string): "openai" | "gemini" | "custom" {
    if (endpoint.includes("openai.com") || endpoint.includes("api.openai.com")) {
      return "openai";
    }
    if (endpoint.includes("generativelanguage.googleapis.com") || endpoint.includes("gemini")) {
      return "gemini";
    }
    return "custom";
  }

  /**
   * Build request body based on LLM provider
   */
  private buildRequestBody(provider: "openai" | "gemini" | "custom", messages: AgoraAIMessage[]): any {
    if (provider === "openai") {
      return {
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        stream: false
      };
    }
    
    if (provider === "gemini") {
      // Gemini format (if using REST API)
      return {
        contents: messages.map(msg => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      };
    }
    
    // Custom/OpenAI-compatible format (default)
    return {
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: false
    };
  }

  /**
   * Build authorization header based on provider
   */
  private buildAuthHeader(provider: "openai" | "gemini" | "custom", config: any): string {
    if (provider === "openai") {
      // OpenAI uses Bearer token (can use API key from env or Agora credentials)
      const apiKey = config.openaiApiKey || config.restKey;
      if (!apiKey) {
        throw new Error("OpenAI API key required. Set VITE_OPENAI_API_KEY or use VITE_AGORA_AI_REST_KEY");
      }
      return `Bearer ${apiKey}`;
    }
    
    if (provider === "gemini") {
      // Gemini uses API key as query param or Bearer token
      const apiKey = config.geminiApiKey || config.restKey;
      if (!apiKey) {
        throw new Error("Gemini API key required. Set VITE_GEMINI_API_KEY or use VITE_AGORA_AI_REST_KEY");
      }
      return `Bearer ${apiKey}`;
    }
    
    // Custom endpoint - use Basic Auth with Agora credentials or Bearer token
    if (config.restKey && config.restSecret) {
      const authString = `${config.restKey}:${config.restSecret}`;
      return `Basic ${btoa(authString)}`;
    }
    
    if (config.restKey) {
      return `Bearer ${config.restKey}`;
    }
    
    throw new Error("Authentication required. Set VITE_AGORA_AI_REST_KEY and VITE_AGORA_AI_REST_SECRET");
  }

  /**
   * Extract response text based on provider
   */
  private extractResponseText(provider: "openai" | "gemini" | "custom", data: any): string {
    if (provider === "openai" || provider === "custom") {
      if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content;
      }
      if (data.content) return data.content;
      if (data.text) return data.text;
      if (data.message) return data.message;
    }
    
    if (provider === "gemini") {
      if (data.candidates && data.candidates[0]?.content?.parts) {
        return data.candidates[0].content.parts.map((p: any) => p.text).join("");
      }
      if (data.text) return data.text;
      if (data.content) return data.content;
    }
    
    if (typeof data === 'string') return data;
    
    throw new Error("Unable to extract response text from API response");
  }

  async sendMessage(userMessage: string): Promise<AgoraAIResponse> {
    try {
      const config = getAgoraAIConfig();
      
      // Add user message to history
      this.conversationHistory.push({
        role: "user",
        content: userMessage
      });

      // Build endpoint - Priority 1: Custom LLM endpoint (Option 1)
      let chatEndpoint = "";
      
      if (config.apiBaseUrl) {
        // Use custom LLM endpoint directly
        chatEndpoint = config.apiBaseUrl;
        // Auto-append /chat/completions if it's OpenAI-style endpoint
        if (!chatEndpoint.includes("/chat/completions") && 
            !chatEndpoint.includes("generateContent") &&
            !chatEndpoint.includes("gemini")) {
          chatEndpoint = `${chatEndpoint}/chat/completions`;
        }
      } else {
        // Fallback: Try Agora endpoint (but this likely won't work for text chat)
        const baseUrl = this.getBaseUrl();
        const apiBase = this.getAgoraApiBase();
        if (config.appId || config.projectId) {
          const appId = config.appId || config.projectId;
          chatEndpoint = `${baseUrl}${apiBase}/projects/${appId}/chat/completions`;
        } else {
          throw new Error(
            "LLM endpoint required. Set VITE_AGORA_AI_API_BASE_URL to your LLM API endpoint.\n\n" +
            "Examples:\n" +
            "- OpenAI: https://api.openai.com/v1/chat/completions\n" +
            "- Gemini: https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent\n" +
            "- Custom: https://your-llm-server.com/api/chat"
          );
        }
      }
      
      // Detect provider
      const provider = this.detectLLMProvider(chatEndpoint);
      
      console.log("📤 Sending message to LLM:", { 
        endpoint: chatEndpoint,
        provider: provider,
        message: userMessage.substring(0, 50) + "..."
      });

      // Build request
      const requestBody = this.buildRequestBody(provider, this.conversationHistory);
      const authHeader = this.buildAuthHeader(provider, config);

      // For Gemini, API key might be in query params
      let finalEndpoint = chatEndpoint;
      if (provider === "gemini" && config.geminiApiKey && !chatEndpoint.includes("key=")) {
        const separator = chatEndpoint.includes("?") ? "&" : "?";
        finalEndpoint = `${chatEndpoint}${separator}key=${config.geminiApiKey}`;
      }

      // Debug logging (without exposing full API key)
      const apiKeyPreview = authHeader.includes("Bearer ") 
        ? authHeader.substring(0, 20) + "..." 
        : "Basic [hidden]";
      console.log("🔍 Request Details:", {
        endpoint: finalEndpoint,
        provider: provider,
        apiKeyFormat: apiKeyPreview,
        requestBodyKeys: Object.keys(requestBody),
        messageCount: this.conversationHistory.length
      });

      const response = await fetch(finalEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", response.status, errorText);
        
        // Handle specific error codes with helpful messages
        if (response.status === 429) {
          let errorMessage = "Rate limit or quota exceeded.";
          let errorCode = "";
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.error?.message) {
              errorMessage = errorData.error.message;
            }
            if (errorData.error?.code) {
              errorCode = errorData.error.code;
            }
            if (errorData.error?.code === "insufficient_quota") {
              errorMessage = "OpenAI account has insufficient quota. This usually means:\n1. No billing method is set up (even free tier needs billing info)\n2. Account credits have been exhausted\n3. Account needs payment method added\n\nCheck: https://platform.openai.com/account/billing\nUsage: https://platform.openai.com/usage";
            }
          } catch (e) {
            // If parsing fails, use default message
          }
          throw new Error(`OpenAI API Error (429 ${errorCode}): ${errorMessage}`);
        }
        
        if (response.status === 401) {
          throw new Error("OpenAI API authentication failed. Please check your API key in .env.local (VITE_OPENAI_API_KEY)");
        }
        
        // If 404, try alternative endpoint structures
        if (response.status === 404) {
          console.log("🔄 Trying alternative endpoint structures...");
          const baseUrl = this.getBaseUrl();
          const apiBase = this.getAgoraApiBase();
          const projectId = config.projectId || config.appId;
          
          // List of alternative endpoints to try based on Agora's API structure
          const alternativeEndpoints = [];
          
          if (projectId) {
            // Try 1: v2 API structure (official)
            alternativeEndpoints.push(`${baseUrl}${apiBase}/projects/${projectId}/chat/completions`);
            // Try 2: v1 API structure (legacy)
            alternativeEndpoints.push(`${baseUrl}/api/conversational-ai-agent/v1/projects/${projectId}/chat/completions`);
            // Try 3: OpenAI-compatible format
            alternativeEndpoints.push(`${baseUrl}${apiBase}/projects/${projectId}/openai/chat/completions`);
            // Try 4: Direct API path
            alternativeEndpoints.push(`${baseUrl}/api/v1/projects/${projectId}/chat/completions`);
          }
          
          // Try each alternative endpoint
          for (const altEndpoint of alternativeEndpoints) {
            console.log(`🔄 Trying: ${altEndpoint}`);
            
            try {
              const altResponse = await fetch(altEndpoint, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": authHeader,
                  "Accept": "application/json",
                },
                body: JSON.stringify({
                  messages: this.conversationHistory.filter(m => m.role !== "system"),
                  model: "gpt-3.5-turbo",
                  temperature: 0.7,
                  max_tokens: 500,
                  stream: false
                })
              });
              
              if (altResponse.ok) {
                const altData = await altResponse.json();
                console.log("✅ Alternative endpoint worked:", altEndpoint);
                
                let assistantMessage = "";
                if (altData.choices && altData.choices[0]?.message?.content) {
                  assistantMessage = altData.choices[0].message.content;
                } else if (altData.content) {
                  assistantMessage = altData.content;
                } else if (altData.text) {
                  assistantMessage = altData.text;
                } else if (altData.message) {
                  assistantMessage = altData.message;
                }
                
                if (assistantMessage) {
                  this.conversationHistory.push({
                    role: "assistant",
                    content: assistantMessage
                  });
                  
                  return {
                    text: assistantMessage,
                    success: true,
                    tokenUsage: altData.usage
                  };
                }
              } else if (altResponse.status !== 404) {
                // If it's not 404, log it but continue trying others
                console.log(`⚠️ Endpoint ${altEndpoint} returned ${altResponse.status}`);
              }
            } catch (err) {
              console.log(`⚠️ Endpoint ${altEndpoint} failed:`, err);
              // Continue to next endpoint
            }
          }
          
          console.log("❌ All alternative endpoints failed");
        }
        
        // Provide helpful error message for 404
        if (response.status === 404) {
          const apiInfo = this.getApiInfo();
          throw new Error(
            `Agora AI endpoint not found (404). The endpoint "${apiInfo.endpoint}" doesn't exist.\n\n` +
            `The Agora Conversational AI Agent API uses the following structure:\n` +
            `https://api.agora.io/api/conversational-ai-agent/v2/projects/{appid}/join\n\n` +
            `For text chat, you may need to:\n` +
            `1. Set up a custom LLM callback URL in your agent configuration\n` +
            `2. Use the agent's LLM endpoint directly\n` +
            `3. Or configure VITE_AGORA_AI_API_BASE_URL with your custom endpoint\n\n` +
            `Please check:\n` +
            `1. Your Agora App ID is correct (set VITE_AGORA_APP_ID)\n` +
            `2. The Conversational AI service is enabled in your Agora dashboard\n` +
            `3. Your agent is configured with a valid LLM callback URL\n\n` +
            `Original error: ${errorText}`
          );
        }
        
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
      const baseUrl = this.getBaseUrl();
      const apiBase = this.getAgoraApiBase();
      let chatEndpoint = "";
      
      if (config.apiBaseUrl) {
        chatEndpoint = config.apiBaseUrl.endsWith('/chat/completions') 
          ? config.apiBaseUrl 
          : `${config.apiBaseUrl}/chat/completions`;
      } else if (config.appId || config.projectId) {
        const appId = config.appId || config.projectId;
        chatEndpoint = `${baseUrl}${apiBase}/projects/${appId}/chat/completions`;
      } else {
        throw new Error("Agora App ID is required for voice messages. Set VITE_AGORA_APP_ID in .env.local");
      }
      
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
   * For Option 1 (Direct LLM API), we need either:
   * - apiBaseUrl (LLM endpoint) + appropriate API key
   * - OR Agora credentials (for Agora endpoints)
   */
  isConfigured(): boolean {
    const config = getAgoraAIConfig();
    
    // Option 1: Direct LLM API endpoint configured
    if (config.apiBaseUrl) {
      // Check if we have appropriate API key for the endpoint
      if (config.apiBaseUrl.includes("openai.com")) {
        return !!(config.openaiApiKey || config.restKey);
      }
      if (config.apiBaseUrl.includes("gemini") || config.apiBaseUrl.includes("generativelanguage")) {
        return !!(config.geminiApiKey || config.restKey);
      }
      // For custom endpoints, any auth is fine
      return !!(config.restKey || config.restSecret);
    }
    
    // Option 2: Agora endpoint (requires both key and secret)
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
    endpoint: string;
  } {
    const config = getAgoraAIConfig();
    const baseUrl = this.getBaseUrl();
    const apiBase = this.getAgoraApiBase();
    let endpoint = "";
    
    if (config.apiBaseUrl) {
      endpoint = config.apiBaseUrl.endsWith('/chat/completions') 
        ? config.apiBaseUrl 
        : `${config.apiBaseUrl}/chat/completions`;
    } else if (config.appId || config.projectId) {
      const appId = config.appId || config.projectId;
      endpoint = `${baseUrl}${apiBase}/projects/${appId}/chat/completions`;
    } else {
      endpoint = "Not configured - App ID required";
    }
    
    return {
      baseUrl: baseUrl || "using proxy",
      apiBase: apiBase,
      configured: this.isConfigured(),
      agentJoined: !!this.agentId,
      endpoint: endpoint
    };
  }
}

export default new AgoraAIRestService();
