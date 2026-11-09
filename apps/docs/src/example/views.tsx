import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  PiggyBank,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Accordion,
  Alert,
  AlertDialog,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Chart,
  Checkbox,
  Chip,
  DataTable,
  DateRangePicker,
  Drawer,
  Empty,
  Field,
  Fieldset,
  Form,
  Icon,
  Item,
  Meter,
  Pagination,
  ProgressCircle,
  RangeCalendar,
  Inline,
  SearchField,
  Select,
  Separator,
  Skeleton,
  Slider,
  Stack,
  Switch,
  Table,
  Tabs,
  TagGroup,
  Text,
  Textarea,
  TextField,
  Toast,
  Toggle,
  ToggleGroup,
} from "@dixy-ui/react";
import { SectionFooter, SectionHeader, StatCard } from "./layout";
import { useEffects, type EffectState } from "./effects";
import { shaderPairings } from "../lab/shader-pairings";
import {
  accounts,
  budgets,
  card,
  cashflow,
  categories,
  compactCurrency,
  currency,
  formatDate,
  goal,
  netWorth,
  transactions,
  type Transaction,
} from "./data";

const accountIcon = {
  Checking: Wallet,
  Savings: PiggyBank,
  Credit: CreditCard,
  Investments: TrendingUp,
} as const;

function Amount({ value }: { value: number }) {
  return (
    <span className="fp-amount" data-direction={value >= 0 ? "in" : "out"}>
      {value >= 0 ? "+" : "−"}
      {currency.format(Math.abs(value))}
    </span>
  );
}

