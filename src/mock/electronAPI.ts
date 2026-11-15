import type { ElectronAPI, FunscriptData, VideoStats } from '../types/electron';

export interface MockConfig {
  librarySize: 0 | 2000 | 21000;
  longNames: boolean;
  connectDelayMs: number;
}

const mockConfig: MockConfig = {
  librarySize: 2000,
  longNames: false,
  connectDelayMs: 12000,
};

export function setMockConfig(partial: Partial<MockConfig>): void {
  Object.assign(mockConfig, partial);
}

export function getMockConfig(): MockConfig {
  return { ...mockConfig };
}

function makeClip(n: number, scripted: boolean): VideoStats {
  const longSuffix = mockConfig.longNames
    ? '_extended_edition_director_cut_final_master_version_2026_part_' + n
    : '';
  const name = `clip_${String(n).padStart(2, '0')}${longSuffix}.mp4`;
  const folder = n % 2 === 0 ? 'D:/Folder A' : 'E:/Folder B';
  const types = ['2-D', '3-D', 'Real'] as const;
  const formats = [
    'normal',
    'first-person',
    'music compilation',
    'animated music compilation',
  ] as const;

  return {
    videoPath: `${folder}/${name}`,
    name,
    scriptPath: scripted ? `${folder}/clip_${String(n).padStart(2, '0')}.funscript` : undefined,
    hasFunscript: scripted,
    hasNew: scripted && n % 17 === 0,
    durationMs: 180000 + (n % 200) * 7000,
    strokes: scripted ? 400 + (n % 900) : 0,
    spm: scripted ? 110 + (n % 70) : 0,
    avgSpeed: scripted ? 170 + (n % 120) : 0,
    scriptedAt: scripted ? Date.now() - (n % 60) * 86400000 : undefined,
    sizeBytes: 300e6 + (n % 12) * 45e6,
    createdAt: Date.now() - (n % 365) * 86400000,
    addedAt: Date.now() - (n % 180) * 3600000,
    folder,
    width: [1280, 1920, 3840][n % 3],
    height: [720, 1080, 2160][n % 3],
    contentKind: n % 5 === 0 ? 'pov' : n % 3 === 0 ? 'pmv' : 'unknown',
    driveConnected: n % 97 !== 0,
    driveSlow: n % 113 === 0,
    categoryType: types[n % types.length],
    categoryFormat: formats[n % formats.length],
    censored: n % 7 === 0,
    series: `Series ${String.fromCharCode(65 + (n % 6))}`,
    creator: `Creator ${(n % 8) + 1}`,
  };
}

const wait = <T,>(ms: number, v: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(v), ms));

const sampleScript: FunscriptData = {
  version: '1.0',
  actions: Array.from({ length: 400 }, (_, i) => ({
    at: i * 450,
    pos: i % 2 ? 90 - (i % 7) * 5 : 10 + (i % 5) * 4,
  })),
};

let savedPlaylists: Record<string, unknown> = {
  'Pattern set A · Warmup': [
    { pattern: 'Pattern 1', seconds: 30 },
    { pattern: 'Pattern 2', seconds: 45 },
  ],
};

let savedMyTags: Record<string, string[]> = {
  'Playlist 1': [],
  'Playlist 2': [],
};

let currentOffsetMs = 0;
let currentLiveTame = { pace: 100, speed: 100, length: 100, vibe: 0 };

