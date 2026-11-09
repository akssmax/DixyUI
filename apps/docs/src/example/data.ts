/**
 * Mock data for the /dixy-example fintech app ("Fernpay"). Everything here is
 * invented and deterministic, so the server and client render the same markup.
 */

export type Category =
  | "Groceries"
  | "Dining"
  | "Transport"
  | "Housing"
  | "Subscriptions"
  | "Shopping"
  | "Health"
  | "Income"
  | "Transfer";

export interface Account {
  id: string;
  name: string;
  kind: "Checking" | "Savings" | "Credit" | "Investments";
  last4: string;
  balance: number;
  change: number;
}

export interface Transaction {
  id: string;
  date: string; // ISO yyyy-mm-dd
  merchant: string;
  category: Category;
  amount: number; // negative is money out
  account: string;
  status: "Posted" | "Pending";
  tags: string[];
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}

export interface Payee {
  id: string;
  name: string;
  handle: string;
  initials: string;
}

export const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});
export const compactCurrency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  notation: "compact",
  maximumFractionDigits: 1,
});
export const shortDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
export function formatDate(iso: string) {
  return shortDate.format(new Date(`${iso}T00:00:00Z`));
}

export const user = {
  name: "Mara Okafor",
  email: "mara@example.com",
  initials: "MO",
  plan: "Fernpay Plus",
};

export const accounts: Account[] = [
  {
    id: "acc-everyday",
    name: "Everyday",
    kind: "Checking",
    last4: "4421",
    balance: 3_284.17,
    change: 4.2,
  },
  {
    id: "acc-rainy",
    name: "Rainy day",
    kind: "Savings",
    last4: "8810",
    balance: 12_940.0,
    change: 1.1,
  },
  {
    id: "acc-card",
    name: "Fern card",
    kind: "Credit",
    last4: "0937",
    balance: -642.35,
    change: -12.8,
  },
  {
    id: "acc-invest",
    name: "Index fund",
    kind: "Investments",
    last4: "5502",
    balance: 21_480.62,
    change: 2.7,
  },
];

export const netWorth = accounts.reduce((sum, a) => sum + a.balance, 0);

export const cashflow = [
  { label: "Jun", income: 4_200, spend: 3_180 },
  { label: "Jul", income: 4_200, spend: 3_640 },
  { label: "Aug", income: 4_650, spend: 2_910 },
  { label: "Sep", income: 4_200, spend: 3_320 },
  { label: "Oct", income: 4_200, spend: 2_780 },
  { label: "Nov", income: 4_900, spend: 1_960 },
];

