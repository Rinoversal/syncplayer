import React from 'react';
import {
  Activity,
  Disc3,
  FolderKanban,
  Headphones,
  Layers,
  Play,
  SlidersHorizontal,
} from 'lucide-react';
import { useShell } from '../../state/appStore';
import { Tooltip } from '../../ui';

const SIBLING_APPS = [
  { id: 'syncplayer', label: 'SyncPlayer', icon: Play, active: true },
  { id: 'library-hub', label: 'Library Hub', icon: FolderKanban, active: false },
  { id: 'script-studio', label: 'Script Studio', icon: Activity, active: false },
  { id: 'audio-sync', label: 'Audio Sync', icon: Headphones, active: false },
  { id: 'catalog', label: 'Catalog', icon: Disc3, active: false },
  { id: 'utilities', label: 'Utilities', icon: SlidersHorizontal, active: false },
] as const;

export function LauncherRail() {
  const { activeView, setActiveView } = useShell();

  return (
    <nav className="sp-rail" aria-label="Application suite">
      <div className="sp-rail-group">
        {SIBLING_APPS.map((app) => {
          const Icon = app.icon;
          const isCurrent = app.active && activeView === 'workspace';
          return (
            <Tooltip key={app.id} label={app.label}>
              <button
                type="button"
                className="sp-rail-item"
                data-active={isCurrent ? 'true' : undefined}
                aria-label={app.label}
                aria-current={isCurrent ? 'page' : undefined}
                onClick={() => {
                  if (app.active) setActiveView('workspace');
                }}
              >
                <Icon size="1.15em" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </Tooltip>
          );
        })}
      </div>

      <div className="sp-rail-group">
        <Tooltip label="UI Primitives Showcase">
          <button
            type="button"
            className="sp-rail-item"
            data-active={activeView === 'primitives' ? 'true' : undefined}
            data-new="1"
            aria-label="UI Primitives Showcase"
            aria-pressed={activeView === 'primitives'}
            onClick={() =>
              setActiveView(activeView === 'primitives' ? 'workspace' : 'primitives')
            }
          >
            <Layers size="1.15em" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </Tooltip>
      </div>
    </nav>
  );
}
