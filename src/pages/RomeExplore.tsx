import { useState, useRef, useEffect } from 'react';
import { MapPin, Compass, Book, Trophy, User, Camera, Brain } from 'lucide-react';
import QuizPage from './QuizPage';
import DiscoveryScanner from './DiscoveryScanner';
import LandmarkDetail from './LandmarkDetail';
import Museum from './Museum';

interface Landmark {
  id: number;
  name: string;
  x: number;
  y: number;
  discovered: boolean;
  category: string;
  year: string;
  metersAway: number;
}

interface RomeExploreProps {
  onNavigateToTrondheim?: () => void;
}

const RomeExplore = ({ onNavigateToTrondheim }: RomeExploreProps) => {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [landmarkToScan, setLandmarkToScan] = useState<Landmark | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [landmarkToShow, setLandmarkToShow] = useState<Landmark | null>(null);
  const [showMuseum, setShowMuseum] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(2000);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // drag state
  const draggingRef = useRef(false);

  const minYear = -2000;
  const maxYear = 2000;

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const valueToPct = (value: number) => {
    return (value - minYear) / (maxYear - minYear);
  }

  const pctToValue = (pct: number) => {
    const raw = minYear + pct * (maxYear - minYear);
    // snap to nearest 100
    return Math.round(raw / 100) * 100;
  }

  // pointer handling
  const startDrag = (ev: PointerEvent | any) => {
    ev.preventDefault();
    (ev.target as Element).setPointerCapture?.(ev.pointerId);
    draggingRef.current = true;
    handlePointerMove(ev);
    window.addEventListener('pointermove', handlePointerMove as any);
    window.addEventListener('pointerup', stopDrag as any);
  }

  const handlePointerMove = (ev: PointerEvent | any) => {
    if (!draggingRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const y = ev.clientY;
    const relative = clamp((y - rect.top) / rect.height, 0, 1);
    const val = pctToValue(relative);
    setSelectedYear(val);
  }

  const stopDrag = () => {
    draggingRef.current = false;
    window.removeEventListener('pointermove', handlePointerMove as any);
    window.removeEventListener('pointerup', stopDrag as any);
  }

  const jumpToYear = (year: number) => {
    setSelectedYear(year);
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      setSelectedYear(s => clamp(Math.round((s - 100) / 100) * 100, minYear, maxYear));
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      setSelectedYear(s => clamp(Math.round((s + 100) / 100) * 100, minYear, maxYear));
    }
  }

  // Landmark data for Rome
  const [landmarks, setLandmarks] = useState([
    { id: 1, name: 'Colosseum', x: 69, y: 45, discovered: true, category: 'Historic', year: '80 AD', metersAway: 0 },
    { id: 2, name: 'Circus Maximus', x: 47, y: 53, discovered: true, category: 'Historic', year: '6th century BC', metersAway: 500 },
    { id: 3, name: 'Caracalla Baths', x: 69, y: 68, discovered: true, category: 'Historic', year: '216 AD', metersAway: 800 },
  ]);

  const discoveredCount = landmarks.filter(l => l.discovered).length;
  const totalCount = landmarks.length;

  // Position the user indicator near the Colosseum by default
  const colosseum = landmarks.find(l => l.name === 'Colosseum');
  const userX = colosseum ? colosseum.x + 6 : 50;
  const userY = colosseum ? colosseum.y + 4 : 50;

  // Handle discovery completion
  const handleDiscoveryComplete = (landmarkId: number) => {
    setLandmarks(prevLandmarks =>
      prevLandmarks.map(landmark =>
        landmark.id === landmarkId ? { ...landmark, discovered: true } : landmark
      )
    );
    setShowScanner(false);
    setLandmarkToScan(null);
  };

  // Launch scanner for selected landmark
  const launchScanner = (landmark: Landmark) => {
    setLandmarkToScan(landmark);
    setShowScanner(true);
    setSelectedLandmark(null);
  };

  // Gladiator popup state - appears when pressing 'U'
  const [showGladiatorPopup, setShowGladiatorPopup] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'u' || e.key === 'U') {
        setShowGladiatorPopup(true);
      }
      // optional: allow Esc to close
      if (e.key === 'Escape') {
        setShowGladiatorPopup(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (showQuiz) return <QuizPage onClose={() => setShowQuiz(false)} />;

  return (
    <div className="h-screen w-full bg-amber-50 flex flex-col relative overflow-hidden">
      {/* Rome map background (switches between modern and historic based on selectedYear) */}
      <div className="absolute inset-0">
        {/* choose historic map around 100 AD if selected close to 100, otherwise modern */}
        {(() => {
          const isHistoric100 = Math.abs(selectedYear - 100) <= 50; // within +/-50 years
          const modernSrc = '/src/assets/rome_modern.png';
          const historicSrc = '/src/assets/rome_historic.png';
          // If historic asset missing, browser will naturally show broken image; user should add the file to the path.
          const src = isHistoric100 ? historicSrc : modernSrc;
          return (
            <img src={src} alt="Rome Map" className="object-cover w-full h-full opacity-50" />
          );
        })()}
      </div>

      {/* Watercolor texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
           style={{
             backgroundImage: `radial-gradient(circle at 20% 30%, rgba(139, 92, 46, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 80% 70%, rgba(101, 67, 33, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 50% 50%, rgba(160, 82, 45, 0.05) 0%, transparent 70%)`
           }}>
      </div>

      {/* Top Bar */}
          <div className="relative z-20 bg-gradient-to-b from-amber-100 to-amber-50 px-4 py-3 shadow-sm border-b-2 border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onNavigateToTrondheim && (
              <button
                onClick={onNavigateToTrondheim}
                className="p-0"
                aria-label="Navigate to Trondheim"
              >
                <Compass className="w-6 h-6 text-amber-800" />
              </button>
            )}
            {!onNavigateToTrondheim && (
              <Compass className="w-6 h-6 text-amber-800" />
            )}
            <div>
              <h1 className="text-lg font-serif text-amber-900">Rome</h1>
              <p className="text-xs text-amber-700">{discoveredCount}/{totalCount} landmarks discovered</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              className="p-2 rounded-full bg-white shadow-sm"
              onClick={() => setShowMuseum(true)}
              aria-label="Open Digital Museum"
            >
              <Book className="w-5 h-5 text-amber-800" />
            </button>
            <button 
              className="p-2 rounded-full bg-white shadow-sm"
              onClick={() => setShowQuiz(true)}
              aria-label="Open Quiz"
              title="Take a quiz"
            >
              <Brain className="w-5 h-5 text-amber-800" />
            </button>
            <button className="p-2 rounded-full bg-white shadow-sm">
              <Trophy className="w-5 h-5 text-amber-800" />
            </button>
            <button className="p-2 rounded-full bg-white shadow-sm">
              <User className="w-5 h-5 text-amber-800" />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-600 to-orange-500 transition-all duration-500 rounded-full"
            style={{ width: `${(discoveredCount / totalCount) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Base map with watercolor effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30"
               style={{
                 background: `
                   radial-gradient(ellipse 400px 300px at 45% 40%, rgba(147, 197, 114, 0.4) 0%, transparent 60%),
                   radial-gradient(ellipse 350px 350px at 65% 25%, rgba(173, 216, 230, 0.3) 0%, transparent 60%)`
               }}>
          </div>
          
          <div className="absolute inset-0 opacity-20"
               style={{
                 background: `
                   radial-gradient(ellipse 300px 300px at 55% 50%, rgba(100, 100, 100, 0.2) 0%, transparent 60%),
                   radial-gradient(ellipse 280px 280px at 30% 60%, rgba(120, 120, 120, 0.15) 0%, transparent 60%)`
               }}>
          </div>

          <svg className="absolute inset-0 w-full h-full opacity-0">
            <path d="M 100 200 Q 250 180 400 220" stroke="#8B7355" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <path d="M 200 100 L 200 400" stroke="#8B7355" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <path d="M 300 150 Q 350 250 320 350" stroke="#8B7355" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          </svg>
        </div>

        {/* Landmarks */}
        {landmarks.map((landmark) => (
          <button
            key={landmark.id}
            onClick={() => setSelectedLandmark(landmark)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              selectedLandmark?.id === landmark.id ? 'scale-125 z-30' : 'z-10'
            }`}
            style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
          >
            {landmark.discovered ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 rounded-full shadow-lg flex items-center justify-center border-3 border-white">
                  <MapPin className="w-6 h-6 text-white" fill="white" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-medium text-amber-900 bg-white px-2 py-1 rounded shadow-sm border border-amber-200">
                    {landmark.name}
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative opacity-60">
                <div className="w-10 h-10 bg-gray-300 rounded-full shadow-md flex items-center justify-center border-2 border-gray-400"
                     style={{
                       background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                       filter: 'grayscale(100%)'
                     }}>
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs text-gray-500">???</span>
                </div>
              </div>
            )}
          </button>
        ))}

        {/* User location indicator */}
        <div className="absolute z-40" style={{ left: `${userX}%`, top: `${userY}%`, transform: 'translate(-50%, -50%)' }}>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Bottom Card - Landmark Details */}
      {selectedLandmark && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300"
             style={{
               background: 'linear-gradient(to bottom, #fffbeb 0%, #ffffff 100%)',
               borderTop: '3px solid #d97706'
             }}>
          <div className="p-5">
            <div className="w-12 h-1 bg-amber-300 rounded-full mx-auto mb-4"></div>
            
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-serif text-amber-900 mb-1">{selectedLandmark.name}</h2>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded">{selectedLandmark.category}</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded">Est. {selectedLandmark.year}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLandmark(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {selectedLandmark.discovered ? (
              <div>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  A short blurb about the landmark to give the player context and entice them to learn more.
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setLandmarkToShow(selectedLandmark);
                      setShowDetail(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-2">🔒 Landmark locked</p>
                <p className="text-sm text-gray-600 mb-4">Visit this location to unlock and discover its story</p>
                <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg inline-block mb-4">
                  {selectedLandmark.metersAway} meters away
                </div>
                <button 
                  onClick={() => launchScanner(selectedLandmark)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Scan to Discover
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating AR Camera Button */}
      <button 
        onClick={() => {
          // Launch scanner with nearest undiscovered landmark
          const undiscovered = landmarks.find(l => !l.discovered);
          if (undiscovered) {
            launchScanner(undiscovered);
          }
        }}
        className="absolute bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-xl flex items-center justify-center z-40 hover:scale-110 transition-transform"
      >
        <Camera className="w-8 h-8 text-white" />
      </button>

      {/* Timeline toggle button placed vertically above the camera button */}
      <button
        onClick={() => setShowTimeline(v => !v)}
        aria-label="Open timeline"
        title="Open timeline"
        className="absolute bottom-40 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center z-40 hover:scale-110 transition-transform"
      >
        {/* simple clock / timeline icon - use a small div + svg fallback */}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-700">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
      </button>

      {/* Timeline slider panel (appears when showTimeline=true) */}
      {showTimeline && (
        <div className="absolute bottom-28 right-20 z-50">
          {/* background panel that covers the map while slider is visible */}
          <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-amber-200 flex items-center gap-4 w-44 overflow-visible">
            {/* (removed left label column) - the interactive timeline is centered in the slider container below */}

            {/* slider container - custom interactive timeline built from the line + points */}
            <div className="relative h-64 w-20 flex items-center">
              {/* interactive container */}
              <div
                ref={(el: HTMLDivElement | null) => { containerRef.current = el }}
                className="relative h-64 w-10 flex items-center cursor-pointer"
                onPointerDown={(e) => startDrag(e as any)}
              >
                {/* transparent accessible range (kept for keyboard users but hidden visually) */}
                <input
                  type="range"
                  min={-2000}
                  max={2000}
                  step={100}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="sr-only"
                  aria-label="Select year on timeline"
                />

                {/* continuous vertical line centered */}
                <div className="absolute left-1/2 top-2 bottom-2 w-1 bg-blue-600 rounded -translate-x-1/2" />

                {/* points positioned along the centered line (no left label column) */}
                {Array.from({ length: 9 }).map((_, i) => {
                  const year = -2000 + i * 500;
                  const pct = (year - (-2000)) / 4000; // 0..1
                  return (
                    <div
                      key={year}
                      onClick={(ev) => { ev.stopPropagation(); jumpToYear(year); }}
                      className="absolute"
                      style={{ left: '50%', top: `${pct * 100}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <div className="relative w-0">
                        {/* dot centered on the blue line */}
                        <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-600 z-10" />
                        {/* label to the right of the line */}
                        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-xs text-amber-800 select-none whitespace-nowrap">
                          {year < 0 ? `${Math.abs(year)} BC` : `${year} AD`}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* draggable thumb */}
                <div
                  role="slider"
                  aria-valuemin={-2000}
                  aria-valuemax={2000}
                  aria-valuenow={selectedYear}
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e)}
                  className="absolute left-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center z-20 -translate-x-1/2"
                  style={{ top: `${valueToPct(selectedYear) * 100}%`, transform: 'translate(-50%, -50%)' }}
                  onPointerDown={(ev) => startDrag(ev as any)}
                >
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                </div>
              </div>

              {/* current year indicator: positioned to the right of the labels, aligned to the selected tick */}
              <div
                className="absolute z-30 text-xs text-amber-900 font-semibold select-none"
                style={{ left: 'calc(50% + 6rem)', top: `${valueToPct(selectedYear) * 100}%`, transform: 'translate(-50%, -50%)' }}
              >
                {selectedYear < 0 ? `${Math.abs(selectedYear)} BC` : `${selectedYear} AD`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discovery Scanner Modal */}
      {showScanner && landmarkToScan && (
        <DiscoveryScanner
          landmark={landmarkToScan}
          onClose={() => {
            setShowScanner(false);
            setLandmarkToScan(null);
          }}
          onDiscoveryComplete={handleDiscoveryComplete}
        />
      )}

      {/* Gladiator notification popup (triggered by pressing 'U') */}
      {showGladiatorPopup && (
        <div className="absolute inset-0 z-60 flex items-start justify-center pt-16">
          <div className="relative w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl border border-amber-200 p-5" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            {/* Close button top-right */}
            <button
              onClick={() => setShowGladiatorPopup(false)}
              aria-label="Close"
              className="absolute -top-3 -right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-amber-50"
            >
              ✕
            </button>

            <div className="text-center text-sm text-amber-900 font-medium mb-4">
              You are near to a famous movie location
              <br />
              from the movie: <strong>Gladiator!</strong>
            </div>

            <div className="overflow-hidden rounded-lg bg-gray-100 border border-amber-100">
              <img src="/src/assets/gladiator.jpg" alt="Gladiator" className="w-full h-40 object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* Landmark Detail Modal */}
      {showDetail && landmarkToShow && (
        <LandmarkDetail 
          landmark={landmarkToShow}
          onClose={() => {
            setShowDetail(false);
            setLandmarkToShow(null);
          }}
        />
      )}

      {/* Digital Museum Modal */}
      {showMuseum && (
        <Museum 
          cityName="Rome"
          items={landmarks}
          onClose={() => setShowMuseum(false)}
        />
      )}
    </div>
  );
};

export default RomeExplore;

