import React, { useEffect, useRef } from 'react';
import { IoClose, IoTimeOutline  } from "react-icons/io5";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';

const VideoPopup = ({ 
  elementRef, 
  popup, 
  isOpen, 
  setIsOpen 
}) => {
  const arrowRef = useRef(null);
  
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    placement: 'bottom',
    middleware: [
      offset(({ rects }) => -rects.reference.height / 2 + 16),
      flip({ fallbackAxisSideDirection: 'end' }),
      shift(),
      arrow({
        element: arrowRef,
        padding: 16,
      }),
    ],
    elements: {
      reference: elementRef,
    },
  });

  useEffect(() => {
    refs.setPositionReference(elementRef);
  }, [elementRef, refs]);

  // Transition effect
  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    common: {
      transitionProperty: 'all',
    },
    duration: 200,
  });

  // Event listeners to change the open state
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'click',
    referencePress: true,
    capture: {
      outsidePress: false,
    },
  });
  
  // Role props for screen readers
  const role = useRole(context);

  // Merge all the interactions into prop getters
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const handleVideoClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isMounted || !popup) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles, ...transitionStyles }}
          {...getFloatingProps()}
          className="z-50 flex max-w-md flex-col rounded-xl bg-white p-4 text-sm text-gray-800 shadow-xl border border-gray-200"
        >
          <div className="flex flex-row items-start justify-between gap-2 mb-2">
            <div className="text-bold flex whitespace-pre-wrap text-xl [overflow-wrap:anywhere]">
              <span className="font-medium text-base">{popup.data.title}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-full hover:bg-gray-100 p-2 transition-colors"
            >
              <IoClose className='w-4 h-4'/>
            </button>
          </div>

          <div className="flex flex-col gap-2 max-h-[50vh] md:max-h-[80vh] overflow-y-auto">
            {popup.data.videos.map((video, index) => (
              <button
              onClick={() => handleVideoClick(video.url)}>
              <div key={index} className="flex flex-row items-center gap-1">
                  <span className="text-xl">▶️</span>
                <div className="flex w-full flex-col">
                  <div
                    className="text-left text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {`${video.title != undefined ? video.title : "Видео"} ${video.date!=undefined ? `(${video.date})`: ``}`}
                  </div>
                  {video.time && (
                    <span className="flex flex-row items-center gap-1 text-xs text-gray-500 font-mono">
                      <IoTimeOutline /> 
                      {video.time}
                    </span>
                  )}
                </div>
              </div>
              </button>
            ))}
          </div>

          <FloatingArrow
            ref={arrowRef}
            context={context}
            className="fill-white"
          />
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};

export default VideoPopup;
