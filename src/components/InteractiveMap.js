import React, { useState, useRef, useEffect, useCallback } from 'react';
import ControlPanel from './ControlPanel';
import VideoPopup from './VideoPopup';
import modelnayaSvgUrl from '../assets/modelnaya-raw.svg';
import VideoData from '../assets/VideoData.json';
import { clientToSvgPoint } from '../utils/routeGraphMarkup';
import RouteGeometryPortal from './RouteGeometryPortal';

// Centralized layer configuration
const LAYER_CONFIG = {
  stopLimits: { svgSelector: '#stop-limits' },
  speedLimits: { svgSelector: '#speed-limits' },
  busStop: { svgSelector: '#bus-stop' },
  pedestrian: { svgSelector: '#pedestrian' },
  showLeftTurns: { svgSelector: '#l-turns' },
  showRightTurns: { svgSelector: '#r-turns' },
  showUTurns: { svgSelector: '#u-turns' },
};

const MARKUP_PASS_THROUGH_SELECTORS = [
  '#l-turns',
  '#r-turns',
  '#u-turns',
  '#others',
  '#ploshadka',
];

const InteractiveMap = ({
  markupMode = false,
  panMode = false,
  onMarkupClick,
  onMarkupMove,
  markupOverlay = null,
}) => {
  const [layers, setLayers] = useState({
    stopLimits: true,
    speedLimits: true,
    busStop: true,
    pedestrian: true,
    showLeftTurns: true,
    showRightTurns: true,
    showUTurns: true,
  });
  
  const [popup, setPopup] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return { x: 0, y: 0, scale: isMobile ? 1 : 0.7 };
  });
  const [interactiveElements, setInteractiveElements] = useState([]);
  const [lastTouchDistance, setLastTouchDistance] = useState(null);
  const [lastTouchCenter, setLastTouchCenter] = useState(null);
  const [svgContent, setSvgContent] = useState('');
  const [mapSvgNode, setMapSvgNode] = useState(null);
  
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const svgContainerRef = useRef(null);
  const isCenteredRef = useRef(false);
  const didDragRef = useRef(false);
  const touchStartRef = useRef(null);

  // Load SVG content
  useEffect(() => {
    fetch(modelnayaSvgUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        setSvgContent(text);
      })
      .catch(error => {
        console.error('Error loading SVG:', error);
        console.error('SVG URL:', modelnayaSvgUrl);
      });
  }, []);

  const handleLayerToggle = (layerName) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  useEffect(() => {
    if(!svgContainerRef.current || !svgContent) return;
    
    let timeoutId;
    let svgElement = null;
    let cleanup = null;

    // Wait for DOM to update after dangerouslySetInnerHTML
    timeoutId = setTimeout(() => {
      // Find the SVG element inside the container
      svgElement = svgContainerRef.current.querySelector('svg');
      if (svgElement) {
        svgRef.current = svgElement;
        setMapSvgNode(svgElement);
        setInteractiveElements(Object.keys(VideoData).map(elementId => 
          svgElement.querySelector(`#${elementId}`)
        ).filter(Boolean));

        // Set up event listeners after SVG is loaded
        const handleSvgClick = (e) => {
          if (markupMode) return;

          let target = e.target;
          
          while (target && target !== svgElement) {
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
          
          while (target && target !== svgElement) {
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
          
          while (target && target !== svgElement) {
            if (target.id && VideoData[target.id]) {
              if (!e.relatedTarget || !e.relatedTarget.closest(`#${target.id}`)) {
                target.style.filter = 'none';
              }
              return;
            }
            target = target.parentElement;
          }
        };
        
        if (!markupMode) {
          svgElement.addEventListener('click', handleSvgClick);
          svgElement.addEventListener('mouseover', handleSvgMouseOver);
          svgElement.addEventListener('mouseout', handleSvgMouseOut);

          cleanup = () => {
            svgElement.removeEventListener('click', handleSvgClick);
            svgElement.removeEventListener('mouseover', handleSvgMouseOver);
            svgElement.removeEventListener('mouseout', handleSvgMouseOut);
          };
        }
      }
    }, 0);

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (cleanup) {
        cleanup();
      }
    };
  }, [svgContent, markupMode]);

  // Center map on desktop after SVG loads
  useEffect(() => {
    if (!svgContent) {
      isCenteredRef.current = false;
      setMapSvgNode(null);
      return;
    }
    
    if (transform.scale >= 1) {
      isCenteredRef.current = true;
      return;
    }
    
    const timeoutId = setTimeout(() => {
      if (svgRef.current && containerRef.current && !isCenteredRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        const scaledSvgWidth = svgRect.width * transform.scale;
        const scaledSvgHeight = svgRect.height * transform.scale;
        
        const centerX = (containerRect.width - scaledSvgWidth) / 2;
        const centerY = (containerRect.height - scaledSvgHeight) / 2;
        
        setTransform(prev => ({
          ...prev,
          x: centerX,
          y: centerY
        }));
        
        isCenteredRef.current = true;
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [svgContent, transform.scale]);

  useEffect(() => {
    if (!svgRef.current) return;

    interactiveElements.forEach((element) => {
      if (element) {
        element.style.strokeWidth = '';
        element.style.pointerEvents = markupMode ? 'none' : 'all';
        if (!markupMode) {
          element.style.filter = 'none';
          element.style.cursor = '';
        }
      }
    });

    MARKUP_PASS_THROUGH_SELECTORS.forEach((selector) => {
      const group = svgRef.current.querySelector(selector);
      if (group) {
        group.style.pointerEvents = markupMode ? 'none' : '';
      }
    });
  }, [interactiveElements, markupMode, svgContent]);
  

  const markupModifiers = (e) => ({ shiftKey: e.shiftKey });

  const handleMarkupClick = useCallback((e) => {
    if (!markupMode || panMode || !onMarkupClick || !svgRef.current) return;
    if (didDragRef.current) return;
    const point = clientToSvgPoint(svgRef.current, e.clientX, e.clientY);
    if (point) onMarkupClick(point, markupModifiers(e));
  }, [markupMode, panMode, onMarkupClick]);

  const handleMarkupMove = useCallback((e) => {
    if (!markupMode || panMode || !onMarkupMove || !svgRef.current) return;
    const point = clientToSvgPoint(svgRef.current, e.clientX, e.clientY);
    if (point) onMarkupMove(point, markupModifiers(e));
  }, [markupMode, panMode, onMarkupMove]);

  const handleMarkupLeave = useCallback(() => {
    if (onMarkupMove) onMarkupMove(null, { shiftKey: false });
  }, [onMarkupMove]);

  const handleMouseDown = (e) => {
    if (markupMode && !panMode) return;
    if (e.target.closest('.interactive-element')) return;
    didDragRef.current = false;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      didDragRef.current = true;
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    } else if (markupMode && !panMode) {
      handleMarkupMove(e);
    }
  }, [isDragging, dragStart, markupMode, panMode, handleMarkupMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const isMobile = window.innerWidth < 768;
    const maxScale = isMobile ? 15 : 5;
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(maxScale, transform.scale * scaleFactor));
    
    setTransform(prev => ({
      x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
      y: mouseY - (mouseY - prev.y) * (newScale / prev.scale),
      scale: newScale
    }));
  }, [transform.scale]);

  const getTouchDistance = (touch1, touch2) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touch1, touch2) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  };

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const center = getTouchCenter(e.touches[0], e.touches[1]);
      const rect = containerRef.current.getBoundingClientRect();
      
      setLastTouchDistance(distance);
      setLastTouchCenter({
        x: center.x - rect.left,
        y: center.y - rect.top
      });
    } else if (e.touches.length === 1) {
      if (markupMode && !panMode) return;
      const touch = e.touches[0];
      if (!touch.target.closest('.interactive-element')) {
        didDragRef.current = false;
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        setIsDragging(true);
        setDragStart({ x: touch.clientX - transform.x, y: touch.clientY - transform.y });
      }
    } else if (markupMode && !panMode && e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      didDragRef.current = false;
    }
  }, [transform.x, transform.y, markupMode, panMode]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const center = getTouchCenter(e.touches[0], e.touches[1]);
      const rect = containerRef.current.getBoundingClientRect();
      
      if (lastTouchDistance && lastTouchCenter) {
        const scaleFactor = distance / lastTouchDistance;
        const maxScale = 15; // Higher max zoom for mobile touch
        const newScale = Math.max(0.1, Math.min(maxScale, transform.scale * scaleFactor));
        const touchCenterX = center.x - rect.left;
        const touchCenterY = center.y - rect.top;
        
        setTransform(prev => ({
          x: touchCenterX - (touchCenterX - prev.x) * (newScale / prev.scale),
          y: touchCenterY - (touchCenterY - prev.y) * (newScale / prev.scale),
          scale: newScale
        }));
        
        setLastTouchDistance(distance);
        setLastTouchCenter({
          x: touchCenterX,
          y: touchCenterY
        });
      }
    } else if (e.touches.length === 1 && isDragging) {
      e.preventDefault();
      didDragRef.current = true;
      const touch = e.touches[0];
      setTransform(prev => ({
        ...prev,
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      }));
    }
  }, [lastTouchDistance, lastTouchCenter, transform.scale, isDragging, dragStart]);

  const handleTouchEnd = useCallback((e) => {
    if (
      markupMode &&
      !panMode &&
      onMarkupClick &&
      svgRef.current &&
      touchStartRef.current &&
      !didDragRef.current
    ) {
      const touch = e.changedTouches[0];
      if (touch) {
        const dx = touch.clientX - touchStartRef.current.x;
        const dy = touch.clientY - touchStartRef.current.y;
        if (Math.hypot(dx, dy) < 12) {
          const point = clientToSvgPoint(svgRef.current, touch.clientX, touch.clientY);
          if (point) onMarkupClick(point, { shiftKey: false });
        }
      }
    }

    setIsDragging(false);
    setLastTouchDistance(null);
    setLastTouchCenter(null);
    touchStartRef.current = null;
  }, [markupMode, panMode, onMarkupClick]);


  // Setup and cleanup effects
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('wheel', handleWheel);
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleMouseMove, handleMouseUp, handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    if (svgRef.current) {
      Object.entries(LAYER_CONFIG).forEach(([layerKey, config]) => {
        const group = svgRef.current.querySelector(config.svgSelector);
        if (group) {
          group.classList.toggle('hidden', !layers[layerKey]);
        }
      });
    }
  }, [layers]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!markupMode && (
        <ControlPanel 
          layers={layers} 
          onToggle={handleLayerToggle}
          svgRef={svgRef}
        />
      )}
      
      <div 
        ref={containerRef}
        className="w-full h-full relative bg-gray-50"
        onMouseDown={handleMouseDown}
        onClick={handleMarkupClick}
        onMouseLeave={markupMode ? handleMarkupLeave : undefined}
        style={{
          cursor: markupMode && !panMode ? 'crosshair' : isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
      >
        {svgContent ? (
          <div
            ref={svgContainerRef}
            className="svg-container relative w-full h-full transition-transform duration-100 ease-out" 
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              transformOrigin: '0 0'
            }}
          >
            <div
              className="w-full h-full [&>svg]:block [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            {markupOverlay && mapSvgNode && (
              <RouteGeometryPortal svgElement={mapSvgNode}>
                {markupOverlay}
              </RouteGeometryPortal>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-gray-500">Загрузка карты...</div>
          </div>
        )}
      </div>

      {!markupMode && (
        <VideoPopup
          elementRef={selectedElement}
          popup={popup}
          isOpen={isPopupOpen}
          setIsOpen={setIsPopupOpen}
        />
      )}
    </div>
  );
};

export default InteractiveMap;