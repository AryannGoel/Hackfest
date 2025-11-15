# Gemini Integration Guide

## Overview
The ChatScreen now supports both **Google Gemini** and **Agora AI** as AI providers. You can switch between them using the provider selector in the chat header.

## Setup Instructions

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy your API key

### 2. Configure Environment Variables

Add this to your `.env.local` file:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

If you also want to use Agora AI, keep these variables:

```
VITE_AGORA_AI_REST_KEY=your_agora_key
VITE_AGORA_AI_REST_SECRET=your_agora_secret
VITE_AGORA_APP_ID=your_agora_app_id
VITE_AGORA_PROJECT_ID=your_agora_project_id
```

### 3. Run the App

```bash
npm run dev
```

## Features

### Provider Selection
- Click the **lightning bolt icon** (⚡) with the provider name in the chat header
- Select between "🔷 Google Gemini" or "🟢 Agora AI"
- Your choice will apply to all subsequent messages

### Gemini Features
- ✅ Direct integration with Google Gemini API
- ✅ Maintains conversation history for context
- ✅ Empathetic mental health responses
- ✅ Temperature: 0.7 (balanced creativity)
- ✅ Max tokens: 500 (concise responses)

### Error Handling
- Clear error messages if API key is not configured
- Automatic fallback messaging if service is unavailable
- Console logging for debugging

## File Structure

**New Files:**
- `src/services/geminiService.ts` - Google Gemini API integration

**Modified Files:**
- `src/components/ChatScreen.tsx` - Added provider selector and dual service support

## API Response Format

### Gemini Response
```json
{
  "candidates": [{
    "content": {
      "parts": [{"text": "response text"}]
    }
  }]
}
```

### Agora AI Response
```json
{
  "choices": [{
    "message": {"content": "response text"}
  }],
  "usage": {...}
}
```

## Troubleshooting

### "Gemini API key not configured"
- Ensure `VITE_GEMINI_API_KEY` is set in `.env.local`
- Restart the dev server after adding the key

### API Rate Limiting
- Google Gemini has rate limits on free tier
- Consider upgrading to a paid plan for production use

### CORS Issues
- Gemini API works directly (no proxy needed)
- Agora AI uses localhost proxy for dev server

## Testing the Integration

1. Go to Chat screen
2. Click the provider selector (⚡ icon)
3. Select "🔷 Google Gemini"
4. Type a message like "Hello, how are you?"
5. You should get a response from Gemini
6. Try switching to Agora AI and compare responses

## Next Steps

- Add more AI providers (OpenAI, Claude, etc.)
- Implement provider comparison mode
- Add response quality metrics
- Store provider preferences locally
