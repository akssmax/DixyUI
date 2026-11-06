import "@dixy-ui/react/materials.css";
import { Toast, Button, Stack, type ToastRootProps } from "@dixy-ui/react";

type Props = Pick<
  ToastRootProps,
  "size" | "variant" | "radius" | "material"
> & { disabled?: boolean };
function Notifications({ disabled, size, variant, radius, material }: Props) {
  const manager = Toast.useToastManager();
  return (
    <Stack gap="md">
      <Button
        disabled={disabled}
        onClick={() =>
          manager.add({
            title: "Project saved",
            description: "Your changes are ready.",
            type: "success",
          })
        }
      >
        Save project
      </Button>
      <Toast.Portal>
        <Toast.Viewport>
          {manager.toasts.map((toast) => (
            <Toast.Root
              size={size}
              variant={variant}
              radius={radius}
              material={material}
              key={toast.id}
              toast={toast}
            >
              <Toast.Content>
                <Toast.Title />
                <Toast.Description />
              </Toast.Content>
              <Toast.Close aria-label="Dismiss notification" />
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
    </Stack>
  );
}
export default function ToastExample({
  disabled = false,
  size = "md",
  variant = "outline",
  radius,
  material,
}: Props) {
  return (
    <Toast.Provider>
      <Notifications
        disabled={disabled}
        size={size}
        variant={variant}
        radius={radius}
        material={material}
      />
    </Toast.Provider>
  );
}
