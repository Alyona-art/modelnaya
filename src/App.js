import React, { useState } from 'react';
import InteractiveMap from './components/InteractiveMap';
import FeedbackButton from './components/FeedbackButton';

function App() {
  const [continueLegacy, setContinueLegacy] = useState(false);

  if (continueLegacy) {
    return (
      <div className="h-screen w-screen relative" style={{ height: '100dvh', width: '100vw', overflow: 'hidden' }}>
        <InteractiveMap />
        <FeedbackButton />
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center px-6 bg-gray-50"
      style={{ height: '100dvh', width: '100vw' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md">
        <p className="text-xl text-gray-800 leading-relaxed">
          Этот проект больше не поддерживается.
          <br />
          Актуальная версия — на{' '}
          <a
            href="https://znak-voprosa.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
          >
            znak-voprosa.ru
          </a>
        </p>
      </div>
      <button
        type="button"
        onClick={() => setContinueLegacy(true)}
        className="mb-10 text-sm text-gray-400 hover:text-gray-500 transition-colors"
      >
        Продолжить пользоваться этой версией
      </button>
    </div>
  );
}

export default App;
