import React, { useEffect, useState } from 'react';
import { UI_SCALE_STEPS } from '../scale/scale';
import { BenchFrameSize, useBench, useDevice, useScale, useShell } from '../state/appStore';
import type { DeviceConnectionStatus, WindowKind } from '../types/electron';
import { registerSelfCheckGlobal, runSelfCheck, SelfCheckReport } from './selfCheck';
import './bench.css';

const FRAME_SIZES: BenchFrameSize[] = [
  'native',
  '640x480',
  '1000x560',
  '1097x617',
  '1200x800',
  '1280x720',
  '1366x768',
  '1920x1080',
  '2560x1440',
  '3440x1440',
  '3840x2160',
  '1080x1920',
];

const WINDOW_KINDS: WindowKind[] = [
  'main',
  'popout',
  'library',
  'deck',
  'keys',
  'chat',
  'ai-popout',
  'phone',
];

const DEVICE_STATES: DeviceConnectionStatus[] = [
  'not-connected',
  'connecting',
  'connected',
  'playing',
  'paused',
  'lost',
  'error',
  'no-script',
];

export function parseFrameDimensions(frame: BenchFrameSize): { width?: number; height?: number } {
  if (frame === 'native') return {};
  const [w, h] = frame.split('x').map(Number);
  return { width: w, height: h };
}

export function TestBenchHost({
  children,
}: {
  children: (dims: { width?: number; height?: number }) => React.ReactNode;
}) {
  const {
    benchOpen,
    setBenchOpen,
    benchFrame,
    setBenchFrame,
    windowKind,
    setWindowKindOverride,
    librarySize,
    setLibrarySize,
    longNames,
    setLongNames,
  } = useBench();
  const { uiScale, setUiScale } = useScale();
  const { status, setBenchStatus } = useDevice();
  const { activeView, setActiveView } = useShell();
  const [report, setReport] = useState<SelfCheckReport | null>(null);

  useEffect(() => {
    registerSelfCheckGlobal();
  }, []);

  const dims = parseFrameDimensions(benchFrame);
  const isFramed = dims.width !== undefined && dims.height !== undefined;

  return (
    <div className="sp-bench-host">
      {benchOpen ? (
        <div className="sp-bench-bar" data-bench-ui="1" role="region" aria-label="Test bench">
          <strong>Test Bench (F9)</strong>

          <label>
            Size
            <select
              value={benchFrame}
              onChange={(e) => setBenchFrame(e.target.value as BenchFrameSize)}
            >
              {FRAME_SIZES.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </label>

          <label>
            Scale
            <select
              value={String(uiScale)}
              onChange={(e) => setUiScale(Number(e.target.value), true)}
            >
              {UI_SCALE_STEPS.map((st) => (
                <option key={st} value={String(st)}>
                  {Math.round(st * 100)}%
                </option>
              ))}
            </select>
          </label>

          <label>
            Window
            <select
              value={windowKind}
              onChange={(e) => setWindowKindOverride(e.target.value as WindowKind)}
            >
              {WINDOW_KINDS.map((wk) => (
                <option key={wk} value={wk}>
                  {wk}
                </option>
              ))}
            </select>
          </label>

          <label>
            Library
            <select
              value={String(librarySize)}
              onChange={(e) => setLibrarySize(Number(e.target.value) as 0 | 2000 | 21000)}
            >
              <option value="0">0</option>
              <option value="2000">2,000</option>
              <option value="21000">21,000</option>
            </select>
          </label>

          <label>
            Names
            <select
              value={longNames ? 'long' : 'normal'}
              onChange={(e) => setLongNames(e.target.value === 'long')}
            >
              <option value="normal">Normal</option>
              <option value="long">Very long</option>
            </select>
          </label>

          <label>
            Device
            <select
              value={status}
              onChange={(e) => setBenchStatus(e.target.value as DeviceConnectionStatus)}
            >
              {DEVICE_STATES.map((ds) => (
                <option key={ds} value={ds}>
                  {ds}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            data-active={activeView === 'primitives' ? 'true' : undefined}
            onClick={() =>
              setActiveView(activeView === 'primitives' ? 'workspace' : 'primitives')
            }
          >
            {activeView === 'primitives' ? 'Workspace' : 'Primitives'}
          </button>

          <button
            type="button"
            onClick={() => setReport(runSelfCheck())}
          >
            Run Self-Check
          </button>

          <button type="button" onClick={() => setBenchOpen(false)}>
            Hide (F9)
          </button>
        </div>
      ) : null}

      <div className="sp-bench-viewport" data-framed={isFramed ? 'true' : 'false'}>
        <div
          className="sp-bench-frame-wrap"
          data-framed={isFramed ? 'true' : 'false'}
          style={
            isFramed
              ? { width: `${dims.width}px`, height: `${dims.height}px` }
              : undefined
          }
        >
          <div className="sp-app-frame" data-app-frame="1">
            {children(dims)}
          </div>
        </div>
      </div>

      {report && benchOpen ? (
        <div className="sp-bench-report" data-bench-ui="1">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong>Self-Check Result</strong>
            <button type="button" onClick={() => setReport(null)}>
              Close
            </button>
          </div>
          <table className="sp-bench-table">
            <tbody>
              <tr><td>Window</td><td>{report.windowWidth}x{report.windowHeight} @ {Math.round(report.uiScale * 100)}%</td></tr>
              <tr><td>Effective rem</td><td>{report.effectiveWidthRem} x {report.effectiveHeightRem} rem</td></tr>
              <tr><td>Picture share</td><td>{report.pictureSharePct}%</td></tr>
              <tr><td>Stage header</td><td>{report.stageHeaderHeightPx}px</td></tr>
              <tr><td>Smallest text</td><td>{report.smallestTextPx}px ({report.textUnder12Count} &lt;12px)</td></tr>
              <tr><td>Smallest target</td><td>{report.smallestTargetPx}px ({report.targetsUnder32Count} &lt;32px, {report.targetsUnder28Count} &lt;28px)</td></tr>
              <tr><td>Cut / Covered</td><td>scroll:{report.cutOffByScrollCount} win:{report.cutOffByWindowCount} cov:{report.coveredControlsCount}</td></tr>
              <tr><td>Missing aria-label</td><td>{report.missingAccessibleNameCount}</td></tr>
              <tr><td>Non-focusable click</td><td>{report.nonFocusableClickTargetsCount}</td></tr>
              <tr><td>Horizontal scroll</td><td>{String(report.horizontalScroll)}</td></tr>
              <tr><td>Distinct text sizes</td><td>{report.distinctTextSizesCount} ({report.distinctTextSizesPx.join(', ')})</td></tr>
              <tr><td>DOM nodes</td><td>{report.domNodeCount}</td></tr>
              <tr><td>Placed data-ctl</td><td>{report.presentDataCtlKeys.length} / {report.totalAppendixBKeys}</td></tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
