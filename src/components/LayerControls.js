import React from 'react';
import CustomToggle from './CustomToggle';
import SpeedIcon from '../assets/speed-sign.svg';
import StopIcon from '../assets/stop-sign.svg';
import TransportIcon from '../assets/transport-sign.svg';import { IoBuildOutline } from "react-icons/io5";

const LayerControls = ({ layers, onToggle }) => {
  return (
    <div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex flex-col items-center text-sm font-medium text-black px-3 py-1 rounded shadow-sm">
        <IoBuildOutline className='w-6 h-6'/>
        Скоро будет доступно
        </div>
      </div>
    <div className='grow p-4 md:p-0 md:pt-4 md:border-t border-l md:border-l-0 md:border-gray-200 flex flex-col gap-4 items-center md:items-start opacity-25 pointer-events-none relative'>
      
      <CustomToggle text="Места для остановки" icon={<CustomIcon icon={StopIcon}/>} id="stops-desktop" checked={layers.stops} onToggle={() => {}} />
      <CustomToggle text="Разрешенная скорость" icon={<CustomIcon icon={SpeedIcon}/>} id="speed-desktop" checked={layers.speed} onToggle={() => {}} />
      <CustomToggle text="Остановки транспорта" icon={<CustomIcon icon={TransportIcon}/>} id="transport-desktop" checked={layers.transport} onToggle={() => {}} />
    </div>
    </div>
  );
};

export default LayerControls;

const CustomIcon = ({ icon })=> {
  return (<img src={icon} alt="" class="w-5 h-5 cursor-pointer" />);
}
