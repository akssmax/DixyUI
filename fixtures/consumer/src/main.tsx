import { createRoot } from "react-dom/client";
import { createRef } from "react";
import {
  Button,
  Dialog,
  Field,
  Heading,
  IconButton,
  Icon,
  Text,
  TextField,
  Theme,
  Container,
  Stack,
  Inline,
} from "@dixy-ui/react";
import "@dixy-ui/react/styles.css";
import { createColorPalette, colorThemeVariables } from "@dixy-ui/tokens";
const customBrand = createColorPalette([0.54, 0.18, 260]);

const buttonRef = createRef<HTMLButtonElement>();
const spanRef = createRef<HTMLSpanElement>();
const svgRef = createRef<SVGSVGElement>();
function Consumer() {
  return (
    <Theme
      appearance="dark"
      accentColor="cyan"
      neutralColor="stone"
      style={colorThemeVariables(customBrand, "dark")}
      density="comfortable"
      radius="full"
    >
      <Container as="section" size="lg" aria-label="Content">
        <Stack as="section" gap="md" aria-label="Layout">
          <Inline gap="sm">
            <Button>One</Button>
            <Button>Two</Button>
          </Inline>
        </Stack>
      </Container>
      <Heading as="h1" variant="display.sm">
        Independent consumer
      </Heading>
      <Text variant="body.md">
        A packed package, with no workspace aliases.
      </Text>
      <Field.Root>
        <Field.Label>Project name</Field.Label>
        <TextField size="lg" defaultValue="Dixy" />
        <Field.Description>
          Types and styles come from the tarball.
        </Field.Description>
      </Field.Root>
      <Button ref={buttonRef} size="sm" variant="outline">
        Start
      </Button>
      <IconButton aria-label="Confirm">
        <Icon
          render={
            <svg viewBox="0 0 24 24">
              <path d="m4 12 5 5 11-11" />
            </svg>
          }
        />
      </IconButton>
      <Icon
        ref={svgRef}
        size="2xl"
        color="success"
        label="Changes saved"
        render={
          <svg viewBox="0 0 24 24">
            <path d="m4 12 5 5 11-11" />
          </svg>
        }
      />
      <Dialog.Root>
        <Dialog.Trigger render={<Button />}>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup>
              <Dialog.Title>It works outside the monorepo.</Dialog.Title>
              <Dialog.Description>
                The entire public contract is available.
              </Dialog.Description>
              <Dialog.Close render={<Button />}>Close</Dialog.Close>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </Theme>
  );
}

// A missing accessible name must remain a type error in the published declarations.
// @ts-expect-error IconButton requires an accessible name.
const unnamedIcon = <IconButton>×</IconButton>;
void unnamedIcon;
// The ref type follows the semantic element, rather than always describing a p.
const wrongTextRef = (
  // @ts-expect-error A paragraph needs a ref with paragraph-specific properties.
  <Text as="p" ref={spanRef}>
    A typed element
  </Text>
);
void wrongTextRef;
createRoot(document.getElementById("root")!).render(<Consumer />);

// @ts-expect-error Stack uses semantic sizes, not primitive IDs.
const invalidGap = <Stack gap="200" />;
void invalidGap;

// @ts-expect-error Body styles belong to Text, not Heading.
const wrongHeadingRole = <Heading variant="body.md" />;
void wrongHeadingRole;

// @ts-expect-error Container only accepts the finite width contract.
const invalidContainer = <Container size="wide" />;
void invalidContainer;

// @ts-expect-error The application must supply an SVG element or component.
const missingArtwork = <Icon />;
// @ts-expect-error Raw dimensions are not named sizing tokens.
const invalidIconSize = <Icon size="48" render={<svg />} />;
// @ts-expect-error Text foregrounds are not icon color roles.
const invalidIconColor = <Icon color="text.primary" render={<svg />} />;
void missingArtwork;
void invalidIconSize;
void invalidIconColor;
