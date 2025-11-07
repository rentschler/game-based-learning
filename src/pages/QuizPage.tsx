import { useState, useEffect } from 'react';
import { X, Check, Star, Trophy, Sparkles, Zap } from 'lucide-react';
import { addXP } from '../utils/score';

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

const praiseMessages = [
  'Excellent! 🎉',
  'Brilliant! ⭐',
  'Perfect! 🌟',
  'Well done! 🏆',
  'Outstanding! 💫',
  'Amazing! ✨',
];

export default function QuizPage({ onClose }: { onClose?: () => void }) {
  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: 'Which cathedral is Trondheim best known for?',
      options: ['Nidaros Cathedral', 'Cologne Cathedral', 'St. Pauls Cathedral', 'Notre-Dame'],
      correctIndex: 0,
    },
    {
      id: 2,
      question: 'Which fortress overlooks Trondheim and was built in the 17th century?',
      options: ['Kristiansten Fortress', 'Akershus Fortress', 'Fredriksten', 'Bergenhus'],
      correctIndex: 0,
    },
    {
      id: 3,
      question: 'What is the name of the historic wooden bridge that crosses the Nidelva river in Trondheim?',
      options: ['Gamle Bybro', 'Tower Bridge', 'Charles Bridge', 'Rialto Bridge'],
      correctIndex: 0,
    },
    {
      id: 4,
      question: 'Which medieval archbishop\'s palace is located near Nidaros Cathedral?',
      options: ['Erkebispegården', 'Rosenborg Palace', 'Akershus Castle', 'Bergenhus Fortress'],
      correctIndex: 0,
    },
    {
      id: 5,
      question: 'What is the name of the historic wharf area in Trondheim known for its colorful wooden warehouses?',
      options: ['Bakklandet', 'Bryggen', 'Nyhavn', 'La Rambla'],
      correctIndex: 0,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPraise, setShowPraise] = useState(false);
  const [praiseMessage, setPraiseMessage] = useState('');
  const [xpAwarded, setXpAwarded] = useState(false);

  const selectOption = (idx: number) => {
    if (selected !== null) return; // Prevent changing answer after selection
    setSelected(idx);
    
    // Check if answer is correct
    if (idx === questions[current].correctIndex) {
      setShowConfetti(true);
      setShowPraise(true);
      setPraiseMessage(praiseMessages[Math.floor(Math.random() * praiseMessages.length)]);
      
      // Hide confetti and praise after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
      setTimeout(() => {
        setShowPraise(false);
      }, 2500);
    }
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    setSelected(null);
    setShowConfetti(false);
    setShowPraise(false);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResults(true);
    }
  };

  const progress = ((current + (selected !== null ? 1 : 0)) / questions.length) * 100;
  const score: number = answers.reduce<number>((acc, ans, i) => (ans === questions[i].correctIndex ? acc + 1 : acc), 0);
  
  // Quiz Bonus: Fixed 60 XP for completing the quiz
  const earnedXP = 60;

  // Award XP when quiz is completed (only once per completion)
  useEffect(() => {
    if (showResults && !xpAwarded) {
      addXP(earnedXP);
      setXpAwarded(true);
    }
  }, [showResults, xpAwarded, earnedXP]);

  return (
    <div className="h-screen w-full bg-amber-100 flex flex-col items-center p-6 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => {
            const randomX = (Math.random() - 0.5) * 200;
            const randomDelay = Math.random() * 0.3;
            const randomDuration = 1 + Math.random() * 1.5;
            const randomRotation = Math.random() * 720;
            const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const startX = 50 + (Math.random() - 0.5) * 80;
            const startY = 50 + (Math.random() - 0.5) * 40;
            
            return (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full confetti-particle"
                style={{
                  left: `${startX}%`,
                  top: `${startY}%`,
                  backgroundColor: color,
                  '--end-x': `${randomX}px`,
                  '--end-rotation': `${randomRotation}deg`,
                  animation: `confettiFall ${randomDuration}s ease-out forwards`,
                  animationDelay: `${randomDelay}s`,
                } as React.CSSProperties & { '--end-x': string; '--end-rotation': string }}
              />
            );
          })}
        </div>
      )}

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-serif">Trondheim Quiz</h2>
          <div className="flex items-center gap-2">
            {onClose && (
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {!showResults && (
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{current + 1}/{questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className={`p-6 ${showResults ? 'flex flex-col h-[calc(100vh-200px)] max-h-[600px]' : ''}`}>
          {!showResults ? (
            <div className="relative">
              {/* Praise Message */}
              {showPraise && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-bold text-lg">{praiseMessage}</span>
                    <Star className="w-5 h-5" />
                  </div>
                </div>
              )}

              <div className="mb-4 text-sm text-gray-600">Question {current + 1} of {questions.length}</div>
              <h3 className="text-xl font-medium mb-6">{questions[current].question}</h3>

              <div className="grid grid-cols-1 gap-3">
                {questions[current].options.map((opt, idx) => {
                  const active = selected === idx;
                  const isCorrect = selected !== null && idx === questions[current].correctIndex;
                  const isIncorrect = selected !== null && active && idx !== questions[current].correctIndex;
                  
                  let backgroundColor = '#FFFFFF';
                  let color = '#1F2937';
                  let borderColor = '#E5E7EB';
                  
                  if (active && isCorrect) {
                    backgroundColor = '#D1FAE5'; // green-100
                    color = '#065F46'; // green-900
                    borderColor = '#34D399'; // green-400
                  } else if (isIncorrect) {
                    backgroundColor = '#FEE2E2'; // red-100
                    color = '#991B1B'; // red-900
                    borderColor = '#F87171'; // red-400
                  } else if (active) {
                    backgroundColor = '#FEF3C7'; // amber-100
                    color = '#92400E'; // amber-900
                    borderColor = '#FCD34D'; // amber-300
                  } else if (selected !== null && isCorrect) {
                    backgroundColor = '#ECFDF5'; // green-50
                    borderColor = '#A7F3D0'; // green-300
                  }

                  const baseClass = 'text-left p-4 rounded-lg shadow-sm transition-all duration-300 border-2 flex items-center justify-between cursor-pointer';
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => selectOption(idx)}
                      role="button"
                      aria-pressed={active}
                      disabled={selected !== null}
                      className={`${baseClass} ${selected !== null ? '' : 'hover:shadow-md hover:scale-[1.02]'}`}
                      style={{
                        backgroundColor,
                        color,
                        borderColor,
                        transform: active ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      <span className="font-medium">{opt}</span>
                      {active && isCorrect && <Check className="w-5 h-5 text-green-600 ml-2" />}
                      {isIncorrect && <X className="w-5 h-5 text-red-600 ml-2" />}
                      {active && !isCorrect && !isIncorrect && <Check className="w-4 h-4 text-amber-700 ml-2" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={selected === null}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selected === null 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-amber-600 text-white hover:bg-amber-700 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {current < questions.length - 1 ? 'Next Question →' : 'View Results'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full text-center">
              {/* Score Display with Trophy - Fixed at top */}
              <div className="flex-shrink-0 flex items-center justify-center mb-4">
                <div className="relative">
                  {score === questions.length && (
                    <div className="absolute -top-4 -right-4 animate-bounce">
                      <Trophy className="w-8 h-8 text-amber-500" />
                    </div>
                  )}
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg ${
                    score === questions.length 
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' 
                      : score >= questions.length * 0.7
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                      : 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white'
                  }`}>
                    {score}/{questions.length}
                  </div>
                </div>
              </div>
              
              {/* Score Message - Fixed */}
              <div className="flex-shrink-0 mb-4">
                {score === questions.length ? (
                  <div>
                    <h3 className="text-2xl font-bold text-amber-600 mb-2">Perfect Score! 🎉</h3>
                    <p className="text-gray-600">You're a Trondheim expert!</p>
                  </div>
                ) : score >= questions.length * 0.7 ? (
                  <div>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Great Job! ⭐</h3>
                    <p className="text-gray-600">You know Trondheim well!</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">Good Effort! 💪</h3>
                    <p className="text-gray-600">Keep exploring to learn more!</p>
                  </div>
                )}
              </div>

              {/* XP Bonus Display */}
              <div className="flex-shrink-0 mb-4">
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-700 text-sm font-medium">Quiz Bonus</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">+{earnedXP} XP</p>
                  {score === questions.length && (
                    <p className="text-xs text-amber-700 mt-1 font-medium">Perfect score bonus included! ✨</p>
                  )}
                </div>
              </div>

              {/* Review Answers - Scrollable */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 text-left mb-4 custom-scrollbar">
                {questions.map((q, i) => {
                  const userAnswer = answers[i];
                  const isCorrect = userAnswer === q.correctIndex;
                  
                  return (
                    <div 
                      key={q.id} 
                      className={`p-4 border-2 rounded-lg transition-all ${
                        isCorrect 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {isCorrect ? (
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="text-sm font-medium flex-1">{q.question}</div>
                      </div>
                      <div className="text-sm space-y-1 ml-7">
                        <div>
                          <span className="text-gray-600">Correct: </span>
                          <span className="font-semibold text-green-700">{q.options[q.correctIndex]}</span>
                        </div>
                        {!isCorrect && (
                          <div>
                            <span className="text-gray-600">Your answer: </span>
                            <span className="font-semibold text-red-700">
                              {userAnswer !== null ? q.options[userAnswer] : 'No answer'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons - Fixed at bottom */}
              <div className="flex-shrink-0 flex justify-center gap-3 pt-4 border-t">
                <button 
                  onClick={() => { 
                    setShowResults(false); 
                    setCurrent(0); 
                    setSelected(null);
                    setAnswers(Array(questions.length).fill(null));
                    setShowConfetti(false);
                    setShowPraise(false);
                    setXpAwarded(false); // Reset XP award flag for retry
                  }} 
                  className="px-6 py-3 rounded-xl bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                >
                  Try Again
                </button>
                {onClose && (
                  <button 
                    onClick={onClose} 
                    className="px-6 py-3 rounded-xl bg-amber-600 text-white hover:bg-amber-700 hover:shadow-lg transition-all font-medium transform hover:scale-105"
                  >
                    Continue Exploring
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confetti Animation Styles */}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) translateX(var(--end-x, 0px)) rotate(var(--end-rotation, 720deg));
            opacity: 0;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}
