---
name: semantic-content
description: Content and media markup — images, lists, tables, text formatting, and data presentation
user-invocable: false
---

# Semantic Content Skill

**Version:** 1.0

> Content markup tells the browser what information *is* — an image, a list, a definition, a date. Get the element right and browsers, screen readers, and search engines all benefit automatically.

## The Problem

AI agents reach for `<div>` and `<span>` to display content because they render fine visually. A list of items becomes three sibling `<div>`s. A data table becomes a grid of styled boxes. A definition list becomes alternating bold and normal text. The content looks right to sighted users, but screen readers can't announce "list with 5 items" or "table with 3 columns" — because the markup doesn't say that's what they are.

## Consumption

- **Builders:** Read `## Builder Checklist` before displaying content that involves images, lists, tables, or formatted text. Choosing the right element now avoids retrofitting semantics later.
- **Refactorers:** Use `## Enforced Rules` to find content markup violations. Read narrative sections for correct element selection.
- **Both:** Narrative sections are the authoritative standard. Checklist and rules table are compressed views of the same content.

---

## Scope and Boundaries

**This skill covers:**
- Images and media (`<img>`, `<video>`, `<audio>`, `<figure>`, `<figcaption>`)
- Lists (`<ul>`, `<ol>`, `<li>`)
- Definition lists (`<dl>`, `<dt>`, `<dd>`)
- Tables (`<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<th>`, `<td>`, `<caption>`)
- Text formatting (`<strong>`, `<em>`, `<mark>`, `<small>`, `<s>`, `<del>`)
- Contextual text (`<time>`, `<abbr>`, `<cite>`, `<code>`, `<pre>`, `<blockquote>`, `<q>`)
- Embedded content (`<iframe>`)
- Progress indicators (`<progress>`, `<meter>`)
- Menus (`<menu>`, `<menuitem>` — command-based, not navigation)

**Defers to other skills:**
- `semantic-structure`: Page layout, landmarks, headings
- `semantic-interaction`: Buttons, links, forms, keyboard nav, focus, ARIA patterns
- `design`: Design tokens, component states, visual layout
- `css-styling`: Design tokens, image styling patterns
- `css-positioning`: Responsive breakpoints

**Use this skill when:** You're displaying images, building lists or tables, or formatting text content.

---

## Images and Media

### Standard Image

```html
<img
  src="product.jpg"
  alt="Red leather wallet with three card slots"
  width="300"
  height="200"
  loading="lazy"
>
```

### Alt Text Rules

Every `<img>` must have an `alt` attribute. The content depends on the image's purpose:

| Image Type | Alt Text | Example |
|------------|----------|---------|
| **Informative** | Describe what the image shows | `alt="Bar chart showing sales growth from Q1 to Q4"` |
| **Decorative** | Empty alt (screen readers skip it) | `alt=""` |
| **Functional** (inside a link/button) | Describe the action | `alt="Company logo — go to homepage"` |
| **Complex** (charts, diagrams) | Summarize + provide detail elsewhere | `alt="Architecture diagram" aria-describedby="diagram-desc"` |

**Never use:** `alt="image"`, `alt="photo"`, `alt="icon"`, or the filename.

### Image with Caption

When an image has a caption, use `<figure>` and `<figcaption>`:

```html
<figure>
  <img src="chart.png" alt="Revenue doubled in Q3 after the product launch" loading="lazy">
  <figcaption>Figure 1: Annual revenue growth</figcaption>
</figure>
```

`<figure>` isn't just for images — it works for code snippets, diagrams, quotes, or any self-contained content that's referenced from the main text.

### Lazy Loading

Add `loading="lazy"` to images that aren't above the fold. This defers loading until the image nears the viewport.

```html
<!-- Above the fold (hero, logo) — load immediately -->
<img src="hero.jpg" alt="Welcome banner">

<!-- Below the fold — lazy load -->
<img src="chart.png" alt="Revenue chart" loading="lazy">
```

**Don't** add `loading="lazy"` to the first visible image (LCP candidate) — it delays initial render.

### SVG Icons

Icon-only buttons and links need accessible labels:

```html
<!-- Icon with visible text — icon is decorative -->
<button>
  <svg aria-hidden="true">...</svg>
  Search
</button>

<!-- Standalone icon — needs a label -->
<button aria-label="Close">
  <svg aria-hidden="true">...</svg>
</button>
```

### Video and Audio

```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="en" label="English">
</video>

<audio controls>
  <source src="podcast.mp3" type="audio/mpeg">
  Your browser does not support audio.
</audio>
```

- **`controls`** — Always include. Users must be able to pause/stop.
- **`<track>`** — Provide captions for video. Required for accessibility.

---

## Lists

Use list elements when 3+ sibling items represent a series. Screen readers announce "list with N items" — giving users context they can't get from a stack of divs.

### Unordered List (no meaningful order)

```html
<ul>
  <li>Feature one</li>
  <li>Feature two</li>
  <li>Feature three</li>
</ul>
```

### Ordered List (sequence matters)

```html
<ol>
  <li>Preheat oven to 350°F</li>
  <li>Mix dry ingredients</li>
  <li>Bake for 25 minutes</li>
</ol>
```

### Definition List (key-value pairs)

Use `<dl>` for term-definition or label-value data:

```html
<dl>
  <dt>Name</dt>
  <dd>Jane Smith</dd>

  <dt>Role</dt>
  <dd>Senior Engineer</dd>

  <dt>Location</dt>
  <dd>Portland, OR</dd>
</dl>
```

### Converting Div-Lists

When sibling divs represent a list, convert them:

