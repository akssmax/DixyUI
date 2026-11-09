import { Tool, type ToolState } from "@dixy-ui/react/ai";
import "@dixy-ui/react/ai.css";

export default function ToolExample({
  state = "output-available",
  defaultOpen = false,
}: {
  state?: ToolState;
  defaultOpen?: boolean;
}) {
  return (
    <div style={{ width: "min(100%, 28rem)" }}>
      <Tool.Root defaultOpen={defaultOpen}>
        <Tool.Header name="get_forecast" state={state} />
        <Tool.Content>
          <Tool.Input>{{ city: "Lisbon", days: 2 }}</Tool.Input>
          {state === "output-available" ? (
            <Tool.Output>
              {{ saturday: "17°, rain", sunday: "18°, clouds" }}
            </Tool.Output>
          ) : null}
          {state === "output-error" ? (
            <Tool.Error>
              403: the weather service refused the request.
            </Tool.Error>
          ) : null}
        </Tool.Content>
      </Tool.Root>
    </div>
  );
}
