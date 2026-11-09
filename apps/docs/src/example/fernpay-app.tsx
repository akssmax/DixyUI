import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu as MenuGlyph,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Command,
  Field,
  Heading,
  Icon,
  IconButton,
  Kbd,
  Link,
  Menu,
  Popover,
  ScrollArea,
  Select,
  Separator,
  Sidebar,
  Stack,
  Text,
  Toast,
  Tooltip,
  Item,
} from "@dixy-ui/react";
import { notifications, user } from "./data";
import { PageHeader } from "./layout";
import { EffectsProvider, useEffects } from "./effects";
import { ShaderBackdrop } from "../lab/shader-backdrop";
import { SendMoneyDialog } from "./send-money";
import {
  CardsView,
  OverviewView,
  SettingsView,
  TransactionsView,
} from "./views";

export const views = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    blurb: "Good afternoon, Mara.",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: ListOrdered,
    blurb: "Every penny, searchable.",
  },
  {
    id: "cards",
    label: "Cards",
    icon: CreditCard,
    blurb: "Freeze, limit and control.",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    blurb: "Profile, alerts and help.",
  },
] as const;
export type ViewId = (typeof views)[number]["id"];

export interface SkinOption {
  slug: string;
  name: string;
}

interface FernpayAppProps {
  view: ViewId;
  onView: (view: ViewId) => void;
  skin: string;
  skins: readonly SkinOption[];
  onSkin: (slug: string) => void;
  appearance: "light" | "dark";
  onAppearance: (appearance: "light" | "dark") => void;
}

export function FernpayApp(props: FernpayAppProps) {
  return (
    <Toast.Provider>
      <Tooltip.Provider delay={400}>
        <EffectsProvider skin={props.skin} onSkin={props.onSkin}>
          <Shell {...props} />
        </EffectsProvider>
        <Toasts />
      </Tooltip.Provider>
    </Toast.Provider>
  );
}

function Toasts() {
  const manager = Toast.useToastManager();
  return (
    <Toast.Portal>
      <Toast.Viewport>
        {manager.toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast}>
            <Toast.Content>
              <Toast.Title />
              <Toast.Description />
            </Toast.Content>
            <Toast.Close aria-label="Dismiss notification" />
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

function NavList({
  view,
  onView,
  collapsed = false,
}: Pick<FernpayAppProps, "view" | "onView"> & { collapsed?: boolean }) {
  return (
    <Stack gap="xs">
      {views.map((item) => {
        const buttonProps = {
          variant: item.id === view ? "soft" : "ghost",
          color: item.id === view ? "accent" : "neutral",
          "aria-current": item.id === view ? "page" : undefined,
          // In the rail the visible label is hidden, so the button keeps it
          // as its accessible name.
          "aria-label": collapsed ? item.label : undefined,
          className: "fp-nav-item",
          onClick: () => onView(item.id),
        } as const;
        const content = (
          <>
            <Icon render={<item.icon />} />
            <span className="fp-nav-label">{item.label}</span>
          </>
        );
        return collapsed ? (
          <Tooltip.Root key={item.id}>
            <Tooltip.Trigger render={<Button {...buttonProps} />}>
              {content}
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner side="right" sideOffset={10}>
                <Tooltip.Popup>{item.label}</Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        ) : (
          <Button key={item.id} {...buttonProps}>
            {content}
          </Button>
        );
      })}
    </Stack>
  );
}

const collapseKey = "fernpay-sidebar";

/** Rail state: remembered per viewer; storage can throw in private windows. */
function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(collapseKey) === "collapsed");
    } catch {}
  }, []);
  function toggle() {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(collapseKey, next ? "collapsed" : "expanded");
      } catch {}
      return next;
    });
  }
  return [collapsed, toggle] as const;
}

