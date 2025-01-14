# vite-plugin-scss-color-palettes

[![npm](https://img.shields.io/npm/v/vite-plugin-scss-color-palettes)](https://www.npmjs.com/package/vite-plugin-scss-color-palettes)
[![GitHub license](https://img.shields.io/github/license/thomva/vite-plugin-scss-color-palettes)](https://github.com/thomva/vite-plugin-scss-color-palettes/blob/main/LICENSE)

Vite plugin for generating color palettes in scss. The css [`color-mix()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix) function is used to generate the colors and mixes each color with white and black.

## Install

```sh
npm install vite-plugin-scss-color-palettes -D
```

## Usage

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import generateScssColorPalette from 'vite-plugin-scss-color-palettes';

export default defineConfig({
  plugins: [generateScssColorPalette(options)],
});
```

## Options

The following options can be used:

### `scssFilePath`

- Type: `string`
- Default: `'./src/scss/variables/exports.module.scss'`

Where your `:export` is located. Example of `exports.module.scss`:

```scss
:export {
  color-palette-primary: rgb(0, 192, 176);
  color-palette-secondary: #209b33;
}
```

### `outputFilePath`

- Type: `string`
- Default: `'./src/scss/variables/_auto-generated-color-palettes.scss'`

Where the generated color palettes will be saved. Example of `_auto-generated-color-palettes.scss`:

```scss
$primary-100: color-mix(in srgb, rgb(0, 192, 176) 20%, white);
$primary-200: color-mix(in srgb, rgb(0, 192, 176) 40%, white);
$primary-300: color-mix(in srgb, rgb(0, 192, 176) 60%, white);
$primary-400: color-mix(in srgb, rgb(0, 192, 176) 80%, white);
$primary-500: rgb(0, 192, 176);
$primary-600: color-mix(in srgb, rgb(0, 192, 176), black 20%);
$primary-700: color-mix(in srgb, rgb(0, 192, 176), black 40%);
$primary-800: color-mix(in srgb, rgb(0, 192, 176), black 60%);
$primary-900: color-mix(in srgb, rgb(0, 192, 176), black 80%);
```

### `amount`

- Type: `number`
- Default: `20`

Amount of colors to generate per palette. The first color will be skipped, since it is always white. The actual amount of colors will be `amount - 1`.

The middle color will always be the original color (value `500`).

### `colorVariablePrefix`

- Type: `string`
- Default: `'color-palette'`

Prefix of the color palette variables in the `scssFilePath`.

### `showLogs`

- Type: `boolean`
- Default: `false`

Show logs in the console.
