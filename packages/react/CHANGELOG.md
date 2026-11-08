# @dixy-ui/react

## 0.1.0-beta.1

### Patch Changes

- 76dd130: Package READMEs now describe the public beta, with install steps, a quick start and documentation links. Releases are published with npm provenance.
- Updated dependencies [76dd130]
  - @dixy-ui/tokens@0.1.0-beta.1

## 0.1.0-beta.0

### Minor Changes

- 0cb30c1: First public beta. Dixy's tokens, React components built on Base UI and React Aria, and the optional themes package are now MIT licensed and published to npm. APIs may still change between beta releases; every change is listed in the changelog.

### Patch Changes

- 0cb30c1: `Field` and `Dialog` are now tree-shakeable. An app that imports only `Button` drops from about 129 KiB to 17 KiB minified (React excluded), because unused Base UI dialog and field code is no longer retained.
- Updated dependencies [0cb30c1]
  - @dixy-ui/tokens@0.1.0-beta.0
