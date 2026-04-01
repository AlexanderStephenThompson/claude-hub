# Unity MonoBehaviour Lifecycle Reference

## Execution Order

```
Initialization
├── Awake()         ← First call, before Start
├── OnEnable()      ← When object/component enabled
└── Start()         ← Before first Update, after all Awake

Physics Loop (FixedUpdate)
├── FixedUpdate()   ← Fixed timestep (default 0.02s)
├── [Physics]       ← Internal physics calculations
└── OnTrigger/Collision callbacks

Game Logic Loop
├── Update()        ← Once per frame
├── LateUpdate()    ← After all Update calls
└── [Rendering]     ← Internal render

Decommissioning
├── OnDisable()     ← When object/component disabled
└── OnDestroy()     ← When object destroyed
```

---

## When to Use Each

### Awake()

**First initialization. Runs once, before Start.**

Use for:
- Caching component references
- Setting up internal state
- Initializing data structures

```csharp
private Rigidbody _rb;
private Animator _animator;

void Awake()
{
    _rb = GetComponent<Rigidbody>();
    _animator = GetComponent<Animator>();
}
```

### OnEnable() / OnDisable()

**Runs when enabled/disabled. Can run multiple times.**

Use for:
- Event subscription/unsubscription
- Resetting state on re-enable
- Pool object setup/teardown

```csharp
void OnEnable()
{
    GameEvents.OnPlayerDied += HandlePlayerDeath;
}

void OnDisable()
{
    GameEvents.OnPlayerDied -= HandlePlayerDeath;
}
```

### Start()

**Runs once before first Update. After all Awake calls.**

Use for:
- Initialization that depends on other objects
- Finding objects that might not exist in Awake
- Setting initial positions/states

```csharp
void Start()
{
    // Safe to find other objects - their Awake has run
    _target = FindObjectOfType<Player>().transform;
}
```

### Update()

**Runs every frame. Variable timestep.**

Use for:
- Input handling
- Non-physics movement
- UI updates
- Game logic checks

```csharp
void Update()
{
    if (Input.GetKeyDown(KeyCode.Space))
    {
        Jump();
    }

    // Use Time.deltaTime for frame-independent movement
    transform.position += _direction * _speed * Time.deltaTime;
}
```

### FixedUpdate()

**Runs at fixed intervals. Default 50 times/second.**

Use for:
- Physics operations (Rigidbody)
- Consistent simulation
- Anything that needs fixed timestep

```csharp
void FixedUpdate()
{
    // Physics movement - no deltaTime needed
    _rb.AddForce(Vector3.up * _jumpForce);
    _rb.MovePosition(_rb.position + _velocity * Time.fixedDeltaTime);
}
```

### LateUpdate()

**Runs after all Update calls.**

Use for:
- Camera follow (after player moves)
- Anything that depends on Update results
- Final adjustments before render

```csharp
void LateUpdate()
{
    // Follow player after they've moved
    transform.position = _player.position + _offset;
}
```

---

## Object Creation Order

When instantiating objects:

```
Instantiate()
├── Object created
├── Awake() called immediately
├── OnEnable() called immediately
└── Start() called next frame (or this frame if called before Update)
```

**Important:** Start is delayed. Don't rely on Start completing before using the object.

---

## Scene Loading

```
LoadScene()
├── OnDisable() on old scene objects
├── OnDestroy() on old scene objects
├── New scene loads
├── Awake() on new objects (in hierarchy order)
├── OnEnable() on new objects
└── Start() on new objects
```

---

## Multiple Objects Execution Order

Between objects, order is **not guaranteed** by default.

To control order:
1. **Script Execution Order** (Project Settings)
2. **Manual initialization** via a manager

```csharp
// Manager controls initialization order
public class GameManager : MonoBehaviour
{
    public PlayerController player;
    public EnemySpawner spawner;

    void Awake()
    {
        player.Initialize();  // Explicit order
        spawner.Initialize();
    }
}
```

---

## Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| GetComponent in Update | Slow | Cache in Awake |
| Relying on Start order | Unpredictable | Use Awake for self-init |
| Physics in Update | Jittery | Use FixedUpdate |
| Camera follow in Update | Jittery | Use LateUpdate |
| Not unsubscribing events | Memory leaks | OnDisable -= handler |
| Using destroyed reference | NullReferenceException | Null check or OnDestroy cleanup |

---

## Checklist

- [ ] Component references cached in Awake
- [ ] Cross-object dependencies handled in Start
- [ ] Physics code in FixedUpdate
- [ ] Camera/follow code in LateUpdate
- [ ] Events subscribed in OnEnable, unsubscribed in OnDisable
- [ ] No GetComponent calls in Update/FixedUpdate
