# SyncPlayer Interface — Design & Engineering Notes

## Design Rationale (Stage 1)
1. **The idea**: A calm, matte-carbon workstation where the video picture owns the frame and every control steps back until summoned.
2. **The grid**: A 56px (`3.5rem`) launcher rail, a single-row top bar that never wraps, and three container-queried regions (library, stage, device) that dock or fold cleanly by effective `rem` width.
3. **The type system**: Local-first Outfit headings, Plus Jakarta Sans UI copy, and JetBrains Mono tabular figures restricted to six named size tokens (`--text-xs` through `--text-xl`), each clamped with `max(12px, ...)` so nothing drops below 12px at any scale.
4. **Surface discipline**: Flat `#0B0B0D` to `#1E1E24` carbon steps separated by `1px` `#27272F` hairlines, true `#000` around the picture, muted `#6A8EC2` accent reserved strictly for active state, primary actions, focus rings, and playhead.
5. **Anti-slop restraint**: Zero gradients, zero glass blur, zero glow, zero decorative dots, zero nested rounded boxes, and short verb-first labels everywhere.
6. **Scale-first math**: `html { font-size: calc(16px * var(--ui-scale)); }` paired with container queries in `rem` ensures scaling up to 160% behaves identically to narrowing the window.
7. **Pointer-pinned sizing**: The size popover freezes its screen-pixel coordinates and dimensions while open so `-` and `+` never shift under the pointer across repeated clicks.
8. **Connection clarity**: The Handy key stays masked unless focused, while connection state combines icon, word, elapsed seconds, and typical duration (`10–20s`).
9. **Performance isolation**: Region states are split and fast-changing telemetry uses direct DOM writes in later stages, keeping playback free of layout thrash.
10. **Contract fidelity**: All calls pass through `window.electronAPI` guards with zero external network requests or extra runtime dependencies.

## Environment Notes
- **Tailwind CSS**: `tailwindcss` and `@tailwindcss/vite` exist in the starter `package.json` and `src/index.css`. Per Section 1, they are left completely unused; all styling uses `src/tokens.css` and plain CSS files with CSS custom properties.
- **No extra runtime dependencies**: Only `react`, `react-dom`, and `lucide-react` (1.5px stroke) are used by the interface.
- **Fonts**: `Outfit`, `Plus Jakarta Sans`, and `JetBrains Mono` are declared in `tokens.css` with system sans/monospace fallbacks and zero network font requests.

## Stage 1 Notes & Open Questions
- **Stage 1 scope**: Foundations are built and verified — `tokens.css`, all 21 `ui/` primitives (plus a dedicated Primitives Showcase view reachable from the launcher rail or test bench), the `--ui-scale` and per-screen `--overlay-scale` system with the pointer-pinned size popover, the `window.electronAPI` stand-in, the `F9` test bench and `window.__selfCheck()`, and the responsive Shell (launcher rail, single-row top bar with device connection, and collapsible/pop-out-ready empty Library, Stage, and Device regions).
- **Questions before Stage 2**:
  1. In the top bar, `top-08` (Stop) and `top-09` (Disconnect) are always rendered when connected; when disconnected, should `top-08` and `top-09` remain visible-but-disabled or hidden until connected? (In Stage 1, they render disabled or compactly accessible in the device connection group so both keys are inspectable and reachable.)
  2. For the new two-screen switch in the top bar, should the target screen choice persist under a new `syncplayer_fullscreen_screen` localStorage key?
  3. On very tight frames (`640x480` at step `1.6` = `25rem` effective width), secondary top-bar source actions collapse into a labelled `Sources` menu so the device connection and size control remain single-row and uncut. Confirm if that grouping feels right.
