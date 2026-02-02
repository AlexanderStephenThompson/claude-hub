# Unity Component Design Checklist

## Script Setup

### Header
- [ ] Namespace defined
- [ ] Required components declared (`[RequireComponent]`)
- [ ] Tooltip on public/serialized fields
- [ ] Header attributes for inspector organization

```csharp
namespace MyGame.Combat
{
    [RequireComponent(typeof(Rigidbody))]
    [RequireComponent(typeof(Collider))]
    public class Projectile : MonoBehaviour
    {
        [Header("Movement")]
        [Tooltip("Speed in units per second")]
        [SerializeField] private float _speed = 10f;

        [Header("Damage")]
        [SerializeField] private int _damage = 10;
    }
}
```

---

## Field Declaration

### Serialization
- [ ] Use `[SerializeField] private` over `public`
- [ ] Hide runtime-only fields with `[HideInInspector]`
- [ ] Use `[Range]` for numeric limits
- [ ] Group related fields with `[Header]`

```csharp
[Header("Configuration")]
[SerializeField] private float _speed = 5f;
[SerializeField] [Range(0, 100)] private int _health = 100;

[Header("References")]
[SerializeField] private Transform _target;
[SerializeField] private ParticleSystem _hitEffect;

// Runtime state - not serialized
private Vector3 _velocity;
private bool _isGrounded;
```

### Naming
- [ ] Private fields prefixed with `_`
- [ ] Public properties PascalCase
- [ ] Boolean fields prefixed with `is`, `has`, `can`, `should`

---

## Initialization

### Awake
- [ ] Cache all component references
- [ ] Initialize internal state
- [ ] No external dependencies

```csharp
private Rigidbody _rb;
private Animator _animator;
private AudioSource _audio;

void Awake()
{
    _rb = GetComponent<Rigidbody>();
    _animator = GetComponent<Animator>();
    _audio = GetComponent<AudioSource>();
}
```

### Start
- [ ] Setup that depends on other objects
- [ ] Find references to scene objects
- [ ] Register with managers

```csharp
void Start()
{
    GameManager.Instance.RegisterPlayer(this);
    _spawnPoint = FindObjectOfType<SpawnPoint>().transform.position;
}
```

---

## Event Handling

### Subscription Pattern
- [ ] Subscribe in OnEnable
- [ ] Unsubscribe in OnDisable
- [ ] Never forget to unsubscribe

```csharp
void OnEnable()
{
    Health.OnDeath += HandleDeath;
    InputManager.OnJump += HandleJump;
}

void OnDisable()
{
    Health.OnDeath -= HandleDeath;
    InputManager.OnJump -= HandleJump;
}
```

---

## Null Safety

### Reference Checks
- [ ] Check SerializeField in Awake/Start
- [ ] Check before using optional references
- [ ] Handle destroyed objects

```csharp
void Awake()
{
    if (_requiredReference == null)
    {
        Debug.LogError($"Missing required reference on {gameObject.name}", this);
        enabled = false;
        return;
    }
}

void Update()
{
    // Target might be destroyed
    if (_target == null) return;

    // Or use Unity's null check
    if (!_target) return;
}
```

---

## Performance

### Update Methods
- [ ] No GetComponent in Update
- [ ] No Find methods in Update
- [ ] Cache everything used repeatedly
- [ ] Use events over polling when possible

### Memory
- [ ] No allocations in Update (new, string concat)
- [ ] Use object pooling for spawned objects
- [ ] StringBuilder for string building

```csharp
// ❌ Bad - allocates every frame
void Update()
{
    Debug.Log("Position: " + transform.position);
}

// ✅ Good - no allocations
private StringBuilder _sb = new StringBuilder();
void Update()
{
    _sb.Clear();
    _sb.Append("Position: ");
    _sb.Append(transform.position);
    Debug.Log(_sb.ToString());
}
```

---

## Public Interface

### Methods
- [ ] Clear, verb-first naming
- [ ] Validate parameters
- [ ] Return success/failure when appropriate

```csharp
public bool TryApplyDamage(int amount, DamageType type)
{
    if (amount < 0) return false;
    if (_isInvulnerable) return false;

    _health -= CalculateDamage(amount, type);
    OnDamaged?.Invoke(amount);
    return true;
}
```

### Properties
- [ ] Use for external access to private state
- [ ] Validate in setters when needed

```csharp
public int Health
{
    get => _health;
    private set => _health = Mathf.Clamp(value, 0, _maxHealth);
}
```

---

## Unity Events

### For Designer Configuration
- [ ] Use UnityEvent for inspector-configurable callbacks
- [ ] Name clearly (OnDeath, OnCollected)

```csharp
[Header("Events")]
public UnityEvent OnDeath;
public UnityEvent<int> OnDamaged;

void Die()
{
    OnDeath?.Invoke();
}
```

---

## Cleanup

### OnDestroy
- [ ] Clean up static references
- [ ] Unsubscribe from non-MonoBehaviour events
- [ ] Stop coroutines if needed

```csharp
void OnDestroy()
{
    // Unregister from singletons
    if (GameManager.Instance != null)
    {
        GameManager.Instance.UnregisterPlayer(this);
    }

    // Clean up external subscriptions
    ExternalService.OnEvent -= HandleExternalEvent;
}
```

---

## Documentation

- [ ] XML comments on public members
- [ ] Tooltip on serialized fields
- [ ] Component description in class comment

```csharp
/// <summary>
/// Handles player movement including walking, running, and jumping.
/// Requires Rigidbody and CapsuleCollider.
/// </summary>
public class PlayerMovement : MonoBehaviour
{
    /// <summary>
    /// Maximum horizontal speed in units per second.
    /// </summary>
    [Tooltip("Maximum horizontal speed in units per second")]
    [SerializeField] private float _maxSpeed = 10f;
}
```
