import { createRef, useState } from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import axe from "axe-core";
import {
  Blockquote,
  Code,
  DataList,
  Field,
  Grid,
  Image,
  Navbar,
  PasswordField,
  Snippet,
  User,
  VisuallyHidden,
} from "../index";

const audit = (container: HTMLElement) =>
  axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
    },
    // jsdom cannot compute rendered contrast.
    rules: { "color-contrast": { enabled: false } },
  });

it("lays out a Grid with bounded fixed columns or responsive auto-fit", () => {
  render(
    <>
      <Grid data-testid="fixed" columns={40} gap="lg" style={{ color: "red" }}>
        <div />
      </Grid>
      <Grid data-testid="fit" minColumnWidth="12rem" as="ul" />
    </>,
  );
  const fixed = screen.getByTestId("fixed");
  expect(fixed).toHaveAttribute("data-gap", "lg");
  expect(fixed.style.getPropertyValue("--dixy-grid-columns")).toBe("12");
  expect(fixed.style.color).toBe("red");
  const fit = screen.getByTestId("fit");
  expect(fit.tagName).toBe("UL");
  expect(fit).toHaveAttribute("data-fit");
  expect(fit.style.getPropertyValue("--dixy-grid-min")).toBe("12rem");
});

it("keeps VisuallyHidden content in the accessibility tree", () => {
  render(
    <>
      <button>
        <span aria-hidden="true">×</span>
        <VisuallyHidden>Close</VisuallyHidden>
      </button>
      <VisuallyHidden focusable data-testid="skip">
        <a href="#main">Skip to content</a>
      </VisuallyHidden>
    </>,
  );
  expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  expect(screen.getByTestId("skip")).toHaveAttribute("data-focusable");
});

it("renders Code and Blockquote as native elements with theme visuals", () => {
  const ref = createRef<HTMLElement>();
  render(
    <>
      <Code ref={ref}>pnpm check</Code>
      <Blockquote color="neutral" cite="https://example.com">
        Quote
      </Blockquote>
    </>,
  );
  expect(ref.current?.tagName).toBe("CODE");
  expect(ref.current).toHaveAttribute("data-variant", "soft");
  expect(ref.current).toHaveAttribute("data-color", "neutral");
  expect(ref.current).toHaveAttribute("data-dixy-visual");
  const quote = screen.getByText("Quote");
  expect(quote.tagName).toBe("BLOCKQUOTE");
  expect(quote).toHaveAttribute("cite", "https://example.com");
});

it("copies the snippet value, excludes the prompt symbol and announces the result", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  // user-event installs its own clipboard stub during setup; replace it after.
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  const onCopy = vi.fn();
  const view = render(
    <Snippet symbol="$" onCopy={onCopy}>
      {"pnpm install\npnpm dev"}
    </Snippet>,
  );
  expect(screen.getAllByText("$")[0]).toHaveAttribute("aria-hidden", "true");
  const status = screen.getByRole("status");
  expect(status).toBeEmptyDOMElement();
  await user.click(screen.getByRole("button", { name: "Copy to clipboard" }));
  await waitFor(() => expect(status).toHaveTextContent("Copied"));
  expect(writeText).toHaveBeenCalledWith("pnpm install\npnpm dev");
  expect(onCopy).toHaveBeenCalledWith("pnpm install\npnpm dev");
  await act(() => vi.advanceTimersByTimeAsync(2000));
  expect(status).toBeEmptyDOMElement();

  writeText.mockRejectedValueOnce(new Error("denied"));
  await user.click(screen.getByRole("button", { name: "Copy to clipboard" }));
  await waitFor(() => expect(status).toHaveTextContent("Copy failed"));
  expect((await audit(view.container)).violations).toEqual([]);
  vi.useRealTimers();
});

it("toggles PasswordField visibility while keeping Field labelling and input focus order", async () => {
  const user = userEvent.setup();
  const view = render(
    <Field.Root>
      <Field.Label>Password</Field.Label>
      <PasswordField name="password" defaultValue="hunter2" />
    </Field.Root>,
  );
  const input = screen.getByLabelText("Password");
  expect(input).toHaveAttribute("type", "password");
  expect(input).toHaveAttribute("autocomplete", "current-password");
  const toggle = screen.getByRole("button", { name: "Show password" });
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  await user.tab();
  expect(input).toHaveFocus();
  await user.tab();
  expect(toggle).toHaveFocus();
  await user.keyboard("[Space]");
  expect(input).toHaveAttribute("type", "text");
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(toggle).toHaveFocus();
  expect((await audit(view.container)).violations).toEqual([]);
});

