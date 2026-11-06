import { Table, Kbd } from "@dixy-ui/react";
import { DocsDisclosure } from "./docs-controls";
import { Button } from "@dixy-ui/react";
import { useEffect, useState } from "react";

type Prop = {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default: string;
};
type Reference = {
  name: string;
  engine?: string;
  parts: { name: string; kind: string; description: string; props: Prop[] }[];
};
const references = import.meta.glob<{ default: Reference }>(
  "../generated/primitives/*.json",
);

/** Load only the current family's reference, generated from public wrapper types. */
export function PrimitiveApi({ slug }: { slug: string }) {
  const [data, setData] = useState<Reference | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setData(null);
    setFailed(false);
    const load = references[`../generated/primitives/${slug}.json`];
    if (!load) return;
    load()
      .then((module) => {
        if (active) setData(module.default);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [slug, attempt]);
  if (failed)
    return (
      <p>
        Reference could not load.{" "}
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          onClick={() => setAttempt(attempt + 1)}
        >
          Retry
        </Button>
      </p>
    );
  if (!data) return null;
  return (
    <div className="primitive-reference">
      <p className="section-description">
        These parts and their primitive-owned props are generated from the
        installed public TypeScript contract. Native HTML attributes are
        forwarded. Generic type names refer to the corresponding owning
        primitive part.
      </p>
      {data.parts.map((part) => (
        <DocsDisclosure
          key={part.name}
          className="source-disclosure"
          summary={
            <>
              <code>
                {data.name === part.name
                  ? part.name
                  : `${data.name}.${part.name}`}
              </code>
              <span>
                {part.kind === "helper"
                  ? "Helper"
                  : `${part.props.length} primitive props`}
              </span>
            </>
          }
        >
          {part.description && (
            <p className="section-description">{part.description}</p>
          )}
          {part.props.length > 0 && (
            <div className="table-scroll">
              <Table.Root className="api-table">
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Prop</Table.Head>
                    <Table.Head>Type / description</Table.Head>
                    <Table.Head>Default</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {part.props.map((prop) => (
                    <Table.Row key={prop.name}>
                      <Table.Cell>
                        <code>
                          {prop.name}
                          {prop.required ? " *" : ""}
                        </code>
                      </Table.Cell>
                      <Table.Cell>
                        <code>{prop.type}</code>
                        <p>{prop.description}</p>
                      </Table.Cell>
                      <Table.Cell>
                        <code>{prop.default}</code>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </div>
          )}
        </DocsDisclosure>
      ))}
    </div>
  );
}
