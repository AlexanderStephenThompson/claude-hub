# Testing Reference

Comprehensive testing guide: pyramid strategy, test structure, fixtures, mocking, edge cases, and anti-patterns.

---

## The Testing Pyramid

More tests at the bottom (fast, focused), fewer at the top (slow, broad).

```
         /\
        /  \     E2E (Few)
       /----\
      /      \   Integration (Some)
     /--------\
    /          \ Unit (Many)
   /____________\
```

### Test Distribution

| Project Size | Unit | Integration | E2E |
|--------------|------|-------------|-----|
| Small | 80% | 15% | 5% |
| Medium | 70% | 20% | 10% |
| Large | 60% | 25% | 15% |

**Rule of thumb:** If E2E tests are slow or flaky, push coverage down the pyramid.

---

## Unit Tests

**Purpose:** Test individual functions/components in isolation.

**Characteristics:**
- Fast (milliseconds)
- Deterministic
- No external dependencies (mocks/stubs for boundaries)
- Heavy domain logic coverage

**What to test:**
- Pure functions with various inputs
- Edge cases and boundary conditions
- Error handling paths
- State transitions

**Best practices:**
- One assertion per test (when possible)
- Descriptive test names that read like documentation
- Arrange-Act-Assert pattern
- Test behavior, not implementation

---

## Integration Tests

**Purpose:** Verify components work together correctly.

**Characteristics:**
- Medium speed (seconds)
- May use real databases/services (test instances)
- Tests module boundaries and contracts

**What to test:**
- Database and API contracts
- Service boundaries
- External API integrations
- Data flow between layers

**Best practices:**
- Use test databases or containers (not mocks)
- Reset state between tests
- Test realistic scenarios
- Focus on contracts, not internals

---

## E2E Tests

**Purpose:** Simulate real user journeys through the entire system.

**Characteristics:**
- Slow (minutes)
- Tests full stack
- Prone to flakiness
- Most expensive to maintain

**What to test:**
- Critical user paths (sign up, login, checkout, payment)
- Happy paths first
- Cross-system flows

**Best practices:**
- Keep the suite small and focused
- Run on environments that mirror production
- Build in retries for flakiness
- Don't duplicate what unit/integration tests cover

---

## Human Review

**Purpose:** Catch what automation cannot.

**Evaluate:**
1. **Functionality** -- Does it work correctly?
2. **Visual** -- Does it look right?
3. **Feel** -- Does it feel good? (responsiveness, transitions)
4. **Accessibility** -- Keyboard navigation, screen reader compatibility

**When:** After all automated tests pass, before merging.

---

## Test Structure

### Naming Convention

```
test_[unit]_[scenario]_[expected result]
```

```python
def test_calculate_total_with_empty_cart_returns_zero():
    ...

def test_user_login_with_invalid_password_raises_auth_error():
    ...
```

### Arrange-Act-Assert (AAA)

Every test should have three distinct sections:

```python
def test_apply_discount_reduces_price():
    # Arrange
    original_price = 100.00
    discount_percent = 20

    # Act
    final_price = apply_discount(original_price, discount_percent)

    # Assert
    assert final_price == 80.00
```

Use blank lines to separate sections. For very short tests, this can be compressed, but the mental model should always be AAA.

---

## Test Quality

### One Assertion Per Test (Preferred)

Each test should verify one behavior. Multiple assertions are okay if they verify the same logical concept:

```python
# Good - single concept
def test_create_user_returns_user_with_correct_fields():
    user = create_user(name="Alice", email="alice@test.com")

    assert user.name == "Alice"
    assert user.email == "alice@test.com"
    assert user.id is not None  # All part of "correct fields"

# Bad - multiple concepts
def test_user_creation_and_retrieval():
    user = create_user(name="Alice")
    assert user.name == "Alice"       # Concept 1: creation

    retrieved = get_user(user.id)
    assert retrieved.name == "Alice"  # Concept 2: retrieval
```

### Test Behavior, Not Implementation

```python
# Good - tests behavior
def test_shopping_cart_total_includes_all_items():
    cart = ShoppingCart()
    cart.add(Item(price=10))
    cart.add(Item(price=20))

    assert cart.total == 30

# Bad - tests implementation
def test_shopping_cart_adds_to_internal_list():
    cart = ShoppingCart()
    cart.add(Item(price=10))

    assert len(cart._items) == 1  # Testing private implementation
```

### Clear Failure Messages

When a test fails, the message should tell you what went wrong:

```python
assert result == expected, f"Expected {expected}, got {result}"
```

---

## Test Organization

### File Structure

Mirror the source directory structure:

```
src/
  users/
    user_service.py
    user_model.py
tests/
  users/
    test_user_service.py
    test_user_model.py
  conftest.py           # Shared fixtures
  fixtures/
    users.json          # Test data
```

### Test Categories

