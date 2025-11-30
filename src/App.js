import React from 'react';
import InteractiveMap from './components/InteractiveMap';
import FeedbackButton from './components/FeedbackButton';

function App() {
  return (
    <div className="h-screen w-screen relative" style={{ height: '100dvh', width: '100vw', overflow: 'hidden' }}>
      <InteractiveMap />
      <FeedbackButton />
    </div>
  );
}

export default App;
