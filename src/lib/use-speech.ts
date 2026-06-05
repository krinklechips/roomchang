"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Voice support for the chatbot using the browser-native Web Speech API.
 * English-only for now (en-US). No external API / cost.
 * - Speech-to-text: hold the mic, speak, transcript streams into the input.
 * - Text-to-speech: optionally read assistant replies aloud.
 */
export function useSpeech() {
  const [listening, setListening] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef<(text: string) => void>(() => {});
  const onEndRef = useRef<(finalText: string) => void>(() => {});
  const finalTextRef = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSttSupported(true);
      const r = new SpeechRecognition();
      r.lang = "en-US";
      r.interimResults = true;
      r.continuous = false;
      r.maxAlternatives = 1;

      r.onresult = (e: any) => {
        let transcript = "";
        for (let i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        finalTextRef.current = transcript;
        onResultRef.current(transcript);
      };
      r.onend = () => {
        setListening(false);
        onEndRef.current(finalTextRef.current.trim());
      };
      r.onerror = () => setListening(false);
      recognitionRef.current = r;
    }

    setTtsSupported("speechSynthesis" in window);

    return () => {
      try {
        recognitionRef.current?.abort?.();
      } catch {
        /* ignore */
      }
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const startListening = useCallback(
    (onResult: (text: string) => void, onEnd?: (finalText: string) => void) => {
      const r = recognitionRef.current;
      if (!r) return;
      onResultRef.current = onResult;
      onEndRef.current = onEnd ?? (() => {});
      finalTextRef.current = "";
      try {
        r.start();
        setListening(true);
      } catch {
        /* already started */
      }
    },
    [],
  );

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    setListening(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!ttsSupported || !text) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US";
        u.rate = 1.02;
        window.speechSynthesis.speak(u);
      } catch {
        /* ignore */
      }
    },
    [ttsSupported],
  );

  const cancelSpeak = useCallback(() => {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
  }, []);

  return {
    sttSupported,
    ttsSupported,
    listening,
    startListening,
    stopListening,
    speak,
    cancelSpeak,
  };
}
