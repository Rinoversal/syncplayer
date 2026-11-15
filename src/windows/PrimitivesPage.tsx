import React, { useRef, useState } from 'react';
import { FolderOpen, Play, Pause, Plus, Sliders } from 'lucide-react';
import {
  Button,
  Checkbox,
  Drawer,
  EmptyState,
  Field,
  IconButton,
  Kbd,
  Menu,
  Notice,
  Panel,
  Popover,
  ProgressRow,
  RangeSlider,
  ResizeHandle,
  Segmented,
  Select,
  Slider,
  Switch,
  Tabs,
  TextInput,
  TextareaInput,
  Tooltip,
  VirtualGrid,
  VirtualList,
} from '../ui';

const DEMO_ITEMS = Array.from({ length: 120 }, (_, i) => ({
  id: `item-${i + 1}`,
  label: `clip_${String(i + 1).padStart(3, '0')}.mp4`,
  meta: `03:${String((i * 7) % 60).padStart(2, '0')} · 1080p · 140 spm`,
}));

export function PrimitivesPage() {
  const [pressed, setPressed] = useState(false);
  const [textVal, setTextVal] = useState('clip_01.mp4');
  const [selectVal, setSelectVal] = useState('name');
  const [sliderVal, setSliderVal] = useState(100);
  const [rangeMin, setRangeMin] = useState(10);
  const [rangeMax, setRangeMax] = useState(90);
  const [switchVal, setSwitchVal] = useState(true);
  const [checkVal, setCheckVal] = useState(false);
  const [tabVal, setTabVal] = useState('a');
  const [segVal, setSegVal] = useState('script');
  const [menuOpen, setMenuOpen] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [splitWidth, setSplitWidth] = useState(200);

  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const popBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="sp-primitives-page" aria-label="UI Primitives Showcase">
      <div className="sp-prim-head">
        <h1 className="display sp-prim-h1">UI Primitives Showcase</h1>
        <span className="sp-prim-sub">
          All 21 primitives · rest, hover, focus, pressed, disabled, busy, error
        </span>
      </div>

      <div className="sp-primitives-grid">
        {/* 1. Button & IconButton */}
        <section className="sp-prim-section">
          <h2 className="sp-prim-title">Button &amp; IconButton</h2>
          <div className="sp-prim-row">
            <Button>Rest</Button>
            <Button variant="primary">Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button pressed={pressed} onClick={() => setPressed((p) => !p)}>
              {pressed ? 'Pressed' : 'Toggle'}
            </Button>
            <Button disabled>Disabled</Button>
            <Button busy>Busy</Button>
            <Button error>Error</Button>
            <Button size="lg" variant="primary">
              Large 2.5rem
            </Button>
          </div>
          <div className="sp-prim-row">
            <IconButton aria-label="Play clip" tooltip="Play" shortcut="Space" icon={<Play size="1em" strokeWidth={1.5} />} />
            <IconButton aria-label="Pause clip" pressed icon={<Pause size="1em" strokeWidth={1.5} />} />
            <IconButton aria-label="Disabled action" disabled icon={<Plus size="1em" strokeWidth={1.5} />} />
            <IconButton aria-label="Busy action" busy icon={<Plus size="1em" strokeWidth={1.5} />} />
            <IconButton aria-label="Error action" error icon={<Sliders size="1em" strokeWidth={1.5} />} />
            <IconButton aria-label="Large play" size="lg" variant="primary" icon={<Play size="1em" strokeWidth={1.5} />} />
          </div>
        </section>

        {/* 2. Field, TextInput, Textarea, Select */}
        <section className="sp-prim-section">
          <h2 className="sp-prim-title">Field, TextInput &amp; Select</h2>
          <Field label="Clip search" hint="Supports ep 3, ep 3+, ep 2-5">
            {(id) => (
              <TextInput
                id={id}
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                placeholder="Search library…"
              />
            )}
          </Field>
          <Field label="Disabled &amp; Error states" error="Could not reach path on drive E:/">
            {(id) => <TextInput id={id} error value="E:/missing/clip.mp4" readOnly />}
          </Field>
          <Field label="Configured text block">
            {(id) => <TextareaInput id={id} defaultValue="existing text, unchanged" />}
          </Field>
          <div className="sp-prim-row">
            <Select
              aria-label="Sort field"
              value={selectVal}
              onChange={(e) => setSelectVal(e.target.value)}
              options={[
                { value: 'name', label: 'Sort: Name' },
                { value: 'spm', label: 'Sort: Strokes/min' },
                { value: 'duration', label: 'Sort: Length' },
              ]}
            />
            <Select
              aria-label="Disabled select"
              disabled
              value="locked"
              onChange={() => {}}
              options={[{ value: 'locked', label: 'Disabled' }]}
            />
            <Select
              aria-label="Error select"
              error
              value="bad"
              onChange={() => {}}
              options={[{ value: 'bad', label: 'Invalid source' }]}
            />
          </div>
        </section>

        {/* 3. Slider, RangeSlider, Switch, Checkbox */}
        <section className="sp-prim-section">
          <h2 className="sp-prim-title">Slider, RangeSlider &amp; Toggles</h2>
          <Slider
            label="Pace"
            value={sliderVal}
            min={50}
            max={150}
            unit="%"
            shortcut=","
            sending={sliderVal !== 100}
            onChange={setSliderVal}
          />
          <RangeSlider
            label="Stroke window"
            minVal={rangeMin}
            maxVal={rangeMax}
            onChange={(lo, hi) => {
              setRangeMin(lo);
              setRangeMax(hi);
            }}
          />
          <div className="sp-prim-row">
            <Switch label="Include sub-folders" checked={switchVal} onChange={setSwitchVal} />
            <Switch label="Disabled switch" checked={false} disabled onChange={() => {}} />
            <Checkbox label="Hide empty scripts" checked={checkVal} onChange={setCheckVal} />
          </div>
        </section>

        {/* 4. Tabs, Segmented, Kbd, Tooltip */}
        <section className="sp-prim-section">
          <h2 className="sp-prim-title">Tabs, Segmented, Kbd &amp; Tooltip</h2>
          <Tabs
            ariaLabel="Demo tabs"
            value={tabVal}
            onChange={setTabVal}
            items={[
              { id: 'a', label: 'Gamepad' },
              { id: 'b', label: 'Journey' },
              { id: 'c', label: 'Knob' },
              { id: 'd', label: 'Locked', disabled: true },
            ]}
          />
          <Segmented
            ariaLabel="Motion mode"
            value={segVal}
            onChange={setSegVal}
            options={[
              { value: 'script', label: 'Script', shortcut: '1' },
              { value: 'fill', label: 'Script + fill', shortcut: '2' },
              { value: 'manual', label: 'Manual', shortcut: '3' },
            ]}
          />
          <div className="sp-prim-row">
            <Kbd>Space</Kbd>
            <Kbd>F9</Kbd>
            <Kbd>Ctrl +</Kbd>
            <Tooltip label="Tooltip with shortcut" shortcut="F">
              <Button variant="ghost">Hover or focus for tooltip</Button>
            </Tooltip>
          </div>
        </section>

        {/* 5. Menu, Popover, Drawer */}
        <section className="sp-prim-section">
          <h2 className="sp-prim-title">Menu, Popover &amp; Drawer</h2>
          <div className="sp-prim-row">
            <Button ref={menuBtnRef} onClick={() => setMenuOpen((o) => !o)}>
              Open Menu
            </Button>
            <Menu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              anchorEl={menuBtnRef.current}
              ariaLabel="Sample actions"
              items={[
                { id: 'm1', label: 'Shuffle', shortcut: 'S', onSelect: () => {} },
                { id: 'm2', label: 'Roulette', shortcut: 'R', onSelect: () => {} },
                { id: 'm3', label: 'Action Mix', onSelect: () => {} },
              ]}
            />

            <Button ref={popBtnRef} onClick={() => setPopOpen((o) => !o)}>
              Open Popover
            </Button>
            <Popover
              open={popOpen}
              onClose={() => setPopOpen(false)}
              anchorEl={popBtnRef.current}
              ariaLabel="Sample popover"
            >
              <div className="sp-prim-pop-msg">Popover content · Esc closes</div>
            </Popover>

            <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Sample Drawer">
              <p className="sp-prim-drawer-msg">
                Drawer content traps Esc and restores focus when closed.
              </p>
            </Drawer>
          </div>
        </section>

        {/* 6. Notice, ProgressRow, EmptyState */}
        <section className="sp-prim-section">
          <h2 className="sp-prim-title">Notice, ProgressRow &amp; EmptyState</h2>
          <Notice tone="info">Folder scan finished: 2,000 clips indexed.</Notice>
          <Notice tone="ok">Connected · v3 · fw 4.0.0</Notice>
          <Notice tone="warn">Playback speed is 1.5x · device paused</Notice>
          <Notice tone="error" action={<Button>Reconnect</Button>}>
            Device dropped offline. Video continues.
          </Notice>
          <ProgressRow title="Repackaging clip_01.mkv" stage="Remuxing container" percent={42} onCancel={() => {}} />
          <ProgressRow title="Scanning drive D:/" stage="Searching scripted files" elapsedText="11s" onCancel={() => {}} />
          <ProgressRow title="Script job" stage="Failed" error="Model server unreachable" onRetry={() => {}} />
        </section>

        {/* 7. Panel, ResizeHandle, EmptyState */}
        <section className="sp-prim-section">
          <h2 className="sp-prim-title">Panel, ResizeHandle &amp; EmptyState</h2>
          <div className="sp-prim-split">
            <div style={{ width: `${splitWidth}px` }}>
              <Panel title="Panel A">
                <div className="sp-prim-split-body">
                  Width: <span className="mono">{splitWidth}px</span>
                </div>
              </Panel>
            </div>
            <ResizeHandle label="Demo resize split" value={splitWidth} min={120} max={280} onChange={setSplitWidth} />
            <div className="sp-prim-split-right">
              <EmptyState
                icon={<FolderOpen size="1.25rem" strokeWidth={1.5} />}
                title="Empty region"
                description="Action-oriented empty state."
                action={<Button variant="primary">Link folder</Button>}
              />
            </div>
          </div>
        </section>

        {/* 8. VirtualList & VirtualGrid */}
        <section className="sp-prim-section">
          <h2 className="sp-prim-title">VirtualList &amp; VirtualGrid</h2>
          <div className="sp-prim-vlist-box">
            <VirtualList
              items={DEMO_ITEMS}
              itemHeight={48}
              getKey={(item) => item.id}
              renderItem={(item) => (
                <div className="sp-prim-vrow">
                  <div className="sp-prim-vrow-title">{item.label}</div>
                  <div className="mono sp-prim-vrow-meta">{item.meta}</div>
                </div>
              )}
            />
          </div>
          <div className="sp-prim-vgrid-box">
            <VirtualGrid
              items={DEMO_ITEMS}
              minTileWidth={130}
              rowHeight={72}
              getKey={(item) => item.id}
              renderItem={(item) => (
                <div className="sp-prim-vtile">{item.label}</div>
              )}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
