# DM Sans font files

This directory holds the self-hosted DM Sans web font files for `index.html`.

After running `npm install`, copy the required WOFF2 files from `node_modules/@fontsource/dm-sans/files/` into this directory.

The files needed are:

- `dm-sans-latin-400-normal.woff2`
- `dm-sans-latin-500-normal.woff2`
- `dm-sans-latin-700-normal.woff2`

These are referenced by the `@font-face` rules in `css/strategy.css`.

DM Sans is published under the SIL Open Font License (OFL). The licence file from the npm package should also be committed here as `dm-sans-LICENSE.txt`.

This placeholder file is removed once the font files are committed.
