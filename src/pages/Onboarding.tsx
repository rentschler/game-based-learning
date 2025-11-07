import { useState, useEffect, useRef } from 'react';
import { MapPin, Camera, Sparkles, CheckCircle, Star, Trophy } from 'lucide-react';

// Assets
const logoImage = new URL('../assets/oboarding/logo.png', import.meta.url).href;
const oldBridgeScan = new URL('../assets/old_bridge_scan.jpg', import.meta.url).href;
const trodnheimImage = new URL('../assets/trodnheim.jpg', import.meta.url).href;

interface OnboardingProps {
  onComplete: () => void;
}

type Scene = 0 | 1 | 2 | 3;
type ScanningState = 'initializing' | 'scanning' | 'recognizing' | 'discovered';

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene>(0);
  const [isSkipped, setIsSkipped] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [scanningState, setScanningState] = useState<ScanningState>('initializing');
  const [scanProgress, setScanProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWaterSplash, setShowWaterSplash] = useState(false);
  const sceneTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle tap/click
  const handleTap = () => {
    if (!isPlaying) {
      // First tap: start playing
      setIsPlaying(true);
      setTapCount(1);
    } else {
      // Second tap: skip
      setIsSkipped(true);
      if (sceneTimeoutRef.current) {
        clearTimeout(sceneTimeoutRef.current);
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      // Trigger water splash transition
      setShowWaterSplash(true);
      // Complete after splash animation
      setTimeout(() => {
        onComplete();
      }, 800);
    }
  };

  // Scene progression
  useEffect(() => {
    if (!isPlaying || isSkipped) return;

    // Scene 0: 0-3s
    if (currentScene === 0) {
      sceneTimeoutRef.current = setTimeout(() => {
        setCurrentScene(1);
      }, 3000);
    }
    // Scene 1: 3-7s
    else if (currentScene === 1) {
      sceneTimeoutRef.current = setTimeout(() => {
        setCurrentScene(2);
      }, 4000);
    }
    // Scene 2: 7-11s - AR Scanning animation
    else if (currentScene === 2) {
      // Reset scanning state when scene starts
      setScanningState('initializing');
      setScanProgress(0);
      setShowConfetti(false);

      // Start scanning sequence (accelerated for 4 seconds)
      const sequence = async () => {
        // Initializing: 0.5s
        await new Promise(resolve => setTimeout(resolve, 500));
        setScanningState('scanning');

        // Scanning with progress: 1.5s
        scanIntervalRef.current = setInterval(() => {
          setScanProgress(prev => {
            if (prev >= 100) {
              if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current);
              }
              return 100;
            }
            return prev + (100 / 15); // Complete in ~1.5s (15 steps at ~100ms each)
          });
        }, 100);

        await new Promise(resolve => setTimeout(resolve, 1500));
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
        }
        setScanProgress(100);

        // Recognition: 1s
        setScanningState('recognizing');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Discovery unlocked: 1s
        setScanningState('discovered');
        setShowConfetti(true);
      };

      sequence();

      sceneTimeoutRef.current = setTimeout(() => {
        setCurrentScene(3);
      }, 4000);
    }
    // Scene 3: 11-15s
    else if (currentScene === 3) {
      sceneTimeoutRef.current = setTimeout(() => {
        // Trigger water splash transition (after 5 seconds total)
        setShowWaterSplash(true);
        // Complete after splash animation
        setTimeout(() => {
          onComplete();
        }, 800);
      }, 5000);
    }

    return () => {
      if (sceneTimeoutRef.current) {
        clearTimeout(sceneTimeoutRef.current);
      }
    };
  }, [isPlaying, currentScene, isSkipped, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sceneTimeoutRef.current) {
        clearTimeout(sceneTimeoutRef.current);
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 z-[100] cursor-pointer"
      onClick={handleTap}
      style={{
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(251, 191, 36, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(14, 165, 233, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)
        `
      }}
    >
      {/* Parchment texture overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3' /%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Scene 0: Logo & Title (0-3s) */}
      {currentScene === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Compass lines animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border-2 border-amber-500/20"
                style={{
                  width: `${100 + i * 40}px`,
                  height: `${100 + i * 40}px`,
                  animation: `compassRotate ${3 + i * 0.5}s linear infinite`,
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0.3 - i * 0.03
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <div className="relative z-10">
            <img 
              src={logoImage} 
              alt="GeoScout Logo" 
              className={`w-32 h-32 md:w-48 md:h-48 ${
                isPlaying ? 'animate-logoBloom' : 'opacity-0 scale-75'
              }`}
              style={{
                transition: isPlaying ? 'none' : 'all 0.3s'
              }}
            />
          </div>

          {/* Title */}
          <div 
            className="mt-8 text-center"
            style={{
              opacity: isPlaying ? 1 : 0,
              transform: isPlaying ? 'translateY(0)' : 'translateY(1rem)',
              transition: isPlaying ? 'opacity 1.2s ease-out 0.5s, transform 1.2s ease-out 0.5s' : 'none'
            }}
          >
            <h1 className="text-4xl md:text-6xl font-serif text-amber-900 mb-2">GeoScout</h1>
            <p className="text-lg md:text-xl text-amber-700 italic">Discover. Learn. Explore.</p>
          </div>

          {/* Tap to start hint */}
          {!isPlaying && (
            <div className="absolute bottom-20 animate-pulse">
              <p className="text-amber-800/70 text-sm">Tap to start</p>
            </div>
          )}
        </div>
      )}

      {/* Scene 1: Map Exploration (3-7s) */}
      {currentScene === 1 && (
        <div className="absolute inset-0 overflow-hidden animate-fadeIn">
          {/* Map background with watercolor effect */}
          <div 
            className="absolute inset-0 transition-transform duration-4000"
            style={{
              background: `
                radial-gradient(ellipse 400px 300px at 45% 40%, rgba(147, 197, 114, 0.4) 0%, transparent 60%),
                radial-gradient(ellipse 350px 350px at 65% 25%, rgba(173, 216, 230, 0.3) 0%, transparent 60%),
                radial-gradient(ellipse 300px 300px at 55% 50%, rgba(100, 100, 100, 0.2) 0%, transparent 60%)
              `,
              transform: 'translateX(-10%) translateY(-5%)',
              animation: 'mapPan 4s ease-in-out'
            }}
          />

          {/* Map pins */}
          {[
            { x: 20, y: 30, delay: 0 },
            { x: 60, y: 20, delay: 300 },
            { x: 80, y: 50, delay: 600 },
            { x: 40, y: 70, delay: 900 },
            { x: 15, y: 50, delay: 1200 }
          ].map((pin, idx) => (
            <div
              key={idx}
              className="absolute"
              style={{
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                animation: `pinFadeIn 1s ease-out forwards`,
                animationDelay: `${pin.delay}ms`,
                opacity: 0
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                <div className="relative w-8 h-8 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                  <MapPin className="w-5 h-5 text-white" fill="white" />
                </div>
              </div>
            </div>
          ))}

          {/* Text overlays */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div 
              className="text-center mb-4"
              style={{
                animation: 'textSlideIn 1s ease-out forwards',
                animationDelay: '1s',
                opacity: 0
              }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-amber-900 mb-2">EXPLORE the World!</h2>
            </div>
            <div 
              className="text-center"
              style={{
                animation: 'textSlideIn 1s ease-out forwards',
                animationDelay: '2s',
                opacity: 0
              }}
            >
              <h3 className="text-2xl md:text-4xl font-semibold text-amber-800">LEARN History, Art & Culture!</h3>
            </div>
          </div>
        </div>
      )}

      {/* Scene 2: AR Scanning (7-11s) */}
      {currentScene === 2 && (
        <div className="absolute inset-0 bg-black animate-fadeIn">
          {/* AR Camera View Simulation */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            {/* Camera feed simulation */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  scanningState === 'scanning'
                    ? `url('${trodnheimImage}')`
                    : scanningState === 'recognizing'
                    ? 'none'
                    : 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05" /%3E%3C/svg%3E")',
                backgroundSize: scanningState === 'scanning' ? 'cover' : undefined,
                backgroundPosition: scanningState === 'scanning' ? 'center' : undefined,
                animation: scanningState === 'scanning' || scanningState === 'recognizing' ? undefined : 'grain 0.5s steps(10) infinite'
              }}
            />
            
            {/* Scanning Grid Overlay */}
            {(scanningState === 'scanning' || scanningState === 'recognizing') && (
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-12 opacity-30">
                {Array.from({ length: 96 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="border border-cyan-400"
                    style={{
                      animation: `pulse ${Math.random() * 2 + 1}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 0.5}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Center Content - State dependent */}
          <div className="absolute inset-0 flex items-center justify-center">
            {scanningState === 'initializing' && (
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">Initializing AR Camera...</p>
              </div>
            )}

            {scanningState === 'scanning' && (
              <div className="text-center px-6">
                {/* Target Reticle */}
                <div className="relative w-64 h-64 mx-auto mb-6">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-cyan-400 animate-pulse" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-cyan-400 animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-cyan-400 animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-cyan-400 animate-pulse" />
                  
                  {/* Center crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                  </div>
                  
                  {/* Scanning line */}
                  <div 
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    style={{
                      top: `${scanProgress}%`,
                      transition: 'top 0.1s linear'
                    }}
                  />
                </div>
                
                <p className="text-white text-xl mb-2">Use the scanner to unlock new landmarks</p>
                <p className="text-cyan-400 text-sm mb-4">Point camera at landmark</p>
                
                {/* Progress bar */}
                <div className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-white/70 text-sm mt-2">{Math.round(scanProgress)}%</p>
              </div>
            )}

            {scanningState === 'recognizing' && (
              <div className="text-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Sparkles className="w-12 h-12 text-white animate-spin" />
                  </div>
                  {/* Ripple effect */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-cyan-400/50 animate-ping" />
                  </div>
                </div>
                <p className="text-white text-xl">Identifying landmark...</p>
                <p className="text-cyan-400 text-sm mt-2">Matching with database</p>
              </div>
            )}

            {scanningState === 'discovered' && (
              <div className="text-center px-6 relative">
                {/* Confetti Animation */}
                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          left: `${50 + (Math.random() - 0.5) * 60}%`,
                          top: `${50}%`,
                          backgroundColor: ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
                          animation: `confetti ${1 + Math.random()}s ease-out forwards`,
                          animationDelay: `${Math.random() * 0.5}s`
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {/* Success Icon */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-yellow-400/20 animate-ping" />
                  </div>
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto shadow-2xl">
                    <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
                  </div>
                </div>
                
                {/* Discovery Text */}
                <h2 className="text-4xl font-bold text-white mb-2 animate-bounce">
                  Unlock new Discoveries
                </h2>
                
                {/* Rewards */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-yellow-400">
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-bold text-xl">+50 XP</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-purple-400 inline-block mt-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">🏛️ History Scholar</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Watercolor glow effect overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at center, rgba(251, 191, 36, 0.2) 0%, transparent 70%),
                radial-gradient(circle at center, rgba(14, 165, 233, 0.15) 0%, transparent 60%)
              `,
              animation: 'watercolorBloom 4s ease-in-out'
            }}
          />
        </div>
      )}

      {/* Scene 3: Museum Journal (11-15s) */}
      {currentScene === 3 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 animate-fadeIn">
          {/* Sketchbook background */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #fef3c7 60%, #fde68a 100%)
              `,
              opacity: 0.8
            }}
          />

          {/* Watercolor cards */}
          <div className="relative z-10 w-full max-w-2xl">
            {[
              { name: 'City Hall', delay: 0 },
              { name: 'Art Museum', delay: 200 },
              { name: 'Botanical Garden', delay: 400 }
            ].map((card, idx) => (
              <div
                key={idx}
                className="mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-amber-200 shadow-lg"
                style={{
                  animation: 'cardSlideIn 0.8s ease-out forwards',
                  animationDelay: `${card.delay}ms`,
                  opacity: 0,
                  transform: 'translateX(-100px)'
                }}
              >
                <h3 className="text-xl font-serif text-amber-900">{card.name}</h3>
              </div>
            ))}
          </div>

          {/* Badges and XP icons */}
          <div className="relative z-10 flex gap-4 mt-8">
            {['🏛️', '⚔️', '🏗️', '🎨'].map((badge, idx) => (
              <div
                key={idx}
                className="text-4xl"
                style={{
                  animation: 'shimmer 2s ease-in-out infinite',
                  animationDelay: `${idx * 200}ms`
                }}
              >
                {badge}
              </div>
            ))}
            <div 
              className="text-amber-600 font-bold text-xl"
              style={{
                animation: 'shimmer 2s ease-in-out infinite',
                animationDelay: '800ms'
              }}
            >
              +50 XP
            </div>
          </div>

          {/* Text */}
          <div 
            className="relative z-10 text-center mt-8"
            style={{
              animation: 'textFadeIn 1s ease-out forwards',
              animationDelay: '1s',
              opacity: 0
            }}
          >
            <p className="text-2xl md:text-3xl font-serif text-amber-900 mb-2">Collect. Learn. Explore.</p>
            <p className="text-lg md:text-xl text-amber-800">Join the adventure with GeoScout.</p>
          </div>

          {/* Final logo */}
          <div 
            className="relative z-10 mt-6"
            style={{
              animation: 'logoFadeIn 1s ease-out forwards',
              animationDelay: '2s',
              opacity: 0
            }}
          >
            <img 
              src={logoImage} 
              alt="GeoScout Logo" 
              className="w-24 h-24 md:w-32 md:h-32 mx-auto"
            />
            <p className="text-sm text-amber-700 mt-2 text-center">Available soon on iOS & Android</p>
          </div>
        </div>
      )}

      {/* Skip hint */}
      {isPlaying && !isSkipped && (
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleTap();
            }}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-amber-900 text-sm font-medium shadow-lg hover:bg-white transition-all"
          >
            Skip
          </button>
        </div>
      )}

      {/* Water Splash Transition */}
      {showWaterSplash && (
        <div className="absolute inset-0 z-[200] pointer-events-none">
          {/* Water ripples */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border-4 border-amber-400/60"
                style={{
                  width: '0px',
                  height: '0px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: `waterRipple 0.8s ease-out forwards`,
                  animationDelay: `${i * 0.15}s`,
                  '--end-size': '2000px'
                } as React.CSSProperties & { '--end-size': string }}
              />
            ))}
          </div>

          {/* Water droplets */}
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              const distance = 300 + Math.random() * 200;
              const endX = Math.cos(angle) * distance;
              const endY = Math.sin(angle) * distance;
              
              return (
                <div
                  key={i}
                  className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 to-sky-300 opacity-80"
                  style={{
                    left: '50%',
                    top: '50%',
                    '--end-x': `${endX}px`,
                    '--end-y': `${endY}px`,
                    animation: `waterDroplet 0.8s ease-out forwards`,
                    animationDelay: `${i * 0.02}s`
                  } as React.CSSProperties & { '--end-x': string; '--end-y': string }}
                />
              );
            })}
          </div>

          {/* Water fill effect - transitions to Explore page background */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 20% 30%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(14, 165, 233, 0.2) 0%, transparent 50%),
                linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)
              `,
              animation: 'waterFill 0.8s ease-out forwards',
              clipPath: 'circle(0% at 50% 50%)'
            }}
          />
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes logoBloom {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes compassRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pinFadeIn {
          0% {
            opacity: 0;
            transform: scale(0) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes textSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes textFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes watercolorBloom {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes userPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        @keyframes mapPan {
          0% {
            transform: translateX(-10%) translateY(-5%);
          }
          50% {
            transform: translateX(5%) translateY(5%);
          }
          100% {
            transform: translateX(-10%) translateY(-5%);
          }
        }

        @keyframes cardSlideIn {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes videoFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes grayscaleToColor {
          0% {
            opacity: 0.5;
            filter: grayscale(100%);
          }
          100% {
            opacity: 0;
            filter: grayscale(0%);
          }
        }

        @keyframes logoFadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(300px) translateX(${Math.random() * 200 - 100}px) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes waterRipple {
          0% {
            width: 0px;
            height: 0px;
            opacity: 0.8;
            border-width: 4px;
          }
          100% {
            width: 2000px;
            height: 2000px;
            opacity: 0;
            border-width: 1px;
          }
        }

        @keyframes waterDroplet {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0.2);
            opacity: 0;
          }
        }

        @keyframes waterFill {
          0% {
            clip-path: circle(0% at 50% 50%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            clip-path: circle(150% at 50% 50%);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;

