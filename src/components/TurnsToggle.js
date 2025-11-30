import React from 'react';
import CustomToggle from './CustomToggle';
import {MdOutlineTurnLeft, MdOutlineTurnRight , MdOutlineUTurnLeft } from "react-icons/md";

const TurnsToggle = ({ showLeftTurns, showRightTurns, showUTurns, onToggleLeft, onToggleRight, onToggleU }) => {
  return (
    <div className="grow p-4 md:p-0 flex flex-col gap-4 md:pb-4 justify-center items-center md:items-start">
      <CustomToggle text="Левые повороты" icon={<MdOutlineTurnLeft/>} id="left-turns" checked={showLeftTurns} onToggle={onToggleLeft} />
      <CustomToggle text="Правые повороты" icon={<MdOutlineTurnRight/>} id="right-turns" checked={showRightTurns} onToggle={onToggleRight} />
      <CustomToggle text="Развороты" icon={<MdOutlineUTurnLeft/>} id="u-turns" checked={showUTurns} onToggle={onToggleU} />
    </div>
  );
};

export default TurnsToggle;
