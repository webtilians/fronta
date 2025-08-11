import { useState, useEffect, useCallback, useRef } from 'react';

const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;

    if (SpeechRecognition && speechSynthesis) {
      setVoiceSupported(true);
      
      // Initialize speech recognition with enhanced settings
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true; // Show interim results for better UX
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 3; // Get multiple alternatives for better accuracy

      // Initialize speech synthesis
      synthRef.current = speechSynthesis;

      // Load voices
      const loadVoices = () => {
        const availableVoices = synthRef.current.getVoices();
        setVoices(availableVoices);
        
        // Find the most natural English voice with priority order
        const voicePriority = [
          // Premium natural voices (Chrome/Edge)
          'Microsoft Aria Online (Natural) - English (United States)',
          'Microsoft Jenny Online (Natural) - English (United States)',
          'Microsoft Guy Online (Natural) - English (United States)',
          'Google US English',
          'Microsoft Zira - English (United States)',
          'Microsoft David - English (United States)',
          // macOS voices
          'Samantha',
          'Alex',
          'Victoria',
          'Allison',
          // Android voices
          'en-US-Wavenet-F',
          'en-US-Standard-C',
          'en-US-Standard-E',
          // Fallback natural indicators
          'natural',
          'neural',
          'premium'
        ];

        let bestVoice = null;
        
        // Try to find voice by exact name match first
        for (const preferredName of voicePriority) {
          bestVoice = availableVoices.find(voice => 
            voice.name.toLowerCase().includes(preferredName.toLowerCase())
          );
          if (bestVoice) break;
        }
        
        // If no preferred voice found, look for any good English voice
        if (!bestVoice) {
          bestVoice = availableVoices.find(voice => 
            voice.lang.startsWith('en') && 
            (voice.name.toLowerCase().includes('natural') || 
             voice.name.toLowerCase().includes('neural') ||
             voice.name.toLowerCase().includes('premium') ||
             voice.name.toLowerCase().includes('online'))
          );
        }
        
        // Final fallback to any English voice
        if (!bestVoice) {
          bestVoice = availableVoices.find(voice => 
            voice.lang.startsWith('en')
          );
        }
        
        setSelectedVoice(bestVoice);
      };

      // Load voices immediately and on voices changed
      loadVoices();
      synthRef.current.onvoiceschanged = loadVoices;

      // Speech recognition event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += result;
          } else {
            interimTranscript += result;
          }
        }

        // Update transcript with final or interim results
        if (finalTranscript) {
          setTranscript(finalTranscript.trim());
        } else if (interimTranscript) {
          setTranscript(interimTranscript.trim());
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Clear transcript after a delay to allow ChatInput to use it
        setTimeout(() => setTranscript(''), 1000);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const speak = useCallback((text) => {
    if (synthRef.current && selectedVoice && text.trim()) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      // Clean and prepare the text for more natural speech
      let cleanText = text.trim()
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
        .replace(/`(.*?)`/g, '$1')       // Remove code markdown
        .replace(/#+\s/g, '')            // Remove headers
        .replace(/\n+/g, '. ')           // Replace newlines with pauses
        .replace(/\s+/g, ' ')            // Normalize spaces
        .replace(/([.!?])\s*([A-Z])/g, '$1 $2'); // Ensure pauses between sentences

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.voice = selectedVoice;
      
      // Optimize speech parameters for more natural delivery
      if (selectedVoice.name.toLowerCase().includes('natural') || 
          selectedVoice.name.toLowerCase().includes('neural') ||
          selectedVoice.name.toLowerCase().includes('online')) {
        // Premium voices - use optimal settings
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
      } else {
        // Standard voices - adjust for better quality
        utterance.rate = 0.85;
        utterance.pitch = 0.95;
        utterance.volume = 0.8;
      }

      // Add natural pauses for punctuation
      utterance.onboundary = (event) => {
        if (event.name === 'sentence') {
          // Small pause between sentences for natural flow
          setTimeout(() => {}, 100);
        }
      };

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
      };

      // For longer texts, break into chunks to prevent cutoff
      if (cleanText.length > 200) {
        const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim());
        let currentIndex = 0;

        const speakNextSentence = () => {
          if (currentIndex < sentences.length && synthRef.current) {
            const sentence = sentences[currentIndex].trim();
            if (sentence) {
              const sentenceUtterance = new SpeechSynthesisUtterance(sentence);
              sentenceUtterance.voice = selectedVoice;
              sentenceUtterance.rate = utterance.rate;
              sentenceUtterance.pitch = utterance.pitch;
              sentenceUtterance.volume = utterance.volume;

              sentenceUtterance.onend = () => {
                currentIndex++;
                if (currentIndex < sentences.length) {
                  setTimeout(speakNextSentence, 200); // Natural pause between sentences
                } else {
                  setIsSpeaking(false);
                }
              };

              sentenceUtterance.onerror = () => {
                setIsSpeaking(false);
              };

              synthRef.current.speak(sentenceUtterance);
            } else {
              currentIndex++;
              speakNextSentence();
            }
          }
        };

        setIsSpeaking(true);
        speakNextSentence();
      } else {
        synthRef.current.speak(utterance);
      }
    }
  }, [selectedVoice]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Enhanced function for conversation mode
  const startConversation = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    }
    startListening();
  }, [isSpeaking, stopSpeaking, startListening]);

  return {
    isListening,
    isSpeaking,
    transcript,
    voiceSupported,
    voices,
    selectedVoice,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    startConversation,
    setSelectedVoice
  };
};

export default useVoice;
