import { useEffect, useState } from "react";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { Star } from "lucide-react";
import { Text } from "@dixy-ui/react";
import { ButtonAnchor } from "./button-link";
import { recordVisit } from "../lib/visitors.functions";

export const repoSlug = "akssmax/DixyUI";
export const portfolioUrl = "https://www.akshaysaini.xyz/";

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const full = new Intl.NumberFormat("en");

/* Browser storage can throw (private mode, blocked site data). */
function readStorage(storage: "local" | "session", key: string) {
  try {
    return (storage === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(
  storage: "local" | "session",
  key: string,
  value: string,
) {
  try {
    (storage === "local" ? localStorage : sessionStorage).setItem(key, value);
  } catch {
    /* The count still shows; it just isn't remembered. */
  }
}

const starsKey = "dixy-github-stars";

/**
 * Stars from the public GitHub API, fetched in the browser. Unauthenticated
 * calls allow 60 an hour per visitor IP, so the count is cached for the tab
 * session. Until it arrives (or if GitHub fails) the button shows no number.
 */
function useGitHubStars() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    const cached = Number(readStorage("session", starsKey));
    if (cached > 0) {
      setStars(cached);
      return;
    }
    const controller = new AbortController();
    fetch(`https://api.github.com/repos/${repoSlug}`, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((repo: { stargazers_count?: unknown } | null) => {
        const count = repo?.stargazers_count;
        if (typeof count !== "number") return;
        setStars(count);
        writeStorage("session", starsKey, String(count));
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return stars;
}

/** Header link to the repository with a live star count. */
export function GitHubStarButton() {
  const stars = useGitHubStars();
  return (
    <ButtonAnchor
      href={`https://github.com/${repoSlug}`}
      variant="outline"
      color="neutral"
      size="sm"
      className="landing-github"
    >
      <GithubLogoIcon size={16} weight="fill" aria-hidden="true" />
      <span className="landing-github-label">Star</span>
      <span className="dixy-visually-hidden"> Dixy UI on GitHub</span>
      {stars !== null && (
        <span className="landing-github-count">
          <Star size={12} aria-hidden="true" />
          <span aria-hidden="true">{compact.format(stars)}</span>
          <span className="dixy-visually-hidden">
            , {full.format(stars)} {stars === 1 ? "star" : "stars"}
          </span>
        </span>
      )}
    </ButtonAnchor>
  );
}

const visitedKey = "dixy-visited";
let countedThisLoad = false;

/**
 * Footer visitor total. A browser counts once: the first visit sets a
 * localStorage flag, later visits only read the total. Hidden until the
 * server answers, and stays hidden if the counter is unavailable.
 */
export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    // A remount (StrictMode, navigating back) within one page load must not
    // count twice; the stored flag is written only once the server confirms.
    const isNew = !countedThisLoad && readStorage("local", visitedKey) === null;
    countedThisLoad = true;
    recordVisit({ data: { isNew } })
      .then((total) => {
        if (total === null) return;
        if (isNew) writeStorage("local", visitedKey, "1");
        if (!cancelled) setCount(total);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  if (count === null) return null;
  return (
    <Text as="span" size="sm" tone="muted" className="landing-footer-visitors">
      {full.format(count)} {count === 1 ? "visitor" : "visitors"}
    </Text>
  );
}
