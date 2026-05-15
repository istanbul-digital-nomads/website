import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  {
    // .claude/worktrees/ is gitignored sandbox copies of the repo left
    // behind by agent runs; eslint shouldn't recurse into them locally.
    // (Not in CI - CI checks out a clean tree.)
    ignores: [".claude/"],
  },
  // Spread the Next preset's configs directly so subsequent blocks reliably
  // override its rules (the `extends:` form in defineConfig pushes expanded
  // sub-configs to the end of the chain, which beat later overrides).
  ...nextCoreWebVitals,
  {
    rules: {
      // eslint-plugin-react-hooks 7 (shipped with eslint-config-next 16)
      // adds a battery of strict React-19 rules that flag patterns we use -
      // e.g. `useEffect(() => setState(true), [])` for mount detection,
      // refs in function components, etc. They're best-practice guidance,
      // not bugs. Drop to `warn` to keep CI green; address in a focused
      // cleanup PR.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/no-deriving-state-in-effects": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/error-boundaries": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/use-memo": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/unsupported-syntax": "warn",
      "react-hooks/incompatible-library": "warn",
      "react-hooks/component-hook-factories": "warn",
      "react-hooks/globals": "warn",
      "react-hooks/capitalized-calls": "warn",
      "react-hooks/set-state-in-render": "warn",
      "react-hooks/memoized-effect-dependencies": "warn",
      "react-hooks/exhaustive-effect-dependencies": "warn",
    },
  },
  {
    // Brand rule (CLAUDE.md): never use em dashes. Scoped to src/** so the
    // rule never lints this config file (whose selector necessarily
    // contains an em dash). The selector uses the literal character - the
    // previous — escape form silently matched every literal.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/—/]",
          message:
            "No em dashes. Use a regular dash (-) or rephrase. See CLAUDE.md.",
        },
        {
          selector: "TemplateElement[value.cooked=/—/]",
          message:
            "No em dashes. Use a regular dash (-) or rephrase. See CLAUDE.md.",
        },
      ],
    },
  },
  {
    // The design reference artboards (docs/plan/design/files/*.jsx) are
    // standalone Figma-canvas snippets loaded in a special harness that
    // exposes AmbientBar / NavBar / Footer / PhotoSlot / SectionEyebrow /
    // CommandK plus React / ReactDOM as globals. They also embed inline
    // editorial copy in JSX text where the standard unescaped-entities
    // rule for production JSX doesn't apply. Disable those rules for
    // these files instead of skipping the lint entirely.
    // (react/jsx-no-undef has no `allowGlobals` option in the current
    // plugin version - declaring globals isn't enough on its own.)
    files: ["docs/plan/design/files/**/*.{jsx,tsx}"],
    languageOptions: {
      globals: {
        React: "readonly",
        ReactDOM: "readonly",
        AmbientBar: "readonly",
        NavBar: "readonly",
        Footer: "readonly",
        PhotoSlot: "readonly",
        SectionEyebrow: "readonly",
        CommandK: "readonly",
      },
    },
    rules: {
      "react/jsx-no-undef": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]);
