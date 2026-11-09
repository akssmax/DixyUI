import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sources = [
  "theme/theme.tsx",
  "utilities/native-part.tsx",
  "utilities/aria-popover.tsx",
  ...fs
    .readdirSync(path.join(root, "packages/react/src/components"))
    .sort()
    .filter((name) => name.endsWith(".tsx") && !name.endsWith(".test.tsx"))
    .map((name) => `components/${name}`),
  "feedback.tsx",
  // The optional @dixy-ui/react/ai entry.
  ...fs
    .readdirSync(path.join(root, "packages/react/src/ai"))
    .sort()
    .filter((name) => name.endsWith(".tsx") && !name.endsWith(".test.tsx"))
    .map((name) => `ai/${name}`),
];
const configPath = path.join(root, "packages/react/tsconfig.json");
function generate() {
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    path.dirname(configPath),
  );
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  const checker = program.getTypeChecker();
  const data = {};

  for (const file of sources) {
    const source = program.getSourceFile(
      path.join(root, "packages/react/src", file),
    );
    if (!source) throw new Error(`Missing source: ${file}`);
    for (const node of source.statements) {
      if (!ts.isInterfaceDeclaration(node) || !node.name.text.endsWith("Props"))
        continue;
      // Include inherited Dixy visual fields, excluding native/third-party props.
      const ownMembers = node.members.filter(ts.isPropertySignature);
      const inheritedVisualMembers = checker
        .getPropertiesOfType(checker.getTypeAtLocation(node))
        .flatMap((symbol) =>
          (symbol.getDeclarations() ?? []).filter(
            (member) =>
              ts.isPropertySignature(member) &&
              member
                .getSourceFile()
                .fileName.endsWith("/utilities/native-part.tsx"),
          ),
        );
      const members = [
        ...new Map(
          [...inheritedVisualMembers, ...ownMembers].map((member) => [
            member.name.getText(),
            member,
          ]),
        ).values(),
      ];
      data[node.name.text] = members.map((member) => {
        const symbol = checker.getSymbolAtLocation(member.name);
        const tags = symbol?.getJsDocTags() ?? [];
        let type = checker.typeToString(
          checker.getTypeOfSymbolAtLocation(
            checker.getSymbolAtLocation(member.name),
            node,
          ),
          node,
          ts.TypeFormatFlags.InTypeAlias,
        );
        // Preserve the public spelling of complex imported types; compiler
        // expansion can include absolute local node_modules paths.
        if (type.includes('import("') && member.type)
          type = member.type.getText(member.getSourceFile());
        for (const parameter of node.typeParameters ?? []) {
          if (parameter.constraint) {
            const constraint = checker.typeToString(
              checker.getTypeFromTypeNode(parameter.constraint),
              parameter,
              ts.TypeFormatFlags.InTypeAlias,
            );
            type = type.replace(
              new RegExp(`\\b${parameter.name.text}\\b`, "g"),
              constraint,
            );
          }
        }
        return {
          name: member.name.getText(member.getSourceFile()).replaceAll('"', ""),
          type,
          required: !member.questionToken,
          description: ts.displayPartsToString(
            symbol?.getDocumentationComment(checker),
          ),
          default:
            tags
              .find((tag) => tag.name === "default")
              ?.text?.map((part) => part.text)
              .join("") ?? "—",
        };
      });
    }
  }

  const target = path.join(root, "apps/docs/src/generated/api.json");

  // Compound wrappers add no new props: derive their full part inventory and
  // primitive-owned props from the exact local exported TypeScript contract.
  // Keep per-family files separate so opening one page does not load every API.
  // Sorted: readdir order is alphabetical on macOS but arbitrary on Linux
  // (CI), and later sources win when names repeat.
  for (const filename of fs
    .readdirSync(path.join(root, "packages/react/src/components"))
    .sort()) {
    if (!filename.endsWith(".tsx") || filename.endsWith(".test.tsx")) continue;
    const source = program.getSourceFile(
      path.join(root, "packages/react/src/components", filename),
    );
    if (!source) continue;
    let primitive =
      source.text.match(
        /import \{ (Field) as PrimitiveField \} from "@base-ui\/react\/([^\"]+)"/,
      ) ??
      source.text.match(
        /import \{ (\w+) as Primitive \} from "@base-ui\/react\/([^\"]+)"/,
      );
    const aria =
      !primitive && /from ["']react-aria-components\//.test(source.text);
    if (aria) {
      const slug = filename.replace(/\.tsx$/, "");
      const name = slug
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("");
      primitive = ["", name, `aria-${slug}`];
    }
    if (!primitive) continue;
    const symbol = checker.getSymbolAtLocation(source);
    const exported =
      symbol &&
      checker
        .getExportsOfModule(symbol)
        .find((item) => item.name === primitive[1]);
    if (!exported) continue;
    const contract = checker.getTypeOfSymbolAtLocation(exported, source);
    const members = contract.getCallSignatures().length
      ? [{ name: primitive[1], type: contract, symbol: exported }]
      : contract.getProperties().map((item) => ({
          name: item.name,
          type: checker.getTypeOfSymbolAtLocation(item, source),
          symbol: item,
        }));
    const parts = members.map((part) => {
      const signature = part.type.getCallSignatures()[0];
      const parameter = signature?.getParameters()[0];
      const props = parameter
        ? checker.getTypeOfSymbolAtLocation(parameter, source).getProperties()
        : [];
      return {
        name: part.name,
        kind: /^[A-Z]/.test(part.name) && signature ? "component" : "helper",
        description: ts.displayPartsToString(
          part.symbol.getDocumentationComment(checker),
        ),
        props: props
          .filter((prop) =>
            prop
              .getDeclarations()
              ?.some(
                (declaration) =>
                  declaration
                    .getSourceFile()
                    .fileName.includes("@base-ui/react/") ||
                  (aria &&
                    /\/(react-aria-components|react-aria|react-stately|@react-types)\//.test(
                      declaration.getSourceFile().fileName,
                    )),
              ),
          )
          .map((prop) => {
            const declaration = prop.getDeclarations()?.[0];
            const tags = prop.getJsDocTags();
            return {
              name: prop.name,
              type:
                declaration?.type?.getText() ??
                checker.typeToString(
                  checker.getTypeOfSymbolAtLocation(prop, source),
                ),
              required: !(prop.flags & ts.SymbolFlags.Optional),
              description: ts.displayPartsToString(
                prop.getDocumentationComment(checker),
              ),
              default:
                tags
                  .find((tag) => tag.name === "default")
                  ?.text?.map((text) => text.text)
                  .join("") ?? "—",
            };
          }),
      };
    });
    const partTarget = path.join(
      root,
      "apps/docs/src/generated/primitives",
      `${primitive[2]}.json`,
    );
    const nextParts = `${JSON.stringify({ name: primitive[1], slug: primitive[2], ...(aria ? { engine: "React Aria" } : {}), parts }, null, 2)}\n`;
    const currentParts = fs.existsSync(partTarget)
      ? fs.readFileSync(partTarget, "utf8")
      : "";
    if (process.argv.includes("--check")) {
      if (currentParts !== nextParts)
        throw new Error(
          `Primitive API metadata is stale: ${primitive[2]}. Run pnpm docs:generate.`,
        );
    } else if (currentParts !== nextParts) {
      fs.mkdirSync(path.dirname(partTarget), { recursive: true });
      fs.writeFileSync(partTarget, nextParts);
    }
  }

  const next = `${JSON.stringify(data, null, 2)}\n`;
  const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  if (process.argv.includes("--check")) {
    if (current !== next) {
      console.error("API metadata is stale. Run pnpm docs:generate.");
      process.exit(1);
    }
    console.log("API metadata matches the local TypeScript contracts.");
  } else if (current !== next) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, next);
    console.log(`Generated ${Object.keys(data).length} local API references.`);
  }
}

generate();
if (process.argv.includes("--watch")) {
  let timer;
  fs.watch(
    path.join(root, "packages/react/src"),
    { recursive: true },
    (_event, filename) => {
      if (!filename?.endsWith(".tsx") && !filename?.endsWith(".ts")) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          generate();
        } catch (error) {
          console.error(error);
        }
      }, 150);
    },
  );
  console.log("Watching component contracts for API changes.");
}
