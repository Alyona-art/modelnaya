import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CustomToggle from './CustomToggle';
import ExportSection from './ExportSection';

const LayerControls = ({ layers, onToggle, svgRef }) => {
  return (
    <div className="absolute top-5 left-5 bg-white/95 border border-gray-200 rounded-lg p-4 shadow-lg backdrop-blur-sm z-50 min-w-48">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Map Layers</h3>
      <div className="space-y-4 mb-4">
      <CustomToggle text="Места для остановки" id="stops" checked={layers.stops} onToggle={() => onToggle('stops')} />
      <CustomToggle text="Разрешенная скорость" id="speed" checked={layers.speed} onToggle={() => onToggle('speed')} />
      <CustomToggle text="Остановки транспорта" id="transport" checked={layers.transport} onToggle={() => onToggle('transport')} />
      <CustomToggle text="Пешеходные переходы" id="pedestrian" checked={layers.pedestrian} onToggle={() => onToggle('pedestrian')} />
      </div>
      
    <div className="border-t border-gray-200 pt-3 text-xs text-gray-500 space-y-1">   
    </div>

    <div class="inline-flex overflow-hidden border border-gray-200 rounded-lg">
    <label for="u-turns" class="cursor-pointer">
      <input 
        type="radio" 
        name="worktype" 
        id="u-turns" 
        class="sr-only peer" 
        checked={layers.showTurns} 
        onChange={() => onToggle('showTurns')}
      />
      <span class="relative inline-flex items-center h-full py-2 px-3 text-sm peer-checked:bg-black peer-checked:text-white">
        <span>U-turns</span>
      </span>
    </label>
    <label for="turns" class="cursor-pointer">
      <input 
        type="radio" 
        name="worktype" 
        id="turns" 
        class="sr-only peer" 
        checked={!layers.showTurns} 
        onChange={() => onToggle('showTurns')}
      />
      <span class="relative inline-flex items-center h-full py-2 px-3 text-sm peer-checked:bg-black peer-checked:text-white">
        <span>Turns</span>
      </span>
    </label>
  </div>
      
      {/* Export Section */}
      <ExportSection svgRef={svgRef} />
    </div>
  );
};

export default LayerControls;
