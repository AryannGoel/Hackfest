# Agora AI Integration - Option 1 Setup Guide

This guide shows you how to set up **Option 1: Direct LLM API** for text chat in your MindBloom app.

## Quick Start

1. Create a `.env.local` file in the root directory
2. Add your LLM API configuration (see examples below)
3. Restart your dev server
4. Start chatting!

## Configuration Examples

### OpenAI Setup

```env
# Set the OpenAI endpoint
VITE_AGORA_AI_API_BASE_URL=https://api.openai.com/v1/chat/completions

# Your OpenAI API key (get it from https://platform.openai.com/api-keys)
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

### Google Gemini Setup

```env
# Set the Gemini endpoint
VITE_AGORA_AI_API_BASE_URL=https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent

# Your Gemini API key (get it from https://makersuite.google.com/app/apikey)
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### Custom LLM Server Setup

```env
# Your custom LLM endpoint
VITE_AGORA_AI_API_BASE_URL=https://your-llm-server.com/api/chat

# Authentication - choose one:
# Bearer Token:
VITE_AGORA_AI_REST_KEY=your-bearer-token

# OR Basic Auth:
VITE_AGORA_AI_REST_KEY=username
VITE_AGORA_AI_REST_SECRET=password
```

## How It Works

The service automatically:
- ✅ Detects which LLM provider you're using (OpenAI, Gemini, or custom)
- ✅ Formats requests according to the provider's API
- ✅ Handles authentication automatically
- ✅ Extracts responses correctly
- ✅ Tracks token usage

## Testing

1. Start your dev server: `npm run dev`
2. Navigate to the Chat screen
3. Type a message and send it
4. You should see the AI response!

## Troubleshooting

### "LLM endpoint required" error
- Make sure `VITE_AGORA_AI_API_BASE_URL` is set in `.env.local`
- Restart your dev server after adding environment variables

### "API key required" error
- For OpenAI: Set `VITE_OPENAI_API_KEY`
- For Gemini: Set `VITE_GEMINI_API_KEY`
- For custom: Set `VITE_AGORA_AI_REST_KEY`

### 401 Unauthorized error
- Check that your API key is correct
- Make sure there are no extra spaces in your `.env.local` file

### 404 Not Found error
- Verify the endpoint URL is correct
- For OpenAI: Use `https://api.openai.com/v1/chat/completions`
- For Gemini: Use `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`

## Next Steps

Once configured, your chat screen will use the direct LLM API for all text conversations. The integration includes:
- Conversation history management
- Token usage tracking
- Error handling
- Connection status indicators

Enjoy your AI-powered chat! 🚀

