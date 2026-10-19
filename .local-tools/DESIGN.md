---
version: alpha
name: Canberra Waterproof Local Editor
colors:
  primary: "#f6b10a"
  ink: "#111c25"
  navy: "#0b1a26"
  teal: "#007c7a"
  paper: "#eef4f5"
  white: "#ffffff"
  line: "#c7d5d9"
  muted: "#50626d"
  danger: "#a32922"
typography:
  body:
    fontFamily: '"Segoe UI", "Microsoft YaHei", Arial, sans-serif'
    fontSize: "14px"
    lineHeight: "1.65"
rounded:
  control: "5px"
  dialog: "14px"
spacing:
  directory: "224px"
  inspector: "350px"
  gutter: "18px"
components:
  primary-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
---
# Local content editor

## Overview

User-approved reference: Canberra Roof Kind source editor. Reuse its three-column directory / scaled actual-page preview / Chinese inspector composition, not its React/Vite runtime or brand facts. This is a local product/admin surface, not a public-site redesign. Dense and familiar controls serve a Chinese-speaking owner editing existing paragraphs. No decorative marketing dashboard, charts or empty hero panels.

## Colors

Model B: `ui/editor.css` is the canonical local token owner. The frontmatter mirrors its `--gold`, `--ink`, `--navy`, `--teal`, `--paper`, `--white`, `--line`, `--muted`, `--danger`; primary aliases gold. Root site styling is not imported into admin controls. The preview alone loads the unchanged public stylesheet. Gold actions have dark labels; errors are text as well as colour.

## Typography

UI body follows the declared stack, Chinese fallback and 1.65 line height. Inspector long paragraphs use 1.9. Display is restrained 18–21px semibold. Full English text is available, read only, below Chinese input.

## Layout

224px directory, flexible actual-site canvas, 350px inspector. At 1190px inspector moves below; at 700px all panels flow vertically. The form uses document scrolling and grows with content. Only the directory list and scaled preview own bounded scrolling. No full-document viewport-height lock. Native select popup geometry is explicitly accepted.

## Elevation & Depth

Simple borders separate work areas. Dialogs use an opaque white surface and dark backdrop. Global scrollbars inherit the tokenized standard and WebKit fallback with a forced-colours reset.

## Shapes

5px control corners and 14px dialog corners. No repeated card shells around paragraphs.

## Components

Shared save/status/error/dialog owners are in `ui/editor.js`. Native select, input, textarea, dialog own keyboard interaction. Existing paragraph markup is edited in one accessible rich textbox; inline links remain intact. Server-side validation is authoritative. Loading and save feedback stay in fixed header slots. No automatic translation or deployment.

## Do's and Don'ts

- Keep native controls, visible focus, Chinese UI, and a keyboard field-list alternative to point-selection.
- Preserve paragraph boundaries, inline links, images and source bytes.
- Do not mark English synced when only a Chinese draft exists.
- Do not replace user drafts on source conflicts or publish local tooling.
