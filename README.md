# microtip

A lightweight standalone tooltip component for plain web projects.

## Overview

microtip is a small, framework-agnostic tooltip system for web interfaces.
It is designed to be integrated with local files and used with a minimal HTML contract.

## Features

- Single global tooltip element created at runtime
- Passive tooltips for hover-capable pointers
- Active toggle tooltips for intentional user interaction, including touch devices
- Automatic viewport-aware positioning with directional arrow support
- No dependency on a framework, build step, or external runtime

## Installation

Copy `tooltip.css` and `tooltip.js` into the target project, then include them in the document.

```html
<link rel="stylesheet" href="path/to/tooltip.css">
<script src="path/to/tooltip.js"></script>
```

## Usage

Passive tooltip (on hover):

```html
<span class="tooltip" data-tooltip="Tooltip content">Label</span>
```

Active tooltip (on click):

```html
<div class="tooltip" data-tooltip="Tooltip content" data-tooltip-trigger="toggle">
    i
</div>
```

## Compatibility

- Modern browsers with support for `closest`, `matchMedia`, optional chaining, and `color-mix()`
- Hover tooltips are limited to devices with a fine pointer and hover capability
- Toggle tooltips work on both pointer and touch interactions

## License

This project is licensed under the terms of the MIT License. See the [LICENSE](LICENSE) file for details.