import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface Props {
  nation: string;
  onBack: () => void;
  onOpenCity: (city: string) => void;
}

const CITY_MAP: Record<string, string[]> = {
  italy: ['Rome', 'Florence', 'Venice', 'Milan'],
  germany: ['Cologne', 'Berlin', 'Munich', 'Hamburg'],
  norway: ['Trondheim', 'Oslo', 'Bergen', 'Stavanger'],
  estonia: ['Tallinn', 'Tartu', 'Pärnu', 'Narva'],
  movies: ['Star Wars', 'The Lord of the Rings', 'James Bond']
};

const NationMuseum = ({ nation, onBack, onOpenCity }: Props) => {
  const cities = CITY_MAP[nation] || ['City A', 'City B', 'City C', 'City D'];

  // Small helper component: try to load a canonical image filename for the city
  // If the image loads successfully it is shown; otherwise we show the default placeholder.
  const CityImage = ({ city }: { city: string }) => {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);
    // canonical filename: use the city string as given (user will add a file with this exact name)
    const src = `/src/assets/${city}.jpg`;

    return (
      <div className="w-full h-full relative">
        {!errored && (
          <img
            src={src}
            alt={city}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={`w-full h-full object-cover ${loaded ? 'block' : 'hidden'}`}
          />
        )}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-amber-700 bg-amber-100">
            {city} image
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-50 bg-gradient-to-b from-amber-50 to-white overflow-auto">
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-full bg-white border border-amber-200 shadow-sm">
            <ArrowLeft className="w-4 h-4 text-amber-800" />
          </button>
          <div>
            <h2 className="text-lg font-serif text-amber-900">{nation.charAt(0).toUpperCase() + nation.slice(1)}</h2>
            <p className="text-xs text-amber-700">Select a city</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => onOpenCity(c)}
              className="bg-white rounded-2xl p-4 text-left border border-amber-200 hover:shadow-md"
            >
              <div className="h-24 rounded-md mb-3 overflow-hidden bg-amber-100 flex items-center justify-center text-amber-700">
                <CityImage city={c} />
              </div>
              <h3 className="text-amber-900 font-medium">{c}</h3>
              <p className="text-xs text-amber-700">4 landmarks</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NationMuseum;
