import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import InteractiveMap from './InteractiveMap';
import RouteGeometryOverlay from './RouteGeometryOverlay';
import {
  buildExportPayload,
  getExamRelevantActions,
  getPointLabels,
  hasCurveRounding,
  loadMarkupEntries,
  normalizeEntry,
  saveMarkupEntries,
  snapPointToAxis,
} from '../utils/routeGraphMarkup';

const RouteGeometryEditor = () => {
  const [entries, setEntries] = useState(() => loadMarkupEntries());
  const [search, setSearch] = useState('');
  const [selectedKey, setSelectedKey] = useState(null);
  const [draftPoints, setDraftPoints] = useState([]);
  const [panMode, setPanMode] = useState(false);
  const [panelTab, setPanelTab] = useState('pending');
  const [copyStatus, setCopyStatus] = useState('');
  const [cursorPoint, setCursorPoint] = useState(null);
  const [shiftHeld, setShiftHeld] = useState(false);
  const [focusedEntryKey, setFocusedEntryKey] = useState(null);
  const lastRawPointRef = useRef(null);

  const allActions = useMemo(() => getExamRelevantActions(), []);
  const completedKeys = useMemo(() => new Set(entries.map((e) => e.key)), [entries]);

  const pendingActions = useMemo(
    () => allActions.filter((item) => !completedKeys.has(item.key)),
    [allActions, completedKeys]
  );

  const selectedAction = useMemo(() => {
    if (!selectedKey) return null;
    return allActions.find((item) => item.key === selectedKey) || null;
  }, [allActions, selectedKey]);

  const filteredPending = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pendingActions;
    return pendingActions.filter((item) => item.searchText.includes(q));
  }, [pendingActions, search]);

  const draftManeuver = selectedAction?.maneuver || null;
  const pointLabels = draftManeuver ? getPointLabels(draftManeuver) : [];
  useEffect(() => {
    saveMarkupEntries(entries);
  }, [entries]);

  const resetDraft = useCallback(() => {
    setDraftPoints([]);
    setCursorPoint(null);
    lastRawPointRef.current = null;
  }, []);

  const resolvePoint = useCallback(
    (point, shiftKey) => {
      if (!shiftKey || draftPoints.length === 0) return point;
      return snapPointToAxis(draftPoints[draftPoints.length - 1], point);
    },
    [draftPoints]
  );

  const handleMapMove = useCallback(
    (point, { shiftKey }) => {
      if (!point || !selectedAction || panMode) {
        setCursorPoint(null);
        return;
      }
      lastRawPointRef.current = point;
      setShiftHeld(shiftKey);
      setCursorPoint(resolvePoint(point, shiftKey));
    },
    [selectedAction, panMode, resolvePoint]
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Shift' || !lastRawPointRef.current || !selectedAction || panMode) return;
      setShiftHeld(true);
      setCursorPoint(resolvePoint(lastRawPointRef.current, true));
    };
    const onKeyUp = (e) => {
      if (e.key !== 'Shift' || !lastRawPointRef.current) return;
      setShiftHeld(false);
      setCursorPoint(lastRawPointRef.current);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [selectedAction, panMode, resolvePoint]);

  const handleSelectAction = (key) => {
    setSelectedKey(key);
    setDraftPoints([]);
    setPanMode(false);
    setPanelTab('pending');
  };

  const handleCancelPlacement = () => {
    setSelectedKey(null);
    resetDraft();
  };

  const handleMapClick = useCallback(
    (point, { shiftKey }) => {
      if (!selectedAction || panMode) return;

      const placed = resolvePoint(point, shiftKey);

      setDraftPoints((prev) => {
        const next = [...prev, placed];
        if (next.length < selectedAction.pointCount) {
          return next;
        }

        const entry = normalizeEntry({
          key: selectedAction.key,
          nodeId: selectedAction.nodeId,
          actionId: selectedAction.actionId,
          nodeLabel: selectedAction.nodeLabel,
          actionLabel: selectedAction.actionLabel,
          maneuver: selectedAction.maneuver,
          points: next,
          curveRounding: 1,
          createdAt: new Date().toISOString(),
        });

        setEntries((current) => {
          const without = current.filter((e) => e.key !== entry.key);
          return [...without, entry];
        });
        setFocusedEntryKey(entry.key);
        setPanelTab('done');
        setSelectedKey(null);
        setCursorPoint(null);
        lastRawPointRef.current = null;
        return [];
      });
    },
    [panMode, selectedAction, resolvePoint]
  );

  const handleDelete = (key) => {
    setEntries((current) => current.filter((e) => e.key !== key));
    if (selectedKey === key) {
      setSelectedKey(null);
      resetDraft();
    }
    if (focusedEntryKey === key) {
      setFocusedEntryKey(null);
    }
  };

  const handleRoundingChange = (key, value) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.key === key ? { ...entry, curveRounding: value / 100 } : entry
      )
    );
  };

  const handleExport = () => {
    const payload = buildExportPayload(entries);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `route-geometry-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const payload = buildExportPayload(entries);
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopyStatus('Скопировано');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch {
      setCopyStatus('Ошибка копирования');
    }
  };

  const placementHint = selectedAction
    ? draftPoints.length < selectedAction.pointCount
      ? `Точка ${draftPoints.length + 1}/${selectedAction.pointCount}: ${
          pointLabels[draftPoints.length]
        }${draftPoints.length > 0 ? ' · Shift — по горизонтали/вертикали' : ''}`
      : 'Сохранение…'
    : panMode
      ? 'Режим перемещения карты'
      : 'Выберите ноду и действие в списке';

  return (
    <div className="h-full w-full relative flex flex-col md:flex-row">
      <div className="flex-1 min-h-0 relative">
        <InteractiveMap
          markupMode
          panMode={panMode}
          onMarkupClick={handleMapClick}
          onMarkupMove={handleMapMove}
          markupOverlay={
            <RouteGeometryOverlay
              savedEntries={entries}
              draftPoints={draftPoints}
              draftManeuver={draftManeuver}
              cursorPoint={cursorPoint}
              shiftConstrained={shiftHeld && draftPoints.length > 0}
              focusedEntryKey={focusedEntryKey}
            />
          }
        />

        <div className="absolute top-3 left-3 z-30 flex flex-wrap gap-2 max-w-[calc(100%-1rem)]">
          <span className="px-3 py-1.5 rounded-full bg-amber-500 text-white text-sm font-medium shadow">
            Разметка маршрутов
          </span>
          <button
            type="button"
            onClick={() => setPanMode((v) => !v)}
            className={`px-3 py-1.5 rounded-full text-sm shadow ${
              panMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            {panMode ? 'Перемещение карты' : 'Расстановка точек'}
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 md:right-auto md:max-w-md z-30 px-3 py-2 rounded-lg bg-white/95 border border-gray-200 shadow text-sm text-gray-700">
          {placementHint}
        </div>
      </div>

      <aside className="w-full md:w-96 shrink-0 border-t md:border-t-0 md:border-l border-gray-200 bg-white flex flex-col max-h-[45vh] md:max-h-none">
        <div className="p-3 border-b border-gray-200 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPanelTab('pending')}
              className={`flex-1 py-2 text-sm rounded ${
                panelTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Осталось ({pendingActions.length})
            </button>
            <button
              type="button"
              onClick={() => setPanelTab('done')}
              className={`flex-1 py-2 text-sm rounded ${
                panelTab === 'done' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Готово ({entries.length})
            </button>
          </div>

          {panelTab === 'pending' && (
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск ноды или действия…"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExport}
              disabled={!entries.length}
              className="flex-1 py-2 text-sm rounded bg-gray-800 text-white disabled:opacity-40"
            >
              Экспорт JSON
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!entries.length}
              className="flex-1 py-2 text-sm rounded border border-gray-300 disabled:opacity-40"
            >
              {copyStatus || 'Копировать'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {panelTab === 'pending' && (
            <>
              {selectedAction && (
                <div className="p-3 rounded-lg border-2 border-amber-400 bg-amber-50 text-sm space-y-2">
                  <div className="font-medium">{selectedAction.nodeLabel}</div>
                  <div className="text-gray-600">{selectedAction.approach}</div>
                  <div>
                    {selectedAction.actionLabel} · {selectedAction.maneuver}
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelPlacement}
                    className="text-red-600 underline text-xs"
                  >
                    Отменить
                  </button>
                </div>
              )}

              {!filteredPending.length && (
                <p className="text-sm text-gray-500">Все EXAM_RELEVANT действия размечены.</p>
              )}

              {filteredPending.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSelectAction(item.key)}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition ${
                    selectedKey === item.key
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium">{item.nodeLabel}</div>
                  {item.approach && (
                    <div className="text-gray-500 text-xs mt-0.5">{item.approach}</div>
                  )}
                  <div className="mt-1 text-gray-700">
                    {item.actionLabel}{' '}
                    <span className="text-gray-400">({item.maneuver}, {item.pointCount} т.)</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {panelTab === 'done' && (
            <>
              {!entries.length && (
                <p className="text-sm text-gray-500">Пока ничего не размечено.</p>
              )}
              {entries.map((entry) => {
                const isFocused = focusedEntryKey === entry.key;
                const roundingPercent = Math.round((entry.curveRounding ?? 1) * 100);

                return (
                  <div
                    key={entry.key}
                    className={`p-3 rounded-lg border text-sm space-y-2 ${
                      isFocused ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setFocusedEntryKey(entry.key)}
                      className="w-full text-left"
                    >
                      <div className="font-medium">{entry.nodeLabel}</div>
                      <div className="text-gray-700">
                        {entry.actionLabel} · {entry.maneuver}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">{entry.key}</div>
                    </button>

                    {hasCurveRounding(entry.maneuver) && (
                      <label className="block space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Сглаживание угла</span>
                          <span>{roundingPercent}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={roundingPercent}
                          onChange={(e) =>
                            handleRoundingChange(entry.key, Number(e.target.value))
                          }
                          className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400">
                          <span>острый угол</span>
                          <span>макс. скругление</span>
                        </div>
                      </label>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(entry.key)}
                      className="text-red-600 underline text-xs"
                    >
                      Удалить
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </aside>
    </div>
  );
};

export default RouteGeometryEditor;
