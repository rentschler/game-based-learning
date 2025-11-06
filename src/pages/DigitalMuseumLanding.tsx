import { X } from 'lucide-react';

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

const BUILDINGS: { key: string; label: string; src: string }[] = [
  { key: 'estonia', label: 'Estonia', src: estonia },
  { key: 'germany', label: 'Germany', src: germany },
  { key: 'italy', label: 'Italy', src: italy },
  { key: 'movies', label: 'Movies', src: movies },
  { key: 'norway', label: 'Norway', src: norway },
];

const DigitalMuseumLanding = ({ onOpenNation, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto">
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-serif text-amber-900">Digital Museum</h1>
          <button onClick={onClose} className="p-2 rounded-full bg-white border border-amber-200 shadow-sm">
            <X className="w-5 h-5 text-amber-800" />
          </button>
        </div>

        <div className="relative bg-amber-50 rounded-xl overflow-hidden">
          <img src={island} alt="Island background" className="w-full object-cover" />

          <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
            <div className="w-full max-w-4xl mt-8 grid grid-cols-5 gap-6 pointer-events-auto">
              {BUILDINGS.map(b => (
                <button
                  key={b.key}
                  onClick={() => onOpenNation(b.key)}
                  className="flex flex-col items-center gap-2 bg-white/80 rounded-lg p-2 shadow-sm hover:scale-105 transition-transform"
                  style={{ width: 166 }}
                >
                  <img src={b.src} alt={b.label} width={166} height={95} className="object-cover rounded-md" />
                  <span className="text-xs text-amber-800">{b.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalMuseumLanding;
