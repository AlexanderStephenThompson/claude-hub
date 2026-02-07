# Docstring Templates

Copy-paste templates for Python, JavaScript/TypeScript, C#, Rust, and Go.

---

## Python (Google Style)

### Function

```python
def function_name(param1: Type1, param2: Type2) -> ReturnType:
    """Short one-line description of function.

    Longer description if needed. Explain the purpose,
    any important details about behavior, and context.

    Args:
        param1: Description of first parameter.
        param2: Description of second parameter.

    Returns:
        Description of what is returned.

    Raises:
        ErrorType: When this error occurs.
        AnotherError: When this other error occurs.

    Side Effects:
        - Describe any state changes, I/O, or mutations.

    Examples:
        Basic usage:
        >>> result = function_name(value1, value2)
        >>> assert result == expected

        Edge case:
        >>> function_name(None, value2)
        Raises ValueError
    """
```

### Class

```python
class ClassName:
    """Short one-line description of class.

    Longer description of the class purpose and behavior.
    Include important usage notes.

    Attributes:
        attr1: Description of first attribute.
        attr2: Description of second attribute.

    Examples:
        >>> obj = ClassName(param1, param2)
        >>> obj.method()
        expected_result
    """

    def __init__(self, param1: Type1, param2: Type2) -> None:
        """Initialize ClassName.

        Args:
            param1: Description of first parameter.
            param2: Description of second parameter.
        """
```

### Method

```python
def method_name(self, param: Type) -> ReturnType:
    """Short description of what method does.

    Args:
        param: Description of parameter.

    Returns:
        Description of return value.

    Raises:
        ErrorType: When error condition occurs.
    """
```

---

## TypeScript (TSDoc Style)

### Function

```typescript
/**
 * Short one-line description of function.
 *
 * Longer description if needed. Explain the purpose,
 * any important details about behavior, and context.
 *
 * @param param1 - Description of first parameter
 * @param param2 - Description of second parameter
 * @returns Description of what is returned
 * @throws {ErrorType} When this error occurs
 *
 * @example
 * Basic usage:
 * ```typescript
 * const result = functionName(value1, value2);
 * console.log(result); // expected
 * ```
 */
function functionName(param1: Type1, param2: Type2): ReturnType {
```

### Class

```typescript
/**
 * Short one-line description of class.
 *
 * Longer description of the class purpose and behavior.
 *
 * @example
 * ```typescript
 * const obj = new ClassName(param1, param2);
 * obj.method();
 * ```
 */
class ClassName {
  /** Description of property */
  property1: Type1;

  /**
   * Create a new ClassName instance.
   *
   * @param param1 - Description of first parameter
   * @param param2 - Description of second parameter
   */
  constructor(param1: Type1, param2: Type2) {
```

### Interface

```typescript
/**
 * Describes the shape of [concept].
 *
 * Used for [context/purpose].
 */
interface InterfaceName {
  /** Description of property */
  property1: Type1;

  /** Description of optional property */
  property2?: Type2;

  /**
   * Description of method.
   *
   * @param param - Description
   * @returns Description
   */
  methodName(param: Type): ReturnType;
}
```

---

## JavaScript (JSDoc Style)

### Function

```javascript
/**
 * Short one-line description of function.
 *
 * Longer description if needed.
 *
 * @param {Type1} param1 - Description of first parameter
 * @param {Type2} param2 - Description of second parameter
 * @returns {ReturnType} Description of what is returned
 * @throws {ErrorType} When this error occurs
 *
 * @example
 * const result = functionName(value1, value2);
 * // => expected
 */
function functionName(param1, param2) {
```

---

## C# (XML Doc Style)

### Method

```csharp
/// <summary>
/// Short one-line description of method.
/// </summary>
/// <remarks>
/// Longer description if needed. Explain the purpose,
/// any important details about behavior, and context.
/// </remarks>
/// <param name="param1">Description of first parameter.</param>
/// <param name="param2">Description of second parameter.</param>
/// <returns>Description of what is returned.</returns>
/// <exception cref="ErrorType">When this error occurs.</exception>
/// <example>
/// <code>
/// var result = instance.MethodName(value1, value2);
/// Assert.AreEqual(expected, result);
/// </code>
/// </example>
public ReturnType MethodName(Type1 param1, Type2 param2)
{
```

### Class

```csharp
/// <summary>
/// Short one-line description of class.
/// </summary>
/// <remarks>
/// Longer description of the class purpose and behavior.
/// </remarks>
/// <example>
/// <code>
/// var obj = new ClassName(param1, param2);
/// obj.Method();
/// </code>
/// </example>
public class ClassName
{
    /// <summary>Description of property.</summary>
    public Type1 Property1 { get; set; }
```

---

## Rust (Rustdoc Style)

### Function

```rust
/// Short one-line description of function.
///
/// Longer description if needed. Explain the purpose,
/// any important details about behavior, and context.
///
/// # Arguments
///
/// * `param1` - Description of first parameter
/// * `param2` - Description of second parameter
///
/// # Returns
///
/// Description of what is returned.
///
/// # Errors
///
/// Returns `ErrorType` when this error occurs.
///
/// # Examples
///
/// ```
/// let result = function_name(value1, value2);
/// assert_eq!(result, expected);
/// ```
///
/// # Panics
///
/// Panics if [condition].
pub fn function_name(param1: Type1, param2: Type2) -> Result<ReturnType, ErrorType> {
```

### Struct

```rust
/// Short one-line description of struct.
///
/// Longer description of the struct purpose and behavior.
///
/// # Examples
///
/// ```
/// let obj = StructName::new(param1, param2);
/// obj.method();
/// ```
pub struct StructName {
    /// Description of field.
    pub field1: Type1,

    /// Description of field.
    field2: Type2,
}
```

---

## Go (Godoc Style)

### Function

```go
// FunctionName does [short description].
//
// Longer description if needed. Explain the purpose,
// any important details about behavior, and context.
//
// It returns [description of return].
// It returns an error if [error conditions].
//
// Example:
//
//	result, err := FunctionName(value1, value2)
//	if err != nil {
//	    log.Fatal(err)
//	}
func FunctionName(param1 Type1, param2 Type2) (ReturnType, error) {
```

### Struct

```go
// StructName represents [short description].
//
// Longer description of the struct purpose and behavior.
type StructName struct {
    // Field1 is [description].
    Field1 Type1

    // Field2 is [description].
    Field2 Type2
}
```

### Interface

```go
// InterfaceName defines [short description].
//
// Longer description of the interface contract.
type InterfaceName interface {
    // MethodName does [description].
    MethodName(param Type) (ReturnType, error)
}
```

---

## Required Elements Checklist

Every public function/method must include:

- [ ] **Purpose** -- One-line description of what it does
- [ ] **Parameters** -- Each param with type and meaning
- [ ] **Returns** -- What is returned and when
- [ ] **Side Effects** -- State changes, I/O, mutations
- [ ] **Errors** -- What exceptions can occur and why
- [ ] **Examples** -- Realistic usage showing common cases

---

## When to Skip Docstrings

Docstrings may be omitted for:

- Private methods with obvious behavior
- Simple getters/setters
- Methods that override a documented parent method
- Test methods (the test name is the documentation)

**When in doubt, add the docstring.**
