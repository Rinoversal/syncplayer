# Control Contract Mapping (Appendix B -> Components)

Updated through **Stage 1 (Foundations)**. Pending controls for Stages 2–6 are tracked below.

## Stage 1 Controls Placed

| Key | Element | Description | Component |
|---|---|---|---|
| `top-01` | `<button>` | Theme: night or brighter level | `src/regions/shell/TopBar.tsx` |
| `top-02` | `<button>` | Select folder containing videos and funscripts | `src/regions/shell/TopBar.tsx` |
| `top-03` | `<button>` | Refresh active folders | `src/regions/shell/TopBar.tsx` |
| `top-04` | `<button>` | Search an entire drive for scripted videos | `src/regions/shell/TopBar.tsx` |
| `top-05` | `<button>` | Action Mix | `src/regions/shell/TopBar.tsx` |
| `top-06` | `<input>` | Device connection key (masked unless focused) | `src/regions/shell/TopBar.tsx` |
| `top-07` | `<button>` | Connect to the device | `src/regions/shell/TopBar.tsx` |
| `top-08` | `<button>` | Stop device movement while connected | `src/regions/shell/TopBar.tsx` |
| `top-09` | `<button>` | Stop and disconnect | `src/regions/shell/TopBar.tsx` |
| `lib-08` | `<button>` | Make everything smaller (`-` in size popover) | `src/regions/shell/ScaleControl.tsx` |
| `lib-09` | `<button>` | Make everything bigger (`+` in size popover) | `src/regions/shell/ScaleControl.tsx` |
| `play-11` | `<button>` | Move library to another screen | `src/regions/shell/WorkspaceShell.tsx` |
| `play-13` | `<button>` | Move player to another screen / bring back | `src/regions/shell/WorkspaceShell.tsx` |
| `popwin-01` | `<button>` | Close pop-out | `src/windows/WindowRouter.tsx` |
| `dev-81` | `<button>` | Move device panel to another screen | `src/regions/shell/WorkspaceShell.tsx` |
| `dev-83` | `<button>` | Open device panel | `src/regions/shell/WorkspaceShell.tsx` |

## New Controls (`data-new="1"`) Placed in Stage 1

| Control | Purpose | Component |
|---|---|---|
| Interface size trigger & popover | Single `--ui-scale` readout (`100%`), 7-stop slider, reset, overlay size, per-screen persistence | `src/regions/shell/ScaleControl.tsx` |
| Two screens switch | One-press dual-screen pop-out / bring-back toggle | `src/regions/shell/TopBar.tsx` |
| Library / Device Bring back | Restores popped-out region into main window | `src/regions/shell/WorkspaceShell.tsx`, `src/windows/WindowRouter.tsx` |
| UI Primitives Showcase toggle | Stage 1 gallery switch in rail (preview aid) | `src/regions/shell/LauncherRail.tsx` |

## Remaining Groups by Stage
- **Stage 2 (Library)**: `lib-01..07`, `lib-10..40`, `tag-01..13`, `card-01..03`, `row-01..03`, `hist-01..03`
- **Stage 3 (Stage, Queue, Playlists, Info, Action Mix)**: `play-01..10`, `play-12`, `play-14..30`, `queue-01..10`, `pl-01..22`, `pick-01..12`, `mix-01..09`, `info-01..45`
- **Stage 4 (Device)**: `dev-01..80`, `dev-82`, `dev-84..87`
- **Stage 5 (Manual & Keys)**: `keys-01..08`, `rem-01..27`
- **Stage 6 (Pop-outs, Assistants, Remote, Jobs, Settings)**: `libwin-01..04`, `deckwin-01..02`, `link-01..06`, `ds-01..04`, `ai-01..69`, `aiwin-01..28`, `chat-01..11`, `con-01..07`, `edge-01..17`, `err-01`
