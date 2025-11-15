# MindBloom Mental Health Companion

A mental health support companion with text chat and voice conversation capabilities powered by local AI.

## Features

- **Text Chat**: Chat interface with intelligent contextual AI responses
- **Voice Chat**: Speak to MindBloom and get voice responses with text-to-speech
- **Conversation History**: Maintains context across messages
- **Empathetic Support**: Responses tailored to emotions and topics
- **No External APIs**: Works with browser-based technologies

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser at `http://localhost:3006` (or port shown in terminal)

## How It Works

### Chat Screen
- Type text messages
- Get intelligent responses based on emotion and topic detection
- Conversation context is maintained
- Instant responses

### Voice Screen
- Click microphone to start speaking
- Speech is converted to text using browser Web Speech API
- AI generates contextual response
- Response is read aloud using Text-to-Speech
- Transcript and response appear on screen

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Web Speech API** - Speech recognition and synthesis
- **Lucide React** - Icons

## Browser Support

- **Chat**: Chrome, Firefox, Safari, Edge (all browsers)
- **Voice**: Chrome (best), Edge, Safari (good support)

## Project Structure

```
src/
├── components/
│   ├── ChatScreen.tsx          # Text chat interface
│   ├── VoiceChatScreen.tsx     # Voice chat interface
│   └── [other screens]
├── services/
│   ├── agoraAIRestService.ts   # Smart contextual AI
│   └── voiceService.ts          # Speech recognition & TTS
└── config/
    └── [app configuration]
```

## Features

- ✅ No API keys needed
- ✅ Works offline (local AI)
- ✅ Fast responses
- ✅ Empathetic mental health support
- ✅ Voice and text modalities
- ✅ Conversation history
