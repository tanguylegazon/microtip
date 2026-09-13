# microtip

A lightweight standalone tooltip component for plain web projects.

## Overview

microtip is a small, framework-agnostic tooltip system for web interfaces.
It is designed to be integrated with local files and used with a minimal HTML contract.

## Features

- Single global tooltip element created at runtime
- Passive tooltips for hover-capable pointers
- Passive tooltips available from the keyboard
- Active toggle tooltips for intentional user interaction, including touch devices
- Support for tooltip targets added after initialization
- Automatic viewport-aware positioning with directional arrow support
- No dependency on a framework, build step, or external runtime

## Installation

Copy `tooltip.css` and `tooltip.js` into the target project, then include them in the document.

```html
<link rel="stylesheet" href="path/to/tooltip.css">
<script src="path/to/tooltip.js" defer></script>
```

Or use the distribution branch through jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tanguylegazon/microtip@dist/tooltip.min.css">
<script src="https://cdn.jsdelivr.net/gh/tanguylegazon/microtip@dist/tooltip.min.js" defer></script>
```

Replace `dist` with a commit hash when the integration must remain immutable.

## Usage

Passive tooltip:

```html
<button class="tooltip" data-tooltip="Saved locally">Save</button>
```

Passive tooltips open on hover and keyboard focus. When `data-tooltip` is used,
the tooltip is linked to its target with `aria-describedby` while visible.
Keep tooltip text concise and supplementary; the target must retain an accessible
name of its own. Use a focusable target when the content must be available to
keyboard users.

Active tooltip (on click):

```html
<button type="button" class="tooltip" data-tooltip="Tooltip content"
        data-tooltip-trigger="toggle" aria-expanded="false">
    More information
</button>
```

Active tooltips are useful when the same information must be available on touch
devices. Tooltip content is plain text and must not contain interactive elements.

Targets added after initialization are supported.

## Customization

Override the public custom properties on `.ui-tooltip`:

```css
.ui-tooltip {
    --tooltip-background: Canvas;
    --tooltip-border-color: currentColor;
    --tooltip-color: CanvasText;
    --tooltip-arrow-size: 10px;
    --tooltip-z-index: 80;
}
```

## Compatibility

- Modern browsers with support for `closest`, `matchMedia`, optional chaining, and `color-mix()`
- Hover tooltips are limited to devices with a fine pointer and hover capability
- Hover tooltips remain visible while the pointer moves between the target and bubble
- Toggle tooltips work on both pointer and touch interactions
- Reduced-motion and forced-colors preferences are respected

## License

This project is licensed under the terms of the MIT License. See the [LICENSE](LICENSE) file for details.
