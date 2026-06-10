import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const OVERLAY_ID = 'route-geometry-overlay';

const RouteGeometryPortal = ({ svgElement, children }) => {
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    if (!svgElement) {
      setMountNode(null);
      return;
    }

    let group = svgElement.querySelector(`#${OVERLAY_ID}`);
    if (!group) {
      group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('id', OVERLAY_ID);
      group.setAttribute('pointer-events', 'none');
      svgElement.appendChild(group);
    }

    setMountNode(group);

    return () => {
      group?.remove();
      setMountNode(null);
    };
  }, [svgElement]);

  if (!mountNode) return null;
  return createPortal(children, mountNode);
};

export default RouteGeometryPortal;
