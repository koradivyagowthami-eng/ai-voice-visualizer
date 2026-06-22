import { useCallback, useEffect, useRef, useState } from "react";
import { Download, FileAudio, Mic, MicOff, Pause, Play, Square, Upload, Volume2, X } from "lucide-react";
import "./App.css";

type Particle = { x: number; y: number; size: number; speed: number; angle: number; phase: number; color: string };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [permissionError, setPermissionError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioName, setAudioName] = useState("");
  const [transcript, setTranscript] = useState("");
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSpeakingRef = useRef(false);

  const stopListening = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioContextRef.current?.close();
    streamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    recognitionRef.current?.stop?.();
    recorderRef.current?.stop?.();
    setIsListening(false);
    setIsRecording(false);
    setRecognitionActive(false);
  }, []);

  const startListening = async () => {
    setPermissionError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) throw new Error("Web Audio is not supported in this browser.");
      const context = new AudioContextClass();
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.82;
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      streamRef.current = stream;
      audioContextRef.current = context;
      analyserRef.current = analyser;
      setIsListening(true);
    } catch (error) {
      const message = error instanceof DOMException && error.name === "NotAllowedError"
        ? "Microphone access was blocked. Enable it in your browser settings and try again."
        : "We couldn’t access your microphone. Check that it is connected and available.";
      setPermissionError(message);
    }
  };

  const beginRecording = async () => {
    if (!isListening) await startListening();
    const stream = streamRef.current;
    if (!stream) return;
    setTranscript("");
    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => event.data.size && chunks.push(event.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
      if (blob.size) {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        setAudioName(`voice-note-${new Date().toISOString().slice(0, 10)}.webm`);
      }
    };
    recorder.start(); recorderRef.current = recorder; setIsRecording(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; recognition.interimResults = true; recognition.lang = navigator.language || "en-US";
      recognition.onresult = (event: any) => {
        let finalText = ""; let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          event.results[i].isFinal ? (finalText += text + " ") : (interimText += text);
        }
        if (finalText) setTranscript((current) => `${current}${finalText}`);
        if (interimText) setTranscript((current) => current.replace(/\s*▍.*$/, "") + `${interimText} ▍`);
      };
      recognition.onerror = () => setRecognitionActive(false);
      recognition.onend = () => setRecognitionActive(false);
      recognition.start(); recognitionRef.current = recognition; setRecognitionActive(true);
    }
  };

  const stopRecording = () => {
    recorderRef.current?.state === "recording" && recorderRef.current.stop();
    recognitionRef.current?.stop?.();
    setTranscript((text) => text.replace(/\s*▍.*$/, "").trim());
    setIsRecording(false); setRecognitionActive(false);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(URL.createObjectURL(file)); setAudioName(file.name); setTranscript("");
  };

  const downloadTranscript = () => {
    const blob = new Blob([transcript || "No transcript was captured."], { type: "text/plain" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "voice-transcript.txt"; link.click(); URL.revokeObjectURL(link.href);
  };

  const speakText = (text: string) => {
    if (!text || !("speechSynthesis" in window)) return;
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => /Google US English|Microsoft.*(Natural|Online)/i.test(voice.name)) || voices.find((voice) => voice.lang.startsWith(navigator.language.slice(0, 2))) || null;
    utterance.rate = .98; utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false); utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance); setIsSpeaking(true);
  };

  useEffect(() => {
    if (!voiceText.trim()) return;
    const delay = window.setTimeout(() => speakText(voiceText), 900);
    return () => window.clearTimeout(delay);
  }, [voiceText]);

  useEffect(() => () => stopListening(), [stopListening]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.code === "Space") { event.preventDefault(); isListening ? stopListening() : startListening(); }
      if (event.code === "Escape" && isListening) stopListening();
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [isListening, stopListening]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const particles: Particle[] = Array.from({ length: 130 }, (_, index) => ({
      x: Math.random(), y: Math.random(), size: Math.random() * 1.8 + 0.35,
      speed: Math.random() * 0.14 + 0.03, angle: Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2, color: index % 8 === 0 ? "#aeeaff" : index % 3 === 0 ? "#318dff" : "#3cecff",
    }));
    let frame = 0;
    let animationId = 0;
    let smoothLevel = 0;
    let size = { width: 0, height: 0, dpr: 1 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      size = { width: rect.width, height: rect.height, dpr: Math.min(window.devicePixelRatio || 1, 2) };
      canvas.width = size.width * size.dpr;
      canvas.height = size.height * size.dpr;
      context.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const frequencies = new Uint8Array(256);

    const circle = (x: number, y: number, radius: number, color: string, width: number, alpha = 1) => {
      context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2);
      context.strokeStyle = color; context.globalAlpha = alpha; context.lineWidth = width; context.stroke();
    };
    const draw = (time: number) => {
      const { width, height } = size;
      const cx = width / 2; const cy = height / 2;
      const scale = Math.min(width, height);
      frame += 0.012;
      let targetLevel = 0.045 + Math.sin(time * 0.0012) * 0.009;
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(frequencies);
        const average = frequencies.reduce((sum, value) => sum + value, 0) / frequencies.length;
        targetLevel = clamp(average / 105, 0, 1);
      }
      if (isSpeakingRef.current) {
        // Speech synthesis cannot be read through the microphone analyser, so create a gentle phoneme-like signal.
        const syllable = Math.pow(Math.max(0, Math.sin(time * .0105) * .7 + Math.sin(time * .018) * .35), 1.7);
        targetLevel = Math.max(targetLevel, .16 + syllable * .46);
        for (let i = 0; i < frequencies.length; i++) {
          const harmonic = Math.max(0, Math.sin(i * .15 + time * .012) * .55 + Math.sin(i * .041 - time * .008) * .3);
          frequencies[i] = Math.max(frequencies[i], Math.round((32 + harmonic * 155) * (.55 + syllable * .45)));
        }
      }
      smoothLevel = lerp(smoothLevel, targetLevel, analyserRef.current ? 0.1 : 0.035);
      context.clearRect(0, 0, width, height);

      const wash = context.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.63);
      wash.addColorStop(0, `rgba(31, 182, 255, ${0.07 + smoothLevel * 0.13})`);
      wash.addColorStop(0.42, "rgba(17, 76, 188, 0.12)"); wash.addColorStop(1, "rgba(2, 9, 28, 0)");
      context.fillStyle = wash; context.fillRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        const boost = 1 + smoothLevel * 3.5;
        particle.angle += particle.speed * 0.004 * boost;
        const driftX = Math.cos(time * 0.00024 + particle.phase) * 15;
        const driftY = Math.sin(time * 0.00018 + particle.phase) * 10;
        const x = particle.x * width + driftX; const y = particle.y * height + driftY;
        const flicker = 0.18 + (Math.sin(time * 0.002 + particle.phase) + 1) * 0.18 + smoothLevel * 0.22;
        context.beginPath(); context.arc(x, y, particle.size * (1 + smoothLevel), 0, Math.PI * 2);
        context.fillStyle = particle.color; context.globalAlpha = flicker; context.fill();
        if (index % 5 === 0) { context.globalAlpha = flicker * .18; context.strokeStyle = particle.color; context.beginPath(); context.moveTo(x, y); context.lineTo(x - Math.cos(particle.angle) * (10 + smoothLevel * 32), y - Math.sin(particle.angle) * (10 + smoothLevel * 32)); context.stroke(); }
      });

      // Cyber portal: a clean open centre, technical rings, circuit traces, and data rain.
      const portalY = cy - 18; const portalRadius = clamp(scale * .22, 120, 220);
      const aura = context.createRadialGradient(cx, portalY, portalRadius * .15, cx, portalY, portalRadius * 1.85);
      aura.addColorStop(0, "rgba(8, 33, 87, 0)"); aura.addColorStop(.58, `rgba(25, 184, 255, ${.1 + smoothLevel * .15})`); aura.addColorStop(1, "rgba(4, 23, 72, 0)"); context.fillStyle = aura; context.fillRect(0, portalY - portalRadius * 2, width, portalRadius * 4);
      for (let ring = 0; ring < 25; ring++) { const radius = portalRadius * .48 + ring * 6.2 + smoothLevel * ring * .56; context.beginPath(); context.arc(cx, portalY, radius, frame * (ring % 2 ? -.13 : .1), Math.PI * 2 + frame * (ring % 2 ? -.13 : .1)); context.setLineDash(ring % 4 === 0 ? [2, 7] : ring % 3 === 0 ? [26, 10] : []); context.strokeStyle = ring % 5 === 0 ? "#6eefff" : "#1687e5"; context.globalAlpha = .13 + (ring % 5 === 0 ? .18 : 0) + smoothLevel * .15; context.lineWidth = ring % 5 === 0 ? 1.1 : .65; context.stroke(); context.setLineDash([]); }
      // Clearly visible energy waves travel out from the aperture in real time.
      for (let pulse = 0; pulse < 4; pulse++) {
        const travel = (time * (.045 + smoothLevel * .085) + pulse * portalRadius * .5) % (portalRadius * 1.6);
        const radius = portalRadius * .46 + travel; const opacity = (1 - travel / (portalRadius * 1.6)) * (.22 + smoothLevel * .58); const wavePoints = 130;
        context.beginPath();
        for (let point = 0; point <= wavePoints; point++) {
          const angle = -Math.PI * .12 + point / wavePoints * Math.PI * 1.24;
          const frequency = frequencies[Math.min(255, Math.floor(point / wavePoints * 210) + 8)] / 255;
          const height = (smoothLevel * 34 + frequency * smoothLevel * 54) * Math.sin(angle * 4 + time * .004 + pulse);
          const x = cx + Math.cos(angle) * (radius + height); const y = portalY + Math.sin(angle) * (radius + height);
          point === 0 ? context.moveTo(x, y) : context.lineTo(x, y);
        }
        context.setLineDash([9 + smoothLevel * 15, 10]); context.strokeStyle = pulse % 2 ? "#2ccfff" : "#9af7ff"; context.globalAlpha = opacity; context.lineWidth = 1.3 + smoothLevel * 1.5; context.shadowColor = "#37d9ff"; context.shadowBlur = 16 + smoothLevel * 26; context.stroke(); context.setLineDash([]);
      }
      // Empty inner aperture and two scanning arcs.
      context.beginPath(); context.arc(cx, portalY, portalRadius * .42, 0, Math.PI * 2); context.strokeStyle = "rgba(60, 190, 255, .22)"; context.globalAlpha = 1; context.lineWidth = 1.1; context.stroke();
      [0, Math.PI].forEach((start) => { context.beginPath(); context.arc(cx, portalY, portalRadius * 1.35, start + frame * .32, start + frame * .32 + Math.PI * .68); context.strokeStyle = "#51e9ff"; context.globalAlpha = .62 + smoothLevel * .28; context.lineWidth = 1.3; context.shadowColor = "#38dfff"; context.shadowBlur = 16; context.stroke(); });
      // Circuit paths plug into the portal from above and below.
      for (let trace = 0; trace < 13; trace++) { const offset = (trace - 6) * 17; const side = trace % 2 ? 1 : -1; const startY = trace % 2 ? -20 : height + 20; const endY = trace % 2 ? portalY - portalRadius * 1.12 : portalY + portalRadius * 1.12; const bendY = trace % 2 ? endY - 55 : endY + 55; context.beginPath(); context.moveTo(cx + offset, startY); context.lineTo(cx + offset, bendY); context.lineTo(cx + offset + side * (16 + (trace % 3) * 9), bendY + (trace % 2 ? 20 : -20)); context.lineTo(cx + offset + side * (16 + (trace % 3) * 9), endY); context.strokeStyle = "#32beff"; context.globalAlpha = .18 + smoothLevel * .4; context.lineWidth = .8; context.shadowColor = "#23c7ff"; context.shadowBlur = 9; context.stroke(); context.beginPath(); context.arc(cx + offset + side * (16 + (trace % 3) * 9), bendY + (trace % 2 ? 20 : -20), 2 + smoothLevel * 2, 0, Math.PI * 2); context.fillStyle = "#76eeff"; context.globalAlpha = .5 + smoothLevel * .4; context.fill(); }
      context.globalAlpha = 1; context.shadowBlur = 0;
      animationId = requestAnimationFrame(draw);
    };
    animationId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animationId); observer.disconnect(); };
  }, []);

  return <main className="app-shell">
    <canvas ref={canvasRef} className="visualizer-canvas" aria-hidden="true" />
    <div className="grid-overlay" />
    <section className="experience" id="top">
      <div className="orb-space" />
    </section>

    <div className="voice-dock">
      <div className="secondary-row">
        <div className="transcript-card"><div className="transcript-head"><span><span className={`record-dot ${isRecording ? "recording" : ""}`} /> {recognitionActive ? "Transcribing" : "Transcript"}</span><div className="transcript-actions">{transcript && <button onClick={() => speakText(transcript)} title="Play with AI voice"><Volume2 size={14} /> {isSpeaking ? "Stop" : "AI voice"}</button>}{transcript && <button onClick={downloadTranscript}><Download size={14} /> Text</button>}</div></div><p>{transcript || "Transcript will appear here."}</p></div>
        <div className="text-voice-card"><div><Volume2 size={15} /><span>AI voice</span><small>Type to speak</small></div><textarea value={voiceText} onChange={(event) => setVoiceText(event.target.value)} placeholder="Write text…" aria-label="Text to speak" /></div>
      </div>
      <div className="control-row">
        <button className={`record-button ${isRecording ? "recording" : ""}`} onClick={isRecording ? stopRecording : beginRecording}><span>{isRecording ? <Square size={16} fill="currentColor" /> : <Mic size={19} />}</span>{isRecording ? "Stop recording" : "Record voice"}</button>
        <label className="upload-button"><Upload size={17} /> Upload audio<input type="file" accept="audio/*" onChange={handleUpload} /></label>
      </div>
      {audioUrl && <div className="audio-card"><FileAudio size={17} /><span>{audioName}</span><button onClick={() => audioRef.current?.paused ? audioRef.current.play() : audioRef.current?.pause()}>{isPlaying ? <Pause size={16} /> : <Play size={16} />}</button><a href={audioUrl} download={audioName}><Download size={16} /></a><audio ref={audioRef} src={audioUrl} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} /></div>}
    </div>
    {permissionError && <div className="error-toast"><span>{permissionError}</span><button onClick={() => setPermissionError("")} aria-label="Dismiss"><X size={16} /></button></div>}
  </main>;
}

export default App;
