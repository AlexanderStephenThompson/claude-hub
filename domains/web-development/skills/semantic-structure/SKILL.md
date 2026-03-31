---
name: semantic-structure
description: Document structure and page outline — landmarks, headings, document-level tags, and meta elements
user-invocable: false
---

# Semantic Structure Skill

**Version:** 1.0

> The document's structure is its skeleton. Get it right and everything — accessibility, SEO, maintainability — follows naturally.

## The Problem

AI agents default to `<div>` for every container because it renders the same visually. The result is a flat, meaningless document where screen readers can't navigate by landmark, search engines can't parse sections, and developers can't tell a sidebar from a footer without reading class names. Each session adds more structural ambiguity, and no amount of ARIA can compensate for a missing skeleton.

## Consumption

- **Builders:** Read `## Builder Checklist` before writing any page layout or component hierarchy. Structure decisions are hard to fix later — get them right from the start.
- **Refactorers:** Use `## Enforced Rules` to find structural violations. Read narrative sections for correct element selection and landmark placement.
- **Both:** Narrative sections are the authoritative standard. Checklist and rules table are compressed views of the same content.

---

## Scope and Boundaries

**This skill covers:**
- Document-level elements (`<html>`, `<head>`, `<body>`, `<title>`, `<meta>`)
- Landmark elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<section>`, `<article>`)
- Heading hierarchy (`<h1>`–`<h6>`)
- Generic containers (`<div>`, `<span>`) and when they're appropriate
- Content separation (`<br>`, `<hr>`)

**Defers to other skills:**
- `semantic-content`: Content and media elements (images, lists, tables, text formatting)
- `semantic-interaction`: Interactive elements (buttons, links, forms)
- `design`: Design tokens, component states, visual layout philosophy
- `css-positioning`: Responsive breakpoints, layout patterns

**Use this skill when:** You're building page layouts, choosing between `<div>` and a landmark, or fixing heading hierarchy.

---

## Document-Level Elements

Every HTML document starts with these. They define the root, metadata, and visible container.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
</head>
<body>
  <!-- All visible content -->
</body>
</html>
```

### Rules

- **`<!DOCTYPE html>` is required** — Without it, browsers enter quirks mode.
- **`<html lang="...">`** — Always set the language. Screen readers use it for pronunciation.
- **`<title>` is required** — Every page needs one. It appears in the browser tab and is the first thing screen readers announce.
- **`<meta viewport>`** — Required for responsive design. Without it, mobile browsers render at desktop width.
- **`<meta charset="UTF-8">`** — Must be within the first 1024 bytes of the document.

### Meta and Head Data

| Element | Purpose |
|---------|---------|
| `<meta>` | Metadata — character set, viewport, SEO info |
| `<link>` | External resources — CSS, icons, fonts |
| `<style>` | Internal CSS (prefer external `<link>`) |
| `<script>` | JavaScript — inline or external |
| `<base>` | Base URL for relative links (rare) |

---

## Landmark Elements

Landmarks define the major regions of a page. Screen readers let users jump between them directly — they're the structural equivalent of a table of contents.

### Page Layout

```html
<body>
  <header>
    <!-- Site-level: logo, site name, main nav -->
  </header>

  <nav aria-label="Main navigation">
    <!-- Primary navigation links -->
  </nav>

  <main>
    <!-- The primary content of the page — one per page -->

    <article>
      <!-- Self-contained content: blog post, comment, product card -->
    </article>

    <section>
      <!-- Thematic grouping with a heading -->
      <h2>Section Title</h2>
    </section>

    <aside>
      <!-- Related but tangential: sidebar, pull quotes, ads -->
    </aside>
  </main>

  <footer>
    <!-- Site-level: copyright, legal links, contact info -->
  </footer>
</body>
```

### When to Use Each Element

| Element | Use when... | Don't use when... |
|---------|-------------|-------------------|
| `<header>` | Wrapping introductory content (site header, article header) | It's just a `<div>` with a "header" class for styling |
| `<nav>` | Containing a group of navigation links | A single link or a list of non-navigation items |
| `<main>` | Wrapping the page's primary content | There's more than one — only one `<main>` per page |
| `<article>` | Content is self-contained and independently distributable | It's just a styled card that isn't self-contained |
| `<section>` | Grouping thematically related content **with a heading** | You just need a styling hook — use `<div>` |
| `<aside>` | Content is tangentially related to surrounding content | It's a core part of the page flow |
| `<footer>` | Wrapping closing content (copyright, links, contact) | It's a "bottom section" that's really more content |

