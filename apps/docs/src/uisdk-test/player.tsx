import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Button,
  Dialog,
  Heading,
  Icon,
  IconButton,
  Kbd,
  ListBox,
  Menu,
  Menubar,
  Slider,
  Text,
  Theme,
  Toggle,
  Toolbar,
  Tooltip,
} from "@dixy-ui/react";
import type { Material } from "@dixy-ui/tokens";
import {
  shortcuts,
  useShortcut,
  useShortcutHint,
} from "@ui-sdk/react/shortcuts";
import {
  ArrowUpFromLine,
  ChevronDown,
  Keyboard,
  Library,
  ListMusic,
  Maximize2,
  Minus,
  Moon,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Square,
  Sun,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { Display } from "./display";
import { MediaLibrary } from "./media-library";
import { ConformancePanel, settle, type Check } from "./conformance";
import { formatTime, speakTime, tracks } from "./tracks";
import { usePlayer, type Visualizer } from "./use-player";
import { materials, skins } from "./skins";

/** Typeahead widgets read letters; page shortcuts must not steal them. */
function focusInTypeahead() {
  return !!document.activeElement?.closest(
    '[role="menu"],[role="menubar"],[role="listbox"],[role="tree"],[role="combobox"]',
  );
}

/**
 * UI SDK pauses shortcuts only for popups in its own layer stack. Dixy dialogs
 * are Base UI popups, so look for an open modal in the DOM instead.
 */
function modalOpen() {
  return !!document.querySelector(
    '[aria-modal="true"]:is([role="dialog"],[role="alertdialog"]):not([data-ending-style])',
  );
}

function useTransportShortcut(
  keys: string,
  run: () => void,
  description: string,
) {
  useShortcut(
    keys,
    (event) => {
      event?.preventDefault?.();
      run();
    },
    { description, when: () => !focusInTypeahead() && !modalOpen() },
  );
  return useShortcutHint(keys);
}

function Tip({
  label,
  children,
}: {
  label: string;
  children: React.ReactElement;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={children} />
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={6}>
          <Tooltip.Popup size="sm">{label}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function ShortcutItem({
  hint,
  onClick,
  children,
}: {
  hint: { text: string; ariaKeyshortcuts: string };
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Menu.Item onClick={onClick} aria-keyshortcuts={hint.ariaKeyshortcuts}>
      {children}
      <Kbd size="sm" className="uisdk-menu-kbd" aria-hidden="true">
        {hint.text}
      </Kbd>
    </Menu.Item>
  );
}

function MenuShell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Menu.Root>
      <Menu.Trigger>{label}</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={4} align="start">
          <Menu.Popup size="sm" className="uisdk-menu">
            {children}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export function PlayerBench({
  appearance,
  onAppearance,
  skin,
  onSkin,
  material,
  onMaterial,
}: {
  appearance: "light" | "dark";
  onAppearance: (a: "light" | "dark") => void;
  skin: string;
  onSkin: (id: string) => void;
  material: Material;
  onMaterial: (m: Material) => void;
}) {
  const player = usePlayer();
  const [visualizer, setVisualizer] = useState<Visualizer>("spectrum");
  const [timeMode, setTimeMode] = useState<"elapsed" | "remaining">("elapsed");
  const [shaded, setShaded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showLibrary, setShowLibrary] = useState(true);
  const [showChecks, setShowChecks] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);
  const configTrigger = useRef<HTMLButtonElement>(null);
  const pinned = skins.find((s) => s.id === skin)?.appearance;

  const prevHint = useTransportShortcut("z", player.previous, "Previous track");
  const playHint = useTransportShortcut("x", player.play, "Play");
  const pauseHint = useTransportShortcut("c", player.pause, "Pause or resume");
  const stopHint = useTransportShortcut("v", player.stop, "Stop");
  const nextHint = useTransportShortcut("b", player.next, "Next track");
  const repeatHint = useTransportShortcut(
    "r",
    () => player.setRepeat(!player.repeat),
    "Toggle repeat",
  );
  const shuffleHint = useTransportShortcut(
    "s",
    () => player.setShuffle(!player.shuffle),
    "Toggle shuffle",
  );
  // list() returns only what would run now, and nothing runs inside a modal or
  // a menu. Read it once after the shortcuts above register, before either.
  const [keyList, setKeyList] = useState<ReturnType<typeof shortcuts.list>>([]);
  useEffect(() => setKeyList(shortcuts.list()), []);

  const { track, status, position } = player;
  const totalTime = useMemo(
    () => tracks.reduce((s, t) => s + t.duration, 0),
    [],
  );

  const checks: Check[] = [
    {
      id: "menubar",
      label: "Main menu",
      source: "Dixy",
      pattern: "menubar",
      find: () => document.querySelector(".uisdk-main [role=menubar]"),
    },
    {
      id: "transport",
      label: "Transport",
      source: "Dixy",
      pattern: "toolbar",
      find: () =>
        document.querySelector('[role=toolbar][aria-label="Transport"]'),
    },
    {
      id: "seek",
      label: "Seek",
      source: "Dixy",
      pattern: "slider",
      find: () => document.querySelector(".uisdk-seek"),
    },
    {
      id: "volume",
      label: "Volume",
      source: "Dixy",
      pattern: "slider",
      find: () => document.querySelector(".uisdk-volume"),
    },
    {
      id: "balance",
      label: "Balance",
      source: "Dixy",
      pattern: "slider",
      find: () => document.querySelector(".uisdk-balance"),
    },
    {
      id: "playlist",
      label: "Playlist",
      source: "Dixy",
      pattern: "listbox",
      find: () =>
        document.querySelector('[role=listbox][aria-label="Playlist"]'),
    },
    {
      id: "config",
      label: "Settings menu",
      source: "Dixy",
      pattern: "menu",
      find: () => configTrigger.current,
      open: async () => {
        configTrigger.current?.click();
        await settle();
        return configTrigger.current;
      },
      close: async () => {
        if (configTrigger.current?.getAttribute("aria-expanded") === "true") {
          document.activeElement?.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
          );
        }
      },
    },
    {
      id: "about",
      label: "About dialog",
      source: "Dixy",
      pattern: "dialog",
      find: () => document.querySelector(".uisdk-about"),
      open: async () => {
        setAboutOpen(true);
        await settle();
        return document.querySelector(".uisdk-about");
      },
      close: async () => setAboutOpen(false),
    },
    {
      id: "tree",
      label: "Media library",
      source: "UI SDK",
      pattern: "tree",
      find: () => document.querySelector(".uisdk-tree"),
    },
    {
      id: "rating",
      label: "Track rating",
      source: "UI SDK",
      pattern: "radio-group",
      find: () => document.querySelector(".uisdk-rating"),
    },
  ];

  return (
    <div className="uisdk-bench">
      <header className="uisdk-header">
        <div>
          <Heading as="h1" size="lg">
            UI SDK × Dixy test bench
          </Heading>
          <Text tone="muted">
            A classic desktop media player rebuilt from Dixy components, with UI
            SDK behaviors where Dixy has no part yet. Playback is simulated.
          </Text>
        </div>
        <Tip
          label={
            appearance === "light" ? "Dark appearance" : "Light appearance"
          }
        >
          <IconButton
            variant="ghost"
            color="neutral"
            aria-label={`Switch to ${appearance === "light" ? "dark" : "light"} appearance`}
            onClick={() =>
              onAppearance(appearance === "light" ? "dark" : "light")
            }
          >
            <Icon render={appearance === "light" ? <Moon /> : <Sun />} />
          </IconButton>
        </Tip>
      </header>

      <div className="uisdk-layout">
        {/* Pinned skins keep the windows in their original appearance while
            the page follows the toggle. */}
        <Theme appearance={pinned} className="uisdk-windows">
          {/* Main window */}
          <section
            className="uisdk-window uisdk-main"
            aria-label="Dixyamp player"
            data-shaded={shaded || undefined}
          >
            <div className="uisdk-titlebar">
              <span className="uisdk-app-icon" aria-hidden="true" />
              <span className="uisdk-grip" aria-hidden="true" />
              <span className="uisdk-title">DIXYAMP</span>
              <span className="uisdk-grip" aria-hidden="true" />
              <Tip label={shaded ? "Expand player" : "Windowshade mode"}>
                <Toggle
                  size="sm"
                  aria-label="Windowshade mode"
                  pressed={shaded}
                  onPressedChange={setShaded}
                  className="uisdk-titlebar-button"
                >
                  <Icon render={shaded ? <Maximize2 /> : <Minus />} size="sm" />
                </Toggle>
              </Tip>
            </div>

            {shaded ? (
              <div className="uisdk-shade">
                <span className="uisdk-shade-time">{formatTime(position)}</span>
                <span className="uisdk-shade-title">
                  {track.artist} - {track.title}
                </span>
                <IconButton
                  size="sm"
                  variant="ghost"
                  color="neutral"
                  aria-label={status === "playing" ? "Pause" : "Play"}
                  onClick={status === "playing" ? player.pause : player.play}
                >
                  <Icon
                    render={status === "playing" ? <Pause /> : <Play />}
                    size="sm"
                  />
                </IconButton>
              </div>
            ) : (
              <>
                <Menubar
                  aria-label="Player"
                  size="sm"
                  className="uisdk-menubar"
                >
                  <MenuShell label="File">
                    <Menu.Item onClick={() => setShowLibrary(true)}>
                      Open media library
                    </Menu.Item>
                    <Menu.Item onClick={() => setShowPlaylist(true)}>
                      Open playlist
                    </Menu.Item>
                  </MenuShell>
                  <MenuShell label="Play">
                    <ShortcutItem hint={prevHint} onClick={player.previous}>
                      Previous
                    </ShortcutItem>
                    <ShortcutItem hint={playHint} onClick={player.play}>
                      Play
                    </ShortcutItem>
                    <ShortcutItem hint={pauseHint} onClick={player.pause}>
                      Pause
                    </ShortcutItem>
                    <ShortcutItem hint={stopHint} onClick={player.stop}>
                      Stop
                    </ShortcutItem>
                    <ShortcutItem hint={nextHint} onClick={player.next}>
                      Next
                    </ShortcutItem>
                    <Menu.Separator />
                    <Menu.CheckboxItem
                      checked={player.repeat}
                      onCheckedChange={player.setRepeat}
                      aria-keyshortcuts={repeatHint.ariaKeyshortcuts}
                    >
                      Repeat
                      <Menu.CheckboxItemIndicator />
                      <Kbd
                        size="sm"
                        className="uisdk-menu-kbd"
                        aria-hidden="true"
                      >
                        {repeatHint.text}
                      </Kbd>
                    </Menu.CheckboxItem>
                    <Menu.CheckboxItem
                      checked={player.shuffle}
                      onCheckedChange={player.setShuffle}
                      aria-keyshortcuts={shuffleHint.ariaKeyshortcuts}
                    >
                      Shuffle
                      <Menu.CheckboxItemIndicator />
                      <Kbd
                        size="sm"
                        className="uisdk-menu-kbd"
                        aria-hidden="true"
                      >
                        {shuffleHint.text}
                      </Kbd>
                    </Menu.CheckboxItem>
                  </MenuShell>
                  <MenuShell label="Options">
                    <Menu.Group>
                      <Menu.GroupLabel>Time display</Menu.GroupLabel>
                      <Menu.RadioGroup
                        value={timeMode}
                        onValueChange={(v) => setTimeMode(v as typeof timeMode)}
                      >
                        <Menu.RadioItem value="elapsed">
                          Elapsed
                          <Menu.RadioItemIndicator />
                        </Menu.RadioItem>
                        <Menu.RadioItem value="remaining">
                          Remaining
                          <Menu.RadioItemIndicator />
                        </Menu.RadioItem>
                      </Menu.RadioGroup>
                    </Menu.Group>
                    <Menu.Separator />
                    <Menu.Group>
                      <Menu.GroupLabel>Visualizer</Menu.GroupLabel>
                      <Menu.RadioGroup
                        value={visualizer}
                        onValueChange={(v) => setVisualizer(v as Visualizer)}
                      >
                        <Menu.RadioItem value="spectrum">
                          Spectrum
                          <Menu.RadioItemIndicator />
                        </Menu.RadioItem>
                        <Menu.RadioItem value="oscilloscope">
                          Oscilloscope
                          <Menu.RadioItemIndicator />
                        </Menu.RadioItem>
                        <Menu.RadioItem value="off">
                          Off
                          <Menu.RadioItemIndicator />
                        </Menu.RadioItem>
                      </Menu.RadioGroup>
                    </Menu.Group>
                  </MenuShell>
                  <MenuShell label="View">
                    <Menu.CheckboxItem
                      checked={showPlaylist}
                      onCheckedChange={setShowPlaylist}
                    >
                      Playlist editor
                      <Menu.CheckboxItemIndicator />
                    </Menu.CheckboxItem>
                    <Menu.CheckboxItem
                      checked={showLibrary}
                      onCheckedChange={setShowLibrary}
                    >
                      Media library
                      <Menu.CheckboxItemIndicator />
                    </Menu.CheckboxItem>
                    <Menu.CheckboxItem
                      checked={showChecks}
                      onCheckedChange={setShowChecks}
                    >
                      UI SDK conformance
                      <Menu.CheckboxItemIndicator />
                    </Menu.CheckboxItem>
                  </MenuShell>
                  <MenuShell label="Help">
                    <Menu.Item onClick={() => setKeysOpen(true)}>
                      Keyboard shortcuts
                    </Menu.Item>
                    <Menu.Item onClick={() => setAboutOpen(true)}>
                      About Dixyamp
                    </Menu.Item>
                  </MenuShell>
                </Menubar>

                <div className="uisdk-body">
                  <Display
                    player={player}
                    visualizer={visualizer}
                    timeMode={timeMode}
                    onToggleTime={() =>
                      setTimeMode((m) =>
                        m === "elapsed" ? "remaining" : "elapsed",
                      )
                    }
                  />
                  <div className="uisdk-side">
                    <Menu.Root>
                      <Menu.Trigger
                        render={
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="neutral"
                            aria-label="Visualizer"
                            className="uisdk-vis-trigger"
                          />
                        }
                      >
                        <Icon render={<ChevronDown />} size="sm" />
                      </Menu.Trigger>
                      <Menu.Portal>
                        <Menu.Positioner sideOffset={6} align="end">
                          <Menu.Popup size="sm" className="uisdk-menu">
                            <Menu.Group>
                              <Menu.GroupLabel>Visualizer</Menu.GroupLabel>
                              <Menu.RadioGroup
                                value={visualizer}
                                onValueChange={(v) =>
                                  setVisualizer(v as Visualizer)
                                }
                              >
                                <Menu.RadioItem value="spectrum">
                                  Spectrum
                                  <Menu.RadioItemIndicator />
                                </Menu.RadioItem>
                                <Menu.RadioItem value="oscilloscope">
                                  Oscilloscope
                                  <Menu.RadioItemIndicator />
                                </Menu.RadioItem>
                                <Menu.RadioItem value="off">
                                  Off
                                  <Menu.RadioItemIndicator />
                                </Menu.RadioItem>
                              </Menu.RadioGroup>
                            </Menu.Group>
                          </Menu.Popup>
                        </Menu.Positioner>
                      </Menu.Portal>
                    </Menu.Root>
                    <Tip label="Repeat">
                      <Toggle
                        size="sm"
                        aria-label="Repeat"
                        pressed={player.repeat}
                        onPressedChange={player.setRepeat}
                        className="uisdk-led-toggle"
                      >
                        <Icon render={<Repeat />} size="sm" />
                      </Toggle>
                    </Tip>
                    <Tip label="Shuffle">
                      <Toggle
                        size="sm"
                        aria-label="Shuffle"
                        pressed={player.shuffle}
                        onPressedChange={player.setShuffle}
                        className="uisdk-led-toggle"
                      >
                        <Icon render={<Shuffle />} size="sm" />
                      </Toggle>
                    </Tip>
                  </div>
                </div>

                <Slider.Root
                  className="uisdk-seek"
                  size="sm"
                  min={0}
                  max={track.duration}
                  step={1}
                  value={Math.floor(position)}
                  disabled={status === "stopped"}
                  onValueChange={(v, details) => {
                    // Only user input seeks; ignore value syncs from the clock.
                    if (details.reason === "none") return;
                    player.seek(Array.isArray(v) ? v[0]! : v);
                  }}
                >
                  <Slider.Control>
                    <Slider.Track>
                      <Slider.Indicator />
                    </Slider.Track>
                    <Slider.Thumb
                      aria-label="Seek"
                      getAriaValueText={(_, value) =>
                        `${speakTime(value)} of ${speakTime(track.duration)}`
                      }
                    />
                  </Slider.Control>
                </Slider.Root>

                <div className="uisdk-controls">
                  <Toolbar.Root
                    aria-label="Transport"
                    className="uisdk-transport"
                  >
                    <Toolbar.Button
                      render={
                        <IconButton
                          aria-label="Previous"
                          variant="soft"
                          color="neutral"
                        />
                      }
                      onClick={player.previous}
                      aria-keyshortcuts={prevHint.ariaKeyshortcuts}
                    >
                      <Icon render={<SkipBack />} />
                    </Toolbar.Button>
                    <Toolbar.Button
                      render={
                        <IconButton
                          aria-label="Play"
                          variant="soft"
                          color="neutral"
                        />
                      }
                      onClick={player.play}
                      aria-keyshortcuts={playHint.ariaKeyshortcuts}
                    >
                      <Icon render={<Play />} />
                    </Toolbar.Button>
                    <Toolbar.Button
                      render={
                        <IconButton
                          aria-label="Pause"
                          variant="soft"
                          color="neutral"
                        />
                      }
                      onClick={player.pause}
                      aria-keyshortcuts={pauseHint.ariaKeyshortcuts}
                    >
                      <Icon render={<Pause />} />
                    </Toolbar.Button>
                    <Toolbar.Button
                      render={
                        <IconButton
                          aria-label="Stop"
                          variant="soft"
                          color="neutral"
                        />
                      }
                      onClick={player.stop}
                      aria-keyshortcuts={stopHint.ariaKeyshortcuts}
                    >
                      <Icon render={<Square />} />
                    </Toolbar.Button>
                    <Toolbar.Button
                      render={
                        <IconButton
                          aria-label="Next"
                          variant="soft"
                          color="neutral"
                        />
                      }
                      onClick={player.next}
                      aria-keyshortcuts={nextHint.ariaKeyshortcuts}
                    >
                      <Icon render={<SkipForward />} />
                    </Toolbar.Button>
                  </Toolbar.Root>

                  <div className="uisdk-mixer">
                    <Tip label={player.muted ? "Unmute" : "Mute"}>
                      <Toggle
                        size="sm"
                        aria-label="Mute"
                        pressed={player.muted}
                        onPressedChange={player.setMuted}
                      >
                        <Icon
                          render={player.muted ? <VolumeX /> : <Volume2 />}
                          size="sm"
                        />
                      </Toggle>
                    </Tip>
                    <span className="uisdk-vol-dots" aria-hidden="true">
                      {Array.from({ length: 8 }, (_, i) => (
                        <i
                          key={i}
                          data-on={
                            (player.muted ? 0 : player.volume) / 100 > i / 8 ||
                            undefined
                          }
                        />
                      ))}
                    </span>
                    <Slider.Root
                      className="uisdk-volume"
                      style={
                        {
                          "--uisdk-level":
                            (player.muted ? 0 : player.volume) / 100,
                        } as React.CSSProperties
                      }
                      size="sm"
                      min={0}
                      max={100}
                      value={player.muted ? 0 : player.volume}
                      onValueChange={(v) => {
                        player.setMuted(false);
                        player.setVolume(Array.isArray(v) ? v[0]! : v);
                      }}
                    >
                      <Slider.Control>
                        <Slider.Track>
                          <Slider.Indicator />
                        </Slider.Track>
                        <Slider.Thumb
                          aria-label="Volume"
                          getAriaValueText={(_, v) => `${v}%`}
                        />
                      </Slider.Control>
                    </Slider.Root>
                    {/* The original Modern main window has no balance (it lives in an EQ drawer this bench does not build), so Modern leaves it out. */}
                    {skin !== "modern" && (
                      <Slider.Root
                        className="uisdk-balance"
                        size="sm"
                        min={-100}
                        max={100}
                        step={5}
                        value={player.balance}
                        onValueChange={(v) =>
                          player.setBalance(Array.isArray(v) ? v[0]! : v)
                        }
                      >
                        <Slider.Control>
                          <Slider.Track />
                          <Slider.Thumb
                            aria-label="Balance"
                            getAriaValueText={(_, v) =>
                              v === 0
                                ? "Centre"
                                : `${Math.abs(v)}% ${v < 0 ? "left" : "right"}`
                            }
                          />
                        </Slider.Control>
                      </Slider.Root>
                    )}
                  </div>

                  <div
                    className="uisdk-windows-toggles"
                    role="group"
                    aria-label="Windows"
                  >
                    <Tip label="Open media library">
                      <IconButton
                        size="sm"
                        variant="soft"
                        color="neutral"
                        aria-label="Open media library"
                        onClick={() => setShowLibrary(true)}
                      >
                        <Icon render={<ArrowUpFromLine />} size="sm" />
                      </IconButton>
                    </Tip>
                    <Tip label="Playlist editor">
                      <Toggle
                        size="sm"
                        aria-label="Playlist editor"
                        className="uisdk-led-toggle"
                        pressed={showPlaylist}
                        onPressedChange={setShowPlaylist}
                      >
                        PL
                      </Toggle>
                    </Tip>
                    <Tip label="Media library">
                      <Toggle
                        size="sm"
                        aria-label="Media library"
                        className="uisdk-led-toggle"
                        pressed={showLibrary}
                        onPressedChange={setShowLibrary}
                      >
                        ML
                      </Toggle>
                    </Tip>
                  </div>

                  <div className="uisdk-config">
                    <span className="uisdk-config-label" aria-hidden="true">
                      Config
                    </span>
                    <Menu.Root>
                      <Menu.Trigger
                        ref={configTrigger}
                        render={
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="neutral"
                            aria-label="Config, skin and finish"
                          />
                        }
                      >
                        <Icon render={<ChevronDown />} size="sm" />
                      </Menu.Trigger>
                      <Menu.Portal>
                        <Menu.Positioner sideOffset={6} align="end">
                          <Menu.Popup size="sm" className="uisdk-menu">
                            <Menu.Group>
                              <Menu.GroupLabel>Skin</Menu.GroupLabel>
                              <Menu.RadioGroup
                                value={skin}
                                onValueChange={(v) => onSkin(v as string)}
                              >
                                {skins.map((s) => (
                                  <Menu.RadioItem key={s.id} value={s.id}>
                                    {s.name}
                                    <Menu.RadioItemIndicator />
                                  </Menu.RadioItem>
                                ))}
                              </Menu.RadioGroup>
                            </Menu.Group>
                            <Menu.Separator />
                            <Menu.Group>
                              <Menu.GroupLabel>Finish</Menu.GroupLabel>
                              <Menu.RadioGroup
                                value={material}
                                onValueChange={(v) => onMaterial(v as Material)}
                              >
                                {materials.map((m) => (
                                  <Menu.RadioItem key={m} value={m}>
                                    {m[0]!.toUpperCase() + m.slice(1)}
                                    <Menu.RadioItemIndicator />
                                  </Menu.RadioItem>
                                ))}
                              </Menu.RadioGroup>
                            </Menu.Group>
                          </Menu.Popup>
                        </Menu.Positioner>
                      </Menu.Portal>
                    </Menu.Root>
                    <Icon
                      render={<Zap />}
                      className="uisdk-logo"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </>
            )}
          </section>

          {showPlaylist && (
            <section className="uisdk-window" aria-labelledby="uisdk-pl-title">
              <div className="uisdk-titlebar">
                <Icon render={<ListMusic />} size="sm" />
                <span id="uisdk-pl-title" className="uisdk-title">
                  Playlist editor
                </span>
              </div>
              <ListBox.Root
                aria-label="Playlist"
                className="uisdk-playlist"
                size="sm"
                material="matte"
                selectionMode="single"
                selectedKeys={[track.id]}
                onAction={(key) => player.playId(String(key))}
                onSelectionChange={(keys) => {
                  const [first] = keys === "all" ? [] : [...keys];
                  if (first) player.playId(String(first));
                }}
              >
                {tracks.map((t, i) => (
                  <ListBox.Item
                    key={t.id}
                    id={t.id}
                    textValue={`${t.artist} - ${t.title}`}
                  >
                    <span
                      className="uisdk-pl-row"
                      data-current={t.id === track.id || undefined}
                    >
                      {/* The name starts with the title, so typeahead matches textValue. */}
                      <span className="uisdk-pl-index" aria-hidden="true">
                        {i + 1}.
                      </span>
                      <span className="uisdk-pl-name">
                        {t.artist} - {t.title}
                      </span>
                      <span className="uisdk-pl-time">
                        {formatTime(t.duration)}
                      </span>
                    </span>
                  </ListBox.Item>
                ))}
              </ListBox.Root>
              <div className="uisdk-pl-footer">
                <Text size="sm" tone="muted">
                  {tracks.length} tracks · {formatTime(totalTime)}
                </Text>
                <Button
                  size="sm"
                  variant="ghost"
                  color="neutral"
                  onClick={() => setKeysOpen(true)}
                >
                  <Icon render={<Keyboard />} size="sm" />
                  Shortcuts
                </Button>
              </div>
            </section>
          )}

          {showLibrary && (
            <section className="uisdk-window" aria-labelledby="uisdk-ml-title">
              <div className="uisdk-titlebar">
                <Icon render={<Library />} size="sm" />
                <span id="uisdk-ml-title" className="uisdk-title">
                  Media library
                </span>
              </div>
              <MediaLibrary player={player} />
            </section>
          )}
        </Theme>

        {showChecks && <ConformancePanel checks={checks} />}
      </div>

      <div className="uisdk-visually-hidden" role="status">
        {status === "playing"
          ? `Now playing: ${track.artist}, ${track.title}`
          : status === "paused"
            ? "Paused"
            : "Stopped"}
      </div>

      <Dialog.Root open={aboutOpen} onOpenChange={setAboutOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="sm" className="uisdk-about">
              <Dialog.Title>About Dixyamp</Dialog.Title>
              <Dialog.Description>
                A test bench for Dixy UI and UI SDK working together. Menus,
                sliders, toggles, the transport toolbar, the playlist and this
                dialog are Dixy. The media library tree, the rating and the
                favorites toggle are UI SDK parts styled with Dixy tokens.
                Keyboard shortcuts run through UI SDK&apos;s shortcut registry.
              </Dialog.Description>
              <div className="uisdk-dialog-actions">
                <Dialog.Close render={<Button />}>Close</Dialog.Close>
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={keysOpen} onOpenChange={setKeysOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="sm">
              <Dialog.Title>Keyboard shortcuts</Dialog.Title>
              <Dialog.Description>
                Read from UI SDK&apos;s <code>shortcuts.list()</code> on load.
                They pause while a dialog is open and while focus is in a menu,
                list or tree.
              </Dialog.Description>
              <ShortcutTable list={keyList} />
              <div className="uisdk-dialog-actions">
                <Dialog.Close render={<Button />}>Close</Dialog.Close>
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function ShortcutTable({ list }: { list: ReturnType<typeof shortcuts.list> }) {
  return (
    <table className="uisdk-keys">
      <thead>
        <tr>
          <th scope="col">Keys</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {list.map((s) => (
          <tr key={s.keys}>
            <td>
              <Kbd size="sm">{s.hint}</Kbd>
            </td>
            <td>{s.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
