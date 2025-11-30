import React from 'react';
import InteractiveMap from './components/InteractiveMap';

function App() {
  return (
    <div className="h-screen w-screen relative" style={{ height: '100dvh', width: '100vw', overflow: 'hidden' }}>
      <InteractiveMap />
    </div>
  );
}

export default App;
