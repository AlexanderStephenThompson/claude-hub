---
name: code-quality
description: Non-negotiable code quality standards for testing, structure, naming, error handling, and documentation
---

# Code Quality Standards

> Non-negotiable code quality standards. These are not preferences — they are requirements.

---

## Testing Standards

### The Testing Pyramid

| Layer | What it Tests | Speed | Purpose |
|-------|---------------|-------|---------|
| **Unit Tests** | Individual functions/components | Fast | TDD lives here. Catches logic errors early. |
| **Integration Tests** | Components working together | Medium | Catches connection and data flow issues. |
| **E2E Tests** | Full user flows | Slowest | Confirms the system does the thing. |
| **Human Review** | Visual correctness, UX | Manual | Irreducible quality judgment. |

### Test-Driven Development (TDD)

**TDD is mandatory at the unit test level:**

1. **Tests are written BEFORE implementation** — Never implement without a failing test first
2. **Red -> Green -> Refactor is mandatory** — No exceptions
3. **Tests define behavior** — Implementation serves tests
4. **Small incremental steps** — Tiny, safe changes over large speculative edits
5. **Tests are the source of truth** — If it's not tested, it doesn't work

**When in doubt:** Slow down, write the test, make the smallest possible change.

### What Makes a Good Test

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

**Tests must be:**
- **Isolated** — No test depends on another test's state or execution order
- **Deterministic** — Same input, same result. No randomness, no clock dependency, no network calls.
- **Fast** — Unit tests run in milliseconds. If they're slow, they're not unit tests.
- **Readable** — A failing test name should tell you what broke without reading the test body

### Unit Tests
- Foundation of testing
- Run in milliseconds
- Test one function/component in isolation
- Mock external dependencies, not internal logic

### Integration Tests
- Verify modules work together
- Use test databases or containers, not mocks
- Reset state between tests

### E2E Tests
- Critical user paths only
- Keep the suite small and focused
- Accept some flakiness, build in retries

### Human Review
- Does it work correctly?
- Does it look right?
- Does it feel good?
- Is it accessible?

---

## Code Structure

### Early Returns Over Nesting

Guard clauses first. Flatten control flow.

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

**Max nesting depth: 3 levels.** If deeper, extract to a function.

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

## Error Handling

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

## Naming Conventions

Names must clearly communicate:
1. **Who is acting** — The subject performing the action
2. **What action is occurring** — The verb describing the behavior
3. **Direction of data or ownership flow** — Where things are going to/from

### Directional Clarity

Use prepositions (`to`, `from`, `into`, `onto`) or named parameters.

**Bad — Ambiguous:**
```python
shop.buy_item(item_id, buyer)      # Who is buying?
transfer(amount, account)           # Transfer to or from?
```

**Good — Clear:**
```python
shop.sell_item_to(item_id, buyer)  # Shop sells TO buyer
shop.sell(item_id, to=buyer)       # Named parameter clarifies
transfer_from(account, amount)      # Direction explicit
account.transfer_to(other, amount)  # Direction in method name
```

### The Read-Aloud Test

If a method call doesn't read naturally when spoken aloud, the name is wrong.

```python
# "shop buy item buyer" — confusing
shop.buy_item(item_id, buyer)

# "shop sell item to buyer" — clear
shop.sell_item_to(item_id, buyer)
```

### Boolean Naming

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

### Naming Patterns

| Pattern | Use When | Example |
|---------|----------|---------|
| `verb_noun_to(target)` | Action flows to target | `send_message_to(user)` |
| `verb_noun_from(source)` | Action flows from source | `receive_payment_from(customer)` |
| `noun.verb_to(target)` | Object performs action toward target | `cart.transfer_to(order)` |
| `verb(noun, to=target)` | Named parameter clarifies | `assign(task, to=developer)` |

### Avoid

| Don't | Instead |
|-------|---------|
| Single letters (except loop `i`, `j`) | Full descriptive name |
| Abbreviations (`cust_id`) | `customer_id` |
| Generic names (`data`, `list`, `temp`) | `user_data`, `order_list` |
| Negated booleans (`is_not_disabled`) | `is_enabled` |

---

## Constants & Clarity

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

## Documentation

### Docstrings

**Docstrings are living documentation.** Public APIs must be self-explanatory without reading implementation.

#### Required Elements

Every public function, method, and class must include:

1. **Purpose** — What it does (one line)
2. **Parameters** — Each parameter with type and meaning
3. **Returns** — What is returned and when
4. **Side effects** — Any state changes, I/O, or mutations
5. **Errors** — What exceptions/errors can occur
6. **Examples** — Realistic usage showing common cases

#### Example Docstring

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

#### Docstring Rules

- Examples should mirror actual test scenarios
- Update docstrings when behavior changes
- Treat docstrings as first-class code, not decoration

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

- [ ] Tests written BEFORE implementation
- [ ] Red -> Green -> Refactor followed
- [ ] Each test has one concept, Arrange-Act-Assert structure
- [ ] Tests are isolated, deterministic, fast
- [ ] All tests pass, edge cases covered
- [ ] Functions are short, single-responsibility
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

---

## References

- `references/testing-reference.md` — Testing pyramid deep-dive, mocking guidelines, anti-patterns
- `references/naming-reference.md` — Complete naming conventions, abbreviation rules, domain naming
- `references/error-handling-reference.md` — Error hierarchies, retry/fallback patterns, error boundaries

## Assets

- `assets/tdd-checklist.md` — Step-by-step TDD workflow checklist
- `assets/docstring-templates.md` — Copy-paste docstring templates (Python, JS/TS, C#, Rust, Go)
- `assets/code-review-checklist.md` — Comprehensive code review checklist

## Scripts

- `scripts/check_naming.py` — Validate naming conventions across any codebase
- `scripts/check_complexity.py` — Check function length, nesting depth, parameter count
