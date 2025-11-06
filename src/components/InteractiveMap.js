import React, { useState, useRef, useEffect, useCallback } from 'react';
import LayerControls from './LayerControls';
import VideoPopup from './VideoPopup';
import { ReactComponent as ModelnayaSvg } from '../assets/modelnaya.svg';
import VideoData from '../assets/VideoData.json';

const InteractiveMap = () => {
  const [layers, setLayers] = useState({
    stops: true,
    speed: true,
    transport: true,
    pedestrian: true,
    showTurns: true,
  });
  
  const [popup, setPopup] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [interactiveElements, setInteractiveElements] = useState([]);
  
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const handleLayerToggle = (layerName) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  useEffect(() => {
    if(!svgRef.current) return;

    setInteractiveElements(Object.keys(VideoData).map(elementId => 
    svgRef.current.querySelector(`#${elementId}`)
  ).filter(Boolean));
  }, []);

 useEffect(() => {
  const handleSvgClick = (e) => {
    let target = e.target;
    
    while (target && target !== svgRef.current) {
      if (target.id && VideoData[target.id]) {
        e.stopPropagation();
        console.log('Element clicked:', target.id);
        
        setSelectedElement(target);
        setPopup({
          elementId: target.id,
          data: VideoData[target.id]
        });
        setIsPopupOpen(true);
        return;
      }
      target = target.parentElement;
    }
  };

  const handleSvgMouseOver = (e) => {
    let target = e.target;
    
    while (target && target !== svgRef.current) {
      if (target.id && VideoData[target.id]) {
        target.style.filter = 'drop-shadow(0px 0px 2px rgba(18, 17, 56, 0.72))';    
        target.style.cursor = 'pointer';
        return;
      }
      target = target.parentElement;
    }
  };

  const handleSvgMouseOut = (e) => {
    let target = e.target;
    
    while (target && target !== svgRef.current) {
      if (target.id && VideoData[target.id]) {
        if (!e.relatedTarget || !e.relatedTarget.closest(`#${target.id}`)) {
          target.style.filter = 'none';
        }
        return;
      }
      target = target.parentElement;
    }
  };

  if (svgRef.current) {
    const svgElement = svgRef.current;
    
    svgElement.addEventListener('click', handleSvgClick);
    svgElement.addEventListener('mouseover', handleSvgMouseOver);
    svgElement.addEventListener('mouseout', handleSvgMouseOut);

    return () => {
      svgElement.removeEventListener('click', handleSvgClick);
      svgElement.removeEventListener('mouseover', handleSvgMouseOver);
      svgElement.removeEventListener('mouseout', handleSvgMouseOut);
    };
  }
}, []);

  useEffect(() => {
    if (svgRef.current) {
      interactiveElements.forEach(element => {
        if (element) {          
          element.style.strokeWidth = '12px';
          element.style.pointerEvents = 'all';
        }
      });
    }
  }, [interactiveElements]);
  

  const handleMouseDown = (e) => {
    if (e.target.closest('.interactive-element')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, transform.scale * scaleFactor));
    
    setTransform(prev => ({
      x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
      y: mouseY - (mouseY - prev.y) * (newScale / prev.scale),
      scale: newScale
    }));
  }, [transform.scale]);


  // Setup and cleanup effects
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('wheel', handleWheel);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleMouseMove, handleMouseUp, handleWheel]);

  useEffect(() => {
    if (svgRef.current) {
      const stopsGroup = svgRef.current.querySelector('#stops');
      const speedGroup = svgRef.current.querySelector('#speed');
      const transportGroup = svgRef.current.querySelector('#transport');
      const pedestrianGroup = svgRef.current.querySelector('#pedestrian');
      const turnsGroup = svgRef.current.querySelector('#turns');
      const uTurnsGroup = svgRef.current.querySelector('#u-turns');
      
      if (stopsGroup) {
        stopsGroup.classList.toggle('hidden', !layers.stops);
      }
      if (speedGroup) {
        speedGroup.classList.toggle('hidden', !layers.speed);
      }
      if (transportGroup) {
        transportGroup.classList.toggle('hidden', !layers.transport);
      }
      if (pedestrianGroup) {
        pedestrianGroup.classList.toggle('hidden', !layers.pedestrian);
      }
      if (turnsGroup && uTurnsGroup) {
        turnsGroup.classList.toggle('hidden', layers.showTurns);
        uTurnsGroup.classList.toggle('hidden', !layers.showTurns);
      }
    }
  }, [layers]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <LayerControls 
        layers={layers} 
        onToggle={handleLayerToggle}
        svgRef={svgRef}
      />
      
      <div 
        ref={containerRef}
        className="w-full h-full relative bg-gray-50"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <ModelnayaSvg
          ref={svgRef}
          className="svg-container w-full h-full transition-transform duration-100 ease-out" 
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0'
          }}
        />
      </div>

      <VideoPopup
        elementRef={selectedElement}
        popup={popup}
        isOpen={isPopupOpen}
        setIsOpen={setIsPopupOpen}
      />
    </div>
  );
};

export default InteractiveMap;