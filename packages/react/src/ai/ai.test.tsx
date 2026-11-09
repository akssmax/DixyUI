import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, it, vi } from "vitest";
import axe from "axe-core";
import {
  completeMarkdown,
  Conversation,
  Message,
  PromptInput,
  Reasoning,
  Response,
  Sources,
  Suggestions,
  Tool,
  splitMarkdownBlocks,
  type ChatStatus,
} from "../ai";

const audit = (container: HTMLElement) =>
  axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
    },
    rules: { "color-contrast": { enabled: false } },
  });

it("closes what a partial reply leaves open, and only that", () => {
  expect(completeMarkdown("```ts\nconst a = 1")).toBe(
    "```ts\nconst a = 1\n```",
  );
  expect(completeMarkdown("Some **bold")).toBe("Some **bold**");
  expect(completeMarkdown("Some **bold** text")).toBe("Some **bold** text");
  expect(completeMarkdown("Run `pnpm")).toBe("Run `pnpm`");
  // A marker with nothing after it yet is dropped rather than printed.
  expect(completeMarkdown("Run `")).toBe("Run ");
  expect(completeMarkdown("Some **")).toBe("Some ");
  expect(completeMarkdown("~~gone")).toBe("~~gone~~");
  expect(completeMarkdown("See [the docs](https://exa")).toBe("See the docs");
  // Asterisks inside inline code are literal, not bold markers.
  expect(completeMarkdown("Use `a ** b` here")).toBe("Use `a ** b` here");
  // A closed fence is left alone; only text after it is repaired.
  expect(completeMarkdown("```\n**x\n```\nand **y")).toBe(
    "```\n**x\n```\nand **y**",
  );
});

it("splits blocks at blank lines but never inside fences or one list", () => {
  expect(splitMarkdownBlocks("One\n\nTwo")).toEqual(["One", "Two"]);
  expect(splitMarkdownBlocks("```\na\n\nb\n```\n\nAfter")).toEqual([
    "```\na\n\nb\n```",
    "After",
  ]);
  expect(splitMarkdownBlocks("- a\n\n- b\n\nAfter")).toEqual([
    "- a\n\n- b",
    "After",
  ]);
});

function Composer({
  status = "ready",
  onSubmit = () => {},
  onStop,
}: {
  status?: ChatStatus;
  onSubmit?: (text: string) => void;
  onStop?: () => void;
}) {
  return (
    <PromptInput.Root status={status} onSubmit={onSubmit} onStop={onStop}>
      <PromptInput.Textarea />
      <PromptInput.Footer>
        <PromptInput.Submit />
      </PromptInput.Footer>
    </PromptInput.Root>
  );
}

it("sends trimmed text on Enter, adds a line on Shift+Enter and clears after", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<Composer onSubmit={onSubmit} />);
  const box = screen.getByRole("textbox", { name: "Message" });
  await user.type(box, "  hello{Shift>}{Enter}{/Shift}there ");
  expect(box).toHaveValue("  hello\nthere ");
  expect(onSubmit).not.toHaveBeenCalled();
  await user.keyboard("{Enter}");
  expect(onSubmit).toHaveBeenCalledWith("hello\nthere");
  expect(box).toHaveValue("");
});

it("never sends from an Enter that confirms an IME composition", () => {
  const onSubmit = vi.fn();
  render(<Composer onSubmit={onSubmit} />);
  const box = screen.getByRole("textbox", { name: "Message" });
  fireEvent.change(box, { target: { value: "にほん" } });
  fireEvent.keyDown(box, { key: "Enter", isComposing: true });
  fireEvent.keyDown(box, { key: "Enter", keyCode: 229 });
  expect(onSubmit).not.toHaveBeenCalled();
  fireEvent.keyDown(box, { key: "Enter" });
  expect(onSubmit).toHaveBeenCalledWith("にほん");
});

it("keeps an empty send button focusable but inert, then turns it into Stop", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  const onStop = vi.fn();
  const { rerender } = render(<Composer onSubmit={onSubmit} onStop={onStop} />);
  const button = screen.getByRole("button", { name: "Send message" });
  expect(button).toHaveAttribute("aria-disabled", "true");
  button.focus();
  expect(button).toHaveFocus();
  await user.click(button);
  expect(onSubmit).not.toHaveBeenCalled();

  rerender(<Composer status="streaming" onSubmit={onSubmit} onStop={onStop} />);
  // Same element, new role: focus survives the switch.
  expect(button).toHaveFocus();
  expect(button).toHaveAccessibleName("Stop generating");
  await user.click(button);
  expect(onStop).toHaveBeenCalledTimes(1);

  // While busy, Enter drafts but does not send.
  const box = screen.getByRole("textbox", { name: "Message" });
  await user.type(box, "next{Enter}");
  expect(onSubmit).not.toHaveBeenCalled();
});

it("announces status changes once each, not every token", () => {
  function Chat({ status }: { status: ChatStatus }) {
    return (
      <Conversation.Root status={status}>
        <Conversation.Content>
          <Message.Root from="assistant">
            <Message.Content>Hi</Message.Content>
          </Message.Root>
        </Conversation.Content>
      </Conversation.Root>
    );
  }
  const { rerender } = render(<Chat status="ready" />);
  const status = screen.getByRole("status");
  expect(status).toHaveTextContent("");
  rerender(<Chat status="submitted" />);
  expect(status).toHaveTextContent("Sending");
  rerender(<Chat status="streaming" />);
  expect(status).toHaveTextContent("Responding");
  rerender(<Chat status="ready" />);
  expect(status).toHaveTextContent("Response complete");
  const log = screen.getByRole("log", { name: "Conversation" });
  expect(log).toHaveAttribute("aria-live", "off");
  expect(log).toHaveAttribute("tabindex", "0");
  expect(screen.getByRole("article", { name: "Assistant" })).toBeVisible();
});

