import React, { useState } from 'react';
import ExportSection from './ExportSection';
import LayerControls from './LayerControls';
import TurnsToggle from './TurnsToggle';

const ControlPanel = ({ layers, onToggle, svgRef }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 md:bottom-5 md:left-5 md:right-auto bg-white/95 border-t md:border border-gray-200 md:rounded-lg md:p-4 shadow-lg backdrop-blur-sm z-50 md:min-w-48 max-h-[calc(100vh-1rem)] md:max-h-none overflow-y-auto md:overflow-visible">
      {/* Mobile: Compact horizontal layout */}
        <div className="md:hidden flex gap-2">
            <LayerControls layers={layers} onToggle={onToggle} />
            <div className='grow flex flex-col items-stretch border-l border-gray-200'>
                <div className='grow flex items-center justify-center'>
                <TurnsToggle
                isShowTurns={layers.showTurns}
                showTurns={() => onToggle('showTurns')}
                /></div>
                <ExportSection svgRef={svgRef} />
            </div>
        </div>

      {/* Desktop: Vertical layout */}
      <div className="hidden md:block items-center content-center">
        <LayerControls 
          layers={layers} 
          onToggle={onToggle}
        />
      <div className='grow flex items-center justify-center mt-6'>
        <TurnsToggle
          isShowTurns={layers.showTurns}
          showTurns={() => onToggle('showTurns')}
        /></div>
        <ExportSection svgRef={svgRef} />
      </div>
    </div>
  );
};

export default ControlPanel;
