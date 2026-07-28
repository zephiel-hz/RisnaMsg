import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import BackgroundLayer from './components/BackgroundLayer';
import WelcomeStage from './components/WelcomeStage';
import PolaroidStage from './components/PolaroidStage';
import LetterStage from './components/LetterStage';

type Stage = 'welcome' | 'polaroids' | 'letter';

function App() {
  const [stage, setStage] = useState<Stage>('welcome');

  const handleReplay = () => {
    setStage('welcome');
  };

  return (
    <div className="min-h-[100dvh] w-full relative overflow-hidden">
      {/* Background layer - always present */}
      <BackgroundLayer />

      {/* Stage content */}
      <div className="relative" style={{ zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {stage === 'welcome' && (
            <WelcomeStage 
              key="welcome"
              onComplete={() => setStage('polaroids')} 
            />
          )}

          {stage === 'polaroids' && (
            <PolaroidStage
              key="polaroids"
              onComplete={() => setStage('letter')}
            />
          )}

          {stage === 'letter' && (
            <LetterStage
              key="letter"
              onReplay={handleReplay}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
