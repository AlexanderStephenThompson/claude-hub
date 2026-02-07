# Naming Reference

Complete naming conventions: directional patterns, boolean prefixes, variable/function/class naming, abbreviation rules, and domain-specific guidance.

---

## Core Principle

Names must communicate three things:
1. **Who is acting** -- The subject
2. **What action is occurring** -- The verb
3. **Direction of data flow** -- Where things go to/from

---

## Directional Naming Patterns

### Pattern 1: `verb_noun_to(target)`

Action flows **to** a target.

```python
send_message_to(user)
export_data_to(file)
copy_selection_to(clipboard)
dispatch_event_to(handler)
```

### Pattern 2: `verb_noun_from(source)`

Action flows **from** a source.

```python
receive_payment_from(customer)
import_data_from(file)
fetch_config_from(server)
read_bytes_from(stream)
```

### Pattern 3: `noun.verb_to(target)`

Object performs action toward target.

```python
cart.transfer_to(order)
user.send_notification_to(device)
document.export_to(pdf)
account.transfer_funds_to(recipient)
```

### Pattern 4: `verb(noun, to=target)`

Named parameter clarifies direction.

```python
assign(task, to=developer)
move(file, to=directory)
copy(data, from_source=source, to=destination)
send(email, to=recipients, cc=managers)
```

---

## The Read-Aloud Test

If you can't read the code naturally as a sentence, rename it.

| Code | Read Aloud | Verdict |
|------|------------|---------|
| `shop.buy_item(item, buyer)` | "shop buy item buyer" | Confusing |
| `shop.sell_item_to(item, buyer)` | "shop sell item to buyer" | Clear |
| `transfer(100, account)` | "transfer 100 account" | Direction unclear |
| `account.withdraw(100)` | "account withdraw 100" | Clear |
| `database.query(sql)` | "database query sql" | Clear |

---

## Variable Naming

### Booleans

Prefix with `is`, `has`, `should`, `can`, `will`, `did`:

```python
# Good
is_active = True
has_permission = user.check_permission("admin")
should_retry = attempt_count < MAX_RETRIES
can_edit = is_owner or is_admin

# Bad
active = True        # Is this a state or an action?
permission = True    # What about permission?
refresh = True       # Is this a flag or a function?
```

### Collections

Use plural nouns:

```python
# Good
users = []
order_items = []
selected_ids = set()

# Bad
user_list = []        # Redundant "list"
order_item_array = [] # Redundant "array"
selected_id_set = []  # Redundant "set"
```

### Functions

Use verb-first:

```python
# Good
def calculate_total(): ...
def fetch_user_data(): ...
def validate_input(): ...
def handle_submit(): ...

# Bad
def total(): ...             # Is this a value or action?
def user_data(): ...         # Noun, not verb
def input_validation(): ...  # Noun phrase
```

### Constants

UPPER_SNAKE_CASE for true constants:

```python
MAX_RETRY_ATTEMPTS = 3
API_BASE_URL = "https://api.example.com"
DEFAULT_TIMEOUT_MS = 5000
```

---

## Abbreviation Rules

### Never Abbreviate

```python
# Bad
usr = get_user()
btn = find_button()
msg = "Hello"
cfg = load_config()
tmp = calculate_temperature()

# Good
user = get_user()
button = find_button()
message = "Hello"
config = load_config()
temperature = calculate_temperature()
```

### Acceptable Abbreviations

Only widely-understood technical abbreviations:

| Abbreviation | Meaning | Context |
|--------------|---------|---------|
| `id` | Identifier | Universal |
| `url` | Uniform Resource Locator | Web |
| `api` | Application Programming Interface | Tech |
| `db` | Database | Backend |
| `io` | Input/Output | Systems |
| `i`, `j`, `k` | Loop counters | Loops only |

### Common Abbreviations to Flag

| Abbreviation | Use Instead |
|---|---|
| `usr` | `user` |
| `btn` | `button` |
| `msg` | `message` |
| `pwd` | `password` |
| `cfg` | `config` |
| `tmp` | `temporary` |
| `num` | `number` |
| `fn` | `function` |
| `cb` | `callback` |
| `err` | `error` |
| `req` | `request` |
| `res` | `response` |
| `val` | `value` |
| `idx` | `index` |
| `cnt` | `count` |
| `ctx` | `context` |
| `src` | `source` |
| `dst` | `destination` |
| `mgr` | `manager` |
| `svc` | `service` |
| `repo` | `repository` |
| `impl` | `implementation` |

---

## Domain-Specific Naming

Match the language of your domain:

### E-commerce
```python
cart.add_item(product)
order.calculate_subtotal()
checkout.apply_discount(coupon)
payment.process_transaction()
```

### Healthcare
```python
patient.schedule_medication(prescription)
appointment.confirm_with_provider()
record.add_diagnosis(icd_code)
```

### Finance
```python
account.credit_amount(deposit)
account.debit_amount(withdrawal)
ledger.record_transaction(entry)
portfolio.rebalance_allocations()
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| `data`, `info`, `stuff` | Too vague | Use specific noun |
| `handle`, `process`, `do` | Too generic | Use specific verb |
| `Manager`, `Handler`, `Processor` | God object smell | Split responsibilities |
| `temp`, `tmp`, `foo`, `bar` | Meaningless | Use descriptive name |
| `data1`, `data2` | Numbered variables | Use meaningful names |
| Hungarian notation (`str_name`) | Type in name | Let types be types |
| Negated booleans (`is_not_disabled`) | Double negative | Use `is_enabled` |