Organize tests by type with markers or directories:

| Type | Runs | Speed | Scope |
|------|------|-------|-------|
| Unit | Every commit | Fast (<100ms) | Single function/class |
| Integration | PR/merge | Medium | Multiple components |
| E2E | Deploy/nightly | Slow | Full system |

---

## Fixtures & Setup

### Use Fixtures for Reusable Setup

```python
import pytest

@pytest.fixture
def user():
    """Provide a standard test user."""
    return User(id="123", name="Test User", email="test@example.com")

@pytest.fixture
def authenticated_client(user):
    """Provide an authenticated API client."""
    client = TestClient()
    client.login(user)
    return client

def test_get_profile(authenticated_client, user):
    response = authenticated_client.get("/profile")
    assert response.json()["name"] == user.name
```

### Fixture Scope

| Scope | When to Use |
|-------|-------------|
| `function` (default) | Fresh setup per test |
| `class` | Shared across test class |
| `module` | Shared across file |
| `session` | Shared across entire run |

### Factory Fixtures

For when you need variations:

```python
@pytest.fixture
def make_user():
    """Factory for creating test users."""
    def _make_user(name="Test", email=None, **kwargs):
        email = email or f"{name.lower()}@test.com"
        return User(name=name, email=email, **kwargs)
    return _make_user

def test_admin_permissions(make_user):
    admin = make_user("Admin", is_admin=True)
    regular = make_user("Regular", is_admin=False)

    assert admin.can_delete_users()
    assert not regular.can_delete_users()
```

---

## Mocking

### Mock External Dependencies, Not Your Code

```python
# Good - mock external service
@patch('myapp.services.payment_gateway.charge')
def test_checkout_calls_payment_gateway(mock_charge):
    mock_charge.return_value = {"status": "success"}

    result = checkout(cart, payment_info)

    mock_charge.assert_called_once()
    assert result.success

# Bad - mocking everything
@patch('myapp.services.cart.calculate_total')
@patch('myapp.services.cart.validate')
@patch('myapp.services.cart.save')
def test_checkout(mock_save, mock_validate, mock_total):
    ...  # Testing nothing real
```

### Use Dependency Injection

Design for testability:

```python
class OrderService:
    def __init__(self, payment_gateway, inventory_service):
        self.payment = payment_gateway
        self.inventory = inventory_service

    def place_order(self, order):
        if not self.inventory.check(order.items):
            raise OutOfStockError()
        return self.payment.charge(order.total)

# In tests
def test_place_order_checks_inventory():
    mock_inventory = Mock()
    mock_inventory.check.return_value = True
    mock_payment = Mock()

    service = OrderService(mock_payment, mock_inventory)
    service.place_order(order)

    mock_inventory.check.assert_called_with(order.items)
```

---

## Edge Cases

### Always Test

| Category | Examples |
|----------|----------|
| Empty inputs | Empty string, empty list, None |
| Boundary values | 0, 1, -1, max, min |
| Invalid inputs | Wrong type, malformed data |
| Error conditions | Network failure, timeout, missing data |

```python
class TestCalculateAverage:
    def test_with_normal_list(self):
        assert calculate_average([1, 2, 3]) == 2.0

    def test_with_empty_list_raises(self):
        with pytest.raises(ValueError):
            calculate_average([])

    def test_with_single_element(self):
        assert calculate_average([5]) == 5.0

    def test_with_negative_numbers(self):
        assert calculate_average([-1, 1]) == 0.0
```

---

## Contract Tests

For API boundaries, consider contract tests where provider and consumer both validate against a shared schema:

```python
# Provider side
def test_user_api_returns_expected_schema():
    response = client.get("/users/1")
    assert_matches_schema(response.json(), USER_SCHEMA)

# Consumer side
def test_user_client_expects_correct_schema():
    user = user_client.get_user(1)
    assert_matches_schema(user.to_dict(), USER_SCHEMA)
```

---

## Coverage

### Coverage Goals

- **Critical paths:** 100% (auth, payments, data mutations)
- **Business logic:** 90%+
- **Utilities:** 80%+
- **Boilerplate/glue:** Best effort

### Coverage Is Not Quality

High coverage doesn't mean good tests. A test that asserts nothing adds coverage but not confidence:

```python
# 100% coverage, 0% value
def test_process_data():
    process_data([1, 2, 3])  # No assertion!
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Ice cream cone | More E2E than unit tests | Push coverage down |
| Testing implementation | Brittle tests | Test behavior |
| Shared state | Flaky tests | Reset between tests |
| Over-mocking | Tests don't catch real bugs | Use real dependencies when possible |
| Slow unit tests | Feedback loop broken | Remove I/O, mock boundaries |
| Flaky tests | Unreliable signal | Fix time/order/state dependencies |
| Testing private methods | Coupled to internals | Test through the public API |
| No assertions | False confidence | Every test must assert something |
