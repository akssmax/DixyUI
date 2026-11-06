import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Fingerprint,
  Layers,
  Palette,
} from "lucide-react";
import {
  Button,
  Field,
  TextField,
  Theme,
  type ThemeProps,
} from "@dixy-ui/react";
import { DixyMark } from "../components/dixy-mark";
import { CodeBlock } from "../components/code-block";

export const Route = createFileRoute("/")({ component: Overview });

function Overview() {
  const [accent, setAccent] = useState<ThemeProps["accentColor"]>("violet");
  const [created, setCreated] = useState(false);
  return (
    <div className="overview-page">
      <div className="overview-hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> A CONSIDERED FOUNDATION
          </div>
          <h1>
            Good interfaces.
            <br />A little more
            <br />
            <em>character.</em>
            <span className="hero-mark">
              <DixyMark size={42} />
            </span>
          </h1>
          <p>
            Expressive React components. Accessible foundations. Thoughtful
            details, all the way down.
          </p>
          <div className="hero-actions">
            <Link to="/docs/installation" className="hero-primary">
              Start building
              <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/docs/components/$component"
              params={{ component: "button" }}
              className="hero-secondary"
            >
              Explore components
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="hero-caption">
            <span>React + TypeScript</span>
            <span>Powered by Base UI</span>
          </div>
        </div>
        <div className="hero-art">
          <span className="art-note">A SMALL IDEA, TAKING SHAPE</span>
          <div className="art-sheet art-sheet-back" />
          <div className="art-sheet art-sheet-middle" />
          <Theme
            appearance="light"
            accentColor={accent}
            className="hero-sample"
          >
            <div className="sample-eyebrow">
              <DixyMark size={21} />
              <span>YOUR NEXT CHAPTER</span>
              <span className="sample-dots">···</span>
            </div>
            <h2>
              Make room for
              <br />
              something good.
            </h2>
            <p>A little space for your next big idea.</p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setCreated(true);
              }}
            >
              <Field.Root>
                <Field.Label>Project name</Field.Label>
                <TextField
                  name="project"
                  placeholder="A very good idea"
                  required
                  onValueChange={() => setCreated(false)}
                />
              </Field.Root>
              <Button type="submit" style={{ width: "100%", marginTop: 16 }}>
                {created ? (
                  <>
                    <Check size={15} />A new beginning
                  </>
                ) : (
                  <>
                    Create project
                    <ArrowUpRight size={15} />
                  </>
                )}
              </Button>
              <span className="sr-only" role="status">
                {created ? "Project created locally in this example." : ""}
              </span>
            </form>
            <div className="sample-footer">
              <span>Yours, down to the details.</span>
              <div className="accent-swatches" aria-label="Sample accent color">
                {(["violet", "blue", "green"] as const).map((color) => (
                  <Button
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    key={color}
                    style={{
                      background:
                        color === "violet"
                          ? "#7043ce"
                          : color === "blue"
                            ? "#285fc5"
                            : "#237454",
                    }}
                    aria-label={`Use ${color} accent`}
                    aria-pressed={accent === color}
                    onClick={() => setAccent(color)}
                  >
                    {accent === color && <Check size={10} />}
                  </Button>
                ))}
              </div>
            </div>
          </Theme>
          <span className="art-footnote">
            <span>01 — COMPOSE, DON’T COMPROMISE</span>
            <span>↗</span>
          </span>
        </div>
      </div>
      <div className="principle-strip">
        <span>
          <Fingerprint size={17} />
          Accessible at the foundation
        </span>
        <span>
          <Palette size={17} />A theme that feels like you
        </span>
        <span>
          <Code2 size={17} />
          Built to be understood
        </span>
      </div>
      <section className="overview-section">
        <div className="overview-section-title">
          <div>
            <span className="eyebrow">THE FIRST BUILDING BLOCKS</span>
            <h2>Small parts. Open possibilities.</h2>
          </div>
          <span className="collection-count">04 component families</span>
        </div>
        <div className="component-cards">
          <div className="component-card">
            <div className="card-preview button-card-preview">
              <Button onClick={() => setCreated(!created)}>
                Let’s make something
                <ArrowUpRight size={14} />
              </Button>
              <Button variant="soft" size="sm">
                With a little character
              </Button>
            </div>
            <Link
              to="/docs/components/$component"
              params={{ component: "button" }}
            >
              <div>
                <h3>Button</h3>
                <p>Give the next step a little clarity.</p>
              </div>
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="component-card">
            <div className="card-preview">
              <Field.Root style={{ width: 240 }}>
                <Field.Label>Your next big thing</Field.Label>
                <TextField placeholder="It starts here…" />
              </Field.Root>
            </div>
            <Link
              to="/docs/components/$component"
              params={{ component: "text-field" }}
            >
              <div>
                <h3>Text Field</h3>
                <p>Make a little room for input.</p>
              </div>
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="component-card">
            <div className="card-preview dialog-card-preview">
              <div className="mini-dialog">
                <span className="mini-dialog-dot" />
                <strong>A moment of focus.</strong>
                <span>A thoughtful space for the task at hand.</span>
                <div>
                  <i />
                  <i />
                </div>
              </div>
            </div>
            <Link
              to="/docs/components/$component"
              params={{ component: "dialog" }}
            >
              <div>
                <h3>Dialog</h3>
                <p>Bring what matters to the front.</p>
              </div>
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="component-card">
            <div className="card-preview type-card-preview">
              <span>
                Aa<span>↗</span>
              </span>
              <p>The right words. The right weight.</p>
            </div>
            <Link
              to="/docs/components/$component"
              params={{ component: "typography" }}
            >
              <div>
                <h3>Typography</h3>
                <p>A voice for every level of hierarchy.</p>
              </div>
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="overview-bottom">
        <div>
          <span className="eyebrow">LESS SETUP. MORE MAKING.</span>
          <h2>A familiar starting point.</h2>
          <p>Install a package. Add a theme. Start composing.</p>
          <Link to="/docs/installation" className="inline-link">
            Walk through the setup
            <ArrowRight size={14} />
          </Link>
        </div>
        <CodeBlock
          code={
            'import "@dixy-ui/react/styles.css";\nimport { Theme, Button } from "@dixy-ui/react";\n\nexport function App() {\n  return (\n    <Theme accentColor="violet">\n      <Button>Make something good ↗</Button>\n    </Theme>\n  );\n}'
          }
        />
      </section>
      <Link to="/docs/learning" className="learning-banner">
        <div className="learning-banner-icon">
          <Layers size={25} />
        </div>
        <div>
          <span className="eyebrow">A DESIGN ENGINEERING JOURNEY</span>
          <h2>Don’t just use it. Understand it.</h2>
          <p>Follow the decisions, tradeoffs, and lessons behind the system.</p>
        </div>
        <ArrowUpRight size={24} />
      </Link>
    </div>
  );
}
