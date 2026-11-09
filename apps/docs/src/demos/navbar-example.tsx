import { Button, Navbar } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

const links = ["Docs", "Components", "Themes"];

export default function NavbarExample({
  size = "md",
  variant = "outline",
  radius,
  material,
  collapseBelow = "md",
}: {
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "soft" | "ghost";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  material?: "matte" | "glossy" | "soft" | "metal" | "paper";
  collapseBelow?: "sm" | "md" | "lg" | "never";
}) {
  const items = links.map((label, index) => (
    <Navbar.Item key={label}>
      <Navbar.Link
        href={`#${label.toLowerCase()}`}
        active={index === 0}
        onClick={(event) => event.preventDefault()}
      >
        {label}
      </Navbar.Link>
    </Navbar.Item>
  ));
  return (
    <div style={{ width: "100%", resize: "horizontal", overflow: "auto" }}>
      <Navbar.Root
        size={size}
        variant={variant}
        radius={radius}
        material={material}
        collapseBelow={collapseBelow}
      >
        <Navbar.Brand>Dixy</Navbar.Brand>
        <Navbar.Content>{items}</Navbar.Content>
        <Navbar.Actions>
          <Button size="sm">Get started</Button>
        </Navbar.Actions>
        <Navbar.Toggle />
        <Navbar.Menu>{items}</Navbar.Menu>
      </Navbar.Root>
    </div>
  );
}