it("renders GFM through Dixy parts and keeps raw HTML as text", () => {
  const markdown = [
    "# Title",
    "",
    "| a | b |",
    "| - | - |",
    "| 1 | 2 |",
    "",
    "```tsx",
    "const x = 1;",
    "```",
    "",
    "[Base UI](https://base-ui.com) <b>not bold</b>",
  ].join("\n");
  const { container } = render(<Response>{markdown}</Response>);
  // Heading offset: a reply's h1 sits below the page's headings.
  expect(
    screen.getByRole("heading", { level: 3, name: "Title" }),
  ).toBeVisible();
  expect(container.querySelector("table.dixy-table")).not.toBeNull();
  expect(screen.getByText("tsx")).toBeVisible();
  expect(screen.getByRole("button", { name: "Copy code" })).toBeVisible();
  const link = screen.getByRole("link", { name: "Base UI" });
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noreferrer noopener");
  expect(container.querySelector("b")).toBeNull();
});

it("marks a streaming response busy and renders the repaired partial text", () => {
  const { container } = render(<Response streaming>{"Hello **wor"}</Response>);
  const region = container.querySelector(".dixy-response")!;
  expect(region).toHaveAttribute("aria-busy", "true");
  expect(container.querySelector("strong")).toHaveTextContent("wor");
});

it("opens reasoning while it streams and closes it once afterwards", () => {
  vi.useFakeTimers();
  function Thinking({ streaming }: { streaming: boolean }) {
    return (
      <Reasoning.Root streaming={streaming}>
        <Reasoning.Trigger />
        <Reasoning.Content>Weighing options</Reasoning.Content>
      </Reasoning.Root>
    );
  }
  const { rerender } = render(<Thinking streaming />);
  const trigger = screen.getByRole("button", { name: /Thinking/ });
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  act(() => vi.advanceTimersByTime(2000));
  rerender(<Thinking streaming={false} />);
  expect(trigger).toHaveTextContent("Thought for 2 seconds");
  act(() => vi.advanceTimersByTime(1000));
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  vi.useRealTimers();
});

it("keeps the reader's choice when they toggled reasoning themselves", async () => {
  vi.useFakeTimers();
  function Thinking() {
    const [streaming, setStreaming] = useState(true);
    return (
      <>
        <button onClick={() => setStreaming(false)}>finish</button>
        <Reasoning.Root streaming={streaming}>
          <Reasoning.Trigger />
          <Reasoning.Content>Weighing options</Reasoning.Content>
        </Reasoning.Root>
      </>
    );
  }
  render(<Thinking />);
  const trigger = screen.getByRole("button", { name: /Thinking/ });
  fireEvent.click(trigger);
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(screen.getByRole("button", { name: "finish" }));
  act(() => vi.advanceTimersByTime(2000));
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  vi.useRealTimers();
});

it("labels tool states and shows input, output and errors on demand", async () => {
  const user = userEvent.setup();
  render(
    <Tool.Root>
      <Tool.Header
        name="get_forecast"
        state="output-error"
        stateLabels={{ "output-error": "Failed" }}
      />
      <Tool.Content>
        <Tool.Input>{{ city: "Lisbon" }}</Tool.Input>
        <Tool.Error>403</Tool.Error>
      </Tool.Content>
    </Tool.Root>,
  );
  const header = screen.getByRole("button", { name: /get_forecast/ });
  expect(header).toHaveTextContent("Failed");
  expect(header).toHaveAttribute("aria-expanded", "false");
  await user.click(header);
  expect(screen.getByText(/"city": "Lisbon"/)).toBeVisible();
  // Revealed by the reader, so it is not an interrupting alert.
  expect(screen.queryByRole("alert")).toBeNull();
});

it("passes axe with messages, actions, suggestions, sources and composer", async () => {
  const { container } = render(
    <main>
      <Conversation.Root status="ready">
        <Conversation.Content>
          <Message.Root from="user">
            <Message.Content>Plan a trip</Message.Content>
          </Message.Root>
          <Message.Root from="assistant">
            <Message.Avatar fallback="W" />
            <Message.Content>
              <Response>{"Here is **a plan**."}</Response>
              <Sources.Root defaultOpen>
                <Sources.Trigger count={1} />
                <Sources.Content>
                  <Sources.Source href="https://example.com" title="Example" />
                </Sources.Content>
              </Sources.Root>
            </Message.Content>
            <Message.Actions>
              <Message.Action label="Copy" tooltip={false}>
                <svg aria-hidden="true" />
              </Message.Action>
            </Message.Actions>
          </Message.Root>
        </Conversation.Content>
      </Conversation.Root>
      <Suggestions.Root>
        <Suggestions.Item suggestion="Try this" />
      </Suggestions.Root>
      <Composer />
    </main>,
  );
  expect(
    screen.getByRole("link", { name: /Example.*opens in a new tab/ }),
  ).toBeVisible();
  expect(
    screen.getByRole("toolbar", { name: "Message actions" }),
  ).toBeVisible();
  const results = await audit(container);
  expect(results.violations).toEqual([]);
});
