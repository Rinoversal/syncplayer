import React, { useEffect, useRef, useState } from 'react';
import { computeVisibleGridRange, computeVisibleRange } from './virtualize';

export interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  overscan?: number;
  initialScrollTop?: number;
  onScrollChange?: (scrollTop: number) => void;
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  overscan = 6,
  initialScrollTop = 0,
  onScrollChange,
  getKey,
  renderItem,
  className = '',
}: VirtualListProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(initialScrollTop);
  const [viewportHeight, setViewportHeight] = useState(480);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (initialScrollTop > 0 && el.scrollTop !== initialScrollTop) {
      el.scrollTop = initialScrollTop;
    }
    const updateHeight = () => setViewportHeight(el.clientHeight || 480);
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [initialScrollTop]);

  const { startIndex, endIndex, totalHeight, offsetTop } = computeVisibleRange({
    itemCount: items.length,
    itemHeight,
    scrollTop,
    viewportHeight,
    overscan,
  });

  const slice = endIndex >= startIndex ? items.slice(startIndex, endIndex + 1) : [];

  return (
    <div
      ref={scrollRef}
      className={`sp-virtual-scroll ${className}`.trim()}
      onScroll={(e) => {
        const next = e.currentTarget.scrollTop;
        setScrollTop(next);
        onScrollChange?.(next);
      }}
    >
      <div className="sp-virtual-spacer" style={{ height: `${totalHeight}px` }}>
        <div
          className="sp-virtual-window"
          style={{ transform: `translateY(${offsetTop}px)` }}
        >
          {slice.map((item, idx) => {
            const realIndex = startIndex + idx;
            return (
              <div key={getKey(item, realIndex)} style={{ height: `${itemHeight}px` }}>
                {renderItem(item, realIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export interface VirtualGridProps<T> {
  items: T[];
  minTileWidth: number;
  rowHeight: number;
  gapPx?: number;
  overscanRows?: number;
  initialScrollTop?: number;
  onScrollChange?: (scrollTop: number) => void;
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function VirtualGrid<T>({
  items,
  minTileWidth,
  rowHeight,
  gapPx = 8,
  overscanRows = 3,
  initialScrollTop = 0,
  onScrollChange,
  getKey,
  renderItem,
  className = '',
}: VirtualGridProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(initialScrollTop);
  const [viewport, setViewport] = useState({ width: 640, height: 480 });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (initialScrollTop > 0 && el.scrollTop !== initialScrollTop) {
      el.scrollTop = initialScrollTop;
    }
    const updateSize = () =>
      setViewport({
        width: el.clientWidth || 640,
        height: el.clientHeight || 480,
      });
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [initialScrollTop]);

  const columns = Math.max(1, Math.floor((viewport.width + gapPx) / (minTileWidth + gapPx)));
  const { startIndex, endIndex, totalHeight, offsetTop } = computeVisibleGridRange({
    itemCount: items.length,
    columns,
    rowHeight,
    scrollTop,
    viewportHeight: viewport.height,
    overscanRows,
  });

  const slice = endIndex >= startIndex ? items.slice(startIndex, endIndex + 1) : [];

  return (
    <div
      ref={scrollRef}
      className={`sp-virtual-scroll ${className}`.trim()}
      onScroll={(e) => {
        const next = e.currentTarget.scrollTop;
        setScrollTop(next);
        onScrollChange?.(next);
      }}
    >
      <div className="sp-virtual-spacer" style={{ height: `${totalHeight}px` }}>
        <div
          className="sp-virtual-window"
          style={{
            transform: `translateY(${offsetTop}px)`,
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: `${gapPx}px`,
          }}
        >
          {slice.map((item, idx) => {
            const realIndex = startIndex + idx;
            return (
              <div key={getKey(item, realIndex)} style={{ height: `${rowHeight - gapPx}px` }}>
                {renderItem(item, realIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
