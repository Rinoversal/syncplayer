import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { callElectron, setMockConfig } from '../mock/electronAPI';
import {
  getScreenSignature,
  OverlayScaleStep,
  SCALE_STORAGE_KEYS,
  snapOverlayScale,
  snapUiScale,
  stepUiScale,
  UiScaleStep,
  windowScaleKey,
  windowScreenScaleKey,
} from '../scale/scale';
import type {
  DeviceConnectionStatus,
  ThemeLevel,
  WindowKind,
} from '../types/electron';
import { readStorageJson, readStorageString, writeStorageJson, writeStorageString } from './storage';

/* ---------------- Window Kind Detection ---------------- */
export function detectWindowKindFromUrl(): WindowKind {
  if (typeof window === 'undefined') return 'main';
  const params = new URLSearchParams(window.location.search);
  if (params.get('popout') === '1') return 'popout';
  if (params.get('library') === '1') return 'library';
  if (params.get('deck') === '1') return 'deck';
  if (params.get('keys') === '1') return 'keys';
  if (params.get('chat') === '1') return 'chat';
  if (params.get('ai-popout') === '1') return 'ai-popout';
  if (params.get('phone') === '1') return 'phone';
  return 'main';
}

/* ---------------- Scale Context ---------------- */
interface ScaleContextValue {
  uiScale: UiScaleStep;
  overlayScale: OverlayScaleStep;
  screenSignature: string;
  scaleBannerTick: number;
  setUiScale: (next: number, persist?: boolean) => void;
  stepScale: (delta: -1 | 1) => void;
  resetScale: () => void;
  setOverlayScale: (next: number) => void;
}

const ScaleContext = createContext<ScaleContextValue | null>(null);

export function useScale(): ScaleContextValue {
  const ctx = useContext(ScaleContext);
  if (!ctx) throw new Error('useScale must be used inside AppProviders');
  return ctx;
}

/* ---------------- Shell Context ---------------- */
export type WorkspaceView = 'workspace' | 'primitives';

export interface PoppedState {
  player: boolean;
  library: boolean;
  deck: boolean;
  keys: boolean;
  chat: boolean;
  ai: boolean;
}

interface ShellContextValue {
  theme: ThemeLevel;
  toggleTheme: () => void;
  oled: boolean;
  setOled: (on: boolean) => void;
  activeView: WorkspaceView;
  setActiveView: (v: WorkspaceView) => void;
  libraryOpen: boolean;
  setLibraryOpen: (open: boolean) => void;
  deviceOpen: boolean;
  setDeviceOpen: (open: boolean) => void;
  libraryWidthPx: number;
  setLibraryWidthPx: (w: number) => void;
  popped: PoppedState;
  popOutRegion: (region: keyof PoppedState) => Promise<void>;
  bringBackRegion: (region: keyof PoppedState) => Promise<void>;
  twoScreenActive: boolean;
  toggleTwoScreens: () => Promise<void>;
  folders: string[];
  selectFolder: () => Promise<void>;
  refreshFolders: () => Promise<void>;
  scanDriveAction: () => Promise<void>;
  scanningDrive: boolean;
  scanStatus: string | null;
  shellError: string | null;
  clearShellError: () => void;
  actionMixOpen: boolean;
  setActionMixOpen: (open: boolean) => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error('useShell must be used inside AppProviders');
  return ctx;
}

/* ---------------- Device Context ---------------- */
interface DeviceContextValue {
  connectionKey: string;
  setConnectionKey: (k: string) => void;
  status: DeviceConnectionStatus;
  apiVersion: 'v2' | 'v3' | null;
  firmware: string | null;
  connectElapsedSec: number;
  errorMessage: string | null;
  connect: () => Promise<void>;
  stopDevice: () => Promise<void>;
  disconnectDevice: () => Promise<void>;
  setBenchStatus: (s: DeviceConnectionStatus) => void;
}

const DeviceContext = createContext<DeviceContextValue | null>(null);

