import { Sources } from "@dixy-ui/react/ai";
import "@dixy-ui/react/ai.css";

const sources = [
  {
    href: "https://base-ui.com/react/overview/quick-start",
    title: "Base UI: Quick start",
  },
  { href: "https://react-spectrum.adobe.com/react-aria/", title: "React Aria" },
  { href: "https://github.com/akssmax/DixyUI", title: "Dixy UI on GitHub" },
];

export default function SourcesExample({
  defaultOpen = true,
}: {
  defaultOpen?: boolean;
}) {
  return (
    <div style={{ width: "min(100%, 26rem)" }}>
      <Sources.Root defaultOpen={defaultOpen}>
        <Sources.Trigger count={sources.length} />
        <Sources.Content>
          {sources.map((source) => (
            <Sources.Source key={source.href} {...source} />
          ))}
        </Sources.Content>
      </Sources.Root>
    </div>
  );
}
