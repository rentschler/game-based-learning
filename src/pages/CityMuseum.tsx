import Museum from './Museum';
import type { Landmark } from './Museum';

interface Props {
  city: string;
  onClose: () => void;
}

// Provide a small sample set of landmarks for each city. In a real app this
// would be loaded from data or API.
const SAMPLE: Record<string, Landmark[]> = {
  Rome: [
    { id: 1, name: 'Colosseum', category: 'Historic', year: '80', discovered: true, metersAway: 50 },
    { id: 2, name: 'Pantheon', category: 'Architecture', year: '126', discovered: false, metersAway: 300 },
    { id: 3, name: 'Trevi Fountain', category: 'Fountain', year: '1762', discovered: false, metersAway: 120 },
    { id: 4, name: 'Vatican Museums', category: 'Museum', year: '1506', discovered: false, metersAway: 800 },
  ],
  Trondheim: [
    { id: 1, name: 'Nidaros Cathedral', category: 'Historic', year: '1070', discovered: true, metersAway: 100 },
    { id: 2, name: 'Kristiansten Fortress', category: 'Military', year: '1681', discovered: true, metersAway: 300 },
    { id: 3, name: 'Old Town Bridge', category: 'Architecture', year: '1861', discovered: false, metersAway: 50 },
    { id: 4, name: 'Rockheim Museum', category: 'Culture', year: '2010', discovered: false, metersAway: 125 },
  ]
};

const CityMuseum = ({ city, onClose }: Props) => {
  const items = SAMPLE[city] || [
    { id: 1, name: `${city} Landmark 1`, category: 'General', year: '1900', discovered: false },
    { id: 2, name: `${city} Landmark 2`, category: 'General', year: '1920', discovered: false },
    { id: 3, name: `${city} Landmark 3`, category: 'General', year: '1950', discovered: false },
  ];

  return (
    <Museum
      cityName={city}
      items={items}
      onClose={onClose}
    />
  );
};

export default CityMuseum;