function Delta({
  value,
  suffix = "vs last month",
  lowerIsBetter = false,
}: {
  value: number;
  suffix?: string;
  /** Spending going down is good news, so it should read as success. */
  lowerIsBetter?: boolean;
}) {
  const good = lowerIsBetter ? value <= 0 : value >= 0;
  return (
    <Inline gap="sm" align="center">
      <Badge variant="soft" color={good ? "success" : "danger"} size="sm">
        {value >= 0 ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
      </Badge>
      <Text as="span" size="sm" tone="muted">
        {suffix}
      </Text>
    </Inline>
  );
}

/* ---------------------------------------------------------------- Overview */

export function OverviewView({
  onOpenTransactions,
}: {
  onOpenTransactions: () => void;
}) {
  const [range, setRange] = useState("spend");
  const [refreshing, setRefreshing] = useState(false);
  const thisMonth = cashflow.at(-1)!;
  const savingsRate = Math.round(
    ((thisMonth.income - thisMonth.spend) / thisMonth.income) * 100,
  );

  function refresh() {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 900);
  }

  return (
    <div className="fp-grid">
      <Alert.Root color="danger" variant="soft" className="fp-span-full">
        <Alert.Title>
          <Icon render={<ShieldAlert />} /> Card used in Lisbon
        </Alert.Title>
        <Alert.Description>
          Your Fern card ·· {card.last4} was used at a new location today. If
          this was you, there’s nothing to do.
        </Alert.Description>
      </Alert.Root>

      <div className="fp-stats fp-span-full">
        <StatCard
          label="Net worth"
          value={currency.format(netWorth)}
          trend={<Delta value={2.4} />}
        />
        <StatCard
          label="Spent in November"
          value={currency.format(thisMonth.spend)}
          trend={<Delta value={-29.5} lowerIsBetter />}
        />
        <StatCard
          label="Savings rate"
          value={`${savingsRate}%`}
          trend={<Delta value={18.0} suffix="best month this year" />}
        />
      </div>

      <Card.Root className="fp-section fp-span-2">
        <SectionHeader
          title="Cash flow"
          description="Last six months"
          actions={
            <ToggleGroup
              segmented
              aria-label="Cash flow series"
              value={[range]}
              onValueChange={(value) => value[0] && setRange(value[0])}
            >
              <Toggle value="spend" size="sm">
                Spending
              </Toggle>
              <Toggle value="income" size="sm">
                Income
              </Toggle>
            </ToggleGroup>
          }
        />
        <Card.Content className="fp-chart">
          {refreshing ? (
            <Skeleton
              className="fp-chart-skeleton"
              aria-label="Refreshing cash flow"
            />
          ) : (
            <Chart
              color={range === "spend" ? "accent" : "success"}
              label={
                range === "spend"
                  ? "Monthly spending, GBP"
                  : "Monthly income, GBP"
              }
              data={cashflow.map((m) => ({
                label: m.label,
                value: range === "spend" ? m.spend : m.income,
              }))}
            />
          )}
        </Card.Content>
        <SectionFooter
          meta={
            <Text as="span" size="sm" tone="muted">
              {range === "spend" ? "Spending" : "Income"} · updated just now
            </Text>
          }
          actions={
            <Button
              size="sm"
              variant="ghost"
              color="neutral"
              onClick={refresh}
              disabled={refreshing}
            >
              <Icon render={<RefreshCw />} /> Refresh
            </Button>
          }
        />
      </Card.Root>

      <Card.Root className="fp-section">
        <SectionHeader title={goal.name} description="Shared savings goal" />
        <Card.Content className="fp-goal">
          <ProgressCircle
            aria-label={`${goal.name} progress`}
            value={goal.saved}
            max={goal.target}
            size="lg"
          />
          <Stack gap="xs">
            <Text className="fp-figure-sm">{currency.format(goal.saved)}</Text>
            <Text size="sm" tone="muted">
              of {currency.format(goal.target)}
            </Text>
          </Stack>
        </Card.Content>
        <SectionFooter
          meta={
            <AvatarGroup.Root size="sm">
              {["MO", "AM", "JR"].map((initials) => (
                <Avatar.Root key={initials}>
                  <Avatar.Fallback>{initials}</Avatar.Fallback>
                </Avatar.Root>
              ))}
              <AvatarGroup.Count>+1</AvatarGroup.Count>
            </AvatarGroup.Root>
          }
          actions={
            <Text as="span" size="sm" tone="muted">
              {Math.round((goal.saved / goal.target) * 100)}% saved
            </Text>
          }
        />
      </Card.Root>

      <Card.Root className="fp-section">
        <SectionHeader
          title="Accounts"
          description={`${accounts.length} linked`}
        />
        <Card.Content>
          <Stack gap="xs">
            {accounts.map((account) => {
              const Glyph = accountIcon[account.kind];
              return (
                <Item.Root key={account.id} size="sm">
                  <Avatar.Root size="sm" variant="soft">
                    <Avatar.Fallback>
                      <Icon render={<Glyph />} size="sm" />
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <Item.Content>
                    <Item.Title>{account.name}</Item.Title>
                    <Item.Description>
                      {account.kind} ·· {account.last4}
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions>
                    <span className="fp-figure-xs">
                      {currency.format(account.balance)}
                    </span>
                  </Item.Actions>
                </Item.Root>
              );
            })}
          </Stack>
        </Card.Content>
      </Card.Root>

      <Card.Root className="fp-section fp-span-2">
        <SectionHeader title="Budgets" description="November" />
        <Card.Content>
          <Stack gap="md">
            {budgets.map((b) => {
              const pct = Math.round((b.spent / b.limit) * 100);
              return (
                <Meter.Root
                  key={b.category}
                  value={pct}
                  color={pct >= 85 ? "danger" : "accent"}
                  size="sm"
                >
                  <Meter.Label>{b.category}</Meter.Label>
                  <Meter.Track>
                    <Meter.Indicator />
                  </Meter.Track>
                  <Meter.Value>
                    {() =>
                      `${compactCurrency.format(b.spent)} / ${compactCurrency.format(b.limit)}`
                    }
                  </Meter.Value>
                </Meter.Root>
              );
            })}
          </Stack>
        </Card.Content>
      </Card.Root>

      <Card.Root className="fp-section fp-span-full">
        <SectionHeader
          title="Recent activity"
          description="Your last five transactions"
          actions={
            <Button
              size="sm"
              variant="outline"
              color="neutral"
              onClick={onOpenTransactions}
            >
              View all
            </Button>
          }
        />
        <Card.Content className="fp-table-wrap">
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.Head scope="col">Merchant</Table.Head>
                <Table.Head scope="col">Category</Table.Head>
                <Table.Head scope="col">Date</Table.Head>
                <Table.Head scope="col" className="fp-num">
                  Amount
                </Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {transactions.slice(0, 5).map((t) => (
                <Table.Row key={t.id}>
                  <Table.Head scope="row">{t.merchant}</Table.Head>
                  <Table.Cell>
                    <Chip size="sm">{t.category}</Chip>
                  </Table.Cell>
                  <Table.Cell>{formatDate(t.date)}</Table.Cell>
                  <Table.Cell className="fp-num">
                    <Amount value={t.amount} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Content>
      </Card.Root>
    </div>
  );
}

/* ------------------------------------------------------------ Transactions */

type Direction = "all" | "in" | "out";
type Sort = { column: string | number; direction: "ascending" | "descending" };
const PAGE_SIZE = 8;

export function TransactionsView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [direction, setDirection] = useState<Direction>("all");
  const [dates, setDates] = useState<{
    start: { toString(): string };
    end: { toString(): string };
  } | null>(null);
  const [sort, setSort] = useState<Sort>({
    column: "date",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = transactions.filter(
      (t) =>
        (!q || t.merchant.toLowerCase().includes(q)) &&
        (category === "all" || t.category === category) &&
        (direction === "all" ||
          (direction === "in" ? t.amount > 0 : t.amount < 0)) &&
        (!dates ||
          (t.date >= dates.start.toString() && t.date <= dates.end.toString())),
    );
    return filtered.sort((a, b) => {
      const result =
        sort.column === "amount"
          ? a.amount - b.amount
          : sort.column === "merchant"
            ? a.merchant.localeCompare(b.merchant)
            : a.date.localeCompare(b.date);
      return sort.direction === "ascending" ? result : -result;
    });
  }, [query, category, direction, dates, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const total = rows.reduce((sum, t) => sum + t.amount, 0);
  const filtered =
    query !== "" || category !== "all" || direction !== "all" || dates !== null;

  function clear() {
    setQuery("");
    setCategory("all");
    setDirection("all");
    setDates(null);
    setPage(1);
  }

  return (
    <Stack gap="lg">
      <Card.Root className="fp-section">
        <Card.Content className="fp-filters">
          <SearchField.Root
            value={query}
            onChange={(v) => (setQuery(v), setPage(1))}
          >
            <SearchField.Label>Search</SearchField.Label>
            <SearchField.Group>
              <SearchField.Input placeholder="Merchant…" />
              <SearchField.Clear aria-label="Clear search" />
            </SearchField.Group>
          </SearchField.Root>

          <Field.Root>
            <Field.Label>Category</Field.Label>
            <Select.Root
              value={category}
              onValueChange={(value) => (
                setCategory(value ?? "all"),
                setPage(1)
              )}
              items={[
                { value: "all", label: "All categories" },
                ...categories.map((c) => ({ value: c, label: c })),
              ]}
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner sideOffset={8}>
                  <Select.Popup>
                    <Select.List>
                      {["all", ...categories].map((c) => (
                        <Select.Item key={c} value={c}>
                          <Select.ItemText>
                            {c === "all" ? "All categories" : c}
                          </Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.List>
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
          </Field.Root>

          <DateRangePicker.Root
            className="fp-dates"
            value={dates as never}
            onChange={(value) => (setDates(value as typeof dates), setPage(1))}
          >
            <DateRangePicker.Label>Dates</DateRangePicker.Label>
            <DateRangePicker.Group>
              <DateRangePicker.Input slot="start">
                {(segment) => <DateRangePicker.Segment segment={segment} />}
              </DateRangePicker.Input>
              <span aria-hidden="true">–</span>
              <DateRangePicker.Input slot="end">
                {(segment) => <DateRangePicker.Segment segment={segment} />}
              </DateRangePicker.Input>
              <DateRangePicker.Button aria-label="Open calendar" />
            </DateRangePicker.Group>
            <DateRangePicker.Popover aria-label="Choose a date range">
              <RangeCalendar.Root aria-label="Date range">
                <Inline>
                  <RangeCalendar.Button
                    slot="previous"
                    aria-label="Previous month"
                  />
                  <RangeCalendar.Heading />
                  <RangeCalendar.Button slot="next" aria-label="Next month" />
                </Inline>
                <RangeCalendar.Grid>
                  <RangeCalendar.GridHeader>
                    {(day) => (
                      <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                    )}
                  </RangeCalendar.GridHeader>
                  <RangeCalendar.GridBody>
                    {(date) => <RangeCalendar.Cell date={date} />}
                  </RangeCalendar.GridBody>
                </RangeCalendar.Grid>
              </RangeCalendar.Root>
            </DateRangePicker.Popover>
          </DateRangePicker.Root>

          <div className="fp-filter-end">
            <ToggleGroup
              segmented
              aria-label="Direction"
              value={[direction]}
              onValueChange={(value) =>
                value[0] && (setDirection(value[0] as Direction), setPage(1))
              }
            >
              <Toggle value="all">All</Toggle>
              <Toggle value="in">
                <Icon render={<ArrowDownLeft />} /> In
              </Toggle>
              <Toggle value="out">
                <Icon render={<ArrowUpRight />} /> Out
              </Toggle>
            </ToggleGroup>
          </div>
        </Card.Content>
        <SectionFooter
          meta={
            <Text as="span" size="sm" role="status">
              {rows.length} {rows.length === 1 ? "transaction" : "transactions"}{" "}
              · net <Amount value={total} />
            </Text>
          }
          actions={
            <Button
              size="sm"
              variant="ghost"
              color="neutral"
              onClick={clear}
              disabled={!filtered}
            >
              Clear filters
            </Button>
          }
        />
      </Card.Root>

      <Card.Root className="fp-section">
        {rows.length === 0 ? (
          <Card.Content className="fp-table-wrap fp-txn-table fp-table-empty">
            <Empty.Root>
              <Empty.Title>Nothing matches those filters</Empty.Title>
              <Empty.Description>
                Try a wider date range or another category.
              </Empty.Description>
              <Empty.Content>
                <Button onClick={clear}>Clear filters</Button>
              </Empty.Content>
            </Empty.Root>
          </Card.Content>
        ) : (
          <Card.Content className="fp-table-wrap fp-txn-table">
            <DataTable.Root
              aria-label="Transactions"
              sortDescriptor={sort}
              onSortChange={(next) => setSort(next as Sort)}
              onRowAction={(key) =>
                setSelected(transactions.find((t) => t.id === key) ?? null)
              }
            >
              <DataTable.Header>
                <DataTable.Column id="merchant" isRowHeader allowsSorting>
                  Merchant
                </DataTable.Column>
                <DataTable.Column id="category">Category</DataTable.Column>
                <DataTable.Column id="date" allowsSorting>
                  Date
                </DataTable.Column>
                <DataTable.Column id="status">Status</DataTable.Column>
                <DataTable.Column id="amount" allowsSorting>
                  Amount
                </DataTable.Column>
              </DataTable.Header>
              <DataTable.Body items={visible}>
                {(t) => (
                  <DataTable.Row id={t.id}>
                    <DataTable.Cell>{t.merchant}</DataTable.Cell>
                    <DataTable.Cell>
                      <Chip size="sm">{t.category}</Chip>
                    </DataTable.Cell>
                    <DataTable.Cell>{formatDate(t.date)}</DataTable.Cell>
                    <DataTable.Cell>
                      <Badge
                        size="sm"
                        variant={t.status === "Pending" ? "outline" : "soft"}
                        color={t.status === "Pending" ? "neutral" : "success"}
                      >
                        {t.status}
                      </Badge>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Amount value={t.amount} />
                    </DataTable.Cell>
                  </DataTable.Row>
                )}
              </DataTable.Body>
            </DataTable.Root>
          </Card.Content>
        )}
        <SectionFooter
          meta={
            <Text as="span" size="sm" tone="muted">
              Page {current} of {pages} · select a row for details
            </Text>
          }
          actions={
            <Pagination.Root aria-label="Transaction pages">
              <Pagination.List>
                <Pagination.Item>
                  <Pagination.Previous
                    href="#previous"
                    aria-disabled={current === 1 || undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      setPage(Math.max(1, current - 1));
                    }}
                  />
                </Pagination.Item>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <Pagination.Item key={n}>
                    <Pagination.Link
                      href={`#page-${n}`}
                      aria-label={`Page ${n}`}
                      aria-current={n === current ? "page" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        setPage(n);
                      }}
                    >
                      {n}
                    </Pagination.Link>
                  </Pagination.Item>
                ))}
                <Pagination.Item>
                  <Pagination.Next
                    href="#next"
                    aria-disabled={current === pages || undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      setPage(Math.min(pages, current + 1));
                    }}
                  />
                </Pagination.Item>
              </Pagination.List>
            </Pagination.Root>
          }
        />
      </Card.Root>

      <TransactionDrawer
        transaction={selected}
        onClose={() => setSelected(null)}
      />
    </Stack>
  );
}

function TransactionDrawer({
  transaction,
  onClose,
}: {
  transaction: Transaction | null;
  onClose: () => void;
}) {
  const toast = Toast.useToastManager();
  const [tags, setTags] = useState<string[]>([]);
  const [lastId, setLastId] = useState<string | null>(null);
  if (transaction && transaction.id !== lastId) {
    setLastId(transaction.id);
    setTags(transaction.tags);
  }
  const account = accounts.find((a) => a.id === transaction?.account);
  return (
    <Drawer.Root
      open={!!transaction}
      onOpenChange={(open) => !open && onClose()}
      swipeDirection="right"
    >
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup className="fp-drawer">
            {transaction ? (
              <Drawer.Content>
                <Stack gap="md">
                  <Drawer.Title>{transaction.merchant}</Drawer.Title>
                  <Drawer.Description>
                    {formatDate(transaction.date)} · {account?.name} ··{" "}
                    {account?.last4}
                  </Drawer.Description>
                  <div className="fp-drawer-amount">
                    <Amount value={transaction.amount} />
                  </div>
                  <Inline gap="sm">
                    <Chip>{transaction.category}</Chip>
                    <Badge
                      variant="soft"
                      color={
                        transaction.status === "Pending" ? "neutral" : "success"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </Inline>
                  <Separator />
                  <TagGroup.Root
                    onRemove={(keys) =>
                      setTags(tags.filter((tag) => !keys.has(tag)))
                    }
                  >
                    <TagGroup.Label>Tags</TagGroup.Label>
                    <TagGroup.List
                      items={tags.map((id) => ({ id }))}
                      renderEmptyState={() => (
                        <Text size="sm" tone="muted">
                          No tags
                        </Text>
                      )}
                    >
                      {(item) => (
                        <TagGroup.Item id={item.id} textValue={item.id}>
                          {item.id}
                          <TagGroup.Remove
                            slot="remove"
                            aria-label={`Remove ${item.id}`}
                          />
                        </TagGroup.Item>
                      )}
                    </TagGroup.List>
                  </TagGroup.Root>
                  <label className="fp-label-stack">
                    Note
                    <Textarea rows={3} placeholder="Add a note for yourself…" />
                  </label>
                  <Inline gap="sm" wrap>
                    <Drawer.Close
                      render={<Button variant="outline" color="neutral" />}
                    >
                      Close
                    </Drawer.Close>
                    <Button
                      color="danger"
                      variant="soft"
                      onClick={() => {
                        toast.add({
                          title: "Dispute opened",
                          description: `We’ll look into ${transaction.merchant}.`,
                        });
                        onClose();
                      }}
                    >
                      Dispute
                    </Button>
                  </Inline>
                </Stack>
              </Drawer.Content>
            ) : null}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

/* ------------------------------------------------------------------- Cards */

export function CardsView() {
  const toast = Toast.useToastManager();
  const [frozen, setFrozen] = useState(false);
  const [limit, setLimit] = useState(card.limit);
  const [controls, setControls] = useState({
    online: true,
    contactless: true,
    atm: false,
    abroad: true,
  });

  return (
    <div className="fp-grid fp-grid-cards">
      <div
        className="fp-payment-card"
        data-frozen={frozen || undefined}
        aria-label="Fern card"
      >
        <Inline gap="sm" align="center">
          <Text as="span" className="fp-card-brand">
            fernpay
          </Text>
          {frozen ? (
            <Badge variant="solid" color="neutral" size="sm">
              Frozen
            </Badge>
          ) : null}
        </Inline>
        <Text as="span" className="fp-card-number">
          •••• •••• •••• {card.last4}
        </Text>
        <Inline gap="lg">
          <Text as="span" size="sm">
            {card.holder}
          </Text>
          <Text as="span" size="sm">
            {card.expires}
          </Text>
        </Inline>
      </div>

      <Card.Root className="fp-section">
        <SectionHeader
          title="Card controls"
          description="Changes apply instantly in this mock."
        />
        <Card.Content>
          <Stack gap="md">
            <label className="fp-switch-row">
              <span>
                <Text as="span">Freeze card</Text>
                <Text as="span" size="sm" tone="muted">
                  Pause all new payments
                </Text>
              </span>
              <Switch.Root
                checked={frozen}
                onCheckedChange={(next) => {
                  setFrozen(next);
                  toast.add({ title: next ? "Card frozen" : "Card unfrozen" });
                }}
              >
                <Switch.Thumb />
              </Switch.Root>
            </label>
            <Separator />
            <Fieldset.Root disabled={frozen}>
              <Fieldset.Legend>Allow payments</Fieldset.Legend>
              <Stack gap="sm">
                {(
                  [
                    ["online", "Online"],
                    ["contactless", "Contactless"],
                    ["atm", "Cash machines"],
                    ["abroad", "Abroad"],
                  ] as const
                ).map(([key, label]) => (
                  <Field.Root key={key}>
                    <Field.Label className="fp-check">
                      <Checkbox.Root
                        checked={controls[key]}
                        onCheckedChange={(checked) =>
                          setControls({ ...controls, [key]: checked })
                        }
                      >
                        <Checkbox.Indicator />
                      </Checkbox.Root>
                      {label}
                    </Field.Label>
                  </Field.Root>
                ))}
              </Stack>
            </Fieldset.Root>
          </Stack>
        </Card.Content>
      </Card.Root>

      <Card.Root className="fp-section">
        <SectionHeader
          title="Monthly limit"
          description={`${currency.format(card.spent)} spent of ${currency.format(limit)}`}
        />
        <Card.Content>
          <Stack gap="md">
            <Slider.Root
              value={limit}
              onValueChange={(value) => setLimit(value as number)}
              min={250}
              max={5000}
              step={250}
              disabled={frozen}
            >
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                </Slider.Track>
                <Slider.Thumb aria-label="Monthly limit" />
              </Slider.Control>
            </Slider.Root>
            <Meter.Root
              value={Math.min(100, Math.round((card.spent / limit) * 100))}
              size="sm"
            >
              <Meter.Label>Used</Meter.Label>
              <Meter.Track>
                <Meter.Indicator />
              </Meter.Track>
              <Meter.Value />
            </Meter.Root>
          </Stack>
        </Card.Content>
        <SectionFooter
          meta={
            <Text as="span" size="sm" tone="muted">
              Resets on the 1st
            </Text>
          }
          actions={
            <AlertDialog.Root>
              <AlertDialog.Trigger
                render={<Button size="sm" variant="ghost" color="danger" />}
              >
                Cancel this card
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Backdrop />
                <AlertDialog.Viewport>
                  <AlertDialog.Popup>
                    <AlertDialog.Title>
                      Cancel card ·· {card.last4}?
                    </AlertDialog.Title>
                    <AlertDialog.Description>
                      You’ll get a new number in 3–5 days. Subscriptions on this
                      card will stop. (Mock: nothing is cancelled.)
                    </AlertDialog.Description>
                    <div className="fp-dialog-actions">
                      <AlertDialog.Close
                        render={<Button variant="outline" color="neutral" />}
                      >
                        Keep card
                      </AlertDialog.Close>
                      <AlertDialog.Close
                        render={<Button color="danger" />}
                        onClick={() =>
                          toast.add({
                            title: "Replacement ordered",
                            type: "success",
                          })
                        }
                      >
                        Cancel card
                      </AlertDialog.Close>
                    </div>
                  </AlertDialog.Popup>
                </AlertDialog.Viewport>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          }
        />
      </Card.Root>
    </div>
  );
}

/* ---------------------------------------------------------------- Settings */

const effectStateLabel: Record<EffectState, string> = {
  off: "Off",
  starting: "Starting…",
  running: "Running",
  still: "Still frame (reduced motion)",
  hidden: "Paused while hidden",
  unsupported: "WebGL isn’t available on this device",
  lost: "Paused by the browser",
};

function AppearanceSettings() {
  const { enabled, setEnabled, pairing, state, onSkin } = useEffects();
  return (
    <Card.Root className="fp-section">
      <SectionHeader
        title="Appearance"
        description="Visual extras. Fernpay looks finished without them."
      />
      <Card.Content>
        <Stack gap="md">
          <label className="fp-switch-row">
            <span>
              <Text as="span">Animated background</Text>
              <Text as="span" size="sm" tone="muted">
                {pairing
                  ? `${pairing.label} · WebGL, pauses when hidden or with reduced motion`
                  : "This theme has no animated background yet."}
              </Text>
            </span>
            <Switch.Root
              checked={enabled && Boolean(pairing)}
              disabled={!pairing}
              onCheckedChange={setEnabled}
            >
              <Switch.Thumb />
            </Switch.Root>
          </label>
          {!pairing ? (
            <Stack gap="sm">
              <Text size="sm" tone="muted">
                Try a theme that has one:
              </Text>
              <Inline gap="sm" wrap>
                {shaderPairings.map((item) => (
                  <Button
                    key={item.slug}
                    size="sm"
                    variant="outline"
                    color="neutral"
                    onClick={() => onSkin(item.slug)}
                  >
                    {item.label}
                  </Button>
                ))}
              </Inline>
            </Stack>
          ) : null}
        </Stack>
      </Card.Content>
      <SectionFooter
        meta={
          <Text as="span" size="sm" tone="muted" role="status">
            Status: {pairing ? effectStateLabel[state] : "Unavailable"}
          </Text>
        }
      />
    </Card.Root>
  );
}

export function SettingsView() {
  const toast = Toast.useToastManager();
  return (
    <Tabs.Root defaultValue="profile" className="fp-settings">
      <Tabs.List aria-label="Settings sections">
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
        <Tabs.Tab value="appearance">Appearance</Tabs.Tab>
        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
        <Tabs.Tab value="help">Help</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="profile">
        <Card.Root className="fp-section">
          <SectionHeader
            title="Profile"
            description="How you appear on receipts and transfers."
          />
          <Card.Content>
            <Form
              id="fp-profile"
              className="fp-form"
              onSubmit={(event) => {
                event.preventDefault();
                toast.add({ title: "Profile saved", type: "success" });
              }}
            >
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <TextField name="name" defaultValue="Mara Okafor" required />
              </Field.Root>
              <Field.Root>
                <Field.Label>Email</Field.Label>
                <TextField
                  name="email"
                  type="email"
                  defaultValue="mara@example.com"
                  required
                />
                <Field.Description>
                  Receipts and statements go here.
                </Field.Description>
              </Field.Root>
            </Form>
          </Card.Content>
          <SectionFooter
            meta={
              <Text as="span" size="sm" tone="muted">
                Saved to this browser only
              </Text>
            }
            actions={
              <Button type="submit" form="fp-profile" size="sm">
                Save
              </Button>
            }
          />
        </Card.Root>
      </Tabs.Panel>
      <Tabs.Panel value="appearance">
        <AppearanceSettings />
      </Tabs.Panel>
      <Tabs.Panel value="notifications">
        <Card.Root className="fp-section">
          <SectionHeader
            title="Notifications"
            description="Choose what Fernpay tells you about."
          />
          <Card.Content>
            <Stack gap="md">
              {[
                ["Payments over £100", true],
                ["Weekly summary", true],
                ["Budget warnings", true],
                ["Product news", false],
              ].map(([label, on]) => (
                <label key={label as string} className="fp-switch-row">
                  <Text as="span">{label}</Text>
                  <Switch.Root defaultChecked={on as boolean}>
                    <Switch.Thumb />
                  </Switch.Root>
                </label>
              ))}
            </Stack>
          </Card.Content>
        </Card.Root>
      </Tabs.Panel>
      <Tabs.Panel value="help">
        <Card.Root className="fp-section">
          <SectionHeader
            title="Help"
            description="Answers to common questions."
          />
          <Card.Content>
            <Accordion.Root>
              {[
                [
                  "Is any of this real?",
                  "No. Fernpay is mock data that shows Dixy components working together.",
                ],
                [
                  "Why does the theme change everything?",
                  "Every component reads the same semantic tokens from the nearest Theme, so one skin restyles the whole app.",
                ],
                [
                  "Where do I report a lost card?",
                  "In a real app, here. In this one, try Cards → Cancel this card.",
                ],
              ].map(([q, a], index) => (
                <Accordion.Item key={q} value={index}>
                  <Accordion.Header>
                    <Accordion.Trigger>
                      {q}
                      <svg
                        data-dixy-chevron=""
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="m4 6 4 4 4-4" />
                      </svg>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Panel>
                    <div className="fp-accordion-body">{a}</div>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Card.Content>
        </Card.Root>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
