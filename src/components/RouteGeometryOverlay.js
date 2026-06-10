import React from 'react';
import { buildPathD } from '../utils/routeGraphMarkup';

const RouteGeometryOverlay = ({
  savedEntries,
  draftPoints,
  draftManeuver,
  cursorPoint,
  shiftConstrained,
  focusedEntryKey,
}) => {
  const lastDraft = draftPoints.length > 0 ? draftPoints[draftPoints.length - 1] : null;
  const previewLine =
    lastDraft && cursorPoint
      ? `M ${lastDraft.x} ${lastDraft.y} L ${cursorPoint.x} ${cursorPoint.y}`
      : '';

  const draftSegments = [];
  for (let i = 1; i < draftPoints.length; i += 1) {
    const a = draftPoints[i - 1];
    const b = draftPoints[i];
    draftSegments.push(`M ${a.x} ${a.y} L ${b.x} ${b.y}`);
  }

  const draftCurve =
    draftPoints.length >= 3 && draftManeuver
      ? buildPathD(draftPoints, draftManeuver)
      : '';

  return (
    <g aria-hidden>
      {savedEntries.map((entry) => {
        const isFocused = entry.key === focusedEntryKey;
        return (
        <g key={entry.key}>
          <path
            d={buildPathD(entry.points, entry.maneuver, entry.curveRounding ?? 1)}
            fill="none"
            stroke={isFocused ? '#1d4ed8' : '#2563eb'}
            strokeWidth={isFocused ? '3' : '2'}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          {entry.points.map((p, i) => (
            <circle
              key={`${entry.key}-${i}`}
              cx={p.x}
              cy={p.y}
              r={i === 0 ? 2 : 1.6}
              fill={i === entry.points.length - 1 ? '#16a34a' : '#2563eb'}
              stroke="#ffffff"
              strokeWidth="0.6"
            />
          ))}
        </g>
      );
      })}

      {draftPoints.length < 3 &&
        draftSegments.map((d, i) => (
          <path
            key={`draft-seg-${i}`}
            d={d}
            fill="none"
            stroke="#ea580c"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}

      {draftCurve && draftPoints.length >= 3 && (
        <path
          d={draftCurve}
          fill="none"
          stroke="#ea580c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {previewLine && (
        <path
          d={previewLine}
          fill="none"
          stroke={shiftConstrained ? '#0284c7' : '#f59e0b'}
          strokeWidth="1.6"
          strokeDasharray="2 2"
          strokeLinecap="round"
        />
      )}

      {draftPoints.map((p, i) => (
        <circle
          key={`draft-${i}`}
          cx={p.x}
          cy={p.y}
          r="2"
          fill="#ea580c"
          stroke="#ffffff"
          strokeWidth="0.6"
        />
      ))}

      {cursorPoint && (
        <>
          <circle
            cx={cursorPoint.x}
            cy={cursorPoint.y}
            r="1.6"
            fill={shiftConstrained ? '#0284c7' : '#fbbf24'}
            stroke="#ffffff"
            strokeWidth="0.6"
          />
          {shiftConstrained && lastDraft && (
            <>
              <line
                x1={lastDraft.x}
                y1={lastDraft.y}
                x2={lastDraft.x}
                y2={cursorPoint.y}
                stroke="#0284c7"
                strokeWidth="0.4"
                strokeDasharray="1 1"
                opacity="0.5"
              />
              <line
                x1={lastDraft.x}
                y1={cursorPoint.y}
                x2={cursorPoint.x}
                y2={cursorPoint.y}
                stroke="#0284c7"
                strokeWidth="0.4"
                strokeDasharray="1 1"
                opacity="0.5"
              />
            </>
          )}
        </>
      )}
    </g>
  );
};

export default RouteGeometryOverlay;
