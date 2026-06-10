import routeGraph from '../assets/routeGraph.json';

export const STORAGE_KEY = 'routeGeometryMarkup';
export const SVG_VIEWBOX = { width: 841.89, height: 1825.17 };

export function isExamRelevant(review) {
  return Array.isArray(review) && review.includes('EXAM_RELEVANT');
}

export function actionKey(nodeId, actionId) {
  return `${nodeId}::${actionId}`;
}

export function parseActionKey(key) {
  const [nodeId, actionId] = key.split('::');
  return { nodeId, actionId };
}

export function getPointCount(maneuver) {
  if (maneuver === 'uturn') return 4;
  if (maneuver === 'left' || maneuver === 'right') return 3;
  return 2;
}

export function getPointLabels(maneuver) {
  const count = getPointCount(maneuver);
  if (count === 4) return ['Начало', 'Закругление 1', 'Закругление 2', 'Конец'];
  if (count === 3) return ['Начало', 'Закругление', 'Конец'];
  return ['Начало', 'Конец'];
}

export function getPathType(maneuver) {
  if (hasCurveRounding(maneuver)) return 'polyline-rounded';
  return 'line';
}

export const DEFAULT_CURVE_ROUNDING = 1;

export function hasCurveRounding(maneuver) {
  return maneuver === 'uturn' || maneuver === 'left' || maneuver === 'right';
}

function dist(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Точка на луче from → toward на расстоянии d от from */
function offsetFrom(from, toward, distance) {
  if (distance <= 0) return { x: from.x, y: from.y };
  const len = dist(from, toward);
  if (len === 0) return { x: from.x, y: from.y };
  const k = distance / len;
  return { x: from.x + (toward.x - from.x) * k, y: from.y + (toward.y - from.y) * k };
}

/**
 * Ломаная p0→p1→…→pn со сглаженными углами в промежуточных точках.
 * rounding 0 = острые углы, 1 = максимальное скругление угла.
 */
function buildPolylineWithRoundedCorners(points, rounding) {
  const n = points.length;
  if (n === 0) return '';
  if (n === 1) return `M ${points[0].x} ${points[0].y}`;

  const r = Math.max(0, Math.min(1, rounding));
  if (r <= 0 || n === 2) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < n; i += 1) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  }

  const fillet = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i += 1) {
    const lenIn = dist(points[i - 1], points[i]);
    const lenOut = dist(points[i], points[i + 1]);
    fillet[i] = r * Math.min(lenIn, lenOut) * 0.48;
  }

  for (let i = 1; i < n - 2; i += 1) {
    const segLen = dist(points[i], points[i + 1]);
    const total = fillet[i] + fillet[i + 1];
    if (total > segLen * 0.98) {
      const scale = (segLen * 0.98) / total;
      fillet[i] *= scale;
      fillet[i + 1] *= scale;
    }
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < n - 1; i += 1) {
    const corner = points[i];
    const approach = offsetFrom(corner, points[i - 1], fillet[i]);
    const depart = offsetFrom(corner, points[i + 1], fillet[i]);
    d += ` L ${approach.x} ${approach.y}`;
    d += ` Q ${corner.x} ${corner.y} ${depart.x} ${depart.y}`;
    if (i < n - 2) {
      const nextApproach = offsetFrom(points[i + 1], points[i], fillet[i + 1]);
      d += ` L ${nextApproach.x} ${nextApproach.y}`;
    }
  }

  d += ` L ${points[n - 1].x} ${points[n - 1].y}`;
  return d;
}

export function normalizeEntry(entry) {
  return {
    ...entry,
    curveRounding: hasCurveRounding(entry.maneuver)
      ? (entry.curveRounding ?? DEFAULT_CURVE_ROUNDING)
      : undefined,
  };
}

export function roundPoint(point) {
  return {
    x: Math.round(point.x * 10) / 10,
    y: Math.round(point.y * 10) / 10,
  };
}

/** Shift: выравнивание по горизонтали или вертикали относительно anchor */
export function snapPointToAxis(anchor, point) {
  if (!anchor) return roundPoint(point);
  const dx = Math.abs(point.x - anchor.x);
  const dy = Math.abs(point.y - anchor.y);
  if (dx > dy) {
    return roundPoint({ x: point.x, y: anchor.y });
  }
  return roundPoint({ x: anchor.x, y: point.y });
}

export function buildPathD(points, maneuver, curveRounding = DEFAULT_CURVE_ROUNDING) {
  if (!points.length) return '';
  if (hasCurveRounding(maneuver) && points.length >= 3) {
    return buildPolylineWithRoundedCorners(points, curveRounding);
  }
  if (points.length >= 2) {
    return buildPolylineWithRoundedCorners(points, 0);
  }
  return `M ${points[0].x} ${points[0].y}`;
}

export function getExamRelevantActions() {
  const items = [];

  (routeGraph.nodes || []).forEach((node) => {
    if (!isExamRelevant(node.review)) return;

    (node.actions || []).forEach((action) => {
      if (action.enabled === false) return;
      items.push({
        key: actionKey(node.id, action.id),
        nodeId: node.id,
        actionId: action.id,
        nodeLabel: node.label,
        approach: node.approach || '',
        actionLabel: action.label,
        maneuver: action.maneuver,
        searchText: [
          node.id,
          node.label,
          node.approach,
          action.id,
          action.label,
          action.maneuver,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
        pointCount: getPointCount(action.maneuver),
        pointLabels: getPointLabels(action.maneuver),
      });
    });
  });

  return items.sort((a, b) => a.searchText.localeCompare(b.searchText, 'ru'));
}

export function loadMarkupEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.entries) ? parsed.entries.map(normalizeEntry) : [];
  } catch {
    return [];
  }
}

export function saveMarkupEntries(entries) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      updatedAt: new Date().toISOString(),
      entries,
    })
  );
}

export function buildExportPayload(entries) {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    viewBox: SVG_VIEWBOX,
    edges: entries.map((entry) => ({
      key: entry.key,
      nodeId: entry.nodeId,
      actionId: entry.actionId,
      maneuver: entry.maneuver,
      nodeLabel: entry.nodeLabel,
      actionLabel: entry.actionLabel,
      pathType: getPathType(entry.maneuver),
      points: entry.points,
      curveRounding: entry.curveRounding,
      pathD: buildPathD(entry.points, entry.maneuver, entry.curveRounding ?? DEFAULT_CURVE_ROUNDING),
    })),
  };
}

export function clientToSvgPoint(svgElement, clientX, clientY) {
  if (!svgElement) return null;
  const point = svgElement.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const matrix = svgElement.getScreenCTM();
  if (!matrix) return null;
  const svgPoint = point.matrixTransform(matrix.inverse());
  return roundPoint({ x: svgPoint.x, y: svgPoint.y });
}
