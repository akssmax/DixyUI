import { Tabs } from "@dixy-ui/react";
import {
  agentPrompt,
  installCommand,
  packageManagers,
  usePackageManager,
  type PackageManager,
  type PromptTheme,
} from "../lib/install";
import { skinCatalog } from "../lib/theme-playground";
import { useAppAppearance } from "./app-appearance-provider";
import { CodeBlock } from "./code-block";

/** The theme the visitor is wearing, so a copied prompt sets up that one. */
export function usePromptTheme(): PromptTheme | undefined {
  const { docsTheme } = useAppAppearance();
  const skin = skinCatalog.find((entry) => entry.id === docsTheme.skin);
  return skin
    ? { slug: skin.slug, symbol: skin.symbol, name: skin.name }
    : undefined;
}

export function PackageManagerTabs({
  label = "Package manager",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [manager, setManager] = usePackageManager();
  return (
    <Tabs.Root
      value={manager}
      onValueChange={(value) => setManager(value as PackageManager)}
      size="sm"
      className={className}
    >
      <Tabs.List aria-label={label}>
        {packageManagers.map((name) => (
          <Tabs.Tab key={name} value={name}>
            {name}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
    </Tabs.Root>
  );
}

/** Install command with a package-manager switch; the choice is shared site-wide. */
export function InstallCommand({ packages }: { packages?: string[] }) {
  const [manager] = usePackageManager();
  return (
    <CodeBlock
      language="shellscript"
      filename="terminal"
      toolbar={<PackageManagerTabs className="install-tabs" />}
      copyLabel="Copy install command"
      code={installCommand(manager, packages)}
    />
  );
}

/** The agent prompt, shown in full and copyable. */
export function AgentPrompt() {
  const [manager] = usePackageManager();
  const theme = usePromptTheme();
  return (
    <CodeBlock
      language="text"
      filename="prompt for your coding agent"
      copyLabel="Copy prompt for your coding agent"
      code={agentPrompt(manager, theme)}
      collapsible
      collapsedLines={9}
    />
  );
}