it("supports controlled PasswordField visibility and disables the toggle with the input", async () => {
  const user = userEvent.setup();
  const onVisibleChange = vi.fn();
  function Controlled() {
    const [visible, setVisible] = useState(true);
    return (
      <PasswordField
        aria-label="Secret"
        visible={visible}
        onVisibleChange={(next) => {
          onVisibleChange(next);
          setVisible(next);
        }}
      />
    );
  }
  const { rerender } = render(<Controlled />);
  expect(screen.getByLabelText("Secret")).toHaveAttribute("type", "text");
  await user.click(screen.getByRole("button", { name: "Show password" }));
  expect(onVisibleChange).toHaveBeenCalledWith(false);
  expect(screen.getByLabelText("Secret")).toHaveAttribute("type", "password");
  rerender(<PasswordField aria-label="Secret" disabled />);
  expect(screen.getByRole("button", { name: "Show password" })).toBeDisabled();
});

it("renders DataList as a native description list", async () => {
  const view = render(
    <DataList.Root orientation="vertical" size="sm">
      <DataList.Item>
        <DataList.Label>Status</DataList.Label>
        <DataList.Value>Active</DataList.Value>
      </DataList.Item>
    </DataList.Root>,
  );
  const list = view.container.querySelector("dl")!;
  expect(list).toHaveAttribute("data-orientation", "vertical");
  expect(screen.getByText("Status").tagName).toBe("DT");
  expect(screen.getByText("Active").tagName).toBe("DD");
  expect((await audit(view.container)).violations).toEqual([]);
});

it("names a User by visible text and keeps the avatar decorative", async () => {
  const view = render(
    <User name="Ada Lovelace" description="Engineer" size="lg" />,
  );
  expect(screen.getByText("AL")).toBeInTheDocument();
  expect(screen.getByText("AL").closest("[aria-hidden]")).toBeTruthy();
  expect(screen.getByText("Ada Lovelace")).toBeVisible();
  expect(screen.getByText("Engineer")).toBeInTheDocument();
  expect((await audit(view.container)).violations).toEqual([]);
});

it("reports Image loading state, tries one fallback, then reports an error", () => {
  const ref = createRef<HTMLImageElement>();
  const onError = vi.fn();
  render(
    <Image
      ref={ref}
      src="/missing.png"
      fallbackSrc="/fallback.png"
      alt="Team photo"
      onError={onError}
    />,
  );
  const image = screen.getByRole("img", { name: "Team photo" });
  expect(ref.current).toBe(image);
  expect(image).toHaveAttribute("loading", "lazy");
  expect(image).toHaveAttribute("data-status", "loading");
  fireEvent.error(image);
  expect(image).toHaveAttribute("src", "/fallback.png");
  expect(image).toHaveAttribute("data-status", "loading");
  fireEvent.error(image);
  expect(image).toHaveAttribute("data-status", "error");
  expect(onError).toHaveBeenCalledTimes(2);
  fireEvent.load(image);
  expect(image).toHaveAttribute("data-status", "loaded");
});

it("exposes Navbar landmarks, the current page and a disclosure menu that closes on navigation", async () => {
  const user = userEvent.setup();
  const onOpenChange = vi.fn();
  const view = render(
    <Navbar.Root onOpenChange={onOpenChange}>
      <Navbar.Brand>Dixy</Navbar.Brand>
      <Navbar.Content>
        <Navbar.Item>
          <Navbar.Link href="#docs" active>
            Docs
          </Navbar.Link>
        </Navbar.Item>
      </Navbar.Content>
      <Navbar.Toggle />
      <Navbar.Menu>
        <Navbar.Item>
          <Navbar.Link href="#themes">Themes</Navbar.Link>
        </Navbar.Item>
      </Navbar.Menu>
    </Navbar.Root>,
  );
  expect(screen.getByRole("banner")).toHaveClass("dixy-navbar");
  expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  const toggle = screen.getByRole("button", { name: "Menu" });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  await user.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.anything());
  await user.click(screen.getByRole("link", { name: "Themes" }));
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
  expect((await audit(view.container)).violations).toEqual([]);
});
