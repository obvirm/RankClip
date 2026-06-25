import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Type as TypeIcon, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Plus, 
  Video, 
  Music, 
  Check, 
  Upload, 
  Link, 
  Sliders, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRELOADED_VIDEOS, TEXT_PRESETS } from '../data/templates';

interface VideoScene {
  id: string;
  text: string;
  videoUrl: string;
  videoTitle: string;
  duration: number; // scene duration in seconds
  color: string;
  strokeColor: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  animation: 'none' | 'bounce' | 'pulse' | 'wiggle' | 'shake' | 'fade-in' | 'slide-up';
  x: number; // percentage coordinate (0-100)
  y: number; // percentage coordinate (0-100)
  overlayType?: 'text' | 'image';
  imageUrl?: string;
  imageWidth?: number;
  numberColor?: string;
  numberBgColor?: string;
  tableBgColor?: string;
  tableBorderColor?: string;
  titleColor?: string;
  glowColor?: string;
  glowRadius?: number;
  numberStrokeColor?: string;
  numberStrokeWidth?: number;
  numberGlowColor?: string;
  numberGlowRadius?: number;
}

const defaultScenes: VideoScene[] = [
  {
    id: 'scene-1',
    text: 'THE CHAMPION',
    videoUrl: PRELOADED_VIDEOS[0].url,
    videoTitle: PRELOADED_VIDEOS[0].title,
    duration: 5,
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 4,
    fontSize: 32,
    fontFamily: 'Courier New',
    animation: 'none',
    x: 50,
    y: 72,
    overlayType: 'text',
    numberColor: '#FACC15',
    numberBgColor: '#000000',
    tableBgColor: 'rgba(0, 0, 0, 0.85)',
    tableBorderColor: '#FACC15',
    titleColor: '#FFFFFF',
    glowColor: '#FACC15',
    glowRadius: 10,
    numberStrokeColor: '#000000',
    numberStrokeWidth: 4,
    numberGlowColor: '#FACC15',
    numberGlowRadius: 10
  },
  {
    id: 'scene-2',
    text: 'EPIC FAIL',
    videoUrl: PRELOADED_VIDEOS[1].url,
    videoTitle: PRELOADED_VIDEOS[1].title,
    duration: 5,
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 4,
    fontSize: 32,
    fontFamily: 'Courier New',
    animation: 'none',
    x: 50,
    y: 72,
    overlayType: 'text',
    numberColor: '#EF4444',
    numberBgColor: '#EF4444',
    tableBgColor: 'rgba(0, 0, 0, 0.85)',
    tableBorderColor: '#EF4444',
    titleColor: '#FFFFFF',
    glowColor: '#EF4444',
    glowRadius: 10,
    numberStrokeColor: '#000000',
    numberStrokeWidth: 4,
    numberGlowColor: '#EF4444',
    numberGlowRadius: 10
  },
  {
    id: 'scene-3',
    text: 'CRAZY ACTION',
    videoUrl: PRELOADED_VIDEOS[3].url,
    videoTitle: PRELOADED_VIDEOS[3].title,
    duration: 5,
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 4,
    fontSize: 32,
    fontFamily: 'Courier New',
    animation: 'none',
    x: 50,
    y: 72,
    overlayType: 'text',
    numberColor: '#22C55E',
    numberBgColor: '#000000',
    tableBgColor: 'rgba(0, 0, 0, 0.85)',
    tableBorderColor: '#22C55E',
    titleColor: '#FFFFFF',
    glowColor: '#22C55E',
    glowRadius: 10,
    numberStrokeColor: '#000000',
    numberStrokeWidth: 4,
    numberGlowColor: '#22C55E',
    numberGlowRadius: 10
  }
];