export function useDevice(): DeviceContextValue {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error('useDevice must be used inside AppProviders');
  return ctx;
}

/* ---------------- Bench Context ---------------- */
export type BenchFrameSize =
  | 'native'
  | '640x480'
  | '1000x560'
  | '1097x617'
  | '1200x800'
  | '1280x720'
  | '1366x768'
  | '1920x1080'
  | '2560x1440'
  | '3440x1440'
  | '3840x2160'
  | '1080x1920';

interface BenchContextValue {
  benchOpen: boolean;
  setBenchOpen: (open: boolean) => void;
  benchFrame: BenchFrameSize;
  setBenchFrame: (size: BenchFrameSize) => void;
  windowKind: WindowKind;
  setWindowKindOverride: (kind: WindowKind | null) => void;
  librarySize: 0 | 2000 | 21000;
  setLibrarySize: (n: 0 | 2000 | 21000) => void;
  longNames: boolean;
  setLongNames: (b: boolean) => void;
  popoutReadySimulated: boolean;
  setPopoutReadySimulated: (ready: boolean) => void;
}

const BenchContext = createContext<BenchContextValue | null>(null);

export function useBench(): BenchContextValue {
  const ctx = useContext(BenchContext);
  if (!ctx) throw new Error('useBench must be used inside AppProviders');
  return ctx;
}