function CollapseButton({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const label = collapsed ? "Expand sidebar" : "Collapse sidebar";
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={
          <IconButton
            variant="ghost"
            color="neutral"
            size="sm"
            aria-label={label}
            aria-expanded={!collapsed}
            aria-controls="fp-sidebar"
            className="fp-collapse"
            onClick={onToggle}
          />
        }
      >
        <Icon render={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />} />
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner side="right" sideOffset={10}>
          <Tooltip.Popup>
            {label} <Kbd size="sm">⌘B</Kbd>
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function Brand() {
  return (
    <Text as="span" className="fp-brand">
      <span aria-hidden="true" className="fp-brand-mark" />
      <span className="fp-brand-name">fernpay</span>
    </Text>
  );
}

function Shell(props: FernpayAppProps) {
  const { view, onView } = props;
  const [mobileNav, setMobileNav] = useState(false);
  const [palette, setPalette] = useState(false);
  const [collapsed, toggleCollapsed] = useSidebarCollapsed();
  const toast = Toast.useToastManager();
  const meta = views.find((v) => v.id === view)!;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPalette((open) => !open);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleCollapsed();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(next: ViewId) {
    onView(next);
    setMobileNav(false);
  }

  return (
    <div
      className="fp-shell"
      data-sidebar={collapsed ? "collapsed" : "expanded"}
    >
      <Backdrop appearance={props.appearance} skin={props.skin} />
      <Sidebar.Content
        id="fp-sidebar"
        className="fp-sidebar"
        radius="none"
        data-collapsed={collapsed || undefined}
      >
        <Sidebar.Header className="fp-sidebar-header">
          <Brand />
          <CollapseButton collapsed={collapsed} onToggle={toggleCollapsed} />
        </Sidebar.Header>
        <Sidebar.Nav aria-label="Fernpay">
          <NavList view={view} onView={go} collapsed={collapsed} />
        </Sidebar.Nav>
        <Sidebar.Footer>
          <Text size="sm" tone="muted">
            Built with Dixy UI · mock data
          </Text>
          <Link href="/playground" size="sm">
            Open theme playground
          </Link>
        </Sidebar.Footer>
      </Sidebar.Content>

      <Sidebar.Mobile.Root
        open={mobileNav}
        onOpenChange={setMobileNav}
        swipeDirection="left"
      >
        <Sidebar.Mobile.Portal>
          <Sidebar.Mobile.Backdrop />
          <Sidebar.Mobile.Viewport>
            <Sidebar.Mobile.Popup className="fp-mobile-nav">
              <Sidebar.Mobile.Content>
                <Sidebar.Mobile.Title>
                  <Brand />
                </Sidebar.Mobile.Title>
                <nav aria-label="Fernpay">
                  <NavList view={view} onView={go} />
                </nav>
              </Sidebar.Mobile.Content>
            </Sidebar.Mobile.Popup>
          </Sidebar.Mobile.Viewport>
        </Sidebar.Mobile.Portal>
      </Sidebar.Mobile.Root>

      <div className="fp-main-col">
        <header className="fp-topbar">
          <IconButton
            className="fp-only-mobile"
            variant="ghost"
            color="neutral"
            aria-label="Open navigation"
            onClick={() => setMobileNav(true)}
          >
            <Icon render={<MenuGlyph />} />
          </IconButton>
          <Breadcrumbs.Root aria-label="Breadcrumb" className="fp-only-wide">
            <Breadcrumbs.Item>
              <Breadcrumbs.Link onPress={() => go("overview")}>
                Fernpay
              </Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link>{meta.label}</Breadcrumbs.Link>
            </Breadcrumbs.Item>
          </Breadcrumbs.Root>

          <div className="fp-topbar-end">
            <Button
              variant="outline"
              color="neutral"
              size="sm"
              className="fp-search-trigger"
              onClick={() => setPalette(true)}
            >
              <Icon render={<Search />} />
              <span className="fp-only-wide">Search</span>
              <Kbd size="sm" className="fp-only-wide">
                ⌘K
              </Kbd>
            </Button>
            <ThemePicker {...props} />
            <Tooltip.Root>
              <Tooltip.Trigger
                render={
                  <IconButton
                    variant="ghost"
                    color="neutral"
                    aria-label={`Switch to ${props.appearance === "light" ? "dark" : "light"} appearance`}
                    onClick={() =>
                      props.onAppearance(
                        props.appearance === "light" ? "dark" : "light",
                      )
                    }
                  />
                }
              >
                <Icon
                  render={props.appearance === "light" ? <Moon /> : <Sun />}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner sideOffset={8}>
                  <Tooltip.Popup>
                    {props.appearance === "light" ? "Dark" : "Light"} appearance
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
            <NotificationsPopover />
            <Menu.Root>
              <Menu.Trigger
                render={
                  <Button
                    variant="ghost"
                    color="neutral"
                    className="fp-user"
                    aria-label="Account menu"
                  />
                }
              >
                <Avatar.Root size="sm">
                  <Avatar.Fallback>{user.initials}</Avatar.Fallback>
                </Avatar.Root>
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner sideOffset={8} align="end">
                  <Menu.Popup>
                    <Menu.Item onClick={() => go("settings")}>
                      <Icon render={<User />} /> Profile
                    </Menu.Item>
                    <Menu.Item onClick={() => go("cards")}>
                      <Icon render={<CreditCard />} /> Cards
                    </Menu.Item>
                    <Menu.Separator />
                    <Menu.Item
                      color="danger"
                      onClick={() =>
                        toast.add({
                          title: "Signed out",
                          description: "Just kidding, it’s a mock.",
                        })
                      }
                    >
                      <Icon render={<LogOut />} /> Sign out
                    </Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </div>
        </header>

        <main className="fp-main" id="fp-main">
          <PageHeader
            title={meta.label}
            description={meta.blurb}
            actions={<SendMoneyDialog />}
          />
          <ViewSwitch view={view} onView={go} />
        </main>
      </div>

      <CommandPalette open={palette} onOpenChange={setPalette} onView={go} />
    </div>
  );
}

function ViewSwitch({
  view,
  onView,
}: {
  view: ViewId;
  onView: (v: ViewId) => void;
}): ReactNode {
  switch (view) {
    case "transactions":
      return <TransactionsView />;
    case "cards":
      return <CardsView />;
    case "settings":
      return <SettingsView />;
    default:
      return <OverviewView onOpenTransactions={() => onView("transactions")} />;
  }
}

/** Opt-in WebGL backdrop behind the app, for skins with a reviewed shader. */
function Backdrop({
  appearance,
  skin,
}: {
  appearance: "light" | "dark";
  skin: string;
}) {
  const { enabled, pairing, state, setState } = useEffects();
  if (!enabled || !pairing || state === "unsupported") return null;
  return (
    <div className="fp-shader" data-shader={pairing.program} aria-hidden="true">
      <ShaderBackdrop
        key={pairing.program}
        program={pairing.program}
        appearance={appearance}
        tokenKey={skin}
        onStatus={(status) => setState(status.state)}
      />
    </div>
  );
}

function ThemePicker({ skin, skins, onSkin }: FernpayAppProps) {
  return (
    <Field.Root className="fp-theme-picker">
      <Field.Label className="fp-visually-hidden">Theme</Field.Label>
      <Select.Root
        value={skin}
        onValueChange={(value) => value && onSkin(value)}
        items={skins.map((s) => ({ value: s.slug, label: s.name }))}
      >
        <Select.Trigger size="sm" aria-label="Theme">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={8} align="end">
            <Select.Popup size="sm">
              <Select.List>
                {skins.map((s) => (
                  <Select.Item key={s.slug} value={s.slug}>
                    <Select.ItemText>{s.name}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  );
}

function NotificationsPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <IconButton
            variant="ghost"
            color="neutral"
            aria-label={`Notifications, ${notifications.length} new`}
            className="fp-bell"
          />
        }
      >
        <Icon render={<Bell />} />
        <Badge
          size="sm"
          variant="solid"
          className="fp-bell-count"
          aria-hidden="true"
        >
          {notifications.length}
        </Badge>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="end">
          <Popover.Popup className="fp-notifications">
            <Popover.Title>Notifications</Popover.Title>
            <ScrollArea.Root className="fp-notification-scroll">
              <ScrollArea.Viewport>
                <ScrollArea.Content>
                  <Stack gap="xs">
                    {notifications.map((n, index) => (
                      <div key={n.id}>
                        {index > 0 ? <Separator /> : null}
                        <Item.Root size="sm">
                          <Item.Content>
                            <Item.Title>{n.title}</Item.Title>
                            <Item.Description>{n.body}</Item.Description>
                          </Item.Content>
                          <Item.Actions>
                            <Text as="span" size="sm" tone="muted">
                              {n.when}
                            </Text>
                          </Item.Actions>
                        </Item.Root>
                      </div>
                    ))}
                  </Stack>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar>
                <ScrollArea.Thumb />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function CommandPalette({
  open,
  onOpenChange,
  onView,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onView: (view: ViewId) => void;
}) {
  const items = views.map((v) => `Go to ${v.label}`);
  return (
    <Command.Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Command.Dialog.Portal>
        <Command.Dialog.Backdrop />
        <Command.Dialog.Popup>
          <Command.Dialog.Title className="fp-visually-hidden">
            Command menu
          </Command.Dialog.Title>
          <Command.Root<string>
            inline
            open
            items={items}
            onValueChange={(value) => {
              const target = views.find((v) => value === `Go to ${v.label}`);
              if (target) {
                onView(target.id);
                onOpenChange(false);
              }
            }}
          >
            <Command.Input
              aria-label="Search commands"
              placeholder="Where to?"
            />
            <Command.List>
              {(item) => (
                <Command.Item key={item} value={item}>
                  {item}
                </Command.Item>
              )}
            </Command.List>
            <Command.Empty>No matching commands.</Command.Empty>
          </Command.Root>
        </Command.Dialog.Popup>
      </Command.Dialog.Portal>
    </Command.Dialog.Root>
  );
}
