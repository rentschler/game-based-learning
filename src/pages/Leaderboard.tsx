import { useEffect, useMemo, useState } from 'react';
import { X, Trophy, Crown, Star } from 'lucide-react';
import { getScore } from '../utils/score';

const profileImage = new URL('../assets/profile/A close-up of a peng.png', import.meta.url).href;
const penguin1Image = new URL('../assets/profile/penguin1.png', import.meta.url).href;
const villager = new URL('../assets/profile/villager.png', import.meta.url).href;
const steveImage = new URL('../assets/profile/steve.png', import.meta.url).href;
const juliusImage = new URL('../assets/profile/Julius.png', import.meta.url).href;
const dorianImage = new URL('../assets/profile/dorian.png', import.meta.url).href;
const vinceImage = new URL('../assets/profile/vince.png', import.meta.url).href;
const teoImage = new URL('../assets/profile/teo.png', import.meta.url).href;
interface LeaderboardProps {
  onClose: () => void;
}

interface PlayerEntry {
  id: string;
  name: string;
  xp: number;
  level: number;
  image: string;
  isCurrentUser?: boolean;
}

const basePlayers: PlayerEntry[] = [
  { id: 'Steve', name: 'Steve', xp: 4950, level: 9, image: steveImage },
  { id: 'Teo', name: 'Teo', xp: 1920, level: 4, image: teoImage },
  { id: 'Julius', name: 'Julius', xp: 1069, level: 3, image: juliusImage },
  { id: 'Vince', name: 'Vince', xp: 869, level: 2, image: vinceImage },
  { id: 'Dorian', name: 'Dorian', xp: 420, level: 1, image: dorianImage },
];

const Leaderboard = ({ onClose }: LeaderboardProps) => {
  const [userScore, setUserScore] = useState(() => getScore());
  const [userLevel, setUserLevel] = useState(() => Math.floor(getScore() / 500) + 1);

  useEffect(() => {
    const updateScore = () => {
      const current = getScore();
      setUserScore(current);
      setUserLevel(Math.floor(current / 500) + 1);
    };

    updateScore();
    const interval = setInterval(updateScore, 1000);
    return () => clearInterval(interval);
  }, []);

  const leaderboard = useMemo(() => {
    const players: PlayerEntry[] = [
      ...basePlayers,
      { id: 'joni', name: 'Alina', xp: userScore, level: userLevel, image: penguin1Image, isCurrentUser: true },
    ];

    const sorted = players
      .slice()
      .sort((a, b) => b.xp - a.xp)
      .map((player, index) => ({
        ...player,
        rank: index + 1,
      }));

    return sorted;
  }, [userLevel, userScore]);

  return (
    <div className="absolute inset-0 z-50 bg-amber-100 overflow-y-auto">
      <div className="sticky top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-amber-100 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900">
            <Trophy className="w-5 h-5 text-amber-900" />
            <span className="font-medium">Leaderboard</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white border border-amber-200 shadow-sm hover:bg-amber-50 transition-colors"
            aria-label="Close leaderboard"
          >
            <X className="w-6 h-6 text-amber-800" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 pt-2">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-amber-200 via-yellow-100 to-orange-200 rounded-2xl border border-amber-300 shadow-lg">
            <Star className="w-5 h-5 text-amber-600" />
            <div className="text-left">
              <p className="text-sm text-amber-700">Your Rank</p>
              {(() => {
                const currentUser = leaderboard.find((player) => player.isCurrentUser);
                return (
                  <p className="text-lg font-semibold text-amber-900">
                    {currentUser?.rank ? `#${currentUser.rank}` : 'Unranked'} • Level {userLevel}
                  </p>
                );
              })()}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden mb-6 shadow-sm">
          <div className="p-6 min-h-[200px]">
            <div className="space-y-3">
              {leaderboard.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-4 p-4 bg-white rounded-xl border border-amber-100 transition-all ${
                    player.isCurrentUser ? 'ring-2 ring-amber-300 shadow-md' : 'hover:bg-amber-50'
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md ${
                        player.rank === 1
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                          : player.rank === 2
                          ? 'bg-gradient-to-br from-slate-400 to-slate-600'
                          : player.rank === 3
                          ? 'bg-gradient-to-br from-amber-600 to-amber-800'
                          : 'bg-gradient-to-br from-amber-300 to-amber-500'
                      }`}
                    >
                      {player.rank}
                    </div>
                    {player.rank === 1 && (
                      <Crown className="w-5 h-5 text-yellow-200 absolute -top-2 -right-2 drop-shadow" />
                    )}
                  </div>


                  <div className="flex-1">
                    <p className="text-amber-900 font-medium">
                      {player.name}
                      {player.isCurrentUser && <span className="ml-2 text-xs text-amber-600">(You)</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-amber-700">
                      <span>Level {player.level}</span>
                      <span className="w-1 h-1 rounded-full bg-amber-300" />
                      <span>{player.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-200"
                    />
                    {/* <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full px-2 py-0.5 border-2 border-black/90">
                      <span className="text-xs font-bold text-white">{player.level}</span>
                    </div> */}
                  </div>

                  {/* <button className="px-4 py-2 bg-white border border-amber-100 hover:bg-amber-50 rounded-lg transition-all">
                    <span className="text-amber-900 text-sm font-medium">View</span>
                  </button> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;







