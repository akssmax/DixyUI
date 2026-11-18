/** Fictional tracks: playback is simulated, so no audio files ship. */
export type Track = {
  id: string;
  artist: string;
  title: string;
  album: string;
  genre: string;
  /** Seconds. */
  duration: number;
  kbps: number;
  khz: number;
  stereo: boolean;
};

export const tracks: readonly Track[] = [
  {
    id: "t1",
    artist: "Cool Tide",
    title: "The Velvet Key (Sefon Mix)",
    album: "Night Bus",
    genre: "Electronic",
    duration: 225,
    kbps: 320,
    khz: 44,
    stereo: true,
  },
  {
    id: "t2",
    artist: "Cool Tide",
    title: "Paper Satellites",
    album: "Night Bus",
    genre: "Electronic",
    duration: 198,
    kbps: 320,
    khz: 44,
    stereo: true,
  },
  {
    id: "t3",
    artist: "Lumen Drive",
    title: "Neon Over Nowhere",
    album: "Overpass",
    genre: "Electronic",
    duration: 251,
    kbps: 256,
    khz: 48,
    stereo: true,
  },
  {
    id: "t4",
    artist: "Lumen Drive",
    title: "Signal Lost",
    album: "Overpass",
    genre: "Electronic",
    duration: 187,
    kbps: 192,
    khz: 44,
    stereo: true,
  },
  {
    id: "t5",
    artist: "The Quiet Arcade",
    title: "Coin Op Heart",
    album: "Bonus Round",
    genre: "Indie",
    duration: 212,
    kbps: 192,
    khz: 44,
    stereo: true,
  },
  {
    id: "t6",
    artist: "The Quiet Arcade",
    title: "Insert Name Here",
    album: "Bonus Round",
    genre: "Indie",
    duration: 176,
    kbps: 128,
    khz: 44,
    stereo: false,
  },
  {
    id: "t7",
    artist: "Marrow & Moss",
    title: "Field Recording No. 4",
    album: "Understory",
    genre: "Folk",
    duration: 243,
    kbps: 256,
    khz: 44,
    stereo: true,
  },
  {
    id: "t8",
    artist: "Marrow & Moss",
    title: "Lantern Season",
    album: "Understory",
    genre: "Folk",
    duration: 205,
    kbps: 256,
    khz: 44,
    stereo: true,
  },
  {
    id: "t9",
    artist: "Static Choir",
    title: "Dial-Up Hymn",
    album: "56k",
    genre: "Ambient",
    duration: 268,
    kbps: 128,
    khz: 22,
    stereo: false,
  },
  {
    id: "t10",
    artist: "Static Choir",
    title: "Handshake",
    album: "56k",
    genre: "Ambient",
    duration: 154,
    kbps: 160,
    khz: 44,
    stereo: true,
  },
];

export function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** "1:06" is read as "1 minute 6 seconds" by assistive tech. */
export function speakTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m} minute${m === 1 ? "" : "s"} ${r} second${r === 1 ? "" : "s"}`;
}

/** Genre → artist → tracks, for the media library tree. */
export function libraryTree() {
  const genres = new Map<string, Map<string, Track[]>>();
  for (const track of tracks) {
    const artists = genres.get(track.genre) ?? new Map<string, Track[]>();
    artists.set(track.artist, [...(artists.get(track.artist) ?? []), track]);
    genres.set(track.genre, artists);
  }
  return [...genres].map(([genre, artists]) => ({
    genre,
    artists: [...artists].map(([artist, list]) => ({ artist, tracks: list })),
  }));
}
