import { useState, useEffect, useRef, useCallback } from 'react';
import { VoiceCallState } from '../../types/salespilot';
import { createAgoraAdapter, IAgoraAdapter } from './mockAgora';

export interface UseVoiceCallOptions {
  onUtteranceSubmitted?: (text: string, speakerName?: string) => Promise<string | void>;
  onInterruption?: (interruptedText: string) => void;
  onAgentSpokeFirst?: (greeting: string) => void;
  conversationId?: string;
  autoStart?: boolean;
  initialGreeting?: string;
}

export function useVoiceCall(options: UseVoiceCallOptions = {}) {
  const [callState, setCallState] = useState<VoiceCallState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Initializing autonomous voice agent...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAwaitingGesture, setIsAwaitingGesture] = useState<boolean>(false);
  const [liveInterimTranscript, setLiveInterimTranscript] = useState<string>('');
  const [activeAISpeech, setActiveAISpeech] = useState<string>('');

  const agoraRef = useRef<IAgoraAdapter>(createAgoraAdapter(true));
  const recognitionRef = useRef<any>(null);
  const isSpeakingAIRef = useRef<boolean>(false);
  const currentAISpeechRef = useRef<string>('');
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioAnimationRef = useRef<number | null>(null);
  const isConnectingOrActiveRef = useRef<boolean>(false);
  const autoStartAttemptedRef = useRef<boolean>(false);

  // Stop active AI speech
  const stopTTS = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeakingAIRef.current = false;
    currentUtteranceRef.current = null;
    setActiveAISpeech('');
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

        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        } catch (_) {}

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.02;
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
        setActiveAISpeech(text);
        setCallState('speaking');
        setStatusMessage('AI Host is speaking...');

        // Safety timer to prevent unhandled hang in background tab
        const timeoutMs = Math.max(4000, Math.min(25000, text.length * 80));
        const safetyTimer = setTimeout(() => {
          if (isSpeakingAIRef.current) {
            isSpeakingAIRef.current = false;
            setActiveAISpeech('');
            setCallState('listening');
            setStatusMessage('Listening to you... (Speak freely into mic)');
            resolve(true);
          }
        }, timeoutMs);

        utterance.onstart = () => {
          isSpeakingAIRef.current = true;
          setActiveAISpeech(text);
        };

        utterance.onend = () => {
          clearTimeout(safetyTimer);
          if (isSpeakingAIRef.current) {
            isSpeakingAIRef.current = false;
            setActiveAISpeech('');
            setCallState('listening');
            setStatusMessage('Listening to you... (Speak freely into mic)');
            resolve(true);
          }
        };

        utterance.onerror = () => {
          clearTimeout(safetyTimer);
          isSpeakingAIRef.current = false;
          setActiveAISpeech('');
          setCallState('listening');
          setStatusMessage('Listening to you... (Speak freely into mic)');
          resolve(false);
        };

        try {
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          clearTimeout(safetyTimer);
          isSpeakingAIRef.current = false;
          setActiveAISpeech('');
          resolve(false);
        }
      });
    },
    [stopTTS]
  );

  // Trigger customer utterance into the AI pipeline
  const processCustomerUtterance = useCallback(
    async (text: string, forceInterruption: boolean = false, speakerName?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setLiveInterimTranscript('');

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
        await new Promise((r) => setTimeout(r, 350));
      }

      setCallState('thinking');
      setStatusMessage('AI is reasoning & updating showroom stage...');

      try {
        if (options.onUtteranceSubmitted) {
          const aiResponse = await options.onUtteranceSubmitted(trimmed, speakerName);
          if (aiResponse && typeof aiResponse === 'string') {
            await speakAI(aiResponse);
          } else {
            setCallState('listening');
            setStatusMessage('Listening to you... (Speak freely into mic)');
          }
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to process utterance');
        setCallState('listening');
        setStatusMessage('Listening to you... (Speak freely into mic)');
      }
    },
    [options, speakAI, stopTTS]
  );

  // Initialize Web Speech Recognition
  const initSpeechRecognition = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn('Web Speech Recognition API is not supported in this browser. Manual input available.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setErrorMessage(null);
        setIsAwaitingGesture(false);
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

        const activeTranscript = interimTranscript || finalTranscript;
        if (activeTranscript.trim().length > 0) {
          setLiveInterimTranscript(activeTranscript);
        }

        // Barge-In: If customer speaks while AI is speaking -> Immediate Turn Takeover!
        if ((interimTranscript.length > 2 || finalTranscript.length > 2) && isSpeakingAIRef.current) {
          stopTTS();
          setCallState('interrupted');
          setStatusMessage('Turn-taking: Customer interrupted AI.');
        }

        if (finalTranscript.trim().length > 0) {
          processCustomerUtterance(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setIsAwaitingGesture(true);
          setErrorMessage('Microphone access waiting for authorization. Tap anywhere to allow microphone.');
        } else if (event.error !== 'no-speech') {
          console.warn('Speech recognition warning:', event.error);
        }
      };

      recognition.onend = () => {
        // Auto-restart if call is still active
        if (isConnectingOrActiveRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Could not initialize speech recognition:', e);
    }
  }, [processCustomerUtterance, stopTTS]);

  // Start Voice Call with Auto Microphone & Proactive Invitation
  const startCall = useCallback(
    async (customGreeting?: string) => {
      if (isConnectingOrActiveRef.current && (callState === 'speaking' || callState === 'listening')) {
        return;
      }

      setErrorMessage(null);
      setCallState('connecting');
      isConnectingOrActiveRef.current = true;
      setStatusMessage('Requesting microphone & initializing Agora voice pipeline...');

      try {
        // 1. Proactively request browser microphone permission
        if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Microphone authorized
            stream.getAudioTracks().forEach((track) => {
              track.enabled = true;
            });
          } catch (mediaErr: any) {
            console.warn('Microphone permission query:', mediaErr);
            if (mediaErr.name === 'NotAllowedError' || mediaErr.name === 'PermissionDeniedError') {
              setIsAwaitingGesture(true);
              setErrorMessage('Microphone access blocked. Click the microphone icon in your browser address bar or tap to allow.');
              setCallState('idle');
              isConnectingOrActiveRef.current = false;
              return;
            }
          }
        }

        await agoraRef.current.join(`room-${Date.now()}`);
        initSpeechRecognition();

        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (_) {}
        }

        setIsAwaitingGesture(false);

        // 2. Proactive AI Welcome Invitation (AI speaks first)
        const defaultWelcome =
          "Welcome to our showroom! I'm your AI sales pilot. Great to have you here — what's your name, and what are you looking for today?";
        const greetingToSpeak =
          customGreeting !== undefined
            ? customGreeting
            : options.initialGreeting !== undefined
            ? options.initialGreeting
            : defaultWelcome;

        if (greetingToSpeak && greetingToSpeak.trim().length > 0) {
          if (options.onAgentSpokeFirst) {
            options.onAgentSpokeFirst(greetingToSpeak);
          }
          await speakAI(greetingToSpeak);
        } else {
          setCallState('listening');
          setStatusMessage('Listening to you... (Speak freely into mic)');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Call failed to connect');
        setCallState('idle');
        isConnectingOrActiveRef.current = false;
        setIsAwaitingGesture(true);
      }
    },
    [callState, initSpeechRecognition, options, speakAI]
  );

  // End Voice Call
  const endCall = useCallback(async () => {
    isConnectingOrActiveRef.current = false;
    stopTTS();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    await agoraRef.current.leave();
    setCallState('ended');
    setStatusMessage('Voice agent paused. Tap to restart anytime.');
    setActiveAISpeech('');
    setLiveInterimTranscript('');
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

  // Auto-Start & Global Gesture Fallback Effect
  useEffect(() => {
    const autoStartEnabled = options.autoStart !== false;
    if (!autoStartEnabled || autoStartAttemptedRef.current) return;
    autoStartAttemptedRef.current = true;

    // 1. Immediately attempt auto-connect & mic authorization
    startCall().catch(() => {
      setIsAwaitingGesture(true);
    });

    // 2. Register a one-time global user gesture listener so ANY tap on the screen starts the call immediately
    const handleOneTimeGesture = () => {
      if (!isConnectingOrActiveRef.current) {
        startCall().catch(() => {});
      }
      window.removeEventListener('pointerdown', handleOneTimeGesture);
      window.removeEventListener('keydown', handleOneTimeGesture);
    };

    window.addEventListener('pointerdown', handleOneTimeGesture, { once: true });
    window.addEventListener('keydown', handleOneTimeGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleOneTimeGesture);
      window.removeEventListener('keydown', handleOneTimeGesture);
    };
  }, [options.autoStart, startCall]);

  // Simulated waveform animation based on call state
  useEffect(() => {
    const updateLevels = () => {
      if (callState === 'speaking') {
        setAudioLevel(45 + Math.floor(Math.random() * 50));
      } else if (callState === 'listening' && !isMuted) {
        setAudioLevel(15 + Math.floor(Math.random() * 30));
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
      isConnectingOrActiveRef.current = false;
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
    isAwaitingGesture,
    liveInterimTranscript,
    activeAISpeech,
    startCall,
    endCall,
    toggleMute,
    processCustomerUtterance,
    speakAI,
    stopTTS,
  };
}
