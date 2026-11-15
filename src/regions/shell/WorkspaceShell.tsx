import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderOpen,
  MonitorUp,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { useDevice, useScale, useShell } from '../../state/appStore';
import { Button, Drawer, EmptyState, Notice, Panel, ResizeHandle } from '../../ui';

function LibraryPlaceholderBody() {
  const { folders, selectFolder } = useShell();
  return (
    <div className="sp-region-placeholder">
      {folders.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size="1.5rem" strokeWidth={1.5} />}
          title="No sources linked"
          description="Link a folder containing local videos and scripts to fill the library."
          action={
            <Button variant="primary" onClick={() => void selectFolder()}>
              Select folder
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={<FolderOpen size="1.5rem" strokeWidth={1.5} />}
          title="Library region ready"
          description={`${folders.length} source folders linked. Virtualised rows, search, and filters arrive in Stage 2.`}
        />
      )}
    </div>
  );
}

function DevicePlaceholderBody() {
  const { status, errorMessage, connect, connectElapsedSec } = useDevice();
  return (
    <div className="sp-region-placeholder">
      {errorMessage ? (
        <Notice
          tone="error"
          action={
            <Button variant="default" onClick={() => void connect()}>
              Reconnect
            </Button>
          }
        >
          {errorMessage}
        </Notice>
      ) : null}
      {status === 'connecting' ? (
        <Notice tone="warn">
          Connecting to device · {connectElapsedSec}s elapsed (usually 10 to 20 seconds)
        </Notice>
      ) : null}
      <EmptyState
        icon={<Sliders size="1.5rem" strokeWidth={1.5} />}
        title="Device panel ready"
        description="Script / Script + fill / Manual modes, stroke window, and live controls arrive in Stage 4."
      />
    </div>
  );
}

