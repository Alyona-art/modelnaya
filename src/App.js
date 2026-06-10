import React from 'react';
import InteractiveMap from './components/InteractiveMap';
import RouteGeometryEditor from './components/RouteGeometryEditor';
import FeedbackButton from './components/FeedbackButton';

function App() {
  const isMarkupMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('markup') === '1';

  return (
    <div className="h-screen w-screen relative" style={{ height: '100dvh', width: '100vw', overflow: 'hidden' }}>
      {isMarkupMode ? <RouteGeometryEditor /> : <InteractiveMap />}
      {!isMarkupMode && <FeedbackButton />}
    </div>
  );
}

export default App;
