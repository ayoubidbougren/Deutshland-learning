import { useState, useRef, useEffect, useCallback } from 'react';
import { SessionStatus, ChatTranscript } from '../types';
import { convertTo16kHzInt16, int16ToBase64, LiveAudioPlayer } from '../utils/audio';

export function useLiveVoice() {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isAiMuted, setIsAiMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [transcripts, setTranscripts] = useState<ChatTranscript[]>([]);
  const [inputLevel, setInputLevel] = useState(0);
  const [outputLevel, setOutputLevel] = useState(0);

  // References to preserve state across callbacks and avoid stale closures
  const wsRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<LiveAudioPlayer | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const isMutedRef = useRef(false);
  const statusRef = useRef<SessionStatus>('idle');
  const currentOutputTextRef = useRef<string>('');
  const currentInputTextRef = useRef<string>('');
  const animationFrameRef = useRef<number | null>(null);
  const isLiveReadyRef = useRef<boolean>(false);

  // Sync refs
  isMutedRef.current = isMicMuted;
  statusRef.current = status;

  // Initialize audio player
  useEffect(() => {
    playerRef.current = new LiveAudioPlayer();
    return () => {
      playerRef.current?.close();
    };
  }, []);

  // Update AI mute setting
  useEffect(() => {
    playerRef.current?.setMuted(isAiMuted);
  }, [isAiMuted]);

  // Audio level monitoring loop
  useEffect(() => {
    const updateLevels = () => {
      // Output level from player analyser
      const playerAnalyser = playerRef.current?.getAnalyser();
      if (playerAnalyser && statusRef.current === 'speaking') {
        const data = new Uint8Array(playerAnalyser.frequencyBinCount);
        playerAnalyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          sum += data[i];
        }
        const avg = sum / data.length / 255;
        setOutputLevel(Math.min(1, avg * 2.2));
      } else {
        setOutputLevel((prev) => Math.max(0, prev * 0.85));
      }

      animationFrameRef.current = requestAnimationFrame(updateLevels);
    };

    animationFrameRef.current = requestAnimationFrame(updateLevels);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const endConversation = useCallback(() => {
    isLiveReadyRef.current = false;

    // Stop recording
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Stop WebSocket
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    // Stop audio player
    if (playerRef.current) {
      playerRef.current.stop();
    }

    setStatus('idle');
    setInputLevel(0);
    setOutputLevel(0);
  }, []);

  const startConversation = useCallback(
    async (
      customInstruction?: string,
      meta?: {
        mode?: 'dialogue_practice' | 'free_conversation' | 'topic_discussion' | string;
        firstSpeaker?: 'ai' | 'user' | string;
        firstLineText?: string;
        level?: string;
        topicTitle?: string;
      }
    ) => {
      setErrorMessage(null);
      setStatus('connecting');
      isLiveReadyRef.current = false;

      try {
        // Ensure microphone access
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              channelCount: 1,
            },
          });
        } catch (micErr: unknown) {
          const err = micErr as { name?: string; message?: string };
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            throw new Error('تم حجب المايكروفون. عافاك سمح بالوصول للمايك في المتصفح باش تبدا تهضر مع الـ AI.');
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            throw new Error('ما تّلقاش مايكروفون موصول بالجهاز ديالك.');
          } else {
            throw new Error('تعذر تشغيل المايكروفون: ' + (err.message || 'حدث خطأ غير متوقع'));
          }
        }

        mediaStreamRef.current = stream;

        // Initialize audio context for microphone capture
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const inputCtx = new AudioContextClass();
        inputAudioCtxRef.current = inputCtx;

        if (inputCtx.state === 'suspended') {
          await inputCtx.resume();
        }

        // Initialize player context via user gesture
        if (playerRef.current) {
          playerRef.current.getContext();
        }

        // Set up WebSocket connection to server Live API with short, clean URL (no oversized query strings)
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/live`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          // Send initial session parameters safely through WebSocket message payload
          ws.send(
            JSON.stringify({
              type: 'init',
              voice: selectedVoice,
              instruction: customInstruction?.trim() || '',
              mode: meta?.mode,
              firstSpeaker: meta?.firstSpeaker,
              firstLineText: meta?.firstLineText,
              level: meta?.level,
              topicTitle: meta?.topicTitle,
            })
          );
        };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'ready') {
            isLiveReadyRef.current = true;
            setStatus('listening');
          } else if (msg.type === 'audio') {
            setStatus('speaking');
            playerRef.current?.playChunk(msg.audio);
          } else if (msg.type === 'interrupted') {
            playerRef.current?.stop();
            setStatus('listening');
          } else if (msg.type === 'turn_complete') {
            setStatus('listening');
            // If we have accumulated output text, finalize it in transcripts
            if (currentOutputTextRef.current.trim()) {
              const text = currentOutputTextRef.current.trim();
              setTranscripts((prev) => [
                ...prev,
                {
                  id: 'turn-' + Date.now(),
                  sender: 'model',
                  text,
                  timestamp: Date.now(),
                },
              ]);
              currentOutputTextRef.current = '';
            }
          } else if (msg.type === 'input_transcription') {
            if (msg.text) {
              currentInputTextRef.current += msg.text;
              if (msg.finished) {
                const fullText = currentInputTextRef.current.trim();
                if (fullText) {
                  setTranscripts((prev) => [
                    ...prev,
                    {
                      id: 'user-' + Date.now(),
                      sender: 'user',
                      text: fullText,
                      timestamp: Date.now(),
                    },
                  ]);
                }
                currentInputTextRef.current = '';
              }
            }
          } else if (msg.type === 'output_transcription') {
            if (msg.text) {
              currentOutputTextRef.current += msg.text;
            }
          } else if (msg.type === 'error') {
            setErrorMessage(msg.error || 'وقع مشكل في الاتصال بـ Gemini Live API');
            setStatus('error');
            endConversation();
          }
        } catch (e) {
          console.error('Error handling WebSocket message:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket connection error:', e);
        setErrorMessage('تعذر الاتصال بخادم الصوت. المرجو التحقق من الاتصال بالإنترنت وإعادة المحاولة.');
        setStatus('error');
      };

      ws.onclose = () => {
        isLiveReadyRef.current = false;
        if (statusRef.current !== 'idle') {
          setStatus('idle');
        }
      };

      // Set up AudioNode pipeline for mic stream
      const source = inputCtx.createMediaStreamSource(stream);
      // Use bufferSize of 4096 for optimal latency and processing stability
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current) {
          setInputLevel(0);
          return;
        }

        const channelData = e.inputBuffer.getChannelData(0);

        // Compute RMS volume for visualizer
        let sumSq = 0;
        for (let i = 0; i < channelData.length; i++) {
          sumSq += channelData[i] * channelData[i];
        }
        const rms = Math.sqrt(sumSq / channelData.length);
        setInputLevel(Math.min(1, rms * 6));

        // Downsample and convert to 16kHz PCM
        const pcm16 = convertTo16kHzInt16(channelData, inputCtx.sampleRate);
        const base64 = int16ToBase64(pcm16);

        if (isLiveReadyRef.current && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ audio: base64 }));
        }
      };

      source.connect(processor);
      // Connecting processor to destination is required in Web Audio API for onaudioprocess to run continuously
      processor.connect(inputCtx.destination);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'فشل تشغيل المحادثة الصوتية.');
      setStatus('error');
      endConversation();
    }
  }, [selectedVoice, endConversation]);

  const toggleMicMute = useCallback(() => {
    setIsMicMuted((prev) => !prev);
  }, []);

  const toggleAiMute = useCallback(() => {
    setIsAiMuted((prev) => !prev);
  }, []);

  const clearTranscripts = useCallback(() => {
    setTranscripts([]);
    currentInputTextRef.current = '';
    currentOutputTextRef.current = '';
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      endConversation();
    };
  }, [endConversation]);

  return {
    status,
    errorMessage,
    isMicMuted,
    isAiMuted,
    selectedVoice,
    setSelectedVoice,
    transcripts,
    inputLevel,
    outputLevel,
    startConversation,
    endConversation,
    toggleMicMute,
    toggleAiMute,
    clearTranscripts,
  };
}
