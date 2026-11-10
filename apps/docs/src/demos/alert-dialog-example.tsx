import { useRef, useState } from "react";
import { AlertDialog, Button, Stack, Text } from "@dixy-ui/react";
import type { AlertDialogPopupProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  AlertDialogPopupProps,
  "size" | "variant" | "radius" | "material"
> & {
  disabled?: boolean;
};

export default function AlertDialogExample({
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled = false,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [result, setResult] = useState("No action taken.");
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <AlertDialog.Root>
        <AlertDialog.Trigger
          render={<Button color="danger" disabled={disabled} />}
        >
          Delete project
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Viewport>
            <AlertDialog.Popup
              initialFocus={cancelRef}
              size={size}
              variant={variant}
              radius={radius}
              material={material}
            >
              <AlertDialog.Title>Delete this project?</AlertDialog.Title>
              <AlertDialog.Description>
                This local example never deletes data. Choose Cancel to keep
                working.
              </AlertDialog.Description>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--dixy-spacing-inline-sm)",
                  marginTop: "var(--dixy-spacing-stack-md)",
                }}
              >
                <AlertDialog.Close
                  render={
                    <Button ref={cancelRef} variant="outline" color="neutral" />
                  }
                >
                  Cancel
                </AlertDialog.Close>
                <AlertDialog.Close
                  render={<Button color="danger" />}
                  onClick={() =>
                    setResult("Deletion confirmed in this local example.")
                  }
                >
                  Confirm deletion
                </AlertDialog.Close>
              </div>
            </AlertDialog.Popup>
          </AlertDialog.Viewport>
        </AlertDialog.Portal>
      </AlertDialog.Root>
      <Text role="status" variant="body.sm">
        {result}
      </Text>
    </Stack>
  );
}