/* ---------------- Providers ---------------- */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const detectedKind = useMemo(() => detectWindowKindFromUrl(), []);
  const [windowKindOverride, setWindowKindOverride] = useState<WindowKind | null>(null);
  const windowKind = windowKindOverride ?? detectedKind;

  /* Bench state */
  const [benchOpen, setBenchOpen] = useState(false);
  const [benchFrame, setBenchFrame] = useState<BenchFrameSize>('native');
  const [librarySize, setLibrarySizeState] = useState<0 | 2000 | 21000>(2000);
  const [longNames, setLongNamesState] = useState(false);
  const [popoutReadySimulated, setPopoutReadySimulated] = useState(false);

  const setLibrarySize = useCallback((n: 0 | 2000 | 21000) => {
    setLibrarySizeState(n);
    setMockConfig({ librarySize: n });
  }, []);

  const setLongNames = useCallback((b: boolean) => {
    setLongNamesState(b);
    setMockConfig({ longNames: b });
  }, []);

  /* Scale state */
  const [screenSignature, setScreenSignature] = useState(() =>
    typeof window !== 'undefined'
      ? getScreenSignature(window.screen.width, window.screen.height, window.devicePixelRatio || 1)
      : '1920x1080@1'
  );

  const readInitialScale = useCallback(
    (kind: WindowKind, sig: string): UiScaleStep => {
      const byScreen = readStorageJson<Record<string, number>>(windowScreenScaleKey(kind), {});
      if (typeof byScreen[sig] === 'number') {
        return snapUiScale(byScreen[sig]);
      }
      const globalRaw = readStorageString(windowScaleKey(kind), '1');
      return snapUiScale(Number(globalRaw));
    },
    []
  );

  const [uiScale, setUiScaleState] = useState<UiScaleStep>(() =>
    readInitialScale(windowKind, screenSignature)
  );
  const [overlayScale, setOverlayScaleState] = useState<OverlayScaleStep>(() =>
    snapOverlayScale(Number(readStorageString(SCALE_STORAGE_KEYS.overlay, '1')))
  );
  const [scaleBannerTick, setScaleBannerTick] = useState(0);

  useEffect(() => {
    document.documentElement.style.setProperty('--ui-scale', String(uiScale));
  }, [uiScale]);

  useEffect(() => {
    document.documentElement.style.setProperty('--overlay-scale', String(overlayScale));
  }, [overlayScale]);

  useEffect(() => {
    const checkScreen = () => {
      const nextSig = getScreenSignature(
        window.screen.width,
        window.screen.height,
        window.devicePixelRatio || 1
      );
      if (nextSig !== screenSignature) {
        setScreenSignature(nextSig);
        setUiScaleState(readInitialScale(windowKind, nextSig));
      }
    };
    window.addEventListener('resize', checkScreen);
    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    mq.addEventListener?.('change', checkScreen);
    return () => {
      window.removeEventListener('resize', checkScreen);
      mq.removeEventListener?.('change', checkScreen);
    };
  }, [screenSignature, windowKind, readInitialScale]);

  const setUiScale = useCallback(
    (next: number, persist = true) => {
      const snapped = snapUiScale(next);
      setUiScaleState(snapped);
      if (persist) {
        writeStorageString(windowScaleKey(windowKind), String(snapped));
        const byScreen = readStorageJson<Record<string, number>>(
          windowScreenScaleKey(windowKind),
          {}
        );
        byScreen[screenSignature] = snapped;
        writeStorageJson(windowScreenScaleKey(windowKind), byScreen);
      }
    },
    [windowKind, screenSignature]
  );

  const stepScale = useCallback(
    (delta: -1 | 1) => {
      setUiScaleState((prev) => {
        const next = stepUiScale(prev, delta);
        writeStorageString(windowScaleKey(windowKind), String(next));
        const byScreen = readStorageJson<Record<string, number>>(
          windowScreenScaleKey(windowKind),
          {}
        );
        byScreen[screenSignature] = next;
        writeStorageJson(windowScreenScaleKey(windowKind), byScreen);
        return next;
      });
      setScaleBannerTick((t) => t + 1);
    },
    [windowKind, screenSignature]
  );

  const resetScale = useCallback(() => {
    setUiScale(1, true);
    setScaleBannerTick((t) => t + 1);
  }, [setUiScale]);

  const setOverlayScale = useCallback((next: number) => {
    const snapped = snapOverlayScale(next);
    setOverlayScaleState(snapped);
    writeStorageString(SCALE_STORAGE_KEYS.overlay, String(snapped));
  }, []);

  /* Global keyboard shortcuts: F9 bench, Ctrl+/Ctrl-/Ctrl0 scale */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        e.preventDefault();
        setBenchOpen((v) => !v);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          stepScale(1);
        } else if (e.key === '-') {
          e.preventDefault();
          stepScale(-1);
        } else if (e.key === '0') {
          e.preventDefault();
          resetScale();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stepScale, resetScale]);

  /* Shell state */
  const [theme, setTheme] = useState<ThemeLevel>(() =>
    readStorageString('syncplayer_theme', 'night') === 'bright' ? 'bright' : 'night'
  );
  const [oled, setOledState] = useState<boolean>(
    () => readStorageString('syncplayer_oled', '0') === '1'
  );
  const [activeView, setActiveView] = useState<WorkspaceView>('workspace');
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [libraryWidthPx, setLibraryWidthPx] = useState(336);
  const [popped, setPopped] = useState<PoppedState>({
    player: false,
    library: false,
    deck: false,
    keys: false,
    chat: false,
    ai: false,
  });
  const [twoScreenActive, setTwoScreenActive] = useState(false);
  const [folders, setFolders] = useState<string[]>(() =>
    readStorageJson<string[]>('syncplayer_folders', ['D:/Folder A', 'E:/Folder B'])
  );
  const [scanningDrive, setScanningDrive] = useState(false);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [shellError, setShellError] = useState<string | null>(null);
  const [actionMixOpen, setActionMixOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    writeStorageString('syncplayer_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-oled', oled ? '1' : '0');
    writeStorageString('syncplayer_oled', oled ? '1' : '0');
  }, [oled]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'night' ? 'bright' : 'night'));
  }, []);

  const setOled = useCallback((on: boolean) => {
    setOledState(on);
  }, []);

  const clearShellError = useCallback(() => setShellError(null), []);

  const selectFolder = useCallback(async () => {
    setShellError(null);
    const res = await callElectron('selectDirectory');
    if (!res.ok) {
      setShellError(res.error);
      return;
    }
    if (res.data) {
      setFolders((prev) => {
        if (prev.includes(res.data!)) return prev;
        const next = [...prev, res.data!];
        writeStorageJson('syncplayer_folders', next);
        return next;
      });
    }
  }, []);

  const refreshFolders = useCallback(async () => {
    setShellError(null);
    setScanStatus('Refreshing folders…');
    const res = await callElectron('scanDirectories', folders, true);
    setScanStatus(null);
    if (!res.ok) {
      setShellError(res.error);
    }
  }, [folders]);

  const scanDriveAction = useCallback(async () => {
    setShellError(null);
    const driveRes = await callElectron('chooseDrive');
    if (!driveRes.ok) {
      setShellError(driveRes.error);
      return;
    }
    if (!driveRes.data) return;
    setScanningDrive(true);
    setScanStatus(`Scanning ${driveRes.data} for scripted videos…`);
    const scanRes = await callElectron('scanDrive', driveRes.data);
    setScanningDrive(false);
    setScanStatus(null);
    if (!scanRes.ok) {
      setShellError(scanRes.error);
    }
  }, []);

  const popOutRegion = useCallback(async (region: keyof PoppedState) => {
    setShellError(null);
    const methodMap: Record<keyof PoppedState, keyof import('../types/electron').ElectronAPI> = {
      player: 'openPopout',
      library: 'openLibraryPopout',
      deck: 'openDeckPopout',
      keys: 'openKeysPopout',
      chat: 'openChatPopout',
      ai: 'openAiPopout',
    };
    const res = await callElectron(methodMap[region]);
    if (!res.ok) {
      setShellError(res.error);
      return;
    }
    setPopped((prev) => ({ ...prev, [region]: true }));
  }, []);

  const bringBackRegion = useCallback(async (region: keyof PoppedState) => {
    setShellError(null);
    if (region === 'player') await callElectron('closePopout');
    if (region === 'ai') await callElectron('closeAiPopout');
    setPopped((prev) => ({ ...prev, [region]: false }));
  }, []);

  const toggleTwoScreens = useCallback(async () => {
    setShellError(null);
    if (!twoScreenActive) {
      const r1 = await callElectron('openPopout');
      if (!r1.ok) {
        setShellError(r1.error);
        return;
      }
      setPopped((prev) => ({ ...prev, player: true }));
      setTwoScreenActive(true);
    } else {
      await callElectron('closePopout');
      setPopped((prev) => ({ ...prev, player: false }));
      setTwoScreenActive(false);
    }
  }, [twoScreenActive]);

  /* Device state (isolated context) */
  const [connectionKey, setConnectionKeyState] = useState<string>(() =>
    readStorageString('syncplayer_handy_key', 'DEMO-KEY-1')
  );
  const [status, setStatus] = useState<DeviceConnectionStatus>('not-connected');
  const [apiVersion, setApiVersion] = useState<'v2' | 'v3' | null>(null);
  const [firmware, setFirmware] = useState<string | null>(null);
  const [connectElapsedSec, setConnectElapsedSec] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const connectingRef = useRef(false);

  const setConnectionKey = useCallback((k: string) => {
    setConnectionKeyState(k);
    writeStorageString('syncplayer_handy_key', k);
  }, []);

  useEffect(() => {
    if (status !== 'connecting') {
      setConnectElapsedSec(0);
      return;
    }
    const id = window.setInterval(() => {
      setConnectElapsedSec((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [status]);

  const connect = useCallback(async () => {
    if (connectingRef.current) return;
    connectingRef.current = true;
    setErrorMessage(null);
    setStatus('connecting');
    setConnectElapsedSec(0);
    const res = await callElectron('connectHandy', connectionKey);
    connectingRef.current = false;
    if (!res.ok) {
      setStatus('error');
      setErrorMessage(res.error);
      return;
    }
    if (res.data?.connected) {
      setStatus('connected');
      setApiVersion(res.data.api ?? 'v3');
      setFirmware(res.data.fw ?? '4.0.0');
      setErrorMessage(null);
    } else {
      setStatus('error');
      setErrorMessage(res.data?.error ?? 'Could not reach device. Check the key and try again.');
    }
  }, [connectionKey]);

  const stopDevice = useCallback(async () => {
    const res = await callElectron('stopHandy');
    if (!res.ok) {
      setErrorMessage(res.error);
      return;
    }
    setStatus((prev) => (prev === 'playing' ? 'paused' : prev));
  }, []);

  const disconnectDevice = useCallback(async () => {
    await callElectron('disconnectHandy');
    setStatus('not-connected');
    setApiVersion(null);
    setFirmware(null);
    setErrorMessage(null);
  }, []);

  const setBenchStatus = useCallback((s: DeviceConnectionStatus) => {
    connectingRef.current = s === 'connecting';
    setStatus(s);
    if (s === 'connected' || s === 'playing' || s === 'paused') {
      setApiVersion('v3');
      setFirmware('4.0.0');
      setErrorMessage(null);
    } else if (s === 'error') {
      setErrorMessage('Handy API HTTP 500 — check connection and retry');
    } else if (s === 'lost') {
      setErrorMessage('Device dropped offline. Video continues; reconnect when ready.');
    } else {
      setErrorMessage(null);
    }
  }, []);

  const scaleValue = useMemo<ScaleContextValue>(
    () => ({
      uiScale,
      overlayScale,
      screenSignature,
      scaleBannerTick,
      setUiScale,
      stepScale,
      resetScale,
      setOverlayScale,
    }),
    [uiScale, overlayScale, screenSignature, scaleBannerTick, setUiScale, stepScale, resetScale, setOverlayScale]
  );

  const shellValue = useMemo<ShellContextValue>(
    () => ({
      theme,
      toggleTheme,
      oled,
      setOled,
      activeView,
      setActiveView,
      libraryOpen,
      setLibraryOpen,
      deviceOpen,
      setDeviceOpen,
      libraryWidthPx,
      setLibraryWidthPx,
      popped,
      popOutRegion,
      bringBackRegion,
      twoScreenActive,
      toggleTwoScreens,
      folders,
      selectFolder,
      refreshFolders,
      scanDriveAction,
      scanningDrive,
      scanStatus,
      shellError,
      clearShellError,
      actionMixOpen,
      setActionMixOpen,
    }),
    [
      theme,
      toggleTheme,
      oled,
      setOled,
      activeView,
      libraryOpen,
      deviceOpen,
      libraryWidthPx,
      popped,
      popOutRegion,
      bringBackRegion,
      twoScreenActive,
      toggleTwoScreens,
      folders,
      selectFolder,
      refreshFolders,
      scanDriveAction,
      scanningDrive,
      scanStatus,
      shellError,
      clearShellError,
      actionMixOpen,
    ]
  );

  const deviceValue = useMemo<DeviceContextValue>(
    () => ({
      connectionKey,
      setConnectionKey,
      status,
      apiVersion,
      firmware,
      connectElapsedSec,
      errorMessage,
      connect,
      stopDevice,
      disconnectDevice,
      setBenchStatus,
    }),
    [
      connectionKey,
      setConnectionKey,
      status,
      apiVersion,
      firmware,
      connectElapsedSec,
      errorMessage,
      connect,
      stopDevice,
      disconnectDevice,
      setBenchStatus,
    ]
  );

  const benchValue = useMemo<BenchContextValue>(
    () => ({
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
      popoutReadySimulated,
      setPopoutReadySimulated,
    }),
    [
      benchOpen,
      benchFrame,
      windowKind,
      librarySize,
      setLibrarySize,
      longNames,
      setLongNames,
      popoutReadySimulated,
    ]
  );

  return (
    <BenchContext.Provider value={benchValue}>
      <ScaleContext.Provider value={scaleValue}>
        <ShellContext.Provider value={shellValue}>
          <DeviceContext.Provider value={deviceValue}>{children}</DeviceContext.Provider>
        </ShellContext.Provider>
      </ScaleContext.Provider>
    </BenchContext.Provider>
  );
}