export default function ShortsEditor() {
  const [scenes, setScenes] = useState<VideoScene[]>(defaultScenes);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [headerText, setHeaderText] = useState('RANKING TOP MOMENTS');
  const [headerBgColor, setHeaderBgColor] = useState('#000000');
  const [headerTextColor, setHeaderTextColor] = useState('#FACC15');
  const [headerPaddingY, setHeaderPaddingY] = useState<number>(12);
  const [headerFontSize, setHeaderFontSize] = useState<number>(14);
  const [volume, setVolume] = useState(0.5);
  
  const [activeTab, setActiveTab] = useState<'clips' | 'styling' | 'smart'>('clips');
  const [themeInput, setThemeInput] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [videoHasError, setVideoHasError] = useState(false);
  const [useVirtualBackdrop, setUseVirtualBackdrop] = useState(false);

  // Stack/List specific custom layout configurations
  const [globalScale, setGlobalScale] = useState<number>(100);
  const [revealMode, setRevealMode] = useState<'reveal' | 'active-only' | 'show-all'>('reveal');
  const [numberingOrder, setNumberingOrder] = useState<'normal' | 'reversed' | 'random'>('normal');
  const [showCrown, setShowCrown] = useState<boolean>(true);
  const [verticalGap, setVerticalGap] = useState<number>(12);
  const [verticalPadding, setVerticalPadding] = useState<number>(4);

  const getDisplayedRank = (idx: number, total: number) => {
    if (numberingOrder === 'reversed') {
      return total - idx;
    }
    if (numberingOrder === 'random') {
      const arr = Array.from({ length: total }, (_, i) => i + 1);
      let seed = 12345;
      for (let i = arr.length - 1; i > 0; i--) {
        seed = (seed * 9301 + 49297) % 233280;
        const j = Math.floor((seed / 233280) * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      return arr[idx % total] || (idx + 1);
    }
    return idx + 1;
  };
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Drag states
  const [isDragging, setIsDragging] = useState(false);
  const [draggedType, setDraggedType] = useState<'text' | null>(null);

  const activeScene = scenes[currentSceneIndex] || scenes[0] || null;

  // Handle Playback Loop across scenes sequentially
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch((err) => {
        console.warn("Autoplay block prevented playing or source loaded: ", err);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, currentSceneIndex, activeScene?.videoUrl]);

  // Sync video volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume, currentSceneIndex]);

  // Video Events Listener for advancing scenes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!useVirtualBackdrop && !videoHasError) {
        setCurrentTime(video.currentTime);
        
        // If current scene duration reached, advance to next scene
        if (activeScene && video.currentTime >= activeScene.duration) {
          advanceToNextScene();
        }
      }
    };

    const handleEnded = () => {
      advanceToNextScene();
    };

    const handleError = () => {
      console.warn("Could not load direct video, enabling procedural canvas simulation.");
      setVideoHasError(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [currentSceneIndex, scenes, isPlaying, useVirtualBackdrop, videoHasError]);

  // Procedural Simulated Timer for Canvas Loop
  useEffect(() => {
    if (!isPlaying) return;

    if (useVirtualBackdrop || videoHasError) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const nextTime = prev + 0.1;
          if (activeScene && nextTime >= activeScene.duration) {
            advanceToNextScene();
            return 0;
          }
          return nextTime;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSceneIndex, useVirtualBackdrop, videoHasError, scenes]);

  // Canvas backdrop drawing loop (beautiful minimalist retro grid)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const draw = () => {
      ctx.fillStyle = '#09090b'; // zinc-950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Simple grid lines
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.1)'; // Yellow accent grid
      ctx.lineWidth = 1;

      if (isPlaying) {
        offset = (offset + 1.5) % 40;
      }

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines moving down
      for (let y = offset; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Backdrop status tag
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(10, canvas.height - 30, 110, 20);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '10px monospace';
      ctx.fillText('DEMO GRID MODE', 18, canvas.height - 16);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  const advanceToNextScene = () => {
    setCurrentSceneIndex((prev) => {
      if (prev < scenes.length - 1) {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
        setCurrentTime(0);
        return prev + 1;
      } else {
        // End of sequence: stop playback and rewind to index 0
        setIsPlaying(false);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
        setCurrentTime(0);
        return 0;
      }
    });
  };

  const playPrevScene = () => {
    setCurrentSceneIndex((prev) => {
      const target = prev > 0 ? prev - 1 : scenes.length - 1;
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      setCurrentTime(0);
      return target;
    });
  };

  const playNextScene = () => {
    setCurrentSceneIndex((prev) => {
      const target = prev < scenes.length - 1 ? prev + 1 : 0;
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      setCurrentTime(0);
      return target;
    });
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Dragging interaction
  const handleOverlayMouseDown = (e: React.MouseEvent, type: 'text') => {
    e.preventDefault();
    setIsDragging(true);
    setDraggedType(type);
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedType || !containerRef.current || !activeScene) return;

    const rect = containerRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    let pctX = Math.round((rawX / rect.width) * 100);
    let pctY = Math.round((rawY / rect.height) * 100);

    // Keep it bound
    pctX = Math.max(5, Math.min(95, pctX));
    pctY = Math.max(5, Math.min(95, pctY));

    setScenes((prev) =>
      prev.map((scene) => {
        if (draggedType === 'text') {
          return { ...scene, x: pctX, y: pctY };
        }
        return scene;
      })
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedType(null);
  };

  // Scene CRUD modifiers
  const addScene = () => {
    const newSceneItem: VideoScene = {
      id: `scene-${Date.now()}`,
      text: `BARU`,
      videoUrl: PRELOADED_VIDEOS[0].url,
      videoTitle: PRELOADED_VIDEOS[0].title,
      duration: 5,
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 4,
      fontSize: 32,
      fontFamily: 'Courier New',
      animation: 'none',
      x: 50,
      y: 72,
      overlayType: 'text',
      imageWidth: 80,
      numberColor: '#FACC15',
      numberBgColor: '#000000',
      tableBgColor: 'rgba(0, 0, 0, 0.85)',
      tableBorderColor: '#FACC15',
      titleColor: '#FFFFFF',
      glowColor: '#FACC15',
      glowRadius: 10,
      numberStrokeColor: '#000000',
      numberStrokeWidth: 4,
      numberGlowColor: '#FACC15',
      numberGlowRadius: 10
    };

    setScenes([...scenes, newSceneItem]);
    setCurrentSceneIndex(scenes.length);
    setCurrentTime(0);
  };

  const deleteScene = (id: string) => {
    if (scenes.length <= 1) return; // Must keep at least one scene
    const updated = scenes.filter((s) => s.id !== id);
    
    setScenes(updated);
    if (currentSceneIndex >= updated.length) {
      setCurrentSceneIndex(updated.length - 1);
    }
    setCurrentTime(0);
  };

  const moveScene = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === scenes.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newScenes = [...scenes];
    const temp = newScenes[index];
    newScenes[index] = newScenes[targetIndex];
    newScenes[targetIndex] = temp;

    setScenes(newScenes);
    setCurrentSceneIndex(targetIndex);
    setCurrentTime(0);
  };

  const updateActiveSceneField = (fields: Partial<VideoScene>) => {
    if (!activeScene) return;
    setScenes((prev) =>
      prev.map((s) => (s.id === activeScene.id ? { ...s, ...fields } : s))
    );
  };

  // Trigger Local File Upload for *specific active scene*
  const handleSceneVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeScene) {
      setVideoHasError(false);
      setUseVirtualBackdrop(false);
      const url = URL.createObjectURL(file);
      updateActiveSceneField({
        videoUrl: url,
        videoTitle: file.name
      });
      setIsPlaying(false);
      setCurrentTime(0);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, 50);
    }
  };

  // Fast style preset applicator
  const applyStylePresetToActiveScene = (presetId: string) => {
    const preset = TEXT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      updateActiveSceneField({
        color: preset.style.color,
        strokeColor: preset.style.strokeColor,
        strokeWidth: preset.style.strokeWidth,
        fontFamily: preset.style.fontFamily,
        fontSize: preset.style.fontSize
      });
    }
  };

  // Smart Planner Gemini generator
  const handleAIGenerateSequence = async () => {
    if (!themeInput.trim()) return;
    setIsGeneratingAI(true);
    setVideoHasError(false);
    try {
      const response = await fetch('/api/ai/suggest-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeInput })
      });
      const data = await response.json();

      if (data && data.items) {
        const generatedScenes: VideoScene[] = data.items.map((item: any, index: number) => {
          const videoTemplate = PRELOADED_VIDEOS[index % PRELOADED_VIDEOS.length];
          const primaryColor = index === 0 ? '#FACC15' : '#FFFFFF';
          const secondaryColor = index === 0 ? '#FACC15' : '#EF4444';
          return {
            id: `ai-scene-${index}-${Date.now()}`,
            text: item.text.toUpperCase(),
            videoUrl: videoTemplate.url,
            videoTitle: videoTemplate.title,
            duration: 5,
            color: '#FFFFFF',
            strokeColor: '#000000',
            strokeWidth: 4,
            fontSize: 32,
            fontFamily: 'Courier New',
            animation: 'none',
            x: 50,
            y: 72,
            overlayType: 'text',
            imageWidth: 80,
            numberColor: primaryColor,
            numberBgColor: '#000000',
            tableBgColor: 'rgba(0, 0, 0, 0.85)',
            tableBorderColor: secondaryColor,
            titleColor: '#FFFFFF',
            glowColor: secondaryColor,
            glowRadius: 10,
            numberStrokeColor: '#000000',
            numberStrokeWidth: 4,
            numberGlowColor: primaryColor,
            numberGlowRadius: 10
          };
        });

        setScenes(generatedScenes);
        setCurrentSceneIndex(0);
        setCurrentTime(0);
        if (data.headerTitle) {
          setHeaderText(data.headerTitle);
        }
      }
    } catch (err) {
      console.error("AI video planning failed: ", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Dynamic animation helper
  const getAnimationClass = (anim: string) => {
    switch (anim) {
      case 'bounce': return 'animate-[bounce_1.2s_infinite]';
      case 'pulse': return 'animate-[pulse_1.5s_infinite]';
      case 'wiggle': return 'hover:scale-110 active:scale-95 transition-transform duration-150';
      case 'shake': return 'animate-[ping_2s_infinite]';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto items-stretch h-[calc(100vh-140px)]">
      
      {/* 1. LEFT PANEL: CLEAN PORTRAIT PREVIEW GRID */}
      <div 
        id="shorts-mobile-wrapper"
        ref={containerRef}
        onMouseMove={handleContainerMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full lg:w-[380px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl select-none mx-auto flex-shrink-0 lg:h-full max-h-[680px]"
      >
        {/* Video Top Header Bar */}
        <div 
          className="absolute top-0 left-0 right-0 px-4 z-40 text-center font-bold tracking-wider select-none uppercase font-sans flex items-center justify-center gap-2 shadow-lg"
          style={{
            backgroundColor: headerBgColor,
            color: headerTextColor,
            paddingTop: `${headerPaddingY}px`,
            paddingBottom: `${headerPaddingY}px`
          }}
        >
          <span 
            className="w-full break-words whitespace-normal leading-tight block text-center"
            style={{
              fontSize: `${headerFontSize}px`
            }}
          >
            {headerText}
          </span>
        </div>

        {/* Backdrop Visual Player Area */}
        <div className="w-full h-full relative">
          {videoHasError || useVirtualBackdrop ? (
            <canvas
              ref={canvasRef}
              width={360}
              height={640}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              src={activeScene?.videoUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
              crossOrigin="anonymous"
              onLoadedMetadata={(e) => {
                const videoEl = e.currentTarget;
                if (videoEl.duration && !isNaN(videoEl.duration) && isFinite(videoEl.duration)) {
                  setScenes(prev => prev.map(s => s.id === activeScene.id ? { ...s, duration: videoEl.duration } : s));
                }
              }}
            />
          )}

          {/* Interactive Player Play overlay button */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer z-20"
            >
              <div className="w-14 h-14 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-transform transform hover:scale-105">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Render Active Scene's Joint Ranking Stack */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            {/* Draggable Joint Ranking List Stack */}
            {scenes.length > 0 && activeScene && (
              <div
                onMouseDown={(e) => handleOverlayMouseDown(e, 'text')}
                style={{
                  left: `${activeScene.x}%`,
                  top: `${activeScene.y}%`,
                  transform: `translate(-50%, -50%) scale(${globalScale / 100})`,
                  fontFamily: activeScene.fontFamily || 'Courier New',
                  gap: `${verticalGap}px`
                }}
                className="absolute pointer-events-auto select-none cursor-grab active:cursor-grabbing flex flex-col z-30 font-bold uppercase tracking-wide max-w-[90%] drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)]"
              >
                 {scenes.map((_, idx) => {
                  const targetSceneIndex = numberingOrder === 'reversed' ? (scenes.length - 1 - idx) : idx;
                  const scene = scenes[targetSceneIndex];
                  if (!scene) return null;

                  const isActive = targetSceneIndex === currentSceneIndex;

                  // Decide if this item's content is revealed according to revealMode
                  const isRevealed = 
                    revealMode === 'show-all' ||
                    (revealMode === 'reveal' && targetSceneIndex <= currentSceneIndex) ||
                    (revealMode === 'active-only' && isActive);

                  // Decide what text to show depending on revealMode
                  let displayedText = '';
                  if (isRevealed) {
                    displayedText = scene.text || '';
                  }

                  const displayRank = numberingOrder === 'reversed' ? (idx + 1) : getDisplayedRank(idx, scenes.length);

                  return (
                    <div
                      key={scene.id}
                      style={{
                        transform: isActive ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.2s ease-out',
                        opacity: isActive ? 1 : 0.85,
                        paddingTop: `${verticalPadding}px`,
                        paddingBottom: `${verticalPadding}px`
                      }}
                      className="flex items-center gap-3 select-none"
                    >
                      {/* Rank Number Text with Outward Outline */}
                      <span
                        style={{
                          position: 'relative',
                          display: 'inline-block',
                          fontSize: `${scene.fontSize * 1.1}px`,
                          WebkitTextStroke: `${scene.numberStrokeWidth ?? 4}px ${scene.numberStrokeColor ?? '#000000'}`,
                          color: scene.numberStrokeColor ?? '#000000',
                          textShadow: `
                            0 0 ${scene.numberGlowRadius ?? 10}px ${scene.numberGlowColor ?? '#FACC15'},
                            0 0 ${(scene.numberGlowRadius ?? 10) / 2}px ${scene.numberGlowColor ?? '#FACC15'},
                            2px 2px 3px rgba(0,0,0,0.9)
                          `,
                          fontWeight: '900'
                        }}
                        className="font-mono font-black select-none"
                      >
                        {/* Background Stroke Layer */}
                        {displayRank}.
                        {/* Foreground Solid Fill Layer */}
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            color: scene.numberColor || '#FACC15',
                            WebkitTextStroke: '0px transparent',
                            textShadow: 'none',
                            fontWeight: '900'
                          }}
                        >
                          {displayRank}.
                        </span>
                      </span>

                      {/* Content Overlay: Text or Image */}
                      {scene.overlayType === 'image' ? (
                        scene.imageUrl ? (
                          <div 
                            style={{
                              position: 'relative',
                              display: 'inline-block',
                              width: `${scene.imageWidth || 80}px`,
                              opacity: isRevealed ? 1 : 0,
                              transition: 'opacity 0.2s ease-out'
                            }}
                          >
                            <img
                              src={scene.imageUrl}
                              alt={scene.text || "Clip Image"}
                              style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '6px',
                                border: `2px solid ${scene.strokeColor || '#000000'}`,
                                boxShadow: `0 0 ${scene.glowRadius ?? 10}px ${scene.glowColor ?? '#FFFFFF'}`
                              }}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : null
                      ) : (
                        <span
                          style={{
                            position: 'relative',
                            display: 'inline-block',
                            fontSize: `${scene.fontSize}px`,
                            WebkitTextStroke: `${scene.strokeWidth ?? 4}px ${scene.strokeColor || '#000000'}`,
                            color: scene.strokeColor || '#000000',
                            textShadow: `
                              0 0 ${scene.glowRadius ?? 10}px ${scene.glowColor ?? '#FFFFFF'},
                              0 0 ${(scene.glowRadius ?? 10) / 2}px ${scene.glowColor ?? '#FFFFFF'},
                              2px 2px 3px rgba(0,0,0,0.9)
                            `,
                            fontWeight: '900'
                          }}
                          className="whitespace-nowrap font-black select-none"
                        >
                          {/* Background Stroke Layer */}
                          {displayedText || <span className="opacity-0">Placeholder</span>}
                          {/* Foreground Solid Fill Layer */}
                          {displayedText && (
                            <span
                              style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                color: scene.titleColor || scene.color || '#FFFFFF',
                                WebkitTextStroke: '0px transparent',
                                textShadow: 'none',
                                fontWeight: '900'
                              }}
                            >
                              {displayedText}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Minimalist Bottom Player Progress & Controls */}
        <div className="absolute bottom-4 left-4 right-4 z-40 bg-zinc-950/90 p-3 rounded-xl border border-zinc-800 flex flex-col gap-2">
          {/* Progress Timeline Indicator */}
          {activeScene && (
            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
              <span>Scene {currentSceneIndex + 1}/{scenes.length}</span>
              <span>{currentTime.toFixed(1)}s / {activeScene.duration}s</span>
            </div>
          )}

          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden w-full">
            {activeScene && (
              <div 
                className="h-full bg-yellow-400 transition-all duration-100"
                style={{ width: `${Math.min(100, (currentTime / activeScene.duration) * 100)}%` }}
              />
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button 
                onClick={playPrevScene}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                title="Previous Scene"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button 
                onClick={togglePlay} 
                className="p-1.5 bg-yellow-400 hover:bg-yellow-300 rounded text-black font-bold"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
              </button>

              <button 
                onClick={playNextScene}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                title="Next Scene"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button 
                onClick={handleRestart}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                title="Restart Track"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick volume */}
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
              <input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-12 h-1 accent-yellow-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT PANEL: SCENE EDITOR TABS */}
      <div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl flex-1 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/50">
          <button
            onClick={() => setActiveTab('clips')}
            className={`flex-1 py-3 text-xs md:text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'clips' ? 'border-yellow-400 text-yellow-400 bg-zinc-900/40' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Video className="w-4 h-4" />
            Manage Clips
          </button>
          <button
            onClick={() => setActiveTab('styling')}
            className={`flex-1 py-3 text-xs md:text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'styling' ? 'border-yellow-400 text-yellow-400 bg-zinc-900/40' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TypeIcon className="w-4 h-4" />
            Text & Style
          </button>
          <button
            onClick={() => setActiveTab('smart')}
            className={`flex-1 py-3 text-xs md:text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'smart' ? 'border-yellow-400 text-yellow-400 bg-zinc-900/40' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Smart Planner
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          
          {/* TAB: CLIPS SEQUENCE */}
          {activeTab === 'clips' && (
            <div className="space-y-5">
              
              {/* Header Title Banner Editor */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Header Title Banner
                </span>
                <input
                  type="text"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  placeholder="e.g. RANKING TOP CLIPS"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1">Banner Color</label>
                    <input
                      type="color"
                      value={headerBgColor}
                      onChange={(e) => setHeaderBgColor(e.target.value)}
                      className="w-full h-8 rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1">Title Color</label>
                    <input
                      type="color"
                      value={headerTextColor}
                      onChange={(e) => setHeaderTextColor(e.target.value)}
                      className="w-full h-8 rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-900/50">
                  <div>
                    <label className="text-[10px] text-zinc-500 flex justify-between mb-1">
                      <span>Tinggi Banner</span>
                      <span className="text-zinc-400 font-mono">{headerPaddingY}px</span>
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="80"
                      value={headerPaddingY}
                      onChange={(e) => setHeaderPaddingY(parseInt(e.target.value))}
                      className="w-full accent-yellow-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 flex justify-between mb-1">
                      <span>Ukuran Font</span>
                      <span className="text-zinc-400 font-mono">{headerFontSize}px</span>
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="36"
                      value={headerFontSize}
                      onChange={(e) => setHeaderFontSize(parseInt(e.target.value))}
                      className="w-full accent-yellow-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Clip List header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                  Sequence Clips & Text ({scenes.length})
                </span>
                <button
                  onClick={addScene}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  Add Clip
                </button>
              </div>

              {/* Render each scene card */}
              <div className="space-y-4">
                {scenes.map((scene, index) => {
                  const isActive = index === currentSceneIndex;
                  return (
                    <div
                      key={scene.id}
                      onClick={() => {
                        if (!isActive) {
                          setCurrentSceneIndex(index);
                          setCurrentTime(0);
                        }
                      }}
                      className={`p-4 rounded-xl border text-sm transition-all relative ${
                        isActive 
                          ? 'bg-zinc-950 border-yellow-400 shadow-lg' 
                          : 'bg-zinc-950/60 border-zinc-800 hover:bg-zinc-850'
                      }`}
                    >
                      {/* Badge / Index counter */}
                      <div className="flex items-center justify-between mb-3 border-b border-zinc-800/60 pb-2">
                        <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                          isActive ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          CLIP #{index + 1} {isActive ? '(ACTIVE)' : ''}
                        </span>

                        {/* Control actions */}
                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => moveScene(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-zinc-800 rounded disabled:opacity-30 text-zinc-400 hover:text-zinc-200"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveScene(index, 'down')}
                            disabled={index === scenes.length - 1}
                            className="p-1 hover:bg-zinc-800 rounded disabled:opacity-30 text-zinc-400 hover:text-zinc-200"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteScene(scene.id)}
                            disabled={scenes.length <= 1}
                            className="p-1 hover:bg-zinc-800 rounded disabled:opacity-30 text-red-400 hover:text-red-300"
                            title="Delete Clip"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Input fields */}
                      <div className="space-y-3" onClick={e => e.stopPropagation()}>
                        
                        {/* Overlay Type Switcher */}
                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Tipe Overlay</label>
                          <div className="grid grid-cols-2 gap-1 p-0.5 bg-zinc-900 rounded border border-zinc-800">
                            <button
                              type="button"
                              onClick={() => {
                                setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, overlayType: 'text' } : s));
                              }}
                              className={`py-1 text-[10px] font-bold rounded transition-all ${
                                !scene.overlayType || scene.overlayType === 'text'
                                  ? 'bg-yellow-400 text-black'
                                  : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
                              }`}
                            >
                              Teks Overlay
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, overlayType: 'image' } : s));
                              }}
                              className={`py-1 text-[10px] font-bold rounded transition-all ${
                                scene.overlayType === 'image'
                                  ? 'bg-yellow-400 text-black'
                                  : 'text-zinc-400 hover:text-zinc-200 bg-transparent'
                              }`}
                            >
                              Gambar Overlay
                            </button>
                          </div>
                        </div>

                        {!scene.overlayType || scene.overlayType === 'text' ? (
                          <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Isi Teks Overlay</label>
                            <input
                              type="text"
                              value={scene.text}
                              onChange={(e) => {
                                setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, text: e.target.value } : s));
                              }}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-yellow-400"
                              placeholder="Ketik teks overlay di sini..."
                            />
                          </div>
                        ) : (
                          <div className="space-y-2 bg-zinc-900/30 p-2.5 rounded border border-zinc-850">
                            <div>
                              <label className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Link Gambar (URL)</label>
                              <input
                                type="text"
                                value={scene.imageUrl || ''}
                                onChange={(e) => {
                                  setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, imageUrl: e.target.value } : s));
                                }}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-[11px] text-zinc-200 focus:outline-none focus:border-yellow-400"
                                placeholder="Paste URL gambar..."
                              />
                            </div>

                            <div className="flex gap-2">
                              <label className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded px-2 py-1 cursor-pointer flex items-center justify-center gap-1.5 text-[10px] text-zinc-300 transition-all">
                                <Upload className="w-3 h-3 text-yellow-400" />
                                <span>Upload Gambar</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        if (event.target?.result) {
                                          setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, imageUrl: event.target?.result as string } : s));
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>

                              {scene.imageUrl && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, imageUrl: '' } : s));
                                  }}
                                  className="px-2 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-red-400 rounded text-[10px] font-bold transition-all"
                                >
                                  Hapus
                                </button>
                              )}
                            </div>

                            <div>
                              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                                <span>Lebar Gambar</span>
                                <span className="text-zinc-300">{scene.imageWidth || 80}px</span>
                              </div>
                              <input
                                type="range"
                                min="20"
                                max="200"
                                step="5"
                                value={scene.imageWidth || 80}
                                onChange={(e) => {
                                  const widthVal = parseInt(e.target.value);
                                  setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, imageWidth: widthVal } : s));
                                }}
                                className="w-full accent-yellow-400 cursor-pointer"
                              />
                            </div>
                          </div>
                        )}

                        {/* Scene duration display */}
                        <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase font-mono bg-zinc-900/40 p-2 rounded border border-zinc-850">
                          <span>Durasi Video</span>
                          <span className="text-yellow-400 font-bold font-sans">
                            {scene.duration ? `${scene.duration.toFixed(1)}s` : 'Mendeteksi...'}
                          </span>
                        </div>

                        {/* Clip Video source chooser */}
                        <div className="pt-2 border-t border-zinc-900 space-y-2">
                          <span className="text-[10px] text-zinc-500 uppercase font-mono block">Video Source Backdrop</span>
                          <div className="grid grid-cols-4 gap-1.5">
                            {PRELOADED_VIDEOS.map((v) => {
                              const isSelected = scene.videoUrl === v.url;
                              return (
                                <button
                                  key={v.id}
                                  onClick={() => {
                                    setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, videoUrl: v.url, videoTitle: v.title } : s));
                                  }}
                                  className={`relative h-10 rounded overflow-hidden border ${
                                    isSelected ? 'border-yellow-400 ring-1 ring-yellow-400' : 'border-zinc-800 hover:border-zinc-700'
                                  }`}
                                  title={v.title}
                                >
                                  <img src={v.thumbnail} className="w-full h-full object-cover" />
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex gap-2">
                            <input 
                              type="file"
                              id={`scene-file-input-${scene.id}`}
                              onChange={handleSceneVideoUpload}
                              accept="video/mp4,video/webm"
                              className="hidden"
                            />
                            <button
                              onClick={() => {
                                document.getElementById(`scene-file-input-${scene.id}`)?.click();
                              }}
                              className="flex-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 text-[10px] py-1 px-2 rounded flex items-center justify-center gap-1"
                            >
                              <Upload className="w-3 h-3" />
                              Upload Local Video
                            </button>
                            
                            {scene.videoTitle && (
                              <div className="text-[9px] text-zinc-500 font-mono self-center truncate max-w-[120px]" title={scene.videoTitle}>
                                {scene.videoTitle}
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Virtual Backdrop Switch */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-300 block">Gameplay Canvas Simulator</span>
                  <p className="text-[10px] text-zinc-500 leading-tight">Use this custom animated layout if direct video loops fail to load.</p>
                </div>
                <button
                  onClick={() => {
                    setUseVirtualBackdrop(!useVirtualBackdrop);
                    setVideoHasError(false);
                  }}
                  className={`text-xs px-3 py-1.5 font-bold rounded-lg transition-all ${
                    useVirtualBackdrop ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {useVirtualBackdrop ? 'ON' : 'OFF'}
                </button>
              </div>

            </div>
          )}

          {/* TAB: TEXT STYLING */}
          {activeTab === 'styling' && (
            <div className="space-y-5">
              {activeScene ? (
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-4">
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block">
                    Active Slide Text Styling
                  </span>

                  {/* GLOBAL LIST CONFIGURATIONS */}
                  <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-850 space-y-3">
                    <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                      ⚙️ Pengaturan Global List / Canvas
                    </span>
                    
                    <div>
                      <div className="flex justify-between text-xs text-zinc-400 mb-1">
                        <span>Skala List ({globalScale}%)</span>
                        <span className="text-yellow-400 font-bold font-mono">mefit list</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="180"
                        value={globalScale}
                        onChange={(e) => setGlobalScale(parseInt(e.target.value))}
                        className="w-full accent-yellow-400 cursor-pointer"
                      />
                    </div>

                    {/* Customizable Vertical Spacing ("keleveran") Controls */}
                    <div className="grid grid-cols-2 gap-4 pt-1 border-t border-zinc-800/40">
                      <div>
                        <div className="flex justify-between text-xs text-zinc-400 mb-1">
                          <span>Jarak Baris ({verticalGap}px)</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={verticalGap}
                          onChange={(e) => setVerticalGap(parseInt(e.target.value))}
                          className="w-full accent-yellow-400 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-zinc-400 mb-1">
                          <span>Tinggi Baris ({verticalPadding}px)</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={verticalPadding}
                          onChange={(e) => setVerticalPadding(parseInt(e.target.value))}
                          className="w-full accent-yellow-400 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-800/40">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Metode Reveal Text</label>
                        <select
                          value={revealMode}
                          onChange={(e) => setRevealMode(e.target.value as any)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-zinc-200 text-xs focus:outline-none"
                        >
                          <option value="reveal">Bertahap (Reveal)</option>
                          <option value="show-all">Tampilkan Semua</option>
                          <option value="active-only">Hanya Slide Aktif</option>
                        </select>
                      </div>

                      <div className="flex flex-col justify-end">
                        <button
                          onClick={() => setShowCrown(!showCrown)}
                          className={`text-xs font-bold py-1.5 px-3 rounded border transition-all ${
                            showCrown 
                              ? 'bg-yellow-400/10 border-yellow-400/40 text-yellow-400 font-sans' 
                              : 'bg-zinc-950 border-zinc-800 text-zinc-500 font-sans'
                          }`}
                        >
                          👑 Mahkota Rank 1: {showCrown ? 'ON' : 'OFF'}
                        </button>
                      </div>
                         <div className="pt-2.5 border-t border-zinc-800/40 space-y-2">
                      <label className="text-xs text-zinc-400 block">
                        🔢 Pola Nomor & Urutan Ranking:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setNumberingOrder('normal')}
                          className={`text-[11px] font-bold py-1 px-2 rounded border transition-all ${
                            numberingOrder === 'normal'
                              ? 'bg-yellow-400 text-black border-yellow-400'
                              : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          1 s/d N
                        </button>
                        
                        <button
                          onClick={() => setNumberingOrder('random')}
                          className={`text-[11px] font-bold py-1 px-2 rounded border transition-all ${
                            numberingOrder === 'random'
                              ? 'bg-yellow-400 text-black border-yellow-400'
                              : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Acak
                        </button>

                        <button
                          onClick={() => setNumberingOrder('reversed')}
                          className={`text-[11px] font-bold py-1 px-2 rounded border transition-all ${
                            numberingOrder === 'reversed'
                              ? 'bg-yellow-400 text-black border-yellow-400'
                              : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          N s/d 1
                        </button>
                      </div>
                      <p className="text-[10px] text-zinc-500 italic mt-1 leading-tight">
                        {numberingOrder === 'normal' && "✨ Nomor urut standar dari atas ke bawah (Rank 1 s/d 5)."}
                        {numberingOrder === 'random' && "🎲 Urutan acak untuk variasi menarik."}
                        {numberingOrder === 'reversed' && "🔄 Countdown dari bawah ke atas: label nomor tetap (1 di atas, 5 di bawah) tapi urutan main/highlight berjalan dari bawah ke atas."}
                      </p>
                    </div>
                  </div>
                  </div>

                  {/* Text visual design style presets fast loader */}
                  <div>
                    <label className="text-xs text-zinc-400 block mb-2">Preset Quick Design Styles</label>
                    <div className="flex flex-wrap gap-2">
                      {TEXT_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => applyStylePresetToActiveScene(preset.id)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 transition-all"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 1: KUSTOMISASI NOMOR URUT */}
                  <div className="border-t border-zinc-900 pt-3 space-y-3">
                    <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wide block">
                      🔢 Desain Nomor Urut (1., 2., 3...)
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Warna Nomor</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeScene.numberColor || '#FACC15'}
                            onChange={(e) => updateActiveSceneField({ numberColor: e.target.value })}
                            className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
                          />
                          <span className="text-xs font-mono text-zinc-400">{activeScene.numberColor || '#FACC15'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Warna Outline Nomor</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeScene.numberStrokeColor || '#000000'}
                            onChange={(e) => updateActiveSceneField({ numberStrokeColor: e.target.value })}
                            className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
                          />
                          <span className="text-xs font-mono text-zinc-400">{activeScene.numberStrokeColor || '#000000'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Ketebalan Outline ({activeScene.numberStrokeWidth ?? 4}px)</label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={activeScene.numberStrokeWidth ?? 4}
                          onChange={(e) => updateActiveSceneField({ numberStrokeWidth: parseInt(e.target.value) })}
                          className="w-full accent-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Radius Glow ({activeScene.numberGlowRadius ?? 10}px)</label>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={activeScene.numberGlowRadius ?? 10}
                          onChange={(e) => updateActiveSceneField({ numberGlowRadius: parseInt(e.target.value) })}
                          className="w-full accent-yellow-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Warna Glow Nomor</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeScene.numberGlowColor || '#FACC15'}
                          onChange={(e) => updateActiveSceneField({ numberGlowColor: e.target.value })}
                          className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
                        />
                        <span className="text-xs font-mono text-zinc-400">{activeScene.numberGlowColor || '#FACC15'}</span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: KUSTOMISASI JUDUL */}
                  <div className="border-t border-zinc-900 pt-3 space-y-3">
                    <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wide block">
                      📝 Desain Teks Judul
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Warna Judul</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeScene.titleColor || activeScene.color || '#FFFFFF'}
                            onChange={(e) => updateActiveSceneField({ titleColor: e.target.value, color: e.target.value })}
                            className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
                          />
                          <span className="text-xs font-mono text-zinc-400">{activeScene.titleColor || activeScene.color || '#FFFFFF'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Warna Outline Judul</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeScene.strokeColor || '#000000'}
                            onChange={(e) => updateActiveSceneField({ strokeColor: e.target.value })}
                            className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
                          />
                          <span className="text-xs font-mono text-zinc-400">{activeScene.strokeColor || '#000000'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Ketebalan Outline ({activeScene.strokeWidth ?? 4}px)</label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={activeScene.strokeWidth ?? 4}
                          onChange={(e) => updateActiveSceneField({ strokeWidth: parseInt(e.target.value) })}
                          className="w-full accent-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Radius Glow ({activeScene.glowRadius ?? 10}px)</label>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={activeScene.glowRadius ?? 10}
                          onChange={(e) => updateActiveSceneField({ glowRadius: parseInt(e.target.value) })}
                          className="w-full accent-yellow-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Warna Glow Judul</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeScene.glowColor || '#FFFFFF'}
                          onChange={(e) => updateActiveSceneField({ glowColor: e.target.value })}
                          className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
                        />
                        <span className="text-xs font-mono text-zinc-400">{activeScene.glowColor || '#FFFFFF'}</span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: UKURAN FONT & FAMILY */}
                  <div className="border-t border-zinc-900 pt-3">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide block mb-2">
                      📐 Ukuran Global & Jenis Font
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-zinc-500 block mb-1">Ukuran Font ({activeScene.fontSize}px)</label>
                        <input
                          type="range"
                          min="16"
                          max="64"
                          value={activeScene.fontSize}
                          onChange={(e) => updateActiveSceneField({ fontSize: parseInt(e.target.value) })}
                          className="w-full accent-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-zinc-500 block mb-1">Jenis Font</label>
                        <select
                          value={activeScene.fontFamily}
                          onChange={(e) => updateActiveSceneField({ fontFamily: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 text-xs focus:outline-none font-sans"
                        >
                          <option value="Courier New">Retro (Courier)</option>
                          <option value="Bebas Neue">Shorts Bold (Bebas)</option>
                          <option value="Bangers">Comic (Bangers)</option>
                          <option value="Space Grotesk">Tech (Space Grotesk)</option>
                          <option value="system-ui">Default Sans</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-500 text-center italic leading-relaxed pt-2 border-t border-zinc-900">
                    💡 Petunjuk: Anda dapat menggeser posisi Tabel Ranking dan Emoji langsung di layar pratinjau kiri.
                  </div>

                </div>
              ) : (
                <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center text-zinc-500 text-xs">
                  Please select or add a clip first.
                </div>
              )}
            </div>
          )}

          {/* TAB: SMART PLANNER */}
          {activeTab === 'smart' && (
            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wide">
                  <Sparkles className="w-4 h-4" />
                  AI Topic Sequence Planner
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Enter a ranking theme (e.g., "fastest cars", "scariest ghosts", "cute kittens"). Gemini will plan the text titles, emojis, and allocate background videos automatically.
                </p>

                <div className="space-y-3 pt-1">
                  <input
                    type="text"
                    value={themeInput}
                    onChange={(e) => setThemeInput(e.target.value)}
                    placeholder="e.g. delicious fruits"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
                  />

                  <button
                    onClick={handleAIGenerateSequence}
                    disabled={isGeneratingAI || !themeInput.trim()}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold py-2.5 px-4 rounded-lg text-xs transition-all flex items-center justify-center gap-2"
                  >
                    {isGeneratingAI ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Generating video sequence...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Plan Sequence Clips
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
