import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import {
  Avatar,
  Button,
  Combobox,
  Dialog,
  Field,
  Form,
  Icon,
  NumberField,
  OTPField,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Toast,
} from "@dixy-ui/react";
import { accounts, currency, payees } from "./data";

type Step = "details" | "verify";

/**
 * Two-step transfer: details (Combobox, NumberField, Select, RadioGroup),
 * then a six-digit check (OTPField). Success is announced with a Toast.
 */
export function SendMoneyDialog({ compact = false }: { compact?: boolean }) {
  const toast = Toast.useToastManager();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("details");
  const [payee, setPayee] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(25);
  const [from, setFrom] = useState(accounts[0]!.id);
  const [speed, setSpeed] = useState("standard");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function reset(next: boolean) {
    setOpen(next);
    if (!next) {
      setStep("details");
      setCode("");
      setError("");
    }
  }

  function review(event: FormEvent) {
    event.preventDefault();
    if (!payee) return setError("Choose who to pay.");
    if (!amount || amount <= 0) return setError("Enter an amount above £0.");
    setError("");
    setStep("verify");
  }

  function confirm(event: FormEvent) {
    event.preventDefault();
    if (code.length !== 6) return setError("Enter all six digits.");
    toast.add({
      title: `${currency.format(amount ?? 0)} sent`,
      description: `${payee} will see it ${speed === "instant" ? "in seconds" : "by tomorrow"}.`,
      type: "success",
    });
    reset(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={reset}>
      <Dialog.Trigger render={<Button size={compact ? "sm" : "md"} />}>
        <Icon render={<Send />} /> Send money
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup>
            {step === "details" ? (
              <>
                <Dialog.Title>Send money</Dialog.Title>
                <Dialog.Description>
                  Mock transfer. Nothing leaves this page.
                </Dialog.Description>
                <Form onSubmit={review}>
                  <Stack gap="md">
                    <Field.Root>
                      <Field.Label>To</Field.Label>
                      <Combobox.Root
                        items={payees.map((p) => p.name)}
                        value={payee}
                        onValueChange={(value) =>
                          setPayee(value as string | null)
                        }
                      >
                        <Combobox.InputGroup>
                          <Combobox.Input placeholder="Search people and payees…" />
                          <Combobox.Trigger aria-label="Show payees" />
                          <Combobox.Clear aria-label="Clear payee" />
                        </Combobox.InputGroup>
                        <Combobox.Portal>
                          <Combobox.Positioner sideOffset={8}>
                            <Combobox.Popup>
                              <Combobox.Empty>
                                No one by that name.
                              </Combobox.Empty>
                              <Combobox.List>
                                {(name: string) => {
                                  const person = payees.find(
                                    (p) => p.name === name,
                                  )!;
                                  return (
                                    <Combobox.Item key={name} value={name}>
                                      <Avatar.Root size="sm">
                                        <Avatar.Fallback>
                                          {person.initials}
                                        </Avatar.Fallback>
                                      </Avatar.Root>
                                      {name}
                                      <Text as="span" size="sm" tone="muted">
                                        {person.handle}
                                      </Text>
                                      <Combobox.ItemIndicator />
                                    </Combobox.Item>
                                  );
                                }}
                              </Combobox.List>
                            </Combobox.Popup>
                          </Combobox.Positioner>
                        </Combobox.Portal>
                      </Combobox.Root>
                    </Field.Root>

                    <NumberField.Root
                      value={amount}
                      onValueChange={setAmount}
                      min={0}
                      step={5}
                      format={{ style: "currency", currency: "GBP" }}
                    >
                      <NumberField.ScrubArea>
                        <label htmlFor="send-amount">Amount</label>
                      </NumberField.ScrubArea>
                      <NumberField.Group>
                        <NumberField.Decrement aria-label="Decrease by £5" />
                        <NumberField.Input id="send-amount" />
                        <NumberField.Increment aria-label="Increase by £5" />
                      </NumberField.Group>
                    </NumberField.Root>

                    <Field.Root>
                      <Field.Label>From</Field.Label>
                      <Select.Root
                        value={from}
                        onValueChange={(value) => value && setFrom(value)}
                        items={accounts
                          .filter((a) => a.kind !== "Investments")
                          .map((a) => ({
                            value: a.id,
                            label: `${a.name} ·· ${a.last4}`,
                          }))}
                      >
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Icon />
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Positioner sideOffset={8}>
                            <Select.Popup>
                              <Select.List>
                                {accounts
                                  .filter((a) => a.kind !== "Investments")
                                  .map((a) => (
                                    <Select.Item key={a.id} value={a.id}>
                                      <Select.ItemText>
                                        {a.name} ·· {a.last4}
                                      </Select.ItemText>
                                      <Select.ItemIndicator />
                                    </Select.Item>
                                  ))}
                              </Select.List>
                            </Select.Popup>
                          </Select.Positioner>
                        </Select.Portal>
                      </Select.Root>
                      <Field.Description>
                        Available:{" "}
                        {currency.format(
                          accounts.find((a) => a.id === from)!.balance,
                        )}
                      </Field.Description>
                    </Field.Root>

                    <RadioGroup
                      aria-label="Transfer speed"
                      value={speed}
                      onValueChange={(value) => setSpeed(value as string)}
                      className="fp-radio-list"
                    >
                      {[
                        {
                          value: "standard",
                          label: "Standard",
                          note: "Free · next working day",
                        },
                        {
                          value: "instant",
                          label: "Instant",
                          note: "£0.50 · in seconds",
                        },
                      ].map((option) => (
                        <label key={option.value} className="fp-radio">
                          <Radio.Root value={option.value}>
                            <Radio.Indicator />
                          </Radio.Root>
                          <span>
                            <Text as="span">{option.label}</Text>
                            <Text as="span" size="sm" tone="muted">
                              {option.note}
                            </Text>
                          </span>
                        </label>
                      ))}
                    </RadioGroup>

                    {error ? (
                      <Text size="sm" role="alert" className="fp-error">
                        {error}
                      </Text>
                    ) : null}

                    <div className="fp-dialog-actions">
                      <Dialog.Close
                        render={<Button variant="ghost" color="neutral" />}
                      >
                        Cancel
                      </Dialog.Close>
                      <Button type="submit">Review</Button>
                    </div>
                  </Stack>
                </Form>
              </>
            ) : (
              <>
                <Dialog.Title>Confirm it’s you</Dialog.Title>
                <Dialog.Description>
                  Sending {currency.format(amount ?? 0)} to {payee}. Type any
                  six digits, this is a mock.
                </Dialog.Description>
                <Form onSubmit={confirm}>
                  <Stack gap="md">
                    <label htmlFor="send-code" className="fp-label">
                      Security code
                    </label>
                    <OTPField.Root
                      id="send-code"
                      length={6}
                      onValueChange={setCode}
                    >
                      {Array.from({ length: 6 }, (_, index) => (
                        <OTPField.Input
                          key={index}
                          aria-label={
                            index === 0 ? undefined : `Digit ${index + 1}`
                          }
                        />
                      ))}
                    </OTPField.Root>
                    {error ? (
                      <Text size="sm" role="alert" className="fp-error">
                        {error}
                      </Text>
                    ) : null}
                    <div className="fp-dialog-actions">
                      <Button
                        type="button"
                        variant="ghost"
                        color="neutral"
                        onClick={() => {
                          setError("");
                          setStep("details");
                        }}
                      >
                        Back
                      </Button>
                      <Button type="submit" color="success">
                        Send {currency.format(amount ?? 0)}
                      </Button>
                    </div>
                  </Stack>
                </Form>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
