import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { Inbox, LayoutDashboard, Music2, Rows3 } from "lucide-react";
import { Spinner, Tabs, Text } from "@dixy-ui/react";
import { LandingShowcase } from "./landing-showcase";
import "../styles/theme-skins.css";

/*
 * The landing page's centrepiece: one app window that switches between real
 * product scenes. The scenes are the playground's own, imported unchanged, so
 * the landing and the playground always show the same compositions.
 */
const EmailScene = lazy(() => import("./theme-email-scene"));
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

export function LandingWindow({ dock }: { dock: ReactNode }) {
  return (
    <section className="landing-window-section" aria-label="Live product demo">
      <Tabs.Root defaultValue="mail" className="landing-window">
        <div className="landing-window-bar">
          <span className="landing-window-lights" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <Tabs.List aria-label="Demo app" className="landing-window-tabs">
            {scenes.map(({ value, label, icon: Icon }) => (
              <Tabs.Tab key={value} value={value}>
                <Icon size={15} aria-hidden="true" />
                {label}
              </Tabs.Tab>
            ))}
            <Tabs.Indicator />
          </Tabs.List>
        </div>
        <div className="landing-window-body">
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
      </Tabs.Root>
      <div className="landing-dock-rail">{dock}</div>
    </section>
  );
}
