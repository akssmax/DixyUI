import { CodeBlock } from "@dixy-ui/react/ai";
import "@dixy-ui/react/ai.css";

const examples = {
  tsx: `export function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}</p>;
}`,
  bash: "pnpm add @dixy-ui/react react-markdown remark-gfm",
  json: `{
  "name": "@dixy-ui/react",
  "exports": { "./ai": "./dist/ai.js" }
}`,
} as const;

export default function CodeBlockExample({
  language = "tsx",
}: {
  language?: "tsx" | "bash" | "json";
}) {
  return (
    <div style={{ width: "min(100%, 32rem)" }}>
      <CodeBlock code={examples[language]} language={language} />
    </div>
  );
}
