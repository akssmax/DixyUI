import "@dixy-ui/react/materials.css";
import { useState, type FormEvent } from "react";
import {
  Button,
  Dialog,
  Form,
  Field,
  TextField,
  type DialogPopupProps,
} from "@dixy-ui/react";

interface DialogExampleProps extends Pick<
  DialogPopupProps,
  "size" | "variant" | "radius" | "material"
> {}

export default function DialogExample({
  size = "md",
  variant = "outline",
  radius,
  material,
}: DialogExampleProps) {
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState("");
  function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("project"));
    setCreated(name);
    setOpen(false);
  }
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 14 }}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger render={<Button />}>
          Create a project <span aria-hidden="true">↗</span>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup
              size={size}
              variant={variant}
              radius={radius}
              material={material}
            >
              <Dialog.Title>A little space for a big idea.</Dialog.Title>
              <Dialog.Description>
                Give your next project a name. You can always change it later.
              </Dialog.Description>
              <Form onSubmit={createProject}>
                <Field.Root>
                  <Field.Label>Project name</Field.Label>
                  <TextField
                    name="project"
                    defaultValue="My next big thing"
                    required
                  />
                </Field.Root>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                    gap: 8,
                    marginTop: 24,
                  }}
                >
                  <Dialog.Close
                    render={<Button variant="ghost" color="neutral" />}
                  >
                    Cancel
                  </Dialog.Close>
                  <Button type="submit">Create project</Button>
                </div>
              </Form>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
      <span
        style={{
          font: "var(--dixy-font-body-sm)",
          letterSpacing: "var(--dixy-font-body-sm-letter-spacing)",
          color: "var(--dixy-text-muted)",
          textAlign: "center",
        }}
        role="status"
      >
        {created
          ? `“${created}” is ready to begin.`
          : "One task. A little more focus."}
      </span>
    </div>
  );
}
