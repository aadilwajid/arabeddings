'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Extend Window for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function VoiceSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setTranscript(finalTranscript);
      };

      recognition.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setError(null);
    setTranscript('');
    
    if (!recognitionRef.current) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      setError('Could not start speech recognition. Please allow microphone access.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSearch = () => {
    if (transcript.trim()) {
      router.push(`/search?q=${encodeURIComponent(transcript.trim())}`);
      setIsOpen(false);
      setTranscript('');
    }
  };

  const handleClose = () => {
    stopListening();
    setIsOpen(false);
    setTranscript('');
    setError(null);
  };

  if (!supported) return null;

  return (
    <>
      {/* Voice Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-[#F5EDE4] transition-colors touchable"
        style={{ color: 'var(--color-text)' }}
        title="Voice Search"
      >
        <Mic size={20} />
      </button>

      {/* Voice Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white dark:bg-[#2d2d2d] rounded-2xl max-w-md w-full p-6 shadow-2xl"
            style={{ border: 'var(--border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif" style={{ color: 'var(--color-text)' }}>
                Voice Search
              </h3>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-[#F5EDE4] dark:hover:bg-[#404040]"
              >
                <X size={20} style={{ color: 'var(--color-text)' }} />
              </button>
            </div>

            {/* Microphone Button */}
            <div className="flex flex-col items-center mb-6">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-red-500 animate-pulse' 
                    : 'bg-[#C4A265] hover:bg-[#D4B275]'
                }`}
              >
                {isListening ? (
                  <MicOff size={40} className="text-white" />
                ) : (
                  <Mic size={40} className="text-white" />
                )}
              </button>
              <p className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {isListening ? 'Listening... Speak now' : 'Tap to start speaking'}
              </p>
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  You said:
                </label>
                <div 
                  className="p-3 rounded-lg text-lg"
                  style={{ 
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-text)',
                    border: 'var(--border)'
                  }}
                >
                  "{transcript}"
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Actions */}
            {transcript && (
              <div className="flex gap-3">
                <button
                  onClick={handleSearch}
                  className="flex-1 bg-[#C4A265] text-white py-3 rounded-lg font-medium hover:bg-[#D4B275] flex items-center justify-center gap-2"
                >
                  <Search size={18} />
                  Search
                </button>
                <button
                  onClick={() => setTranscript('')}
                  className="px-4 py-3 border rounded-lg hover:bg-[#F5EDE4] dark:hover:bg-[#404040]"
                  style={{ 
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                >
                  Clear
                </button>
              </div>
            )}

            {/* Tips */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Try saying:
              </p>
              <div className="flex flex-wrap gap-2">
                {['cotton bed sheets', 'king size comforter', 'kids bedding', 'winter quilts'].map(example => (
                  <button
                    key={example}
                    onClick={() => {
                      setTranscript(example);
                    }}
                    className="text-xs px-3 py-1 rounded-full hover:bg-[#F5EDE4] dark:hover:bg-[#404040]"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