export function WorkspaceShell() {
  const {
    libraryOpen,
    setLibraryOpen,
    deviceOpen,
    setDeviceOpen,
    libraryWidthPx,
    setLibraryWidthPx,
    popped,
    popOutRegion,
    bringBackRegion,
    scanStatus,
    shellError,
    clearShellError,
  } = useShell();

  const { uiScale } = useScale();
  const [drawerRegion, setDrawerRegion] = useState<'library' | 'device' | null>(null);

  return (
    <>
      {shellError ? (
        <div className="sp-shell-banner">
          <Notice
            tone="error"
            action={
              <Button variant="ghost" onClick={clearShellError}>
                Dismiss
              </Button>
            }
          >
            {shellError}
          </Notice>
        </div>
      ) : null}

      {scanStatus ? (
        <div className="sp-shell-banner">
          <Notice tone="info">{scanStatus}</Notice>
        </div>
      ) : null}

      <div className="sp-workspace">
        {/* Docked Library Region */}
        <aside
          className="sp-library-slot"
          data-collapsed={!libraryOpen ? 'true' : 'false'}
          style={libraryOpen ? { width: `clamp(16rem, ${libraryWidthPx}px, 34%)` } : undefined}
          aria-label="Library region"
        >
          {!libraryOpen ? (
            <div className="sp-collapsed-strip">
              <Button
                variant="ghost"
                aria-label="Open library panel"
                onClick={() => setLibraryOpen(true)}
              >
                <ChevronRight size="1em" strokeWidth={1.5} aria-hidden="true" />
              </Button>
            </div>
          ) : popped.library ? (
            <Panel
              title="Library"
              dataRegion="library"
              actions={
                <Button
                  variant="ghost"
                  dataNew
                  onClick={() => void bringBackRegion('library')}
                >
                  <RotateCcw size="1em" strokeWidth={1.5} aria-hidden="true" />
                  <span>Bring back</span>
                </Button>
              }
            >
              <div className="sp-region-placeholder">
                <Notice tone="info">
                  Library is in its own window · Bring back
                </Notice>
              </div>
            </Panel>
          ) : (
            <Panel
              title="Library"
              dataRegion="library"
              actions={
                <>
                  <Button
                    variant="ghost"
                    dataCtl="play-11"
                    onClick={() => void popOutRegion('library')}
                  >
                    <ExternalLink size="1em" strokeWidth={1.5} aria-hidden="true" />
                    <span>Move to another screen</span>
                  </Button>
                  <Button
                    variant="ghost"
                    aria-label="Collapse library"
                    onClick={() => setLibraryOpen(false)}
                  >
                    <ChevronLeft size="1em" strokeWidth={1.5} aria-hidden="true" />
                  </Button>
                </>
              }
            >
              <LibraryPlaceholderBody />
            </Panel>
          )}
        </aside>

        {libraryOpen ? (
          <span className="sp-library-resize">
            <ResizeHandle
              label="Resize library width"
              value={libraryWidthPx}
              min={260}
              max={480}
              onChange={setLibraryWidthPx}
            />
          </span>
        ) : null}

        {/* Primary Stage Region (Hero Picture) */}
        <main className="sp-stage" aria-label="Video stage">
          <div className="sp-stage-header">
            <div className="sp-stage-left">
              <div className="sp-region-drawer-triggers">
                <Button
                  variant="ghost"
                  onClick={() => setDrawerRegion('library')}
                >
                  <FolderOpen size="1em" strokeWidth={1.5} aria-hidden="true" />
                  <span>Library</span>
                </Button>
              </div>
              <h1 className="sp-stage-title">No video selected</h1>
            </div>

            <div className="sp-stage-actions">
              <Button
                variant="ghost"
                className="sp-device-drawer-trigger"
                onClick={(e) => {
                  const frameW =
                    e.currentTarget.closest('[data-app-frame]')?.clientWidth ?? window.innerWidth;
                  const effRem = frameW / (16 * uiScale);
                  if (effRem <= 80) setDrawerRegion('device');
                  else setDeviceOpen(!deviceOpen);
                }}
              >
                <Sliders size="1em" strokeWidth={1.5} aria-hidden="true" />
                <span>Device</span>
              </Button>
              {popped.player ? (
                <Button
                  variant="default"
                  dataCtl="play-13"
                  onClick={() => void bringBackRegion('player')}
                >
                  <RotateCcw size="1em" strokeWidth={1.5} aria-hidden="true" />
                  <span>Bring back</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  dataCtl="play-13"
                  onClick={() => void popOutRegion('player')}
                >
                  <MonitorUp size="1em" strokeWidth={1.5} aria-hidden="true" />
                  <span>Move to another screen</span>
                </Button>
              )}
            </div>
          </div>

          <div
            className="sp-picture-viewport"
            data-region="picture"
            data-testid="picture-viewport"
          >
            {popped.player ? (
              <Notice
                tone="info"
                action={
                  <Button
                    variant="default"
                    onClick={() => void bringBackRegion('player')}
                  >
                    Bring back
                  </Button>
                }
              >
                Picture is in its own window
              </Notice>
            ) : (
              <div className="sp-test-pattern">
                <span className="mono">16:9 Stage</span>
                <span>Select a clip from the library to begin playback</span>
              </div>
            )}
          </div>

          <div className="sp-stage-scrub" aria-label="Timeline and live motion bar">
            <div className="sp-heatmap-placeholder">
              <span>Timeline heatmap scrub bar</span>
              <span className="mono">00:00 / 00:00</span>
            </div>
            <div className="sp-live-strip">
              <span>Live motion bar · Range · Pace · Versions 1–9 · Mode</span>
              <span className="mono">Stage 3–4</span>
            </div>
          </div>
        </main>

        {/* Docked Device Region */}
        <aside
          className="sp-device-slot"
          data-collapsed={!deviceOpen ? 'true' : 'false'}
          aria-label="Device region"
        >
          {!deviceOpen ? (
            <div className="sp-collapsed-strip">
              <Button
                variant="ghost"
                aria-label="Open device panel"
                dataCtl="dev-83"
                onClick={() => setDeviceOpen(true)}
              >
                <ChevronLeft size="1em" strokeWidth={1.5} aria-hidden="true" />
              </Button>
            </div>
          ) : popped.deck ? (
            <Panel
              title="Device"
              dataRegion="device"
              actions={
                <Button
                  variant="ghost"
                  dataNew
                  onClick={() => void bringBackRegion('deck')}
                >
                  <RotateCcw size="1em" strokeWidth={1.5} aria-hidden="true" />
                  <span>Bring back</span>
                </Button>
              }
            >
              <div className="sp-region-placeholder">
                <Notice tone="info">
                  Device panel is in its own window · Bring back
                </Notice>
              </div>
            </Panel>
          ) : (
            <Panel
              title="Device"
              dataRegion="device"
              actions={
                <>
                  <Button
                    variant="ghost"
                    dataCtl="dev-81"
                    onClick={() => void popOutRegion('deck')}
                  >
                    <ExternalLink size="1em" strokeWidth={1.5} aria-hidden="true" />
                    <span>Move to another screen</span>
                  </Button>
                  <Button
                    variant="ghost"
                    aria-label="Collapse device panel"
                    onClick={() => setDeviceOpen(false)}
                  >
                    <ChevronRight size="1em" strokeWidth={1.5} aria-hidden="true" />
                  </Button>
                </>
              }
            >
              <DevicePlaceholderBody />
            </Panel>
          )}
        </aside>
      </div>

      {/* Drawers for narrow effective widths */}
      <Drawer
        open={drawerRegion === 'library'}
        onClose={() => setDrawerRegion(null)}
        title="Library"
        side="left"
        headerActions={
          <Button variant="ghost" onClick={() => void popOutRegion('library')}>
            Move to another screen
          </Button>
        }
      >
        <LibraryPlaceholderBody />
      </Drawer>

      <Drawer
        open={drawerRegion === 'device'}
        onClose={() => setDrawerRegion(null)}
        title="Device"
        side="right"
        headerActions={
          <Button variant="ghost" onClick={() => void popOutRegion('deck')}>
            Move to another screen
          </Button>
        }
      >
        <DevicePlaceholderBody />
      </Drawer>
    </>
  );
}
