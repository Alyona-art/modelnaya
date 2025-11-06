import React, { useEffect, useRef } from 'react';
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
          <div className="flex flex-row justify-between gap-2">
            <div className="text-bold flex whitespace-pre-wrap text-xl [overflow-wrap:anywhere]">
              <span className="font-medium">{popup.data.title}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-full hover:bg-gray-100 p-1 transition-colors"
            >
              <span className="text-xl font-bold text-gray-500 hover:text-gray-700">×</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {popup.data.videos.map((video, index) => (
              <div key={index} className="flex flex-row gap-2">
                <div className="w-6">
                  <span className="text-2xl">▶️</span>
                </div>
                <div className="flex w-full flex-col">
                  <button
                    onClick={() => handleVideoClick(video.url)}
                    className="text-left text-blue-600 hover:text-blue-800 hover:underline py-1 transition-colors"
                  >
                    {video.title}
                  </button>
                  {video.timecode && (
                    <span className="text-xs text-gray-500 mt-1 font-mono">
                      Time: {video.timecode}
                    </span>
                  )}
                </div>
              </div>
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
