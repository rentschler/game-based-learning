import { useState, useEffect } from 'react';
import { X, User, Zap, Trophy, MapPin, Users, BookOpen, Book, Award, Star, Sparkles } from 'lucide-react';
import { getScore } from '../utils/score';

// Profile images
const profileImage = new URL('../assets/profile/A close-up of a peng.png', import.meta.url).href;
const steveImage = new URL('../assets/profile/steve.png', import.meta.url).href;
const juliusImage = new URL('../assets/profile/Julius.png', import.meta.url).href;

interface ProfileProps {
  onClose: () => void;
  discoveredLandmarks?: number;
  totalLandmarks?: number;
}

type TabType = 'friends' | 'museum' | 'journal' | 'achievements';

const Profile = ({ onClose, discoveredLandmarks = 0, totalLandmarks = 0 }: ProfileProps) => {
  const [score, setScore] = useState(1069);
  const [level, setLevel] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('friends');

  useEffect(() => {
    const updateScore = () => {
      const currentScore = getScore();
      setScore(currentScore);
      // Calculate level: every 500 XP = 1 level (starting from level 1)
      setLevel(Math.floor(currentScore / 500) + 1);
    };
    
    updateScore();
    // Refresh score every second to keep it updated
    const interval = setInterval(updateScore, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sample badges based on discovered landmarks
  const badges = [
    { id: 1, name: '🏛️ History Scholar', earned: discoveredLandmarks >= 1 },
    { id: 2, name: '⚔️ Fortress Explorer', earned: discoveredLandmarks >= 2 },
    { id: 3, name: '🏗️ Design Enthusiast', earned: discoveredLandmarks >= 3 },
    { id: 4, name: '🎨 Culture Curator', earned: discoveredLandmarks >= 4 },
    { id: 5, name: '👑 Royal Heritage', earned: discoveredLandmarks >= 5 },
  ];

  const xpForNextLevel = (level * 500) - score;
  const xpProgress = score % 500;
  const levelProgress = (xpProgress / 500) * 100;

  // Friends list
  const friends = [
    { id: 1, name: 'Steve', level: 9, image: steveImage },
    { id: 2, name: 'Julius', level: 2, image: juliusImage },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-amber-100 overflow-y-auto">
      {/* Top Bar */}
  <div className="sticky top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-amber-100 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900">
            <User className="w-5 h-5 text-amber-900" />
            <span className="font-medium">Profile</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white border border-amber-200 shadow-sm hover:bg-amber-50 transition-colors"
            aria-label="Close profile"
          >
            <X className="w-6 h-6 text-amber-800" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 pt-2">
        {/* Top Section: Avatar, Name, XP, Level */}
        <div className="text-center mb-6">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl border-4 border-amber-200">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-2 border-4 border-black/90">
              <Trophy className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-serif text-amber-900 mb-2">Joni</h1>
          
          {/* Level Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-4">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-amber-900 font-semibold">Level {level}</span>
          </div>

          {/* XP Display */}
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4 border border-yellow-200 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-amber-800 text-sm font-medium">Experience Points</span>
            </div>
            <p className="text-3xl font-bold text-amber-900 mb-2">{score.toLocaleString()} XP</p>
            
            {/* Level Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-amber-700 mb-1">
                <span>Level {level}</span>
                <span>{xpProgress}/500 XP</span>
                <span>Level {level + 1}</span>
              </div>
              <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <p className="text-xs text-amber-700 mt-1 text-center">
                {xpForNextLevel} XP until next level
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Section: Friends, Museum, Journal, Achievements */}
        <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden mb-6">
          {/* Tab Headers */}
          <div className="flex border-b border-white/10">
            {[
              { id: 'friends' as TabType, label: 'Friends', icon: Users },
              { id: 'museum' as TabType, label: 'Museum', icon: BookOpen },
              { id: 'journal' as TabType, label: 'Journal', icon: Book },
              { id: 'achievements' as TabType, label: 'Achievements', icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-2 flex flex-col items-center gap-1 transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-50 border-b-2 border-amber-400'
                    : 'hover:bg-amber-50'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-amber-400' : 'text-amber-700'}`} />
                <span className={`text-xs font-medium ${activeTab === tab.id ? 'text-amber-900' : 'text-amber-700'}`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 min-h-[200px]">
            {activeTab === 'friends' && (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-amber-100 hover:bg-amber-50 transition-all"
                  >
                    <div className="relative">
                      <img 
                        src={friend.image} 
                        alt={friend.name} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-amber-200"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full px-2 py-0.5 border-2 border-black/90">
                        <span className="text-xs font-bold text-white">{friend.level}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-amber-900 font-medium">{friend.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-3 h-3 text-purple-400" />
                        <span className="text-amber-700 text-sm">Level {friend.level}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-amber-100 hover:bg-amber-50 rounded-lg transition-all">
                      <span className="text-amber-900 text-sm font-medium">View</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'museum' && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <p className="text-amber-700 mb-2">Your digital collection</p>
                <p className="text-amber-600 text-sm">View all your discovered landmarks in one place</p>
              </div>
            )}

            {activeTab === 'journal' && (
              <div className="text-center py-8">
                <Book className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <p className="text-amber-700 mb-2">Your exploration journal</p>
                <p className="text-amber-600 text-sm">Track your journey and discoveries</p>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-3">
                {[
                  { id: 1, title: 'First Discovery', description: 'Discover your first landmark', earned: discoveredLandmarks >= 1 },
                  { id: 2, title: 'Explorer', description: 'Discover 3 landmarks', earned: discoveredLandmarks >= 3 },
                  { id: 3, title: 'Master Explorer', description: 'Discover all landmarks', earned: discoveredLandmarks >= totalLandmarks },
                  { id: 4, title: 'Quiz Master', description: 'Complete a quiz', earned: false },
                  { id: 5, title: 'Knowledge Seeker', description: 'Read 10 landmark details', earned: false },
                ].map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border transition-all ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200'
                        : 'bg-white border-amber-100 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.earned
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                          : 'bg-white'
                      }`}>
                        <Award className={`w-5 h-5 ${achievement.earned ? 'text-white' : 'text-amber-400'}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${achievement.earned ? 'text-amber-900' : 'text-amber-700'}`}>
                          {achievement.title}
                        </p>
                        <p className={`text-sm ${achievement.earned ? 'text-amber-700' : 'text-amber-500'}`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <Sparkles className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Discoveries Section */}
        <div className="bg-white rounded-2xl p-6 border border-amber-100 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <h3 className="text-amber-900 font-semibold">Discoveries</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-amber-900 font-medium">Landmarks Explored</p>
                  <p className="text-amber-700 text-sm">{discoveredLandmarks} of {totalLandmarks} discovered</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-bold">{Math.round((discoveredLandmarks / totalLandmarks) * 100)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-2xl p-6 border border-amber-100 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-purple-400" />
            <h3 className="text-amber-900 font-semibold">Badges</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border transition-all ${
                  badge.earned
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30'
                    : 'bg-white border-amber-100 opacity-90'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{badge.name.split(' ')[0]}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${badge.earned ? 'text-white' : 'text-amber-700'}`}>
                      {badge.name.split(' ').slice(1).join(' ')}
                    </p>
                    {badge.earned && (
                      <p className="text-xs text-purple-300 mt-1">Earned</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

