import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FolderPlus,
  HardDrive,
  Loader2,
  Monitor,
  RefreshCw,
  Shuffle,
  Square,
  SunMedium,
  Moon,
  Unplug,
  WifiOff,
  ChevronDown,
} from 'lucide-react';
import { useDevice, useShell } from '../../state/appStore';
import { Button, Menu, TextInput } from '../../ui';
import { ScaleControl } from './ScaleControl';

export interface TopBarProps {
  frameWidthPx?: number;
  frameHeightPx?: number;
}

export function TopBar({ frameWidthPx, frameHeightPx }: TopBarProps) {
  const {
    theme,
    toggleTheme,
    selectFolder,
    refreshFolders,
    scanDriveAction,
    scanningDrive,
    twoScreenActive,
    toggleTwoScreens,
    actionMixOpen,
    setActionMixOpen,
  } = useShell();

  const {
    connectionKey,
    setConnectionKey,
    status,
    apiVersion,
    firmware,
    connectElapsedSec,
    connect,
    stopDevice,
    disconnectDevice,
  } = useDevice();

  const [keyFocused, setKeyFocused] = useState(false);
  const [sourcesMenuOpen, setSourcesMenuOpen] = useState(false);
  const sourcesBtnRef = useRef<HTMLButtonElement>(null);

  const isConnected = status === 'connected' || status === 'playing' || status === 'paused';
  const isConnecting = status === 'connecting';

  const statusLabel = (() => {
    switch (status) {
      case 'connecting':
        return {
          text: `Connecting ${connectElapsedSec}s`,
          detail: 'usually 10–20s',
          icon: <Loader2 size="1em" strokeWidth={1.5} className="sp-spin" aria-hidden="true" />,
        };
      case 'connected':
        return {
          text: 'Connected',
          detail: apiVersion && firmware ? `${apiVersion} · ${firmware}` : undefined,
          icon: <CheckCircle2 size="1em" strokeWidth={1.5} aria-hidden="true" />,
        };
      case 'playing':
        return {
          text: 'Playing',
          detail: apiVersion ?? undefined,
          icon: <CheckCircle2 size="1em" strokeWidth={1.5} aria-hidden="true" />,
        };
      case 'paused':
        return {
          text: 'Paused',
          detail: apiVersion ?? undefined,
          icon: <CheckCircle2 size="1em" strokeWidth={1.5} aria-hidden="true" />,
        };
      case 'lost':
        return {
          text: 'Lost',
          detail: 'Reconnect',
          icon: <WifiOff size="1em" strokeWidth={1.5} aria-hidden="true" />,
        };
      case 'error':
        return {
          text: 'Error',
          detail: undefined,
          icon: <AlertCircle size="1em" strokeWidth={1.5} aria-hidden="true" />,
        };
      case 'no-script':
        return {
          text: 'No script',
          detail: undefined,
          icon: <AlertCircle size="1em" strokeWidth={1.5} aria-hidden="true" />,
        };
      default:
        return {
          text: 'Not connected',
          detail: undefined,
          icon: <WifiOff size="1em" strokeWidth={1.5} aria-hidden="true" />,
        };
    }
  })();

  const compactMenuItems = [
    {
      id: 'folder',
      label: 'Select folder',
      dataCtl: 'top-02',
      onSelect: () => {
        void selectFolder();
      },
    },
    {
      id: 'refresh',
      label: 'Refresh folders',
      dataCtl: 'top-03',
      onSelect: () => {
        void refreshFolders();
      },
    },
    {
      id: 'drive',
      label: scanningDrive ? 'Scanning drive…' : 'Scan drive',
      dataCtl: 'top-04',
      disabled: scanningDrive,
      onSelect: () => {
        void scanDriveAction();
      },
    },
    {
      id: 'mix',
      label: 'Action Mix',
      dataCtl: 'top-05',
      onSelect: () => setActionMixOpen(!actionMixOpen),
    },
    {
      id: 'two-screen',
      label: twoScreenActive ? 'One window' : 'Two screens',
      onSelect: () => {
        void toggleTwoScreens();
      },
    },
    {
      id: 'theme',
      label: theme === 'night' ? 'Brighter theme' : 'Night theme',
      dataCtl: 'top-01',
      onSelect: () => toggleTheme(),
    },
  ];

  return (
    <header className="sp-topbar" aria-label="Workspace controls">
      <div className="sp-topbar-left">
        <span className="sp-topbar-folder-btn">
          <Button
            dataCtl="top-02"
            onClick={() => void selectFolder()}
          >
            <FolderPlus size="1em" strokeWidth={1.5} aria-hidden="true" />
            <span>Folder</span>
          </Button>
        </span>

        <span className="sp-topbar-wide-only">
          <Button dataCtl="top-03" variant="ghost" onClick={() => void refreshFolders()}>
            <RefreshCw size="1em" strokeWidth={1.5} aria-hidden="true" />
            <span>Refresh</span>
          </Button>
          <Button
            dataCtl="top-04"
            variant="ghost"
            busy={scanningDrive}
            onClick={() => void scanDriveAction()}
          >
            <HardDrive size="1em" strokeWidth={1.5} aria-hidden="true" />
            <span>Scan drive</span>
          </Button>
          <Button
            dataCtl="top-05"
            variant="ghost"
            pressed={actionMixOpen}
            onClick={() => setActionMixOpen(!actionMixOpen)}
          >
            <Shuffle size="1em" strokeWidth={1.5} aria-hidden="true" />
            <span>Action Mix</span>
          </Button>
          <Button
            variant="ghost"
            pressed={twoScreenActive}
            dataNew
            onClick={() => void toggleTwoScreens()}
          >
            <Monitor size="1em" strokeWidth={1.5} aria-hidden="true" />
            <span>{twoScreenActive ? 'One window' : 'Two screens'}</span>
          </Button>
          <Button
            dataCtl="top-01"
            variant="ghost"
            onClick={toggleTheme}
            aria-label={theme === 'night' ? 'Switch to brighter theme' : 'Switch to night theme'}
          >
            {theme === 'night' ? (
              <SunMedium size="1em" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Moon size="1em" strokeWidth={1.5} aria-hidden="true" />
            )}
            <span>{theme === 'night' ? 'Brighter' : 'Night'}</span>
          </Button>
        </span>

        <span className="sp-topbar-compact-menu">
          <Button
            ref={sourcesBtnRef}
            variant="ghost"
            aria-expanded={sourcesMenuOpen}
            onClick={() => setSourcesMenuOpen((v) => !v)}
          >
            <span>Sources</span>
            <ChevronDown size="1em" strokeWidth={1.5} aria-hidden="true" />
          </Button>
          <Menu
            open={sourcesMenuOpen}
            onClose={() => setSourcesMenuOpen(false)}
            anchorEl={sourcesBtnRef.current}
            items={compactMenuItems}
            ariaLabel="Sources and display actions"
          />
        </span>
      </div>

      <div className="sp-topbar-right">
        <div className="sp-conn-group" role="region" aria-label="Device connection">
          <TextInput
            type={keyFocused ? 'text' : 'password'}
            aria-label="Device connection key"
            placeholder="Device key"
            autoComplete="off"
            spellCheck={false}
            className="sp-conn-key"
            dataCtl="top-06"
            value={connectionKey}
            onFocus={() => setKeyFocused(true)}
            onBlur={() => setKeyFocused(false)}
            onChange={(e) => setConnectionKey(e.target.value)}
          />

          <div
            className="sp-conn-status"
            data-state={status}
            role="status"
            aria-live="polite"
          >
            {statusLabel.icon}
            <span>{statusLabel.text}</span>
            {statusLabel.detail ? (
              <span className="sp-conn-status-detail mono">· {statusLabel.detail}</span>
            ) : null}
          </div>

          {!isConnected ? (
            <Button
              variant="primary"
              dataCtl="top-07"
              busy={isConnecting}
              disabled={isConnecting}
              onClick={() => void connect()}
            >
              <span>{isConnecting ? 'Connecting…' : status === 'lost' ? 'Reconnect' : 'Connect'}</span>
            </Button>
          ) : (
            <>
              <Button
                variant="default"
                dataCtl="top-08"
                onClick={() => void stopDevice()}
              >
                <Square size="0.95em" strokeWidth={1.5} aria-hidden="true" />
                <span>Stop</span>
              </Button>
              <Button
                variant="ghost"
                dataCtl="top-09"
                onClick={() => void disconnectDevice()}
              >
                <Unplug size="0.95em" strokeWidth={1.5} aria-hidden="true" />
                <span>Disconnect</span>
              </Button>
            </>
          )}
        </div>

        <ScaleControl frameWidthPx={frameWidthPx} frameHeightPx={frameHeightPx} />
      </div>
    </header>
  );
}