```html
<!-- Before — divs pretending to be a list -->
<div class="menu">
  <div class="menu-item">Home</div>
  <div class="menu-item">About</div>
  <div class="menu-item">Contact</div>
</div>

<!-- After — semantic list (inside nav if it's navigation) -->
<nav>
  <ul class="menu">
    <li class="menu-item"><a href="/">Home</a></li>
    <li class="menu-item"><a href="/about">About</a></li>
    <li class="menu-item"><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

---

## Tables

Tables are for **tabular data** — information with rows and columns. Never use tables for layout.

### Complete Table

```html
<table>
  <caption>Quarterly Sales Report</caption>

  <thead>
    <tr>
      <th scope="col">Product</th>
      <th scope="col">Q1</th>
      <th scope="col">Q2</th>
      <th scope="col">Q3</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">Widget A</th>
      <td>$1,000</td>
      <td>$1,200</td>
      <td>$1,100</td>
    </tr>
    <tr>
      <th scope="row">Widget B</th>
      <td>$800</td>
      <td>$900</td>
      <td>$950</td>
    </tr>
  </tbody>

  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>$1,800</td>
      <td>$2,100</td>
      <td>$2,050</td>
    </tr>
  </tfoot>
</table>
```

### Table Rules

- **`<caption>`** — Describes the table's purpose. Screen readers announce it first.
- **`<thead>` / `<tbody>` / `<tfoot>`** — Group rows by function.
- **`<th scope="col">`** — Column headers.
- **`<th scope="row">`** — Row headers.
- **Never use `<table>` for layout** — Use CSS Grid or Flexbox.

### Converting Div-Tables

When you find a grid of divs that represents tabular data, convert it:

```html
<!-- Before — div grid -->
<div class="table">
  <div class="row">
    <div class="cell header">Name</div>
    <div class="cell header">Email</div>
  </div>
  <div class="row">
    <div class="cell">Jane</div>
    <div class="cell">jane@example.com</div>
  </div>
</div>

<!-- After — real table -->
<table>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Jane</td>
      <td>jane@example.com</td>
    </tr>
  </tbody>
</table>
```

---

## Text Formatting

### Emphasis and Importance

| Element | Meaning | Use when... |
|---------|---------|-------------|
| `<strong>` | Strong importance | The text is genuinely important (warnings, key points) |
| `<em>` | Stress emphasis | The emphasis changes the sentence meaning |
| `<b>` | Visual boldness only | Drawing attention without extra importance (lead paragraph, product name) |
| `<i>` | Visual italics only | Alternate voice (technical terms, foreign words, thoughts) |
| `<mark>` | Highlighted/relevant | Search results, referenced text |
| `<small>` | Side comment | Fine print, disclaimers, legal text |
| `<s>` / `<del>` | No longer accurate / removed | Strikethrough prices, deleted content in edits |

**Key distinction:** `<strong>` and `<em>` carry semantic weight — screen readers change voice. `<b>` and `<i>` are purely visual.

### Contextual Text

| Element | Purpose | Example |
|---------|---------|---------|
| `<time datetime="...">` | Machine-readable date/time | `<time datetime="2025-01-15">January 15, 2025</time>` |
| `<abbr title="...">` | Abbreviation with expansion | `<abbr title="HyperText Markup Language">HTML</abbr>` |
| `<cite>` | Title of a cited work | `<cite>The Design of Everyday Things</cite>` |
| `<code>` | Inline code fragment | `Use <code>console.log()</code> for debugging` |
| `<pre><code>` | Code block (preserves whitespace) | Multi-line code snippets |
| `<blockquote>` | Block-level quotation | Extended quotes from another source |
| `<q>` | Inline quotation | Short quotes within a sentence |

---

## Embedded Content and Indicators

### Iframes

```html
<iframe
  src="https://example.com/widget"
  title="Weather widget"
  loading="lazy"
></iframe>
```

- **`title` is required** — Screen readers use it to describe the embedded content.
- **`loading="lazy"`** — Defer loading for below-fold iframes.

### Progress and Meters

```html
<!-- Progress — task completion (indeterminate or percentage) -->
<label for="upload">Upload progress:</label>
<progress id="upload" value="70" max="100">70%</progress>

<!-- Meter — scalar measurement within a known range -->
<label for="disk">Disk usage:</label>
<meter id="disk" value="0.7" min="0" max="1" low="0.3" high="0.8" optimum="0.5">70%</meter>
```

| Element | Use when... |
|---------|-------------|
| `<progress>` | Showing task completion (file upload, form steps) |
| `<meter>` | Displaying a measurement within a range (disk space, score, temperature) |

---

## Builder Checklist

Before displaying content:

- [ ] Every `<img>` has an `alt` attribute (descriptive or empty for decorative)
- [ ] Below-fold images have `loading="lazy"`
- [ ] Images with captions use `<figure>` and `<figcaption>`
- [ ] Icon-only buttons/links have `aria-label`
- [ ] Series of 3+ sibling items use `<ul>` or `<ol>`, not divs
- [ ] Key-value data uses `<dl>`, not alternating divs
- [ ] Tabular data uses `<table>` with `<thead>`, `<th scope>`, and `<caption>`
- [ ] `<strong>` for importance, `<em>` for emphasis (not `<b>`/`<i>` for semantic meaning)
- [ ] Dates wrapped in `<time datetime="...">`
- [ ] Abbreviations use `<abbr title="...">`
- [ ] Iframes have a `title` attribute
- [ ] Videos have `<track>` for captions

---

## Enforced Rules

These rules are deterministically checked by `check.js` (clean-web team). When updating these standards, update the corresponding check.js rules to match — and vice versa.

| Rule ID | Severity | What It Checks |
|---------|----------|---------------|
| `img-alt-required` | error | `<img>` without `alt` attribute |
