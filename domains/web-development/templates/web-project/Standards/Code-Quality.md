# Code Quality Standards

**Version:** 2.0
**Last Updated:** 2026-02-09

> Non-negotiable code quality standards for all agents. These are not preferences—they are requirements.

---

## Table of Contents

1. [Structure](#1-structure) - 3-tier architecture
2. [Code Structure](#2-code-structure) - Functions, nesting, clarity
3. [Strict Test Standards](#3-strict-test-standards) - Test-Driven Development (TDD)
4. [Naming Conventions](#4-naming-conventions) - Clear, directional naming
5. [Constants & Clarity](#5-constants--clarity) - No magic values
6. [Error Handling](#6-error-handling) - Fail fast, fail specifically
7. [Docstrings](#7-docstrings) - Living documentation

---

## 1. Structure
The code base should be genuinely enjoyable to work in, with a clear, consistent structure that makes sense at a glance.
Always respect the 3-tier architecture:

```
01-presentation/  <- UI layer (React components, pages, styles)
02-logic/         <- Business logic (services, use cases, API)
03-data/          <- Data persistence (repositories, models)
Config/           <- Cross-cutting configuration
```

**Directory Structure Rules**

```
# Components should have this structure:
/01-presentation/components/
  Button/
    ├── Button.tsx           # Component
    ├── Button.test.tsx      # Tests
    ├── Button.css           # Styles (if not using CSS-in-JS)
    └── index.ts             # Re-export

# Services follow this pattern:
/02-logic/services/
  ├── UserService.ts
  ├── UserService.test.ts
  └── types.ts             # Service-specific types

# Repositories follow this pattern:
/03-data/repositories/
  ├── UserRepository.ts
  └── UserRepository.test.ts
```


**Before creating any file:**
1. Ask: "Which tier does this belong to?"
2. Verify: "Am I importing from a valid dependency direction?"
3. Check: "Is this business logic masquerading as a component?"

**Valid dependency flow:** Presentation -> Logic -> Data
**Invalid:** Data -> Logic | Logic -> Presentation

---

## 2. Code Structure

### Early Returns Over Nesting

Guard clauses first. Flatten control flow. Max nesting depth: 3 levels.

**Bad — nested, hard to follow:**
```python
def process(order):
    if order:
        if order.items:
            if order.is_valid:
                return calculate_total(order)
    return None
```

**Good — flat, clear:**
```python
def process(order):
    if not order:
        return None
    if not order.items:
        return None
    if not order.is_valid:
        return None

    return calculate_total(order)
```

If deeper than 3 levels, extract to a function.

### Function Size

A function should do one thing. If you need a comment to separate "sections" inside a function, those sections should be separate functions.

**Guidelines:**
- If a function exceeds ~30 lines, look for extraction opportunities
- If a function takes more than 3-4 parameters, it's probably doing too much
- If you can't name the function clearly, it has too many responsibilities

### Single Responsibility

Every function, class, and module should have one reason to change.

**Smell:** "This function handles validation AND formatting AND saving."
**Fix:** Three functions — `validate`, `format`, `save`.

### Explicit Over Clever

Readability beats brevity. Separate operations into clear steps.

**Bad — clever but hard to debug:**
```python
names = [u.name for u in users if u.is_active and u.role in allowed]
```

**Good — clear intent, debuggable:**
```python
active_users = filter_active(users)
authorized_users = filter_by_role(active_users, allowed)
names = extract_names(authorized_users)
```

When a one-liner requires mental parsing, break it apart. Optimize for the reader, not the writer.

---

## 3. Test-Driven Development: 4-Layer Validation

> **See also:** [Naming Conventions](#4-naming-conventions) for test file naming.

### The TDD Principle

Tests are written **before** implementation code. All tests should fail initially — that's the point. The tests define what you're building. Then you write the minimum code to make them pass. Layers 1-3 are automated and written before code. Layer 4 is the final human gate after everything else is green.

```
Layer 1: Unit Tests          — Does the logic work?
Layer 2: Integration Tests   — Do the pieces connect?
Layer 3: Behavioral Tests    — Does the flow work?
Layer 4: Human Verification  — Does it actually feel right?
```

The cycle for each acceptance criterion:
1. **Red** — Write failing tests (Layers 1-2, Layer 3 if UI)
2. **Green** — Write minimal code to pass
3. **Refactor** — Clean up while keeping tests green
4. **Verify** — Layer 4 manual check after all automated layers pass

When in doubt: **slow down, write the test, and make the smallest possible change.**

### Layer 1 — Unit Tests (does the logic work?)

Test individual functions, calculations, state transformations, and data formatting **in isolation**. Pure input/output — given this input, do I get this output? Mock everything around the piece being tested.

These are fast, cheap, and should be the **most numerous**.

**Covers:** happy path, the specific case you're building for, and edge cases.

**Structure every test as Arrange-Act-Assert:**

```python
def test_apply_discount_reduces_total():
    # Arrange — set up the scenario
    cart = Cart(items=[Item(price=100)])
    discount = Discount(percent=20)

    # Act — perform the action under test
    cart.apply_discount(discount)

    # Assert — verify the outcome
    assert cart.total == 80
```

**One concept per test.** If a test name has "and" in it, split it into two tests.

**Name tests to describe behavior, not implementation:**

| Bad | Good |
|-----|------|
| `test_calculate` | `test_calculate_total_sums_item_prices` |
| `test_error` | `test_negative_quantity_raises_validation_error` |
| `test_user_service` | `test_deactivated_user_cannot_place_order` |

**Unit tests must be:**
- **Isolated** — No test depends on another test's state or execution order
- **Deterministic** — Same input, same result. No randomness, no clock dependency, no network calls
- **Fast** — Run in milliseconds. If they're slow, they're not unit tests
- **Readable** — A failing test name should tell you what broke without reading the test body

### Layer 2 — Integration Tests (do the pieces connect?)

Test how multiple pieces work together. These catch the "works alone, breaks together" problems.

**What to test:**
- API calls return expected shapes and status codes
- Components render with correct props
- Database queries return the right data
- Hooks and state management wire up properly
- Modules pass data between each other correctly
- 3-tier boundaries work (presentation calls logic, logic calls data)

**Volume:** Moderate — cover the boundaries between modules and layers, not every combination.

### Layer 3 — Behavioral Tests (does the flow work?)

Test the full user-facing flow end-to-end using automated tools (Playwright or similar). Simulate real interactions — click this, expect that, navigate here, form submits correctly, data appears where it should.

**What to test:**
- The primary user flow for the feature being built
- Adjacent flows that could regress from the changes
- Error states the user would actually encounter

**Volume:** Minimal — these are slower and more brittle. Only test critical paths. E2E sprawl leads to slow, flaky test suites.

**When to write:** Required for features with `ui` scope. Optional but recommended for `api`-only features (test via HTTP client instead of browser).

### Layer 4 — Human Verification (does it actually feel right?)

Everything automated tests **literally cannot judge**: does it look correct visually, does the animation feel smooth, does the UX make intuitive sense, does the data on screen match real-world expectations, does it work on your actual device and screen size.

**After Layers 1-3 pass**, generate a **specific** manual checklist based on what changed — not generic checks:
- Touched a chart component? Ask the human to eyeball the chart
- Touched an API integration? Ask them to verify real data flows through
- Touched layout? Ask them to check it at their actual screen width
- Touched a form? Ask them to submit with real data and verify the result

**Layer 4 is the final gate.** See the `/Feature` command for how this is generated per-feature.

### Layer Summary

| Layer | What | When | Volume | Written |
|-------|------|------|--------|---------|
| **1. Unit** | Pure logic, isolated | Before implementation | Heavy | Before code (TDD) |
| **2. Integration** | Boundaries, wiring | Before implementation | Moderate | Before code (TDD) |
| **3. Behavioral** | User flows, E2E | Before implementation | Minimal | Before code (TDD) |
| **4. Human** | Visual, UX, feel | After Layers 1-3 pass | Per-change | Generated checklist |

---

## 4. Naming Conventions

Names must clearly communicate:

1. **Who is acting** — The subject performing the action
2. **What action is occurring** — The verb describing the behavior
3. **Direction of data or ownership flow** — Where things are going to/from

### 4.1 Avoid Directional Ambiguity

Use prepositions (`to`, `from`, `into`, `onto`) or named parameters to clarify direction.

**Bad — Ambiguous:**
```python
shop.buy_item(item_id, buyer)      # Who is buying? Shop or buyer?
transfer(amount, account)           # Transfer to or from?
```

**Good — Clear:**
```python
shop.sell_item_to(item_id, buyer)  # Shop sells TO buyer
shop.sell(item_id, to=buyer)       # Named parameter clarifies
transfer_from(account, amount)      # Direction explicit
account.transfer_to(other, amount)  # Direction in method name
```


### 4.2 The Read-Aloud Test

If a method call does not read naturally when spoken aloud, the name is wrong.

```python
# Read this aloud: "shop buy item buyer"  — confusing
shop.buy_item(item_id, buyer)

# Read this aloud: "shop sell item to buyer" — clear
shop.sell_item_to(item_id, buyer)
```

### 4.3 Naming Patterns

| Pattern | Use When | Example |
|---------|----------|---------|
| `verb_noun_to(target)` | Action flows to target | `send_message_to(user)` |
| `verb_noun_from(source)` | Action flows from source | `receive_payment_from(customer)` |
| `noun.verb_to(target)` | Object performs action toward target | `cart.transfer_to(order)` |
| `verb(noun, to=target)` | Named parameter clarifies | `assign(task, to=developer)` |

### 4.4 Boolean Naming

Always prefix booleans with `is`, `has`, `should`, `can`, `will`, or `did`:

```python
# Bad — ambiguous (is it a noun? a verb? a state?)
active = True
permission = True
refresh = True

# Good — clearly a yes/no question
is_active = True
has_permission = True
should_refresh = True
```

### 4.5 Avoid

| Don't | Instead |
|-------|---------|
| Single letters (except loop `i`, `j`) | Full descriptive name |
| Abbreviations (`cust_id`) | `customer_id` |
| Generic names (`data`, `list`, `temp`) | `user_data`, `order_list` |
| Negated booleans (`is_not_disabled`) | `is_enabled` |

### 4.6 Files

> **See also:** [Structure](#1-structure) for directory organization within the 3-tier architecture.

| File Type | Convention | Example |
|-----------|------------|---------|
| **Components** | PascalCase | `Button.tsx`, `UserProfile.tsx` |
| **Pages** | PascalCase | `Dashboard.tsx`, `Login.tsx` |
| **Services** | PascalCase + "Service" | `EmailService.ts`, `AuthService.ts` |
| **Repositories** | PascalCase + "Repository" | `UserRepository.ts`, `OrderRepository.ts` |
| **Use Cases** | camelCase (verb-first) | `registerUser.ts`, `createOrder.ts` |
| **Utils** | camelCase | `formatDate.ts`, `validateEmail.ts` |
| **Types** | PascalCase | `User.ts`, `Order.ts` |
| **Tests** | Same as source + `.test` | `UserService.test.ts` |
| **Styles** | kebab-case | `button.css`, `user-profile.css` |
| **Config** | camelCase | `database.ts`, `email.ts` |

---

## 5. Constants & Clarity

### No Magic Values

Every number and string literal should have a name.

**Bad:**
```python
if retry_count > 3:
    sleep(60)
```

**Good:**
```python
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 60

if retry_count > MAX_RETRIES:
    sleep(RETRY_DELAY_SECONDS)
```

### Boolean Parameters

Boolean arguments hide meaning at the call site.

**Bad — what does `True` mean?**
```python
create_user(data, True, False)
```

**Good — named parameters or options:**
```python
create_user(data, send_welcome=True, require_verification=False)
```

If the language doesn't support named parameters, use an options object/struct.

---

## 6. Error Handling

### Fail Fast

Validate inputs at the boundary. Don't let bad data travel deep into the system.

```python
def create_user(email, name):
    if not email:
        raise ValidationError("Email is required")
    if not is_valid_email(email):
        raise ValidationError("Invalid email format")

    return save_user(email, name)
```

### Specific Errors Over Generic

Catch what you expect. Re-raise what you don't.

**Bad — swallows everything:**
```python
try:
    do_risky_thing()
except Exception:
    pass
```

**Good — handles what it understands:**
```python
try:
    do_risky_thing()
except NetworkError:
    return retry()
except ValidationError as e:
    return error_response(e.message)
# Unexpected errors propagate up
```

### Never Swallow Errors

If you catch an error, you must either:
1. **Handle it** — take a meaningful recovery action
2. **Log and re-raise it** — make the failure visible
3. **Transform it** — wrap in a more specific error for the caller

Empty `catch` / `except` blocks are bugs.

---

## 7. Docstrings

> **See also:** Documentation Standards for complete documentation requirements.

**Docstrings Are Living Documentation**
- Examples should mirror actual test scenarios
- Update docstrings when behavior changes
- Docstrings are as important as the implementation
- Treat them as **first-class code**, not decoration

Public APIs must be **self-explanatory without reading implementation**.

### Required Elements

Every public function, method, and class must include:

1. **Purpose** — What it does (one line)
2. **Parameters** — Each parameter with type and meaning
3. **Returns** — What is returned and when
4. **Side effects** — Any state changes, I/O, or mutations
5. **Errors** — What exceptions/errors can occur
6. **Examples** — Realistic usage showing common cases

### Example Docstring

```python
def sell_item_to(self, item_id: str, buyer: Customer) -> Receipt:
    """Sell an item from shop inventory to a customer.

    Transfers ownership of the item from the shop to the buyer,
    processes payment, and updates inventory.

    Args:
        item_id: Unique identifier of the item to sell.
        buyer: Customer purchasing the item. Must have sufficient balance.

    Returns:
        Receipt containing transaction details and timestamp.

    Raises:
        ItemNotFoundError: If item_id doesn't exist in inventory.
        InsufficientBalanceError: If buyer can't afford the item.
        ItemAlreadySoldError: If item was sold between check and purchase.

    Examples:
        Basic sale:
        >>> shop = Shop(inventory=[item])
        >>> buyer = Customer(balance=100)
        >>> receipt = shop.sell_item_to(item.id, buyer)
        >>> assert receipt.amount == item.price
        >>> assert item.id not in shop.inventory

        Handling insufficient balance:
        >>> poor_buyer = Customer(balance=0)
        >>> shop.sell_item_to(item.id, poor_buyer)
        Raises InsufficientBalanceError
    """
```

### Comments

| Do Comment | Don't Comment |
|------------|---------------|
| **Why** — intent, business reason, non-obvious context | **What** — the code already says this |
| Non-obvious gotchas or edge cases | Obvious operations |
| Complex algorithm summaries | Bad code to explain it (fix the code instead) |
| TODO with ticket/issue reference | TODO without context |

**If you need a comment to explain what code does, the code should be clearer.** Rename variables, extract functions, simplify logic — then the comment becomes unnecessary.

---

## Quick Reference

- [ ] Layer 1 (Unit): Logic tested in isolation, edge cases covered
- [ ] Layer 2 (Integration): Boundaries and wiring verified
- [ ] Layer 3 (Behavioral): User flows pass end-to-end (if `ui` scope)
- [ ] Layer 4 (Human): Change-specific manual verification passed
- [ ] Red -> Green -> Refactor followed for Layers 1-3
- [ ] Each test has one concept, Arrange-Act-Assert structure
- [ ] Tests are isolated, deterministic, fast
- [ ] Functions are short (~30 lines), single-responsibility
- [ ] Max 3 levels of nesting, early returns used
- [ ] Errors fail fast at boundaries with specific types
- [ ] No empty catch/except blocks
- [ ] Names pass the read-aloud test
- [ ] Directional clarity in method names (to/from)
- [ ] Booleans prefixed with is/has/should/can
- [ ] No abbreviations, no generic names
- [ ] No magic numbers or strings — constants extracted
- [ ] Boolean parameters use named args or options
- [ ] All public APIs have complete docstrings
- [ ] Comments explain why, not what
