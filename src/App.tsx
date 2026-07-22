import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Download, FileVideo, Mic, Pause, Play, Square, Trash2, Upload, Volume2, X, Settings, Image as ImageIcon, Grid, AudioLines, Maximize, Minimize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import localforage from "localforage";
import "./App.css";

// --- 3D Visualizer Component ---
function Visualizer3D({ 
  analyserRef, 
  isSpeakingRef,
  transcript,
  voiceText,
  orbColor,
  coreColor,
  sceneType
}: { 
  analyserRef: React.MutableRefObject<AnalyserNode | null>, 
  isSpeakingRef: React.MutableRefObject<boolean>,
  transcript: string,
  voiceText?: string,
  orbColor: string,
  coreColor: string,
  sceneType: string
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const [bgTexture, setBgTexture] = useState<THREE.Texture | null>(null);
  const [debouncedPhrase, setDebouncedPhrase] = useState("");
  
  const frequencies = useMemo(() => new Uint8Array(128), []);

  const words = transcript.replace(/▍/g, '').trim().split(/\s+/);
  const speechText = words.length > 0 && words[0] !== "" ? words.slice(-10).join(' ') : "";
  const latestPhrase = voiceText || speechText || "epic beautiful anime scenery, gorgeous sky, studio ghibli masterpiece";

  useEffect(() => {
    const handler = setTimeout(() => {
      if (latestPhrase.length > 5 && latestPhrase !== debouncedPhrase) {
        setDebouncedPhrase(latestPhrase);
      }
    }, 1500); 
    return () => clearTimeout(handler);
  }, [latestPhrase, debouncedPhrase]);

  useEffect(() => {
    if (debouncedPhrase) {
      const prompt = `${debouncedPhrase}, stunning anime style, studio ghibli, masterpiece, highly detailed 2d anime art`;
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true`;
      
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(
        url, 
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          setBgTexture(texture);
        },
        undefined,
        (err) => console.error("Texture load error:", err)
      );
    }
  }, [debouncedPhrase]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    let targetLevel = 0;
    if (analyserRef.current) {
      analyserRef.current.getByteFrequencyData(frequencies);
      const average = frequencies.reduce((sum, value) => sum + value, 0) / frequencies.length;
      targetLevel = average / 100;
    }
    
    if (isSpeakingRef.current) {
      const time = state.clock.getElapsedTime();
      const syllable = Math.pow(Math.max(0, Math.sin(time * 10) * 0.7 + Math.sin(time * 18) * 0.35), 1.7);
      targetLevel = Math.max(targetLevel, 0.3 + syllable * 0.5);
    }

    const scale = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.2 + targetLevel * 1.5, 0.1);
    meshRef.current.scale.set(scale, scale, scale);
    
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, 0.2 + targetLevel * 1.2, 0.1);
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, 1.5 + targetLevel * 8, 0.1);
  });

  return (
    <>
      {sceneType === 'orb' && (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
          <Sphere ref={meshRef} args={[1, 128, 128]} scale={1}>
            <MeshDistortMaterial 
              ref={materialRef}
              color={orbColor} 
              emissive={orbColor}
              emissiveIntensity={0.6}
              roughness={0.2}
              metalness={0.9}
              distort={0.2}
              speed={1.5}
              wireframe={true}
            />
          </Sphere>
          <Sphere args={[0.95, 64, 64]}>
             <meshStandardMaterial 
                color="#0f172a" 
                emissive={coreColor} 
                emissiveIntensity={0.8} 
                roughness={0.3} 
                metalness={0.8}
             />
          </Sphere>
        </Float>
      )}

      {sceneType === 'cube' && (
        <Float speed={2} rotationIntensity={3} floatIntensity={2}>
           <mesh ref={meshRef as any}>
              <boxGeometry args={[1.5, 1.5, 1.5, 32, 32, 32]} />
              <MeshDistortMaterial 
                ref={materialRef}
                color={orbColor} 
                emissive={coreColor}
                emissiveIntensity={0.6}
                roughness={0.1}
                metalness={0.9}
                distort={0.3}
                speed={2}
                wireframe={true}
              />
           </mesh>
        </Float>
      )}

      <mesh position={[0, 0, -10]} scale={[24, 13.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
           map={bgTexture} 
           color={bgTexture ? "#999999" : "#020617"} 
           transparent 
           opacity={bgTexture ? 0.8 : 1}
        />
      </mesh>
    </>
  );
}

// --- Main App ---
function App() {
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const [isListening, setIsListening] = useState(false);
  const [permissionError, setPermissionError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [transcript, setTranscript] = useState("");
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  
  // Customization State
  const [orbColor, setOrbColor] = useState("#06b6d4"); // Cyan
  const [coreColor, setCoreColor] = useState("#8b5cf6"); // Purple
  const [sceneType, setSceneType] = useState("orb");
  const [showSettings, setShowSettings] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  // Gallery State
  const [gallery, setGallery] = useState<{ id: string, name: string, date: number, blob: Blob }[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const isSpeakingRef = useRef(false);
  const finalTranscriptRef = useRef("");

  // Initialize DB and fetch gallery
  useEffect(() => {
    localforage.config({ name: 'VoiceVisualizer', storeName: 'videos' });
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const keys = await localforage.keys();
      const items = await Promise.all(keys.map(async (key) => {
        const data = await localforage.getItem<any>(key);
        return { id: key, ...data };
      }));
      setGallery(items.sort((a, b) => b.date - a.date));
    } catch (e) {
      console.error("Failed to fetch gallery:", e);
    }
  };

  const deleteFromGallery = async (id: string) => {
    await localforage.removeItem(id);
    fetchGallery();
  };

  const loadFromGallery = (item: any) => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl(URL.createObjectURL(item.blob));
    setMediaName(item.name);
    setShowGallery(false);
  };

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
      analyser.fftSize = 256;
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
    finalTranscriptRef.current = "";
    
    // Capture 3D Canvas Video Stream
    let recordStream = stream;
    let isVideo = false;
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        // @ts-ignore
        const canvasStream = canvas.captureStream(30);
        const videoTracks = canvasStream.getVideoTracks();
        if (videoTracks.length > 0) {
          recordStream = new MediaStream([...videoTracks, ...stream.getAudioTracks()]);
          isVideo = true;
        }
      }
    } catch (e) {
      console.warn("Could not capture canvas stream, falling back to audio only.", e);
    }

    const chunks: BlobPart[] = [];
    const options = isVideo ? { mimeType: 'video/webm' } : undefined;
    
    let recorder: MediaRecorder;
    try {
       recorder = new MediaRecorder(recordStream, options);
    } catch (e) {
       recorder = new MediaRecorder(recordStream);
    }

    recorder.ondataavailable = (event) => event.data.size && chunks.push(event.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: isVideo ? "video/webm" : (recorder.mimeType || "audio/webm") });
      if (blob.size) {
        if (mediaUrl) URL.revokeObjectURL(mediaUrl);
        const name = `visualizer-${new Date().toISOString().slice(0, 10)}.webm`;
        setMediaUrl(URL.createObjectURL(blob));
        setMediaName(name);
        
        try {
           await localforage.setItem(Date.now().toString(), { name, date: Date.now(), blob });
           fetchGallery();
        } catch (e) {
           console.error("Failed to save to gallery:", e);
        }
      }
    };
    recorder.start(); recorderRef.current = recorder; setIsRecording(true);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; recognition.interimResults = true; recognition.lang = navigator.language || "en-US";
      recognition.onresult = (event: any) => {
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += text + " ";
          } else {
            interimText += text;
          }
        }
        setTranscript(finalTranscriptRef.current + (interimText ? interimText + " ▍" : ""));
      };
      recognition.onerror = () => setRecognitionActive(false);
      recognition.onend = () => setRecognitionActive(false);
      recognition.start(); recognitionRef.current = recognition; setRecognitionActive(true);
    }
  };

  const stopRecording = () => {
    recorderRef.current?.state === "recording" && recorderRef.current.stop();
    recognitionRef.current?.stop?.();
    setTranscript(finalTranscriptRef.current.trim());
    setIsRecording(false); setRecognitionActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith("audio/") || file.type.startsWith("video/"))) {
       if (mediaUrl) URL.revokeObjectURL(mediaUrl);
       setMediaUrl(URL.createObjectURL(file)); setMediaName(file.name); setTranscript("");
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl(URL.createObjectURL(file)); setMediaName(file.name); setTranscript("");
  };

  const onAudioPlayerPlay = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    const context = audioContextRef.current;
    
    if (!(e.target as any).hasConnectedSource) {
       const analyser = context.createAnalyser();
       analyser.fftSize = 256;
       analyser.smoothingTimeConstant = 0.82;
       
       const source = context.createMediaElementSource(e.target as HTMLMediaElement);
       source.connect(analyser);
       analyser.connect(context.destination);
       
       analyserRef.current = analyser;
       (e.target as any).hasConnectedSource = true;
    }
  };

  const downloadTranscript = () => {
    const textToSave = finalTranscriptRef.current.trim() || transcript.replace(/\s*▍.*$/, "").trim() || "No transcript was captured.";
    const blob = new Blob([textToSave], { type: "text/plain" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `echovision-transcript-${Date.now()}.txt`; link.click(); URL.revokeObjectURL(link.href);
  };

  const removeUploadedMedia = () => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl(""); setMediaName(""); 
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

  const toggleZenMode = async () => {
    if (!isZenMode) {
        try { await document.documentElement.requestFullscreen(); } catch (e) { console.warn(e); }
        setIsZenMode(true);
        setShowGallery(false);
        setShowSettings(false);
    } else {
        try { if (document.fullscreenElement) await document.exitFullscreen(); } catch (e) { console.warn(e); }
        setIsZenMode(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) setIsZenMode(false);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!voiceText.trim()) return;
    const delay = window.setTimeout(() => speakText(voiceText), 900);
    return () => window.clearTimeout(delay);
  }, [voiceText]);

  useEffect(() => () => stopListening(), [stopListening]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.code === "Space") { event.preventDefault(); isListening ? stopListening() : startListening(); }
      if (event.code === "Escape" && isListening) stopListening();
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [isListening, stopListening]);

  const isVideoMedia = mediaName.endsWith('.webm') || mediaName.endsWith('.mp4');

  return (
    <main 
       onDragOver={handleDragOver} 
       onDrop={handleDrop}
       className="app-shell font-sans text-slate-100 flex flex-col h-screen relative bg-[#020617] overflow-hidden"
    >
      
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 6], fov: 45 }}>
          <fog attach="fog" args={['#020617', 5, 20]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color={orbColor} />
          <directionalLight position={[-10, -10, -5]} intensity={1} color={coreColor} />
          
          <Visualizer3D 
            analyserRef={analyserRef} 
            isSpeakingRef={isSpeakingRef} 
            transcript={transcript} 
            voiceText={isSpeaking ? voiceText : ""} 
            orbColor={orbColor}
            coreColor={coreColor}
            sceneType={sceneType}
          />
          
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          <Environment preset="city" />
        </Canvas>
      </div>

      <div className="grid-overlay absolute inset-0 pointer-events-none z-0 opacity-20" />

      {/* Dynamic Header */}
      <AnimatePresence>
        {!isZenMode && (
          <motion.header 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full flex justify-between items-center px-[6.72rem] sm:px-16 py-10 pointer-events-none"
          >
            <div className="flex flex-col gap-1 px-[6.72rem] sm:px-0">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/40">
                  <AudioLines size={24} className="text-white animate-pulse" />
                  <div className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-2xl animate-ping opacity-20" style={{ animationDuration: '2s' }} />
                </div>
                <h1 className="text-4xl sm:text-5xl tracking-wide" style={{ fontFamily: "'Righteous', sans-serif" }}>
                  <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">Echo</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-bl from-fuchsia-400 to-purple-600 drop-shadow-[0_0_20px_rgba(217,70,239,0.5)]">Vision</span>
                </h1>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400/80 font-semibold tracking-[0.2em] uppercase sm:ml-[4.5rem] ml-[3.5rem] mt-1">
                Live Cinematic Artwork
              </p>
            </div>
            
            {/* Top Right Controls */}
            <div className="flex gap-3 pointer-events-auto">
              <button 
                onClick={toggleZenMode}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg bg-slate-900/60 border border-white/10 hover:bg-slate-800/80 text-white hover:text-cyan-300"
                title="Zen Mode (Fullscreen)"
              >
                <Maximize size={18} />
              </button>
              <button 
                onClick={() => { setShowGallery(!showGallery); setShowSettings(false); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showGallery ? 'bg-cyan-500 text-white' : 'bg-slate-900/60 border border-white/10 hover:bg-slate-800/80 text-cyan-400'}`}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => { setShowSettings(!showSettings); setShowGallery(false); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showSettings ? 'bg-purple-500 text-white' : 'bg-slate-900/60 border border-white/10 hover:bg-slate-800/80 text-purple-400'}`}
              >
                <Settings size={18} />
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
      
      {/* Settings Panel */}
      <AnimatePresence>
         {showSettings && !isZenMode && (
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="absolute top-24 right-6 sm:right-12 z-50 w-72 bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl"
            >
               <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-purple-300">3D Settings</h3>
               
               <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Visualizer Shape</label>
                  <select 
                     value={sceneType} 
                     onChange={(e) => setSceneType(e.target.value)}
                     className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                  >
                     <option value="orb">Cyber Orb</option>
                     <option value="cube">Shattered Cube</option>
                  </select>
               </div>
               
               <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Outer Color</label>
                  <div className="flex gap-2">
                     <input type="color" value={orbColor} onChange={(e) => setOrbColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent" />
                     <span className="text-xs text-slate-400 font-mono mt-1">{orbColor}</span>
                  </div>
               </div>

               <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">Core Color</label>
                  <div className="flex gap-2">
                     <input type="color" value={coreColor} onChange={(e) => setCoreColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent" />
                     <span className="text-xs text-slate-400 font-mono mt-1">{coreColor}</span>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Gallery Panel */}
      <AnimatePresence>
         {showGallery && !isZenMode && (
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="absolute top-24 right-6 sm:right-12 z-50 w-80 max-h-[60vh] overflow-y-auto bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl scrollbar-thin scrollbar-thumb-white/20"
            >
               <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-cyan-300">My Gallery</h3>
               {gallery.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No media saved yet. Record something!</p>
               ) : (
                  <div className="flex flex-col gap-3">
                     {gallery.map(item => (
                        <div key={item.id} className="bg-black/40 border border-white/5 rounded-xl p-3 flex justify-between items-center group">
                           <div className="flex flex-col overflow-hidden max-w-[150px]">
                              <span className="text-xs font-semibold text-slate-200 truncate">{item.name}</span>
                              <span className="text-[10px] text-slate-500">{new Date(item.date).toLocaleString()}</span>
                           </div>
                           <div className="flex gap-1">
                              <button onClick={() => loadFromGallery(item)} className="p-1.5 text-cyan-400 hover:bg-cyan-400/20 rounded-md transition-colors" title="View">
                                 <Play size={14} />
                              </button>
                              <a href={URL.createObjectURL(item.blob)} download={item.name} className="p-1.5 text-slate-300 hover:bg-white/20 rounded-md transition-colors" title="Download">
                                 <Download size={14} />
                              </a>
                              <button onClick={() => deleteFromGallery(item.id)} className="p-1.5 text-rose-400 hover:bg-rose-400/20 rounded-md transition-colors opacity-0 group-hover:opacity-100" title="Delete">
                                 <Trash2 size={14} />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </motion.div>
         )}
      </AnimatePresence>

      
      {/* Dock Container */}
      <AnimatePresence>
        {!isZenMode && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 flex flex-col items-center justify-end pb-10 sm:pb-16 px-[6.72rem] sm:px-12 pointer-events-none z-20"
          >
            <div className="w-full max-w-[500px] grid gap-2 pointer-events-auto">
              
              {/* Secondary Row (Transcript & Text-to-Speech) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                
                {/* Transcript Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col bg-slate-950/60 backdrop-blur-2xl border border-white/10 rounded-xl p-2.5 shadow-2xl transition-all duration-300 hover:bg-slate-900/80 hover:border-white/20"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-mono text-cyan-300 uppercase tracking-widest font-semibold">
                      <span className={`w-1 h-1 rounded-full ${isRecording ? "bg-rose-500 animate-pulse-ring" : "bg-cyan-500"}`} />
                      {recognitionActive ? "Transcribing..." : "Transcript"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {transcript && (
                        <button onClick={() => speakText(transcript)} className="text-[8px] sm:text-[9px] font-semibold text-slate-300 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                          <Volume2 size={10} /> {isSpeaking ? "Stop" : "AI Voice"}
                        </button>
                      )}
                      {transcript && (
                        <button onClick={downloadTranscript} className="text-[8px] sm:text-[9px] font-semibold text-slate-300 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                          <Download size={10} /> Save
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug overflow-y-auto max-h-12 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-1.5 flex-1">
                    {transcript || "Speak clearly into the microphone. AI images will generate in the background..."}
                  </p>
                </motion.div>
      
                {/* Text-to-Voice Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col bg-slate-950/60 backdrop-blur-2xl border border-white/10 rounded-xl p-2.5 shadow-2xl transition-all duration-300 hover:bg-slate-900/80 hover:border-white/20"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-mono text-purple-300 uppercase tracking-widest font-semibold">
                      <Volume2 size={10} /> AI Synthesis
                    </span>
                    <span className="text-[8px] text-slate-400 font-medium">Type to speak</span>
                  </div>
                  <div className="flex gap-1.5 h-full items-end">
                    <textarea 
                      value={voiceText} 
                      onChange={(e) => setVoiceText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 h-8 bg-black/40 border border-white/10 rounded-lg p-1.5 text-[10px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/30 resize-none transition-all"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => speakText(voiceText)}
                      disabled={!voiceText.trim()}
                      className="h-8 w-8 shrink-0 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed border border-purple-500/30 rounded-lg text-purple-300 flex items-center justify-center transition-all shadow-lg"
                    >
                      {isSpeaking ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                    </motion.button>
                  </div>
                </motion.div>
      
              </div>
      
              {/* Primary Controls Row */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center justify-center gap-2 mt-0.5"
              >
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={isRecording ? stopRecording : beginRecording}
                  className={`group relative overflow-hidden flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-[10px] transition-all duration-300 shadow-xl w-full sm:w-auto ${
                    isRecording 
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-600/30' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/30'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-1.5 text-white uppercase tracking-wider">
                    {isRecording ? <Square size={12} fill="currentColor" /> : <FileVideo size={12} />}
                    {isRecording ? "Stop Recording" : "Record Video"}
                  </span>
                </motion.button>
      
                <label className="cursor-pointer group relative overflow-hidden flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-2xl border border-white/10 font-bold text-[10px] text-slate-200 hover:text-white transition-all duration-300 shadow-lg w-full sm:w-auto uppercase tracking-wider">
                  <Upload size={12} />
                  <span>Upload Audio</span>
                  <input type="file" accept="audio/*,video/*" onChange={handleUpload} className="hidden" />
                </label>
              </motion.div>
      
              {/* Media Player Card */}
              <AnimatePresence>
                {mediaUrl && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="mt-2 flex flex-col gap-2 bg-slate-950/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-3 shadow-2xl w-full max-w-lg mx-auto"
                  >
                    <div className="flex items-center gap-4 px-2">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                        <FileVideo size={18} className="text-cyan-400" />
                      </div>
                      <span className="flex-1 truncate text-xs font-semibold text-slate-300 tracking-wide">{mediaName}</span>
                      <div className="flex items-center gap-2">
                        <a href={mediaUrl} download={mediaName} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" title="Download">
                          <Download size={14} />
                        </a>
                        <button onClick={removeUploadedMedia} className="w-9 h-9 flex items-center justify-center rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Visual Player */}
                    {isVideoMedia ? (
                      <video 
                        src={mediaUrl} 
                        controls 
                        className="w-full rounded-2xl bg-black/50 border border-white/5 max-h-[160px] object-cover"
                      />
                    ) : (
                      <audio 
                        src={mediaUrl} 
                        controls 
                        onPlay={onAudioPlayerPlay}
                        className="w-full h-10 px-2 opacity-80 invert hue-rotate-180" 
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
      
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zen Mode Exit Button */}
      <AnimatePresence>
        {isZenMode && (
           <motion.button 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.8 }}
             onClick={toggleZenMode}
             className="absolute top-6 right-6 z-50 p-4 bg-black/20 hover:bg-black/60 backdrop-blur-md rounded-full text-white/50 hover:text-white transition-all shadow-xl"
             title="Exit Zen Mode"
           >
              <Minimize size={24} />
           </motion.button>
        )}
      </AnimatePresence>
  
      {/* Toast for Errors */}
      <AnimatePresence>
        {permissionError && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 flex items-center gap-4 bg-rose-500/90 backdrop-blur-xl text-white px-6 py-3 rounded-full shadow-2xl shadow-rose-500/20 z-[60]"
          >
            <span className="text-sm font-medium">{permissionError}</span>
            <button onClick={() => setPermissionError("")} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
