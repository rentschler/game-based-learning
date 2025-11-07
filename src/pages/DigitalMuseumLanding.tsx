import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
  onOpenNation: (nation: string) => void;
  onClose: () => void;
}

// Use asset paths; if images aren't present these will simply fail to load in the browser
// but won't break the TypeScript/Vite build like a missing `new URL(...)` import would.
const island = '/src/assets/digital_Museum/island_empty_vertical.png';
const estonia = '/src/assets/digital_Museum/museum_estonia.png';
const germany = '/src/assets/digital_Museum/museum_germany.png';
const italy = '/src/assets/digital_Museum/museum_italy.png';
const movies = '/src/assets/digital_Museum/museum_movies.png';
const norway = '/src/assets/digital_Museum/museum_norway.png';

// Add absolute positions (percentages) for each building so we can place them
// over the island image at the requested coordinates (approximated from the
// provided sketch). Positions are the center point for each thumbnail.
const BUILDINGS: { key: string; label: string; src: string; left: string; top: string }[] = [
  // nudged further down as requested
  // nudged slightly up as requested
  { key: 'estonia', label: 'Estonia', src: estonia, left: '22%', top: '49.5%' },
  { key: 'germany', label: 'Germany', src: germany, left: '38%', top: '42%' },
  { key: 'italy', label: 'Italy', src: italy, left: '52%', top: '46%' },
  { key: 'colosseum', label: 'Colosseum', src: '/src/assets/digital_Museum/JUST_Coloseum.png', left: '60%', top: '52.5%' },
  { key: 'movies', label: 'Movies', src: movies, left: '68%', top: '40%' },
  { key: 'norway', label: 'Norway', src: norway, left: '79%', top: '50%' },
];

const DigitalMuseumLanding = ({ onOpenNation, onClose }: Props) => {
  // Which buildings are currently visible. Only Norway is visible by default.
  const initialShown = BUILDINGS.reduce((acc, b) => {
    acc[b.key] = b.key === 'norway';
    return acc;
  }, {} as Record<string, boolean>);
  const [shown, setShown] = useState<Record<string, boolean>>(initialShown);

  // Colosseum toggle kept separate (still toggled via 'c')
  const [showColosseum, setShowColosseum] = useState(false);

  // animation / timeouts refs to allow cleanup
  const timeouts: { current: number[] } = { current: [] } as any;
  const isAnimatingRef: { current: boolean } = { current: false } as any;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'c' || e.key === 'C') {
        setShowColosseum((v) => !v);
      }
      if (e.key === 'b' || e.key === 'B') {
        // start reveal sequence for selected buildings
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        const order = ['estonia', 'germany', 'italy', 'movies'];
        order.forEach((key, i) => {
          const t = window.setTimeout(() => {
            setShown((prev) => ({ ...prev, [key]: true }));
          }, i * 1000);
          timeouts.current.push(t);
        });
        // clear animating flag after last timeout
        const endTimeout = window.setTimeout(() => {
          isAnimatingRef.current = false;
        }, order.length * 1000);
        timeouts.current.push(endTimeout);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      // cleanup any pending timeouts
      timeouts.current.forEach((t: number) => clearTimeout(t));
      timeouts.current = [];
    };
  }, []);
  return (
    <div className="absolute inset-0 z-50 bg-white overflow-auto">
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-serif text-amber-900">Digital Museum</h1>
          <button onClick={onClose} className="p-2 rounded-full bg-white border border-amber-200 shadow-sm">
            <X className="w-5 h-5 text-amber-800" />
          </button>
        </div>

        <div className="relative bg-amber-50 rounded-xl overflow-hidden">
          <img src={island} alt="Island background" className="w-full object-cover" />

          <div className="absolute inset-0 pointer-events-none">
            {/* Render each building as an absolutely positioned element over the island */}
            {BUILDINGS.map(b => {
              // handle colosseum separately (toggled with 'c')
              if (b.key === 'colosseum') {
                if (!showColosseum) return null;
              } else {
                // other buildings follow the shown map (only Norway visible initially)
                if (!shown[b.key]) return null;
              }
              const isCol = b.key === 'colosseum';
              // slightly smaller colosseum as requested
              const imgW = isCol ? 100 : 166;
              const imgH = isCol ? 58 : 95;
              return (
                <div
                  key={b.key}
                  className="absolute pointer-events-auto flex items-center justify-center"
                  style={{ left: b.left, top: b.top, transform: 'translate(-50%, -50%)', width: imgW }}
                >
                  <img src={b.src} alt={b.label} width={imgW} height={imgH} className="object-cover rounded-md" />

                  {/* Invisible clickable overlay button (covers the image area) */}
                  <button
                    aria-label={`Open ${b.label} museum`}
                    title={`Open ${b.label} museum`}
                    onClick={() => onOpenNation(b.key)}
                    className="absolute border-0 bg-transparent p-0 m-0 opacity-0"
                    style={{ left: 0, top: 0, width: `${imgW}px`, height: `${imgH}px` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalMuseumLanding;
