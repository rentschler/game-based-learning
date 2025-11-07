import { useState } from 'react';
import './App.css'
import WatercolorAtlasExplore from './pages/Explore'
import Onboarding from './pages/Onboarding'
import MobileViewport from './components/MobileViewport'

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <MobileViewport>
      {showOnboarding ? (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      ) : (
        <WatercolorAtlasExplore />
      )}
    </MobileViewport>
  )
}

export default App
