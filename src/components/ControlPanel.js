import React, { useState } from 'react';
import ExportSection from './ExportSection';
import LayerControls from './LayerControls';
import TurnsToggle from './TurnsToggle';

const ControlPanel = ({ layers, onToggle, svgRef }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 md:bottom-5 md:left-5 md:right-auto bg-white/95 border-t md:border border-gray-200 md:rounded-lg md:p-4 shadow-lg backdrop-blur-sm z-50 md:min-w-48 max-h-[calc(100vh-1rem)] md:max-h-none overflow-y-auto md:overflow-visible">
      {/* Mobile: Compact horizontal layout */}
        <div className="md:hidden flex flex-col">
            <div className=' flex flex-col items-stretch justify-between'>
                <div className='grow flex flex-row items-stretch '>
                  <TurnsToggle
                  showLeftTurns={layers.showLeftTurns}
                  showRightTurns={layers.showRightTurns}
                  showUTurns={layers.showUTurns}
                  onToggleLeft={() => onToggle('showLeftTurns')}
                  onToggleRight={() => onToggle('showRightTurns')}
                  onToggleU={() => onToggle('showUTurns')}
                  />
                  <LayerControls layers={layers} onToggle={onToggle} />
                </div>
            </div>
            <ExportSection svgRef={svgRef} />
        </div>

      {/* Desktop: Vertical layout */}
      <div className="hidden md:block items-center content-center">
      <TurnsToggle
          showLeftTurns={layers.showLeftTurns}
          showRightTurns={layers.showRightTurns}
          showUTurns={layers.showUTurns}
          onToggleLeft={() => onToggle('showLeftTurns')}
          onToggleRight={() => onToggle('showRightTurns')}
          onToggleU={() => onToggle('showUTurns')}
        />
        <LayerControls 
          layers={layers} 
          onToggle={onToggle}
        />
      <div className='grow flex items-center justify-center mt-4'>
        </div>
        <ExportSection svgRef={svgRef} />
      </div>
    </div>
  );
};

export default ControlPanel;