export function installMockElectronAPI(): void {
  if (typeof window === 'undefined') return;
  if (window.electronAPI) return;

  const base: ElectronAPI = {
    listDrives: () => wait(40, ['D:/', 'E:/']),
    chooseDrive: () => wait(60, 'D:/'),
    selectDirectory: () => wait(60, 'D:/Folder A'),
    scanDirectory: () => {
      const count = mockConfig.librarySize;
      return wait(80, Array.from({ length: count }, (_, i) => makeClip(i + 1, i % 3 !== 0)));
    },
    scanDirectories: () => {
      const count = mockConfig.librarySize;
      return wait(120, Array.from({ length: count }, (_, i) => makeClip(i + 1, i % 3 !== 0)));
    },
    scanDrive: (root: string) => {
      const count = Math.min(mockConfig.librarySize || 200, 2000);
      return wait(600, Array.from({ length: count }, (_, i) => makeClip(i + 1, true)).map((c) => ({ ...c, folder: root })));
    },
    playbackFileExists: (p: string) => wait(15, !p.includes('missing')),
    listScriptVersions: (p: string) =>
      wait(50, [
        { label: 'default', path: p.replace(/\.mp4$/i, '.funscript') },
        { label: 'v2', path: p.replace(/\.mp4$/i, '.v2.funscript') },
        { label: 'alt', path: p.replace(/\.mp4$/i, '.alt.funscript') },
      ]),
    getFunscript: () => wait(80, sampleScript),
    getThumbnail: () => wait(80, null),
    getThumbnailCached: () => wait(10, null),
    getResumeAll: () => wait(20, {}),
    setResume: () => wait(5, undefined),
    connectHandy: (key: string) =>
      wait(
        mockConfig.connectDelayMs,
        key && key.trim().length > 0
          ? { connected: true, api: 'v3', fw: '4.0.0' }
          : { connected: false, error: 'Connection key is required' }
      ),
    stopHandy: () => wait(150, undefined),
    disconnectHandy: () => wait(100, undefined),
    uploadHandyScript: () => wait(1200, { success: true }),
    playHandy: () => wait(150, undefined),
    pauseHandy: () => wait(150, undefined),
    syncHandyTime: () => wait(150, undefined),
    setHandyOffset: (ms: number) => {
      currentOffsetMs = ms;
      return wait(80, undefined);
    },
    liveTameGet: () => wait(10, { ...currentLiveTame }),
    liveTameSet: (values) => {
      currentLiveTame = { ...values };
      return wait(180, undefined);
    },
    remoteSlide: () => wait(180, undefined),
    setDevicePlayerState: () => {},
    setDeviceMotion: () => {},
    listPatterns: () =>
      wait(60, [
        { folder: 'Pattern set A', name: 'Pattern 1', path: 'pattern-set-a/p1' },
        { folder: 'Pattern set A', name: 'Pattern 2', path: 'pattern-set-a/p2' },
        { folder: 'Pattern set B', name: 'Pattern 3', path: 'pattern-set-b/p3' },
      ]),
    readPattern: () => wait(30, sampleScript),
    readAllPatterns: () => wait(60, { 'pattern-set-a/p1': sampleScript }),
    readPatternsByPath: () => wait(60, { 'pattern-set-a/p1': sampleScript }),
    playlistsGet: () => wait(40, { ...savedPlaylists }),
    playlistsSet: (all) => {
      savedPlaylists = { ...all };
      return wait(40, undefined);
    },
    myTagsGet: () => wait(40, { ...savedMyTags }),
    myTagsSet: ({ name, paths, op }) => {
      const existing = new Set(savedMyTags[name] ?? []);
      if (op === 'replace') savedMyTags[name] = [...paths];
      else if (op === 'add') {
        paths.forEach((p) => existing.add(p));
        savedMyTags[name] = [...existing];
      } else {
        paths.forEach((p) => existing.delete(p));
        savedMyTags[name] = [...existing];
      }
      return wait(40, { ...savedMyTags });
    },
    getSeriesInfo: (p: string) =>
      wait(40, {
        title: 'Series A',
        description: 'existing text, unchanged',
        rating: 8.2,
        genres: ['Tag 1', 'Tag 2'],
        themes: ['Tag 3'],
        path: p,
      } as unknown as import('../types/electron').SeriesInfo),
    getSeriesIndex: () => wait(40, {}),
    getSeriesCatalog: () => wait(40, []),
    getLanInfo: () => wait(40, { url: 'http://192.168.1.20:8787', pin: '4812' }),
    deepsyncStatus: () => wait(40, { running: false, url: 'http://127.0.0.1:8899' }),
    lmModels: () => wait(40, ['Model 1', 'Model 2']),
    listGenPersonas: () => wait(40, [{ id: 'p1', name: 'Persona A' }]),
    openPopout: () => wait(20, undefined),
    closePopout: () => wait(20, undefined),
    openLibraryPopout: () => wait(20, undefined),
    openDeckPopout: () => wait(20, undefined),
    openKeysPopout: () => wait(20, undefined),
    openChatPopout: () => wait(20, undefined),
    openAiPopout: () => wait(20, undefined),
    closeAiPopout: () => wait(20, undefined),
  };

  window.electronAPI = new Proxy(base, {
    get(target, prop: keyof ElectronAPI) {
      if (prop in target) return target[prop];
      if (String(prop).startsWith('on')) {
        return () => () => {};
      }
      return () => wait(40, null);
    },
  });
}

export async function callElectron<K extends keyof ElectronAPI>(
  method: K,
  ...args: Parameters<NonNullable<ElectronAPI[K]>>
): Promise<{ ok: true; data: Awaited<ReturnType<NonNullable<ElectronAPI[K]>>> } | { ok: false; error: string }> {
  const api = typeof window !== 'undefined' ? window.electronAPI : undefined;
  const fn = api?.[method];
  if (typeof fn !== 'function') {
    return { ok: false, error: `Action unavailable (${String(method)})` };
  }
  try {
    const data = await (fn as (...a: unknown[]) => Promise<unknown>)(...args);
    return {
      ok: true,
      data: data as Awaited<ReturnType<NonNullable<ElectronAPI[K]>>>,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected back-end error';
    return { ok: false, error: message };
  }
}

export function getMockOffsetMs(): number {
  return currentOffsetMs;
}
