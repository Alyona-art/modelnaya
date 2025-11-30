import React from 'react';
import CustomToggle from './CustomToggle';
import SpeedIcon from '../assets/speed-sign.svg';
import StopIcon from '../assets/stop-sign.svg';
import TransportIcon from '../assets/transport-sign.svg';import { IoBuildOutline } from "react-icons/io5";

const LayerControls = ({ layers, onToggle }) => {
  return (
    <div className="grow flex flex-col min-h-0">
      <div className='p-4 md:p-0 md:pt-4 md:border-t border-l md:border-l-0 md:border-gray-200 relative w-full h-fit self-start'>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-sm font-medium text-black">
          <IoBuildOutline className='w-6 h-6'/>
          Скоро будет доступно
        </div>
        <div className='flex flex-col gap-4 items-center md:items-start opacity-25 pointer-events-none'>
          <CustomToggle text="Места для остановки" icon={<CustomIcon icon={StopIcon}/>} id="stops-desktop" checked={layers.stops} onToggle={() => {}} />
          <CustomToggle text="Разрешенная скорость" icon={<CustomIcon icon={SpeedIcon}/>} id="speed-desktop" checked={layers.speed} onToggle={() => {}} />
          <CustomToggle text="Остановки транспорта" icon={<CustomIcon icon={TransportIcon}/>} id="transport-desktop" checked={layers.transport} onToggle={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default LayerControls;

const CustomIcon = ({ icon })=> {
  return (<img src={icon} alt="" class="w-5 h-5 cursor-pointer" />);
}
