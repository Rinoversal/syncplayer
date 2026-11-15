export interface VisibleRangeInput {
  itemCount: number;
  itemHeight: number;
  scrollTop: number;
  viewportHeight: number;
  overscan?: number;
}

export interface VisibleRangeResult {
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetTop: number;
}

export function computeVisibleRange({
  itemCount,
  itemHeight,
  scrollTop,
  viewportHeight,
  overscan = 6,
}: VisibleRangeInput): VisibleRangeResult {
  if (itemCount <= 0 || itemHeight <= 0) {
    return { startIndex: 0, endIndex: -1, totalHeight: 0, offsetTop: 0 };
  }
  const totalHeight = itemCount * itemHeight;
  const clampedScroll = Math.max(0, Math.min(scrollTop, Math.max(0, totalHeight - viewportHeight)));
  const rawStart = Math.floor(clampedScroll / itemHeight);
  const visibleCount = Math.max(1, Math.ceil(viewportHeight / itemHeight));
  const startIndex = Math.max(0, rawStart - overscan);
  const endIndex = Math.min(itemCount - 1, rawStart + visibleCount - 1 + overscan);
  return {
    startIndex,
    endIndex,
    totalHeight,
    offsetTop: startIndex * itemHeight,
  };
}

export interface GridRangeInput {
  itemCount: number;
  columns: number;
  rowHeight: number;
  scrollTop: number;
  viewportHeight: number;
  overscanRows?: number;
}

export interface GridRangeResult {
  startRow: number;
  endRow: number;
  startIndex: number;
  endIndex: number;
  totalRows: number;
  totalHeight: number;
  offsetTop: number;
}

export function computeVisibleGridRange({
  itemCount,
  columns,
  rowHeight,
  scrollTop,
  viewportHeight,
  overscanRows = 3,
}: GridRangeInput): GridRangeResult {
  const cols = Math.max(1, columns);
  if (itemCount <= 0 || rowHeight <= 0) {
    return {
      startRow: 0,
      endRow: -1,
      startIndex: 0,
      endIndex: -1,
      totalRows: 0,
      totalHeight: 0,
      offsetTop: 0,
    };
  }
  const totalRows = Math.ceil(itemCount / cols);
  const totalHeight = totalRows * rowHeight;
  const clampedScroll = Math.max(0, Math.min(scrollTop, Math.max(0, totalHeight - viewportHeight)));
  const rawStartRow = Math.floor(clampedScroll / rowHeight);
  const visibleRows = Math.max(1, Math.ceil(viewportHeight / rowHeight));
  const startRow = Math.max(0, rawStartRow - overscanRows);
  const endRow = Math.min(totalRows - 1, rawStartRow + visibleRows - 1 + overscanRows);
  const startIndex = startRow * cols;
  const endIndex = Math.min(itemCount - 1, (endRow + 1) * cols - 1);
  return {
    startRow,
    endRow,
    startIndex,
    endIndex,
    totalRows,
    totalHeight,
    offsetTop: startRow * rowHeight,
  };
}
