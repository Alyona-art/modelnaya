import React from 'react';
import CustomToggle from './CustomToggle';
import SpeedIcon from '../assets/speed-sign.svg';
import StopIcon from '../assets/stop-sign.svg';
import TransportIcon from '../assets/transport-sign.svg';

const LAYER_CONTROLS = [
  { key: 'stopLimits', text: 'Места для остановки', icon: StopIcon },
  { key: 'speedLimits', text: 'Разрешенная скорость', icon: SpeedIcon },
  { key: 'busStop', text: 'Остановки транспорта', icon: TransportIcon },
];

const LayerControls = ({ layers, onToggle }) => {
  return (
    <div className="grow flex flex-col min-h-0">
      <div className='p-4 md:p-0 md:pt-4 md:border-t border-l md:border-l-0 md:border-gray-200 relative w-full h-fit self-start'>
        <div className='flex flex-col gap-4 items-center md:items-start'>
          {LAYER_CONTROLS.map(({ key, text, icon }) => (
            <CustomToggle
              key={key}
              text={text}
              icon={<CustomIcon icon={icon} />}
              id={`layer-${key}`}
              checked={layers[key]}
              onToggle={() => onToggle(key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayerControls;

const CustomIcon = ({ icon })=> {
  return (<img src={icon} alt="" className="w-5 h-5 cursor-pointer" />);
}
