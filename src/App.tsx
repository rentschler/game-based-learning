import { useState } from 'react';
import './App.css'
import WatercolorAtlasExplore from './pages/Explore'
import Onboarding from './pages/Onboarding'

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <div className="App w-screen h-screen m-0 p-0">
      {showOnboarding ? (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      ) : (
        <WatercolorAtlasExplore />
      )}
    </div>
  )
}

export default App
