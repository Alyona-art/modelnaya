import React, { useState } from 'react';
import CustomToggle from './CustomToggle';
import SpeedIcon from '../assets/speed-sign.svg';
import StopIcon from '../assets/stop-sign.svg';
import TransportIcon from '../assets/transport-sign.svg';

const LayerControls = ({ layers, onToggle }) => {
  return (
    <div className='px-4 py-4 md:p-0'>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 hidden md:block">Показать слои</h3>
        <div className="space-y-4">
          <CustomToggle text="Места для остановки" icon={StopIcon} id="stops-desktop" checked={layers.stops} onToggle={() => onToggle('stops')} />
          <CustomToggle text="Разрешенная скорость" icon={SpeedIcon} id="speed-desktop" checked={layers.speed} onToggle={() => onToggle('speed')} />
          <CustomToggle text="Остановки транспорта" icon={TransportIcon} id="transport-desktop" checked={layers.transport} onToggle={() => onToggle('transport')} />
        </div>
    </div>
  );
};

export default LayerControls;
