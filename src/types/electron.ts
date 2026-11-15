export type WindowKind =
  | 'main'
  | 'popout'
  | 'library'
  | 'deck'
  | 'keys'
  | 'chat'
  | 'ai-popout'
  | 'phone';

export type DeviceConnectionStatus =
  | 'not-connected'
  | 'connecting'
  | 'connected'
  | 'playing'
  | 'paused'
  | 'lost'
  | 'error'
  | 'no-script';

export type ThemeLevel = 'night' | 'bright';

export type VideoFitMode = 'fit' | 'fill' | 'stretch';

export interface VideoStats {
  videoPath: string;
  name: string;
  scriptPath?: string;
  hasFunscript: boolean;
  hasNew?: boolean;
  durationMs: number;
  strokes: number;
  spm: number;
  avgSpeed: number;
  scriptedAt?: number;
  sizeBytes: number;
  createdAt: number;
  addedAt?: number;
  folder?: string;
  width?: number;
  height?: number;
  contentKind?: 'pmv' | 'pov' | 'unknown';
  statsPending?: boolean;
  probePending?: boolean;
  driveConnected?: boolean;
  driveSlow?: boolean;
  categoryType?: '2-D' | '3-D' | 'Real';
  categoryFormat?: 'music compilation' | 'animated music compilation' | 'first-person' | 'normal';
  censored?: boolean;
  series?: string;
  creator?: string;
}

export interface FunscriptAction {
  at: number;
  pos: number;
}

export interface FunscriptData {
  version: string;
  inverted?: boolean;
  range?: number;
  actions: FunscriptAction[];
  metadata?: Record<string, unknown>;
}

export interface ScriptVersionInfo {
  label: string;
  path: string;
}

export interface HandyConnectResult {
  connected: boolean;
  api?: 'v2' | 'v3';
  fw?: string;
  error?: string;
}

export interface HandyUploadResult {
  success: boolean;
  error?: string;
}

export interface LiveTameValues {
  pace: number;
  speed: number;
  length: number;
  vibe: number;
}

export interface PatternItem {
  folder: string;
  name: string;
  path: string;
}

export interface SeriesInfo {
  title: string;
  description: string;
  rating: number;
  genres: string[];
  themes: string[];
}

export interface ScanDriveProgress {
  root: string;
  scanned: number;
  found: number;
  stage: string;
  done?: boolean;
}

export interface ElectronAPI {
  listDrives?: () => Promise<string[]>;
  chooseDrive?: () => Promise<string | null>;
  scanDrive?: (root: string) => Promise<VideoStats[]>;
  onScanDriveProgress?: (cb: (p: ScanDriveProgress) => void) => () => void;
  selectDirectory?: () => Promise<string | null>;
  scanDirectory?: (dir: string) => Promise<VideoStats[]>;
  scanDirectories?: (dirs: string[], recursive?: boolean) => Promise<VideoStats[]>;
  watchDirectory?: (dirs: string[], recursive?: boolean) => Promise<void>;
  onDirectoryChanged?: (cb: (dir: string) => void) => () => void;
  takePendingFolders?: () => Promise<string[]>;
  playbackFileExists?: (path: string) => Promise<boolean>;
  openFolder?: (dir: string) => Promise<void>;
  scriptStatsBatch?: (items: Array<{ videoPath: string; scriptPath?: string }>) => Promise<Partial<VideoStats>[]>;
  probeMediaBatch?: (videoPaths: string[]) => Promise<Array<{ videoPath: string; width: number; height: number; durationMs: number }>>;
  getThumbnail?: (path: string, second?: number) => Promise<string | null>;
  getThumbnailCached?: (path: string) => Promise<string | null>;
  getResumeAll?: () => Promise<Record<string, { t: number; dur: number; at: number }>>;
  setResume?: (path: string, t: number, dur: number) => Promise<void>;

  selectFunscript?: () => Promise<string | null>;
  getFunscript?: (scriptPath: string) => Promise<FunscriptData | null>;
  listScriptVersions?: (videoPath: string) => Promise<ScriptVersionInfo[]>;

  remuxVideo?: (path: string) => Promise<{ url?: string; error?: string }>;
  getSubtitleText?: (path: string) => Promise<string | null>;
  getSubtitleCues?: (path: string) => Promise<Array<{ start: number; end: number; text: string }>>;

  connectHandy?: (key: string) => Promise<HandyConnectResult>;
  stopHandy?: () => Promise<void>;
  disconnectHandy?: () => Promise<void>;
  uploadHandyScript?: (scriptPath: string, depth?: number, gap?: unknown) => Promise<HandyUploadResult>;
  playHandy?: (timeMs: number) => Promise<void>;
  pauseHandy?: () => Promise<void>;
  syncHandyTime?: (timeMs: number) => Promise<void>;
  setHandyOffset?: (ms: number) => Promise<void>;
  liveTameSet?: (values: LiveTameValues, state?: unknown) => Promise<void>;
  liveTameGet?: () => Promise<LiveTameValues>;
  remoteSlide?: (min: number, max: number, mode?: 'squash' | 'cap', style?: string) => Promise<void>;
  remoteUploadVariants?: (variants: unknown) => Promise<void>;
  remotePlay?: (url: string, timeMs: number) => Promise<void>;
  setDevicePlayerState?: (state: unknown) => void;
  setDeviceMotion?: (motion: { rev: number; actions: FunscriptAction[] }) => void;

