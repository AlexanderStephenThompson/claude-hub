---
name: semantic-interaction
description: Interactive elements — buttons, links, forms, inputs, and keyboard/focus patterns
user-invocable: false
---

# Semantic Interaction Skill

**Version:** 1.0

> If a user can click it, type in it, or navigate with it — the markup must say what it is. A `<div>` with an onclick handler looks like a button but behaves like nothing to keyboards and screen readers.

## The Problem

AI agents wire click handlers to the nearest element — usually a `<div>` or `<span>` — because it works for mouse users. But keyboard users can't tab to it, screen readers don't announce it as interactive, and the browser doesn't provide focus styles, form validation, or submit behavior. Each session creates more interactive elements that only work with a mouse, silently excluding everyone else.

## Consumption

- **Builders:** Read `## Builder Checklist` before building any interactive UI — forms, buttons, toggles, navigation. Choosing the right element gives you keyboard support, focus management, and screen reader announcements for free.
- **Refactorers:** Use `## Enforced Rules` to find interaction violations. Read narrative sections for correct element selection and ARIA patterns.
- **Both:** Narrative sections are the authoritative standard. Checklist and rules table are compressed views of the same content.

---

## Scope and Boundaries

**This skill covers:**
- Buttons (`<button>`) — types, when to use
- Links (`<a>`) — when to use instead of buttons
- Forms (`<form>`, `<fieldset>`, `<legend>`)
- Form inputs (`<input>`, `<textarea>`, `<select>`, `<option>`, `<datalist>`, `<output>`)
- Labels (`<label>`) and input association
- Error messages and validation patterns
- Keyboard navigation fundamentals
- Focus management basics
- ARIA for interactive widgets (when native HTML isn't enough)

**Defers to other skills:**
- `semantic-structure`: Page layout, landmarks, headings
- `semantic-content`: Images, lists, tables, text formatting
- `design`: Component states (hover, active, focus, disabled), design tokens
- `css-styling`: Focus indicator styling, reduced motion media queries, component states

**Use this skill when:** You're building buttons, links, forms, or any element users interact with.

---

## Buttons vs Links

This is the most common mistake. The rule is simple:

| If it... | Use |
|----------|-----|
| **Goes to a URL** (navigates) | `<a href="...">` |
| **Does something** (action) | `<button type="button">` |
| **Submits a form** | `<button type="submit">` |

### Buttons

```html
<!-- Action button — most common -->
<button type="button" onclick="openModal()">Settings</button>

<!-- Submit button — inside a form -->
<form>
  <button type="submit">Save Changes</button>
</form>

<!-- Reset button — rare, use sparingly -->
<form>
  <button type="reset">Clear Form</button>
</form>
```

**Always include `type`**. Without it, `<button>` defaults to `type="submit"` — which can accidentally submit a form when you just wanted to toggle a dropdown.

### Links

```html
<!-- Navigation -->
<a href="/about">About Us</a>

<!-- Anchor link -->
<a href="#pricing">Jump to Pricing</a>

<!-- External link -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Site
</a>

<!-- Email -->
<a href="mailto:hello@example.com">Contact Us</a>
```

### Common Mistakes

```html
<!-- BAD: Clickable div — no keyboard, no screen reader, no focus -->
<div onclick="handleClick()">Click me</div>

<!-- GOOD: Proper button -->
<button type="button" onclick="handleClick()">Click me</button>

<!-- BAD: Link that does an action (no href or href="#") -->
<a onclick="openModal()">Open Settings</a>

<!-- GOOD: Button for actions -->
<button type="button" onclick="openModal()">Open Settings</button>

<!-- BAD: Button that navigates -->
<button onclick="location.href='/about'">About</button>

<!-- GOOD: Link for navigation -->
<a href="/about">About</a>
```

### JSX/React Equivalents

```jsx
// Navigation in React Router
<Link to="/products">View Products</Link>

// Action
<button type="button" onClick={handleSubmit}>Submit</button>

// BAD — div with click handler
<div className="close-btn" onClick={handleClose}>×</div>

// GOOD — button
<button type="button" className="close-btn" onClick={handleClose}>
  <span aria-hidden="true">×</span>
  <span className="sr-only">Close</span>
</button>
```

---

## Forms

### Complete Form Structure

```html
<form action="/submit" method="POST">
  <fieldset>
    <legend>Personal Information</legend>

    <div class="form-group">
      <label for="name">Full Name</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        aria-describedby="name-hint"
      >
      <small id="name-hint">Enter your legal name</small>
    </div>

    <div class="form-group">
      <label for="email">Email Address</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        aria-describedby="email-error"
      >
      <span id="email-error" class="error" role="alert" hidden>
        Please enter a valid email address
      </span>
    </div>
  </fieldset>

  <fieldset>
    <legend>Preferences</legend>

    <div class="checkbox-group">
      <input type="checkbox" id="newsletter" name="newsletter">
      <label for="newsletter">Subscribe to newsletter</label>
    </div>

    <div class="radio-group">
      <span id="contact-label">Preferred contact method:</span>
      <div role="radiogroup" aria-labelledby="contact-label">
        <input type="radio" id="contact-email" name="contact" value="email">
        <label for="contact-email">Email</label>

        <input type="radio" id="contact-phone" name="contact" value="phone">
        <label for="contact-phone">Phone</label>
      </div>
    </div>
  </fieldset>

  <button type="submit">Submit Form</button>
</form>
```

### Labels — The Most Important Rule

**Every input must have an associated label.** No exceptions.

```html
<!-- Method 1: for/id association (preferred) -->
<label for="email">Email</label>
<input type="email" id="email">

<!-- Method 2: Wrapping (also valid) -->
<label>
  Email
  <input type="email">
</label>

<!-- Method 3: aria-label (when visible label isn't desired) -->
<input type="search" aria-label="Search" placeholder="Search...">
```

**Never use placeholder as the only label.** Placeholders disappear when users start typing, leaving no label visible.

```html
<!-- BAD — placeholder as label -->
<input type="text" placeholder="Email">

<!-- GOOD — proper label + placeholder as hint -->
<label for="email">Email</label>
<input type="email" id="email" placeholder="you@example.com">
```

### Fieldsets and Legends

Group related inputs with `<fieldset>` and describe the group with `<legend>`:

- Radio button groups
- Checkbox groups
- Address blocks (street, city, state, zip)
- Multi-part fields (date: month/day/year)

### Input Types

Use the most specific type available — it triggers the right mobile keyboard and enables browser validation:

| Type | Use for | Keyboard |
|------|---------|----------|
| `text` | General text | Standard |
| `email` | Email addresses | @ key prominent |
| `tel` | Phone numbers | Numeric |
| `url` | URLs | .com key |
| `number` | Numeric values | Numeric |
| `password` | Passwords | Masked input |
| `search` | Search queries | Search key |
| `date` | Date selection | Date picker |

### Other Input Elements

| Element | Use when... |
|---------|-------------|
| `<textarea>` | Multi-line text input |
| `<select>` + `<option>` | Choosing from a fixed set of options |
| `<datalist>` + `<input>` | Autocomplete suggestions (user can still type freely) |
| `<output>` | Displaying a calculated result |

### Error Messages

Link error messages to their input with `aria-describedby`:

```html
<label for="password">Password</label>
<input
  type="password"
  id="password"
  aria-invalid="true"
  aria-describedby="password-error"
>
<p id="password-error" role="alert">
  Password must be at least 8 characters
</p>
```

- **`aria-invalid="true"`** — Tells screen readers the input has an error.
- **`aria-describedby`** — Links the error message to the input.
- **`role="alert"`** — Screen readers announce the error immediately.

### Required Fields

```html
<label for="name">
  Name
  <span aria-hidden="true">*</span>
  <span class="sr-only">(required)</span>
</label>
<input type="text" id="name" required>
```

- **`required`** — Enables browser validation.
- **Visual asterisk** — Hidden from screen readers (they read `required` attribute).
- **`sr-only` text** — Explicit for screen readers in case `required` isn't announced.

---

## Keyboard Navigation

### Fundamentals

All interactive elements must be operable with a keyboard:

| Key | Action |
|-----|--------|
| **Tab** | Move to next focusable element |
| **Shift+Tab** | Move to previous focusable element |
| **Enter** | Activate buttons and links |
| **Space** | Activate buttons, toggle checkboxes |
| **Arrow keys** | Navigate within components (tabs, radio groups, menus) |
| **Escape** | Close modals, dismiss dropdowns |

### Tab Order

Tab order should follow the visual reading order. **Never use positive `tabindex`** — it overrides the natural DOM order and creates unpredictable navigation.

```html
<!-- BAD — jumpy tab order -->
<input tabindex="3">
<input tabindex="1">
<input tabindex="2">

<!-- GOOD — natural DOM order -->
<input>
<input>
<input>
```

- **`tabindex="0"`** — Makes a non-interactive element focusable in natural order (rare, only for custom widgets).
- **`tabindex="-1"`** — Focusable via JavaScript but not via Tab (for programmatic focus management).
- **`tabindex="1+"` — Never.** Breaks tab order.

### Focus Indicators

Every focusable element must have a visible focus indicator:

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

**Never remove focus outlines** without replacing them:

```css
/* BAD */
:focus { outline: none; }

/* GOOD — only suppress for mouse, keep for keyboard */
:focus:not(:focus-visible) { outline: none; }
```

### Skip Links

For keyboard users to bypass navigation and jump to content:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<!-- ... navigation ... -->
<main id="main-content">
```

---

## ARIA for Interactive Widgets

**First rule:** Don't use ARIA if native HTML does the job. A `<button>` doesn't need `role="button"`.

Use ARIA when building custom interactive patterns that have no native HTML equivalent:

### Disclosure (show/hide)

```html
<button aria-expanded="false" aria-controls="details-panel">
  Show Details
</button>
<div id="details-panel" hidden>
  Details content here
</div>
```

### Tabs

```html
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2">Tab 2</button>
</div>
<div role="tabpanel" id="panel-1">Content 1</div>
<div role="tabpanel" id="panel-2" hidden>Content 2</div>
```

### Live Regions (dynamic updates)

```html
<!-- Polite — waits for user to finish current task -->
<div aria-live="polite" aria-atomic="true">
  Cart updated: 3 items
</div>

<!-- Assertive — interrupts immediately (use sparingly) -->
<div aria-live="assertive" role="alert">
  Session expired. Please log in again.
</div>
```

### Common ARIA Roles

| Role | Use Case |
|------|----------|
| `alert` | Important messages (errors, warnings) |
| `alertdialog` | Modal requiring user response |
| `dialog` | Modal dialogs |
| `search` | Search forms |
| `tablist`, `tab`, `tabpanel` | Tab interfaces |
| `menu`, `menuitem` | Dropdown menus |
| `status` | Non-urgent status updates |

---

## Builder Checklist

Before building interactive UI:

- [ ] Actions use `<button>`, navigation uses `<a>` — never a `<div>` with a click handler
- [ ] All `<button>` elements have a `type` attribute (`button`, `submit`, or `reset`)
- [ ] Every form input has an associated `<label>` (via `for`/`id` or wrapping)
- [ ] Placeholders supplement labels, never replace them
- [ ] Related inputs are grouped with `<fieldset>` and `<legend>`
- [ ] Required fields have the `required` attribute
- [ ] Error messages are linked to inputs with `aria-describedby`
- [ ] Input types match the data (`email`, `tel`, `url`, `number`, etc.)
- [ ] No positive `tabindex` values
- [ ] Focus indicators are visible on all interactive elements
- [ ] Modals/dropdowns close on Escape
- [ ] ARIA is used only when no native HTML element fits

---

## Enforced Rules

These rules are deterministically checked by `check.js` (clean-web team). When updating these standards, update the corresponding check.js rules to match — and vice versa.

| Rule ID | Severity | What It Checks |
|---------|----------|---------------|
| `button-type-required` | error | `<button>` without `type` attribute |
| `no-div-as-button` | warn | `<div>` or `<span>` with onclick handler |
| `tabindex-no-positive` | error | Positive `tabindex` values (breaks tab order) |
| `no-inline-style` | warn | Inline `style=` attributes in HTML |
| `no-jsx-inline-style` | warn | Inline `style={{}}` in JSX |
| `max-classes` | warn | Elements with 4+ CSS classes (class bloat) |
