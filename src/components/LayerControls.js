import React, { useState } from 'react';
import CustomToggle from './CustomToggle';
import SpeedIcon from '../assets/speed-sign.svg';
import StopIcon from '../assets/stop-sign.svg';
import TransportIcon from '../assets/transport-sign.svg';

const LayerControls = ({ layers, onToggle }) => {
  return (
    <div className='grow p-4 md:p-0 md:pt-4 md:border-t border-l md:border-l-0 md:border-gray-200 flex flex-col gap-4 items-center md:items-start'>
      <CustomToggle text="Места для остановки" icon={<CustomIcon icon={StopIcon}/>} id="stops-desktop" checked={layers.stops} onToggle={() => onToggle('stops')} />
      <CustomToggle text="Разрешенная скорость" icon={<CustomIcon icon={SpeedIcon}/>} id="speed-desktop" checked={layers.speed} onToggle={() => onToggle('speed')} />
      <CustomToggle text="Остановки транспорта" icon={<CustomIcon icon={TransportIcon}/>} id="transport-desktop" checked={layers.transport} onToggle={() => onToggle('transport')} />
    </div>
  );
};

export default LayerControls;

const CustomIcon = ({ icon })=> {
  return (<img src={icon} alt="" class="w-5 h-5 cursor-pointer" />);
}
