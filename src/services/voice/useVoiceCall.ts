import { useState, useEffect, useRef, useCallback } from 'react';
import { VoiceCallState, TranscriptTurn } from '../../types/salespilot';
import { createAgoraAdapter, IAgoraAdapter } from './mockAgora';

interface UseVoiceCallOptions {
  onUtteranceSubmitted?: (text: string) => Promise<string | void>;
  onInterruption?: (interruptedText: string) => void;
  conversationId?: string;
}

export function useVoiceCall(options: UseVoiceCallOptions = {}) {
  const [callState, setCallState] = useState<VoiceCallState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to start call');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const agoraRef = useRef<IAgoraAdapter>(createAgoraAdapter(true));
  const recognitionRef = useRef<any>(null);
  const isSpeakingAIRef = useRef<boolean>(false);
  const currentAISpeechRef = useRef<string>('');
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioAnimationRef = useRef<number | null>(null);

  // Stop active AI speech
  const stopTTS = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeakingAIRef.current = false;
    currentUtteranceRef.current = null;
  }, []);

  // Speak AI response with interruption tracking
  const speakAI = useCallback(
    (text: string): Promise<boolean> => {
      return new Promise((resolve) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
          resolve(true);
          return;
        }

        stopTTS();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;

        // Try selecting an English natural voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        isSpeakingAIRef.current = true;
        currentAISpeechRef.current = text;
        currentUtteranceRef.current = utterance;
        setCallState('speaking');
        setStatusMessage('AI is speaking...');

        utterance.onstart = () => {
          isSpeakingAIRef.current = true;
        };

        utterance.onend = () => {
          if (isSpeakingAIRef.current) {
            isSpeakingAIRef.current = false;
            setCallState('listening');
            setStatusMessage('Listening to customer...');
            resolve(true);
          }
        };

        utterance.onerror = (e) => {
          // If cancelled due to customer interruption, handled separately
          isSpeakingAIRef.current = false;
          resolve(false);
        };

        window.speechSynthesis.speak(utterance);
      });
    },
    [stopTTS]
  );

  // Trigger customer utterance into the AI pipeline
  const processCustomerUtterance = useCallback(
    async (text: string, forceInterruption: boolean = false) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Check if customer barged in while AI was speaking
      if (isSpeakingAIRef.current || forceInterruption) {
        const interruptedText = currentAISpeechRef.current;
        stopTTS();
        setCallState('interrupted');
        setStatusMessage(`Interrupted AI turn: "${interruptedText.slice(0, 45)}..."`);
        if (options.onInterruption) {
          options.onInterruption(interruptedText);
        }
        // Brief pause to acknowledge interruption
        await new Promise((r) => setTimeout(r, 450));
      }

      setCallState('thinking');
      setStatusMessage('AI is reasoning over CustomerState...');

      try {
        if (options.onUtteranceSubmitted) {
          const aiResponse = await options.onUtteranceSubmitted(trimmed);
          if (aiResponse && typeof aiResponse === 'string') {
            await speakAI(aiResponse);
          } else {
            setCallState('listening');
            setStatusMessage('Listening to customer...');
          }
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to process utterance');
        setCallState('listening');
        setStatusMessage('Listening to customer...');
      }
    },
    [options, speakAI, stopTTS]
  );

  // Initialize Web Speech Recognition
  const initSpeechRecognition = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn('Web Speech Recognition API is not supported in this browser environment. Direct typing/scripted scenario mode available.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        // If customer starts speaking while AI is speaking -> Turn taking cutoff!
        if ((interimTranscript.length > 3 || finalTranscript.length > 3) && isSpeakingAIRef.current) {
          stopTTS();
          setCallState('interrupted');
          setStatusMessage('Turn-taking: Customer interrupted AI.');
        }

        if (finalTranscript.trim().length > 0) {
          processCustomerUtterance(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access denied. You can still test using manual input or the Demo Scenario!');
        } else if (event.error !== 'no-speech') {
          console.warn('Speech recognition warning:', event.error);
        }
      };

      recognition.onend = () => {
        // Auto-restart if call is still active
        if (callState !== 'idle' && callState !== 'ended' && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Could not initialize speech recognition:', e);
    }
  }, [callState, processCustomerUtterance, stopTTS]);

  // Start Voice Call
  const startCall = useCallback(async () => {
    setErrorMessage(null);
    setCallState('connecting');
    setStatusMessage('Negotiating Agora RTC channel & speech pipeline...');

    try {
      await agoraRef.current.join(`room-${Date.now()}`);
      initSpeechRecognition();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (_) {}
      }

      setCallState('listening');
      setStatusMessage('Listening to customer... (Speak into mic or type below)');
    } catch (err: any) {
      setErrorMessage(err.message || 'Call failed to connect');
      setCallState('idle');
    }
  }, [initSpeechRecognition]);

  // End Voice Call
  const endCall = useCallback(async () => {
    stopTTS();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    await agoraRef.current.leave();
    setCallState('ended');
    setStatusMessage('Call ended. CustomerState saved.');
  }, [stopTTS]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    agoraRef.current.mute(nextMuted);
    if (nextMuted && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    } else if (!nextMuted && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (_) {}
    }
  }, [isMuted]);

  // Simulated waveform animation based on call state
  useEffect(() => {
    const updateLevels = () => {
      if (callState === 'speaking') {
        setAudioLevel(45 + Math.floor(Math.random() * 50));
      } else if (callState === 'listening' && !isMuted) {
        setAudioLevel(15 + Math.floor(Math.random() * 25));
      } else if (callState === 'thinking') {
        setAudioLevel(20 + Math.floor(Math.random() * 20));
      } else {
        setAudioLevel(0);
      }
      audioAnimationRef.current = requestAnimationFrame(updateLevels);
    };

    audioAnimationRef.current = requestAnimationFrame(updateLevels);
    return () => {
      if (audioAnimationRef.current) cancelAnimationFrame(audioAnimationRef.current);
    };
  }, [callState, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTTS();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, [stopTTS]);

  return {
    callState,
    isMuted,
    audioLevel,
    statusMessage,
    errorMessage,
    startCall,
    endCall,
    toggleMute,
    processCustomerUtterance,
    speakAI,
    stopTTS,
  };
}
