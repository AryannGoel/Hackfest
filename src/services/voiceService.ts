/**
 * Voice Chat Service
 * Handles speech recognition and text-to-speech for voice conversations
 */

export interface VoiceConfig {
  language?: string;
  autoStart?: boolean;
  continuous?: boolean;
  interimResults?: boolean;
}

class VoiceService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private transcript: string = "";
  private isSpeaking: boolean = false;

  constructor() {
    // Initialize Speech Recognition (Web Speech API)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.configureRecognition();
    }

    // Initialize Speech Synthesis
    this.synthesis = window.speechSynthesis;
  }

  private configureRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.language = "en-US";

    this.recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };
  }

  /**
   * Start listening for user speech
   */
  startListening(onResult: (text: string) => void, onFinal: (text: string) => void): void {
    if (!this.recognition) {
      console.error("Speech Recognition not supported");
      return;
    }

    this.isListening = true;
    this.transcript = "";

    this.recognition.onstart = () => {
      console.log("Listening...");
    };

    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          this.transcript = transcript;
          console.log("Final transcript:", transcript);
          onFinal(transcript);
        } else {
          onResult(transcript);
        }
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log("Stopped listening");
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  }

  /**
   * Stop listening
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Speak text using text-to-speech
   */
  speak(text: string, onEnd?: () => void): void {
    if (!this.synthesis) {
      console.error("Speech Synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    if (this.isSpeaking) {
      this.synthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = "en-US";

    utterance.onstart = () => {
      this.isSpeaking = true;
      console.log("Speaking:", text);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event: any) => {
      console.error("Speech synthesis error:", event);
      this.isSpeaking = false;
    };

    this.synthesis.speak(utterance);
  }

  /**
   * Stop speaking
   */
  stopSpeaking(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Check if currently speaking
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Check if speech recognition is available
   */
  isRecognitionAvailable(): boolean {
    return this.recognition !== null;
  }

  /**
   * Check if speech synthesis is available
   */
  isSynthesisAvailable(): boolean {
    return this.synthesis !== null;
  }

  /**
   * Get current transcript
   */
  getTranscript(): string {
    return this.transcript;
  }

  /**
   * Clear transcript
   */
  clearTranscript(): void {
    this.transcript = "";
  }
}

export default new VoiceService();
