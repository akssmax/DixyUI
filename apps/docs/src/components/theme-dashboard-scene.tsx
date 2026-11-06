import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chart,
  IconButton,
  Progress,
  Table,
  Text,
} from "@dixy-ui/react";
import {
  BarChart3,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Menu,
  PanelLeft,
  Plus,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import "../styles/theme-scenes.css";

const navigation = [
  ["Dashboard", LayoutDashboard],
  ["Projects", FolderKanban],
  ["Analytics", BarChart3],
  ["Team", Users],
  ["Documents", FileText],
  ["Settings", Settings],
] as const;

const metrics = [
  {
    label: "Total revenue",
    value: "$48,250",
    change: "+12.5%",
    up: true,
    note: "Trending up this month",
  },
  {
    label: "New customers",
    value: "1,284",
    change: "-4.2%",
    up: false,
    note: "Acquisition needs attention",
  },
  {
    label: "Active accounts",
    value: "12,640",
    change: "+8.1%",
    up: true,
    note: "Strong user retention",
  },
  {
    label: "Growth rate",
    value: "4.6%",
    change: "+0.9%",
    up: true,
    note: "Steady performance increase",
  },
];

const ranges = {
  "7d": {
    label: "Last 7 days",
    data: [
      { label: "Mon", value: 32 },
      { label: "Tue", value: 41 },
      { label: "Wed", value: 38 },
      { label: "Thu", value: 52 },
      { label: "Fri", value: 47 },
      { label: "Sat", value: 29 },
      { label: "Sun", value: 24 },
    ],
  },
  "30d": {
    label: "Last 30 days",
    data: [
      { label: "W1", value: 180 },
      { label: "W2", value: 214 },
      { label: "W3", value: 196 },
      { label: "W4", value: 252 },
    ],
  },
  "90d": {
    label: "Last 3 months",
    data: [
      { label: "Aug", value: 620 },
      { label: "Sep", value: 744 },
      { label: "Oct", value: 812 },
    ],
  },
} as const;
type Range = keyof typeof ranges;

const goals = [
  { label: "Quarterly revenue", value: 72 },
  { label: "Customer onboarding", value: 48 },
  { label: "Support resolved", value: 91 },
];

const documents = [
  {
    id: 1,
    title: "Cover page",
    type: "Narrative",
    status: "Done",
    owner: "Maya Chen",
    target: 18,
  },
  {
    id: 2,
    title: "Executive summary",
    type: "Narrative",
    status: "In review",
    owner: "Alex Rivera",
    target: 10,
  },
  {
    id: 3,
    title: "Technical approach",
    type: "Technical",
    status: "In progress",
    owner: "Jamie Park",
    target: 24,
  },
  {
    id: 4,
    title: "Pricing breakdown",
    type: "Finance",
    status: "Done",
    owner: "Sam Lee",
    target: 6,
  },
  {
    id: 5,
    title: "Risk assessment",
    type: "Planning",
    status: "In progress",
    owner: "Maya Chen",
    target: 12,
  },
];

const statusColor = {
  Done: "success",
  "In review": "accent",
  "In progress": "neutral",
} as const;

export default function ThemeDashboardScene() {
  const [page, setPage] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [range, setRange] = useState<Range>("30d");
  const menuRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Move focus into the drawer when it opens and back to the trigger when it
  // closes, so keyboard users are never left behind the scrim.
  useEffect(() => {
    if (navOpen) closeRef.current?.focus();
    else if (wasOpen.current) menuRef.current?.focus();
    wasOpen.current = navOpen;
  }, [navOpen]);

  useEffect(() => {
    if (!navOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [navOpen]);

  return (
    <Card.Root
      className="theme-dashboard-scene"
      data-collapsed={collapsed || undefined}
      data-nav-open={navOpen || undefined}
    >
      <div className="theme-dash-shell">
        <aside
          id="theme-dash-nav"
          className="theme-dash-nav"
          aria-label="Workspace navigation"
        >
          <div className="theme-dash-brand">
            <span className="theme-dash-brand-mark" aria-hidden="true">
              <LayoutDashboard size={16} />
            </span>
            <span className="theme-dash-label">
              <strong>Acme Inc.</strong>
              <small>Enterprise</small>
            </span>
            <IconButton
              variant="ghost"
              color="neutral"
              size="sm"
              ref={closeRef}
              className="theme-dash-nav-close"
              aria-label="Close navigation"
              onClick={() => setNavOpen(false)}
            >
              <X size={16} />
            </IconButton>
          </div>
          <Button className="theme-dash-quick" aria-label="Quick create">
            <Plus size={16} />
            <span className="theme-dash-label">Quick create</span>
          </Button>
          <nav aria-label="Main">
            {navigation.map(([name, Icon]) => (
              <Button
                key={name}
                variant={page === name ? "soft" : "ghost"}
                color="neutral"
                aria-label={name}
                aria-current={page === name ? "page" : undefined}
                title={name}
                onClick={() => {
                  setPage(name);
                  setNavOpen(false);
                }}
              >
                <Icon size={16} />
                <span className="theme-dash-label">{name}</span>
              </Button>
            ))}
          </nav>
          <div className="theme-dash-account">
            <Avatar.Root size="sm">
              <Avatar.Fallback>AS</Avatar.Fallback>
            </Avatar.Root>
            <span className="theme-dash-label">
              <Text size="sm" variant="label.sm">
                Alex S.
              </Text>
              <Text size="sm" tone="muted">
                alex@example.com
              </Text>
            </span>
          </div>
        </aside>
        <button
          type="button"
          className="theme-dash-scrim"
          aria-label="Close navigation"
          tabIndex={-1}
          onClick={() => setNavOpen(false)}
        />
        <div className="theme-dash-main">
          <header className="theme-dash-header">
            <IconButton
              variant="ghost"
              color="neutral"
              size="sm"
              className="theme-dash-collapse"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-pressed={collapsed}
              onClick={() => setCollapsed((value) => !value)}
            >
              <PanelLeft size={16} />
            </IconButton>
            <IconButton
              variant="ghost"
              color="neutral"
              size="sm"
              ref={menuRef}
              className="theme-dash-menu"
              aria-label="Open navigation"
              aria-expanded={navOpen}
              aria-controls="theme-dash-nav"
              onClick={() => setNavOpen(true)}
            >
              <Menu size={16} />
            </IconButton>
            <h2>{page}</h2>
            <Button size="sm" variant="outline" color="neutral">
              Export
            </Button>
          </header>
          <div className="theme-dash-content">
            <section className="theme-dash-metrics" aria-label="Key metrics">
              {metrics.map((metric) => {
                const Trend = metric.up ? TrendingUp : TrendingDown;
                return (
                  <article key={metric.label} className="theme-dash-metric">
                    <div className="theme-dash-metric-top">
                      <Text size="sm" tone="muted">
                        {metric.label}
                      </Text>
                      <Badge
                        variant="soft"
                        color={metric.up ? "success" : "danger"}
                      >
                        <Trend size={12} aria-hidden="true" />
                        {metric.change}
                      </Badge>
                    </div>
                    <strong className="theme-dash-metric-value">
                      {metric.value}
                    </strong>
                    <Text size="sm" tone="muted">
                      {metric.note}
                    </Text>
                  </article>
                );
              })}
            </section>
            <div className="theme-dash-split">
              <section
                className="theme-dash-panel theme-dash-chart"
                aria-labelledby="theme-dash-chart-title"
              >
                <div className="theme-dash-panel-header">
                  <div>
                    <h3 id="theme-dash-chart-title">Visitors</h3>
                    <Text size="sm" tone="muted">
                      {ranges[range].label}
                    </Text>
                  </div>
                  <div
                    className="theme-dash-range"
                    role="group"
                    aria-label="Chart range"
                  >
                    {(Object.keys(ranges) as Range[]).map((key) => (
                      <Button
                        key={key}
                        size="sm"
                        variant={range === key ? "soft" : "ghost"}
                        color="neutral"
                        aria-pressed={range === key}
                        onClick={() => setRange(key)}
                      >
                        {key}
                      </Button>
                    ))}
                  </div>
                </div>
                <Chart
                  color="accent"
                  label={"Visitors, " + ranges[range].label.toLowerCase()}
                  data={ranges[range].data}
                />
              </section>
              <section
                className="theme-dash-panel theme-dash-goals"
                aria-labelledby="theme-dash-goals-title"
              >
                <div className="theme-dash-panel-header">
                  <div>
                    <h3 id="theme-dash-goals-title">Goals</h3>
                    <Text size="sm" tone="muted">
                      This quarter
                    </Text>
                  </div>
                </div>
                {goals.map((goal) => (
                  <Progress.Root key={goal.label} value={goal.value} size="sm">
                    <Progress.Label>{goal.label}</Progress.Label>
                    <Progress.Value />
                    <Progress.Track>
                      <Progress.Indicator />
                    </Progress.Track>
                  </Progress.Root>
                ))}
              </section>
            </div>
            <section
              className="theme-dash-panel"
              aria-labelledby="theme-dash-table-title"
            >
              <div className="theme-dash-panel-header">
                <div>
                  <h3 id="theme-dash-table-title">Documents</h3>
                  <Text size="sm" tone="muted">
                    Proposal sections and their owners
                  </Text>
                </div>
                <Button size="sm" variant="outline" color="neutral">
                  <Plus size={14} />
                  Add section
                </Button>
              </div>
              <div
                className="theme-dash-table"
                tabIndex={0}
                role="region"
                aria-label="Documents table"
              >
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.Head scope="col">Section</Table.Head>
                      <Table.Head scope="col" data-optional>
                        Type
                      </Table.Head>
                      <Table.Head scope="col">Status</Table.Head>
                      <Table.Head scope="col" data-optional>
                        Owner
                      </Table.Head>
                      <Table.Head scope="col" data-numeric>
                        Pages
                      </Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {documents.map((doc) => (
                      <Table.Row key={doc.id}>
                        <Table.Head scope="row">{doc.title}</Table.Head>
                        <Table.Cell data-optional>{doc.type}</Table.Cell>
                        <Table.Cell>
                          <Badge
                            variant="soft"
                            color={
                              statusColor[
                                doc.status as keyof typeof statusColor
                              ]
                            }
                          >
                            {doc.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell data-optional>{doc.owner}</Table.Cell>
                        <Table.Cell data-numeric>{doc.target}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Card.Root>
  );
}
