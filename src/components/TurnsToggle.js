import React from 'react';

const TurnsToggle = ({ isShowTurns, showTurns }) => {
  return (
    <div className="inline-flex overflow-hidden border border-gray-200 rounded-3xl">
          <label htmlFor="u-turns" className="cursor-pointer">
            <input 
              type="radio"
              id="u-turns" 
              name="turns-type"
              className="sr-only" 
              checked={isShowTurns} 
              onChange={() => !isShowTurns && showTurns()}
            />
            <span className={`relative inline-flex items-center h-full py-2 px-4 text-sm ${isShowTurns ? 'bg-black text-white' : 'bg-white text-gray-700'}`}>
              <span>Развороты</span>
            </span>
          </label>
          <label htmlFor="turns" className="cursor-pointer">
            <input 
              type="radio"
              id="turns" 
              name="turns-type"
              className="sr-only" 
              checked={!isShowTurns} 
              onChange={() => isShowTurns && showTurns()}
            />
            <span className={`relative inline-flex items-center h-full py-2 px-4 text-sm ${!isShowTurns ? 'bg-black text-white' : 'bg-white text-gray-700'}`}>
              <span>Повороты</span>
            </span>
          </label>
        </div>
  );
};

export default TurnsToggle;
