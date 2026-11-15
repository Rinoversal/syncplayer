import React from 'react';
import { RotateCcw } from 'lucide-react';
import { LauncherRail } from '../regions/shell/LauncherRail';
import { TopBar } from '../regions/shell/TopBar';
import { WorkspaceShell } from '../regions/shell/WorkspaceShell';
import { useBench, useShell } from '../state/appStore';
import { Button, EmptyState, Notice } from '../ui';
import { PrimitivesPage } from './PrimitivesPage';

export interface WindowRouterProps {
  frameWidthPx?: number;
  frameHeightPx?: number;
}

export function WindowRouter({ frameWidthPx, frameHeightPx }: WindowRouterProps) {
  const { windowKind, popoutReadySimulated, setPopoutReadySimulated, setWindowKindOverride } =
    useBench();
  const { activeView, bringBackRegion } = useShell();

  if (windowKind === 'main') {
    return (
      <>
        <LauncherRail />
        <div className="sp-main-col">
          <TopBar frameWidthPx={frameWidthPx} frameHeightPx={frameHeightPx} />
          {activeView === 'primitives' ? <PrimitivesPage /> : <WorkspaceShell />}
        </div>
      </>
    );
  }

  /* Stand-alone / Pop-out windows (no launcher rail) */
  const titleMap: Record<Exclude<typeof windowKind, 'main'>, string> = {
    popout: 'Pop-out Player',
    library: 'Library Window',
    deck: 'Device Window',
    keys: 'Keys & Controller',
    chat: 'Assistant Chat',
    'ai-popout': 'Assistant Controls',
    phone: 'Phone Remote',
  };

  return (
    <div className="sp-standalone-wrap">
      {windowKind !== 'popout' ? (
        <header className="sp-stage-header">
          <h1 className="sp-stage-title">{titleMap[windowKind]}</h1>
          <div className="sp-stage-actions">
            {windowKind === 'library' || windowKind === 'deck' || windowKind === 'ai-popout' ? (
              <Button
                variant="ghost"
                onClick={() => {
                  const region = windowKind === 'ai-popout' ? 'ai' : windowKind;
                  void bringBackRegion(region);
                  setWindowKindOverride(null);
                }}
              >
                <RotateCcw size="1em" strokeWidth={1.5} aria-hidden="true" />
                <span>Bring back</span>
              </Button>
            ) : null}
          </div>
        </header>
      ) : null}

      {windowKind !== 'phone' && !popoutReadySimulated ? (
        <div className="sp-standalone-wait">
          <EmptyState
            title="Waiting for the main window"
            description="Listening on the window bridge for the active video and device state."
            action={
              <div className="sp-standalone-actions">
                <Button variant="primary" onClick={() => setPopoutReadySimulated(true)}>
                  Simulate state sync
                </Button>
                {windowKind === 'popout' ? (
                  <Button dataCtl="popwin-01" onClick={() => setWindowKindOverride(null)}>
                    Close pop-out
                  </Button>
                ) : null}
              </div>
            }
          />
        </div>
      ) : (
        <div className="sp-standalone-body">
          <Notice tone="ok">
            {titleMap[windowKind]} ready · full controls populate in Stage 6.
          </Notice>
          {windowKind === 'popout' ? (
            <div className="sp-standalone-video">
              <Button dataCtl="popwin-01" onClick={() => setWindowKindOverride(null)}>
                Close pop-out
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