export const transactions: Transaction[] = [
  {
    id: "t01",
    date: "2026-11-09",
    merchant: "Greenleaf Market",
    category: "Groceries",
    amount: -46.82,
    account: "acc-everyday",
    status: "Pending",
    tags: ["weekly shop"],
  },
  {
    id: "t02",
    date: "2026-11-08",
    merchant: "Tram & Rail",
    category: "Transport",
    amount: -12.4,
    account: "acc-card",
    status: "Posted",
    tags: [],
  },
  {
    id: "t03",
    date: "2026-11-08",
    merchant: "Little Saigon",
    category: "Dining",
    amount: -31.5,
    account: "acc-card",
    status: "Posted",
    tags: ["friends"],
  },
  {
    id: "t04",
    date: "2026-11-07",
    merchant: "Studio Pay — salary",
    category: "Income",
    amount: 4_900,
    account: "acc-everyday",
    status: "Posted",
    tags: ["salary"],
  },
  {
    id: "t05",
    date: "2026-11-07",
    merchant: "Rainy day transfer",
    category: "Transfer",
    amount: -600,
    account: "acc-everyday",
    status: "Posted",
    tags: ["auto-save"],
  },
  {
    id: "t06",
    date: "2026-11-06",
    merchant: "Streamly",
    category: "Subscriptions",
    amount: -10.99,
    account: "acc-card",
    status: "Posted",
    tags: ["recurring"],
  },
  {
    id: "t07",
    date: "2026-11-06",
    merchant: "Corner Pharmacy",
    category: "Health",
    amount: -8.75,
    account: "acc-everyday",
    status: "Posted",
    tags: [],
  },
  {
    id: "t08",
    date: "2026-11-05",
    merchant: "Harbour Lettings",
    category: "Housing",
    amount: -1_250,
    account: "acc-everyday",
    status: "Posted",
    tags: ["rent", "recurring"],
  },
  {
    id: "t09",
    date: "2026-11-04",
    merchant: "Bookbarn",
    category: "Shopping",
    amount: -23.0,
    account: "acc-card",
    status: "Posted",
    tags: [],
  },
  {
    id: "t10",
    date: "2026-11-04",
    merchant: "Greenleaf Market",
    category: "Groceries",
    amount: -38.1,
    account: "acc-everyday",
    status: "Posted",
    tags: ["weekly shop"],
  },
  {
    id: "t11",
    date: "2026-11-03",
    merchant: "Bike Share",
    category: "Transport",
    amount: -3.5,
    account: "acc-card",
    status: "Posted",
    tags: [],
  },
  {
    id: "t12",
    date: "2026-11-03",
    merchant: "Daybreak Coffee",
    category: "Dining",
    amount: -4.2,
    account: "acc-card",
    status: "Posted",
    tags: [],
  },
  {
    id: "t13",
    date: "2026-11-02",
    merchant: "Refund — Bookbarn",
    category: "Shopping",
    amount: 23.0,
    account: "acc-card",
    status: "Posted",
    tags: ["refund"],
  },
  {
    id: "t14",
    date: "2026-11-02",
    merchant: "Wavelength Mobile",
    category: "Subscriptions",
    amount: -18.0,
    account: "acc-everyday",
    status: "Posted",
    tags: ["recurring"],
  },
  {
    id: "t15",
    date: "2026-11-01",
    merchant: "City Energy",
    category: "Housing",
    amount: -74.3,
    account: "acc-everyday",
    status: "Posted",
    tags: ["bills"],
  },
  {
    id: "t16",
    date: "2026-10-31",
    merchant: "Pumpkin Patch Fair",
    category: "Dining",
    amount: -16.0,
    account: "acc-card",
    status: "Posted",
    tags: ["friends"],
  },
  {
    id: "t17",
    date: "2026-10-30",
    merchant: "Greenleaf Market",
    category: "Groceries",
    amount: -52.64,
    account: "acc-everyday",
    status: "Posted",
    tags: ["weekly shop"],
  },
  {
    id: "t18",
    date: "2026-10-29",
    merchant: "Fitloop Gym",
    category: "Health",
    amount: -35.0,
    account: "acc-card",
    status: "Posted",
    tags: ["recurring"],
  },
  {
    id: "t19",
    date: "2026-10-28",
    merchant: "Tram & Rail",
    category: "Transport",
    amount: -28.9,
    account: "acc-card",
    status: "Posted",
    tags: [],
  },
  {
    id: "t20",
    date: "2026-10-27",
    merchant: "Thread & Co",
    category: "Shopping",
    amount: -89.0,
    account: "acc-card",
    status: "Posted",
    tags: ["gift"],
  },
  {
    id: "t21",
    date: "2026-10-26",
    merchant: "Little Saigon",
    category: "Dining",
    amount: -27.4,
    account: "acc-card",
    status: "Posted",
    tags: [],
  },
  {
    id: "t22",
    date: "2026-10-25",
    merchant: "Index fund top-up",
    category: "Transfer",
    amount: -250,
    account: "acc-everyday",
    status: "Posted",
    tags: ["auto-save"],
  },
  {
    id: "t23",
    date: "2026-10-24",
    merchant: "Corner Pharmacy",
    category: "Health",
    amount: -12.2,
    account: "acc-everyday",
    status: "Posted",
    tags: [],
  },
  {
    id: "t24",
    date: "2026-10-23",
    merchant: "Greenleaf Market",
    category: "Groceries",
    amount: -44.07,
    account: "acc-everyday",
    status: "Posted",
    tags: ["weekly shop"],
  },
  {
    id: "t25",
    date: "2026-10-22",
    merchant: "Cloudnest Storage",
    category: "Subscriptions",
    amount: -2.49,
    account: "acc-card",
    status: "Posted",
    tags: ["recurring"],
  },
  {
    id: "t26",
    date: "2026-10-21",
    merchant: "Freelance — Ada Studio",
    category: "Income",
    amount: 450,
    account: "acc-everyday",
    status: "Posted",
    tags: ["side work"],
  },
  {
    id: "t27",
    date: "2026-10-20",
    merchant: "Daybreak Coffee",
    category: "Dining",
    amount: -3.9,
    account: "acc-card",
    status: "Posted",
    tags: [],
  },
  {
    id: "t28",
    date: "2026-10-19",
    merchant: "Bike Share",
    category: "Transport",
    amount: -3.5,
    account: "acc-card",
    status: "Posted",
    tags: [],
  },
];

export const categories = [
  ...new Set(transactions.map((t) => t.category)),
].sort() as Category[];

export const budgets: Budget[] = [
  { category: "Groceries", limit: 320, spent: 181.62 },
  { category: "Dining", limit: 150, spent: 132.6 },
  { category: "Transport", limit: 90, spent: 48.3 },
  { category: "Shopping", limit: 120, spent: 89.0 },
  { category: "Subscriptions", limit: 40, spent: 31.48 },
];

export const goal = {
  name: "Lisbon in spring",
  target: 2_400,
  saved: 1_680,
};

export const payees: Payee[] = [
  { id: "p1", name: "Ada Mensah", handle: "@ada", initials: "AM" },
  { id: "p2", name: "Jonah Reyes", handle: "@jonah", initials: "JR" },
  { id: "p3", name: "Priya Natarajan", handle: "@priya", initials: "PN" },
  { id: "p4", name: "Harbour Lettings", handle: "rent", initials: "HL" },
  { id: "p5", name: "Tomás Ferreira", handle: "@tomas", initials: "TF" },
];

export const notifications = [
  {
    id: "n1",
    title: "Salary arrived",
    body: "£4,900.00 from Studio Pay landed in Everyday.",
    when: "2 days ago",
  },
  {
    id: "n2",
    title: "Dining budget at 88%",
    body: "£17.40 left for November.",
    when: "Yesterday",
  },
  {
    id: "n3",
    title: "New sign-in",
    body: "Safari on macOS, Lisbon.",
    when: "Today",
  },
];

export const card = {
  holder: "MARA OKAFOR",
  last4: "0937",
  expires: "08/29",
  limit: 1_500,
  spent: 642.35,
};
