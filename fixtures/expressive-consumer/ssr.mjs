import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Theme, Box, Shape, Button } from "@dixy-ui/react";
import { FeedbackProvider } from "@dixy-ui/react/feedback";
const html = renderToString(
  createElement(
    Theme,
    { personality: "playful", effects: "reduced" },
    createElement(
      FeedbackProvider,
      { enabled: true },
      createElement(
        Box,
        null,
        createElement(Shape),
        createElement(Button, null, "Save"),
      ),
    ),
  ),
);
assert.match(html, /data-material="glossy"/);
assert.match(html, /data-effects="reduced"/);
assert.match(html, /aria-hidden="true"/);
console.log(
  "Packed material, shape, personality and optional feedback exports render in SSR.",
);
