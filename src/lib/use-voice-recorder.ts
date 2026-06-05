"use client";

import { useRef, useCallback, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type VoiceState = "off" | "listening" | "recording" | "thinking" | "speaking";

const SILENCE_THRESHOLD = 0.014; // RMS below this = silence
const SILENCE_AFTER_SPEECH_MS = 1200; // stop this long after speech ends
const NO_SPEECH_TIMEOUT_MS = 10_000; // exit if nobody speaks within 10s

/**
 * Records a single spoken turn with voice-activity detection:
 * - waits for the user to start talking
 * - records until ~1.2s of silence after they finish
 * - resolves with the audio Blob, or null on the 10s no-speech timeout / cancel.
 * The mic stream is kept open between turns for a smooth conversation.
 */
export function useVoiceRecorder() {
  const [state, setState] = useState<VoiceState>("off");
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const cancelRef = useRef(false);

  const ensureStream = useCallback(async (): Promise<MediaStream | null> => {
    if (streamRef.current) return streamRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      return stream;
    } catch {
      return null;
    }
  }, []);

  const listenOnce = useCallback(async (): Promise<Blob | null> => {
    cancelRef.current = false;
    const stream = await ensureStream();
    if (!stream) return null;

    return new Promise<Blob | null>((resolve) => {
      const mime = MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recorderRef.current = recorder;
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size) chunks.push(e.data);
      };

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      let hasSpoken = false;
      let silenceStart = 0;
      const startTime = Date.now();
      let raf = 0;

      const cleanupAudio = () => {
        cancelAnimationFrame(raf);
        try {
          source.disconnect();
          analyser.disconnect();
          ctx.close();
        } catch {
          /* ignore */
        }
      };

      recorder.onstop = () => {
        cleanupAudio();
        if (cancelRef.current || !hasSpoken) {
          resolve(null);
          return;
        }
        resolve(new Blob(chunks, { type: mime || "audio/webm" }));
      };

      const tick = () => {
        if (cancelRef.current) {
          try {
            recorder.stop();
          } catch {
            /* ignore */
          }
          return;
        }
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        const now = Date.now();

        if (rms > SILENCE_THRESHOLD) {
          if (!hasSpoken) {
            hasSpoken = true;
            setState("recording");
          }
          silenceStart = 0;
        } else if (hasSpoken) {
          if (!silenceStart) silenceStart = now;
          else if (now - silenceStart > SILENCE_AFTER_SPEECH_MS) {
            try {
              recorder.stop();
            } catch {
              /* ignore */
            }
            return;
          }
        } else if (now - startTime > NO_SPEECH_TIMEOUT_MS) {
          // Nobody spoke within the timeout — bail out.
          try {
            recorder.stop();
          } catch {
            /* ignore */
          }
          return;
        }
        raf = requestAnimationFrame(tick);
      };

      try {
        recorder.start();
        setState("listening");
        raf = requestAnimationFrame(tick);
      } catch {
        cleanupAudio();
        resolve(null);
      }
    });
  }, [ensureStream]);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    try {
      recorderRef.current?.stop();
    } catch {
      /* ignore */
    }
  }, []);

  const release = useCallback(() => {
    cancel();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setState("off");
  }, [cancel]);

  return { state, setState, listenOnce, cancel, release };
}
