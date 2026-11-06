import { useState } from "react";
import {
  Card,
  Button,
  IconButton,
  Slider,
  Progress,
  Tabs,
  Text,
  Badge,
} from "@dixy-ui/react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Shuffle,
  Repeat2,
  Volume2,
} from "lucide-react";

const tracks = [
  { title: "Solar Drift", artist: "Dixy Collective", time: "3:58" },
  { title: "Glass Rivers", artist: "North Atlas", time: "4:21" },
  { title: "Amber Light", artist: "Mira Fields", time: "3:12" },
  { title: "Parallel Days", artist: "Lume", time: "4:06" },
];
export default function ThemePlayerScene() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const track = tracks[index]!;
  return (
    <div className="theme-player-scene">
      <Card.Root className="theme-player-main">
        <Card.Header>
          <span className="theme-scene-eyebrow">DIXY RADIO</span>
          <Card.Title as="h2">Find your frequency.</Card.Title>
          <Card.Description>
            A little atmosphere for whatever comes next.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="theme-album-art" aria-hidden="true">
            <svg viewBox="0 0 200 120" fill="none">
              <path
                d="M12 60h14m5-16v32m12-48v64m12-58v52m12-75v98m12-64v30m12-42v54m12-78v102m12-84v66m12-48v30m12-52v74m12-65v56m12-39v22m12-17h14"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
            <span>FIELD NOTES / VOL. 01</span>
          </div>
          <div className="theme-now-playing">
            <div>
              <Card.Title as="h3">{track.title}</Card.Title>
              <Card.Description>{track.artist}</Card.Description>
            </div>
            <IconButton
              variant="ghost"
              color="neutral"
              aria-label={liked ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={liked}
              onClick={() => setLiked(!liked)}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
            </IconButton>
          </div>
          <Progress.Root value={34} aria-label="Track progress">
            <Progress.Track>
              <Progress.Indicator />
            </Progress.Track>
          </Progress.Root>
          <div className="theme-track-time">
            <span>1:21</span>
            <span>{track.time}</span>
          </div>
          <div className="theme-player-transport">
            <IconButton
              variant="ghost"
              aria-label="Shuffle"
              aria-pressed={shuffle}
              onClick={() => setShuffle(!shuffle)}
            >
              <Shuffle size={18} />
            </IconButton>
            <IconButton
              variant="outline"
              color="neutral"
              aria-label="Previous track"
              onClick={() =>
                setIndex((index + tracks.length - 1) % tracks.length)
              }
            >
              <SkipBack size={18} />
            </IconButton>
            <IconButton
              className="theme-play-button"
              size="lg"
              aria-label={playing ? "Pause preview" : "Play preview"}
              aria-pressed={playing}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={23} /> : <Play size={23} />}
            </IconButton>
            <IconButton
              variant="outline"
              color="neutral"
              aria-label="Next track"
              onClick={() => setIndex((index + 1) % tracks.length)}
            >
              <SkipForward size={18} />
            </IconButton>
            <IconButton
              variant="ghost"
              aria-label="Repeat"
              aria-pressed={repeat}
              onClick={() => setRepeat(!repeat)}
            >
              <Repeat2 size={18} />
            </IconButton>
          </div>
          <Slider.Root defaultValue={65} className="theme-volume">
            <Slider.Label>
              <Volume2 size={15} /> Volume
            </Slider.Label>
            <Slider.Value />
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb aria-label="Volume" />
            </Slider.Control>
          </Slider.Root>
          <Text size="sm" tone="muted" role="status">
            {playing ? "Playing" : "Paused"} · Interactive preview, no audio
            stream.
          </Text>
        </Card.Content>
      </Card.Root>
      <Card.Root className="theme-player-queue">
        <Card.Header>
          <span className="theme-scene-eyebrow">YOUR ROTATION</span>
          <Card.Title as="h2">Good things on repeat.</Card.Title>
        </Card.Header>
        <Card.Content>
          <Tabs.Root defaultValue="playlist" variant="soft" fullWidth>
            <Tabs.List aria-label="Music collection">
              <Tabs.Tab value="playlist">Playlist</Tabs.Tab>
              <Tabs.Tab value="favorites">Favorites</Tabs.Tab>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Panel value="playlist">
              <div className="theme-track-list">
                {tracks.map((item, i) => (
                  <Button
                    key={item.title}
                    variant={i === index ? "soft" : "ghost"}
                    color="neutral"
                    className="theme-track-row"
                    aria-pressed={i === index}
                    onClick={() => setIndex(i)}
                  >
                    <span className="theme-track-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="theme-track-copy">
                      <strong>{item.title}</strong>
                      <small>{item.artist}</small>
                    </span>
                    <span>{item.time}</span>
                  </Button>
                ))}
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="favorites">
              <Text size="sm">
                {liked
                  ? track.title + " is in your favorites."
                  : "Tap the heart to save a track for later."}
              </Text>
            </Tabs.Panel>
          </Tabs.Root>
          <div className="theme-player-note">
            <Badge variant="soft">Made of Dixy</Badge>
            <Text size="sm" tone="muted">
              Cards, buttons, tabs, progress and a slider. One composition,
              every skin.
            </Text>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  );
}
