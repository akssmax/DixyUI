import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { Inbox, LayoutDashboard, Music2, Rows3 } from "lucide-react";
import { Spinner, Tabs, Text } from "@dixy-ui/react";
import { LandingShowcase } from "./landing-showcase";
import "../styles/theme-skins.css";

/*
 * The landing page's centrepiece: one live app that switches between real
 * product scenes. The scenes are the playground's own, imported unchanged, so
 * the landing and the playground always show the same compositions.
 */
const loadEmailScene = () => import("./theme-email-scene");
const EmailScene = lazy(loadEmailScene);
// Mail is the default tab. Start its chunk as soon as this module runs on the
// client, so the download overlaps hydration instead of waiting for it.
if (typeof window !== "undefined") void loadEmailScene();
const DashboardScene = lazy(() => import("./theme-dashboard-scene"));
const PlayerScene = lazy(() => import("./theme-player-scene"));

const scenes = [
  { value: "mail", label: "Mail", icon: Inbox },
  { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { value: "music", label: "Music", icon: Music2 },
  { value: "blocks", label: "Blocks", icon: Rows3 },
] as const;

function Loading() {
  return (
    <div className="landing-window-loading" role="status">
      <Spinner aria-hidden="true" />
      <Text size="sm" tone="muted">
        Loading scene…
      </Text>
    </div>
  );
}

/*
 * Lazy scenes mount only after hydration. On the server React.lazy suspends
 * inside Base UI's tab panel, which produced HTML the client could not
 * hydrate; rendering the same loading state on both sides avoids the mismatch.
 */
function ClientScene({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated ? (
    <Suspense fallback={<Loading />}>{children}</Suspense>
  ) : (
    <Loading />
  );
}

/*
 * Frameless stage: no browser chrome around the scenes. The app sits on the
 * page itself and, on wide screens, runs off the right edge of the viewport.
 */
export function LandingWindow() {
  return (
    <Tabs.Root
      defaultValue="mail"
      variant="segmented"
      size="sm"
      className="landing-stage"
    >
      <Tabs.List aria-label="Demo app" className="landing-stage-tabs">
        {scenes.map(({ value, label, icon: Icon }) => (
          <Tabs.Tab key={value} value={value}>
            <Icon size={14} aria-hidden="true" />
            {label}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
      <div className="landing-stage-body">
        {/* One boundary per panel: a boundary around all panels would
            re-suspend the list and break Base UI's panel registration. */}
        <Tabs.Panel value="mail">
          <ClientScene>
            <EmailScene />
          </ClientScene>
        </Tabs.Panel>
        <Tabs.Panel value="dashboard">
          <ClientScene>
            <DashboardScene />
          </ClientScene>
        </Tabs.Panel>
        <Tabs.Panel value="music">
          <ClientScene>
            <PlayerScene />
          </ClientScene>
        </Tabs.Panel>
        <Tabs.Panel value="blocks">
          <LandingShowcase />
        </Tabs.Panel>
      </div>
      <Text size="sm" tone="muted" className="landing-stage-caption">
        Real Dixy components. Change the starter to restyle them.
      </Text>
    </Tabs.Root>
  );
}
