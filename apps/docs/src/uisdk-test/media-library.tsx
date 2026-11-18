import { useMemo, useState } from "react";
import { Button, Icon, Text } from "@dixy-ui/react";
import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
} from "@ui-sdk/react/tree";
import { Rating, RatingItem } from "@ui-sdk/react/rating";
import { Toggle as SdkToggle } from "@ui-sdk/react/toggle";
import { ChevronRight, Folder, FolderOpen, Music, Star } from "lucide-react";
import { formatTime, libraryTree, tracks } from "./tracks";
import type { Player } from "./use-player";

/**
 * UI SDK parts (Tree, Rating, Toggle) dressed in Dixy tokens. The favorites
 * filter is a UI SDK Toggle rendered as a Dixy Button: the SDK owns
 * aria-pressed and state, Dixy owns the visual contract.
 */
export function MediaLibrary({ player }: { player: Player }) {
  const [selected, setSelected] = useState<string | null>(player.track.id);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const tree = useMemo(() => libraryTree(), []);
  const selectedTrack = tracks.find((t) => t.id === selected) ?? null;
  const isFavorite = (id: string) => (player.ratings[id] ?? 0) >= 4;

  return (
    <div className="uisdk-ml">
      <div className="uisdk-ml-toolbar">
        <SdkToggle
          pressed={favoritesOnly}
          onPressedChange={setFavoritesOnly}
          render={<Button size="sm" variant="outline" color="neutral" />}
          className="uisdk-sdk-toggle"
        >
          <Icon render={<Star />} size="sm" />
          Favorites only
        </SdkToggle>
        <Text size="sm" tone="muted">
          Enter or double-click plays a track
        </Text>
      </div>
      <Tree
        aria-label="Media library"
        className="uisdk-tree"
        defaultExpanded={["Electronic", "Electronic/Cool Tide"]}
        value={selected}
        onValueChange={(value) => setSelected(value as string | null)}
        onAction={(value) => {
          if (value.startsWith("t")) player.playId(value);
        }}
      >
        {tree.map(({ genre, artists }) => {
          const visibleArtists = artists
            .map((a) => ({
              ...a,
              tracks: favoritesOnly
                ? a.tracks.filter((t) => isFavorite(t.id))
                : a.tracks,
            }))
            .filter((a) => a.tracks.length > 0);
          if (!visibleArtists.length) return null;
          return (
            <TreeItem key={genre} value={genre}>
              <TreeItemLabel>
                <TreeItemIndicator className="uisdk-tree-chevron">
                  <ChevronRight aria-hidden="true" />
                </TreeItemIndicator>
                <Folder aria-hidden="true" className="uisdk-tree-closed" />
                <FolderOpen aria-hidden="true" className="uisdk-tree-open" />
                <span>{genre}</span>
              </TreeItemLabel>
              <TreeGroup>
                {visibleArtists.map(({ artist, tracks: list }) => (
                  <TreeItem key={artist} value={`${genre}/${artist}`}>
                    <TreeItemLabel>
                      <TreeItemIndicator className="uisdk-tree-chevron">
                        <ChevronRight aria-hidden="true" />
                      </TreeItemIndicator>
                      <Folder
                        aria-hidden="true"
                        className="uisdk-tree-closed"
                      />
                      <FolderOpen
                        aria-hidden="true"
                        className="uisdk-tree-open"
                      />
                      <span>{artist}</span>
                    </TreeItemLabel>
                    <TreeGroup>
                      {list.map((t) => (
                        <TreeItem key={t.id} value={t.id}>
                          <TreeItemLabel
                            data-playing={t.id === player.track.id || undefined}
                          >
                            <Music aria-hidden="true" />
                            <span className="uisdk-tree-title">{t.title}</span>
                            <span className="uisdk-tree-time">
                              {formatTime(t.duration)}
                            </span>
                          </TreeItemLabel>
                        </TreeItem>
                      ))}
                    </TreeGroup>
                  </TreeItem>
                ))}
              </TreeGroup>
            </TreeItem>
          );
        })}
      </Tree>
      <div className="uisdk-ml-detail">
        {selectedTrack ? (
          <>
            <div className="uisdk-ml-detail-text">
              <Text>{selectedTrack.title}</Text>
              <Text size="sm" tone="muted">
                {selectedTrack.artist} · {selectedTrack.album}
              </Text>
            </div>
            <Rating
              aria-label={`Rate ${selectedTrack.title}`}
              className="uisdk-rating"
              value={player.ratings[selectedTrack.id] ?? null}
              onValueChange={(value) => player.rate(selectedTrack.id, value)}
            >
              <RatingItem>
                <Star aria-hidden="true" />
              </RatingItem>
            </Rating>
          </>
        ) : (
          <Text size="sm" tone="muted">
            Select a track to rate it.
          </Text>
        )}
      </div>
    </div>
  );
}