  listPatterns?: () => Promise<PatternItem[]>;
  readPattern?: (path: string) => Promise<FunscriptData | null>;
  readAllPatterns?: () => Promise<Record<string, FunscriptData>>;
  readPatternsByPath?: () => Promise<Record<string, FunscriptData>>;
  patternsBrief?: () => Promise<unknown>;
  playlistsGet?: () => Promise<Record<string, unknown>>;
  playlistsSet?: (all: Record<string, unknown>) => Promise<void>;

  openPopout?: () => Promise<void>;
  closePopout?: () => Promise<void>;
  sendPopoutCommand?: (cmd: unknown) => void;
  notifyPopoutReady?: () => void;
  onPopoutCommand?: (cb: (cmd: unknown) => void) => () => void;
  onPopoutReady?: (cb: () => void) => () => void;
  onPopoutClosed?: (cb: () => void) => () => void;
  openLibraryPopout?: () => Promise<void>;
  openDeckPopout?: () => Promise<void>;
  openKeysPopout?: () => Promise<void>;
  openChatPopout?: () => Promise<void>;
  libraryBridge?: (msg: unknown) => void;
  onLibraryBridge?: (cb: (msg: unknown) => void) => () => void;
  openAiPopout?: () => Promise<void>;
  closeAiPopout?: () => Promise<void>;
  aiControlBridge?: (msg: unknown) => void;
  onAiControlBridge?: (cb: (msg: unknown) => void) => () => void;

  getLanInfo?: () => Promise<{ url: string; pin: string } | null>;
  setLanPlayerState?: (state: unknown) => void;
  onLanCommand?: (cb: (cmd: unknown) => void) => () => void;
  remoteVideoSend?: (...args: unknown[]) => Promise<unknown>;
  remoteSidecarsFetch?: (...args: unknown[]) => Promise<unknown>;
  getRemotePcHint?: () => Promise<string | null>;
  onRemoteVideoProgress?: (cb: (p: unknown) => void) => () => void;

  getSeriesInfo?: (path: string) => Promise<SeriesInfo | null>;
  getSeriesIndex?: () => Promise<Record<string, SeriesInfo>>;
  getSeriesCatalog?: () => Promise<SeriesInfo[]>;
  fixSeriesInfo?: (req: unknown) => Promise<SeriesInfo | null>;
  refreshSeriesInfo?: (folders: string[]) => Promise<void>;
  setEpisodeSynopsis?: (path: string, text: string, sources?: unknown) => Promise<void>;
  myTagsGet?: () => Promise<Record<string, string[]>>;
  myTagsSet?: (req: { name: string; paths: string[]; op: 'add' | 'remove' | 'replace' }) => Promise<Record<string, string[]>>;
  myTagsCombine?: (req: { names: string[]; newName: string }) => Promise<Record<string, string[]>>;
  myTagsTidy?: (req: { exclusive: boolean }) => Promise<Record<string, string[]>>;
  myTagsMeta?: () => Promise<Record<string, { count: number; updatedAt: number }>>;

  deepsyncStatus?: () => Promise<{ running: boolean; url?: string }>;
  deepsyncStart?: () => Promise<{ ok: boolean }>;
  deepsyncStop?: () => Promise<void>;
  lmModels?: (base?: string) => Promise<string[]>;
  lmTest?: (base: string, model: string) => Promise<{ ok: boolean; reply?: string; error?: string }>;
  webResearch?: (query: string) => Promise<{ summary: string }>;
  aiTagsRun?: (job: unknown) => Promise<void>;
  aiTagsStatus?: () => Promise<unknown>;
  aiTagsStop?: () => Promise<void>;
  aiTagsUndo?: () => Promise<void>;
  aiTagsChat?: (req: unknown) => Promise<{ reply: string }>;
  onAiTagsProgress?: (cb: (p: unknown) => void) => () => void;
  aiCollect?: (req: unknown) => Promise<unknown>;
  aiCoach?: (req: unknown) => Promise<unknown>;
  aiOrganiseSeries?: (req: unknown) => Promise<unknown>;
  listGenPersonas?: () => Promise<Array<{ id: string; name: string; missing?: boolean }>>;
  getGenPersonaBio?: (id: string) => Promise<string | null>;
  getStudyCache?: (path: string) => Promise<unknown>;
  saveFastAiFolders?: (folders: string[]) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