### Replacing Div-Soup

When you find divs acting as landmarks, replace them:

| Find | Replace With |
|------|-------------|
| `<div class="header">` or `<div id="header">` | `<header>` |
| `<div class="footer">` | `<footer>` |
| `<div class="nav">` or `<div class="navigation">` | `<nav>` |
| `<div class="main">` or `<div class="content">` | `<main>` |
| `<div class="sidebar">` | `<aside>` |
| `<div class="article">` or `<div class="post">` | `<article>` |
| `<div class="section">` with a heading inside | `<section>` |

**Important:** When replacing `<div class="header">` with `<header>`, check if CSS targets `.header` before removing the class. If it does, keep the class until CSS is updated.

### Multiple Landmarks of the Same Type

When a page has multiple `<nav>` or `<aside>` elements, label them so screen readers can distinguish:

```html
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Footer navigation">...</nav>

<aside aria-label="Related articles">...</aside>
<aside aria-label="Advertisements">...</aside>
```

### Generic Containers

`<div>` and `<span>` are **not wrong** — they're the correct choice when no semantic element fits:

- **`<div>`** — Block-level grouping for styling or layout. Use it for flexbox/grid wrappers that don't represent a document region.
- **`<span>`** — Inline grouping for styling a text fragment.

The problem isn't using `<div>` — it's using `<div>` *instead of* a semantic element that better describes the content.

---

## Heading Hierarchy

Headings define the document's outline. Screen readers use them for navigation — users can jump between headings to scan the page.

### Rules

1. **One `<h1>` per page** — It's the page title. In SPAs, each route/view gets one `<h1>`.
2. **Never skip levels** — `<h1>` → `<h2>` → `<h3>`, not `<h1>` → `<h3>`.
3. **Headings are for structure, not styling** — If you want big bold text without structural meaning, use `<p>` or `<span>` with a CSS class.

### Correct Hierarchy

```html
<h1>Main Page Title</h1>

  <h2>First Section</h2>
    <h3>Subsection of First</h3>
    <h3>Another Subsection</h3>

  <h2>Second Section</h2>
    <h3>Subsection</h3>
      <h4>Detail within Subsection</h4>

  <h2>Third Section</h2>
```

### Common Mistakes

| Pattern | Problem | Fix |
|---------|---------|-----|
| Multiple `<h1>` elements | Confuses document outline | Demote extras to `<h2>` |
| `<h1>` → `<h3>` (skipped level) | Screen reader users miss the gap | Insert `<h2>` or change to `<h2>` |
| Heading used for visual size | Breaks document outline | Use `<p class="text-lg">` instead |
| `<h6>` used because it's small | Implies 5 levels of nesting | Use `<p class="text-sm">` instead |
| Card titles as `<h3>` globally | Context-dependent — nesting level matters | Use the correct level for where the card appears |

### Headings in Components (React/JSX)

In component-based architectures, the correct heading level depends on where the component is rendered, not what the component "is." A card title might be `<h2>` on a listing page but `<h3>` inside a section.

Options:
- Accept a `headingLevel` prop
- Use `<p><strong>` for component-internal labels that aren't document structure

---

## Content Separation

| Element | Purpose |
|---------|---------|
| `<br>` | Line break within text (e.g., poem lines, addresses). **Not for spacing** — use CSS margin/padding. |
| `<hr>` | Thematic break between sections. Represents a shift in topic, not a decorative line. |

---

## Builder Checklist

Before writing page layout or component hierarchy:

- [ ] Document has `<!DOCTYPE html>`, `<html lang>`, `<title>`, `<meta charset>`, `<meta viewport>`
- [ ] Page has exactly one `<main>` element
- [ ] Major regions use landmark elements, not styled `<div>`s
- [ ] Multiple landmarks of the same type are labeled with `aria-label`
- [ ] Exactly one `<h1>` per page/view
- [ ] Heading levels don't skip (h1 → h2 → h3, never h1 → h3)
- [ ] Headings are used for structure, not visual styling
- [ ] `<div>` and `<span>` are only used when no semantic element fits

---

## Enforced Rules

These rules are deterministically checked by `check.js` (clean-web team). When updating these standards, update the corresponding check.js rules to match — and vice versa.

| Rule ID | Severity | What It Checks |
|---------|----------|---------------|
| `doctype-required` | error | Missing `<!DOCTYPE html>` |
| `title-required` | error | Missing `<title>` element |
| `heading-order` | warn | Heading levels that skip (h1 → h3) |
| `single-h1` | warn | Multiple `<h1>` elements per page |
