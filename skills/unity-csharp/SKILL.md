---
name: unity-csharp
description: C# patterns for Unity - MonoBehaviour, async, architecture
user-invocable: false
---

# Unity C# Skill

**Version:** 1.0
**Stack:** Unity, C#

> Patterns for writing clean, performant Unity C# code.

---

## Scope and Boundaries

**This skill covers:**
- MonoBehaviour lifecycle
- Unity-specific C# patterns
- Async/coroutine patterns
- ScriptableObject usage
- Event systems
- Component architecture

**Defers to other skills:**
- `unity-performance`: Optimization techniques
- `unity-shaders`: Shader code
- `vrc-udon`: VRChat-specific scripting

**Use this skill when:** Writing C# scripts for Unity.

---

## Core Principles

1. **Composition Over Inheritance** — Small, focused components.
2. **Avoid Update() When Possible** — Event-driven or coroutines instead.
3. **Cache References** — GetComponent is expensive; cache in Awake.
4. **ScriptableObjects for Data** — Decouple data from behavior.
5. **Null-Safe Access** — Unity objects can be destroyed at any time.

---

## Patterns

### Reference Caching

```csharp
public class PlayerController : MonoBehaviour
{
    // Cached references
    private Rigidbody _rb;
    private Animator _animator;

    // Serialized for inspector assignment (preferred)
    [SerializeField] private Transform _cameraTarget;

    private void Awake()
    {
        // Cache component references once
        _rb = GetComponent<Rigidbody>();
        _animator = GetComponent<Animator>();
    }

    private void FixedUpdate()
    {
        // Use cached reference, not GetComponent every frame
        _rb.AddForce(Vector3.up);
    }
}
```

### Event System

```csharp
// ScriptableObject event
[CreateAssetMenu(menuName = "Events/Game Event")]
public class GameEvent : ScriptableObject
{
    private readonly List<GameEventListener> _listeners = new();

    public void Raise()
    {
        for (int i = _listeners.Count - 1; i >= 0; i--)
            _listeners[i].OnEventRaised();
    }

    public void RegisterListener(GameEventListener listener) =>
        _listeners.Add(listener);

    public void UnregisterListener(GameEventListener listener) =>
        _listeners.Remove(listener);
}

// Listener component
public class GameEventListener : MonoBehaviour
{
    [SerializeField] private GameEvent _event;
    [SerializeField] private UnityEvent _response;

    private void OnEnable() => _event.RegisterListener(this);
    private void OnDisable() => _event.UnregisterListener(this);
    public void OnEventRaised() => _response.Invoke();
}
```

### Null-Safe Pattern

```csharp
// Unity overloads == for destroyed objects
if (_target != null)  // Correct for Unity objects
{
    _target.DoSomething();
}

// Or use null-conditional with care
_target?.DoSomething();  // Works but doesn't catch destroyed objects

// Best: explicit destroyed check
if (_target != null && !_target.Equals(null))
{
    _target.DoSomething();
}
```

### Coroutine Pattern

```csharp
private IEnumerator FadeOut(float duration)
{
    float elapsed = 0f;
    Color startColor = _renderer.material.color;

    while (elapsed < duration)
    {
        elapsed += Time.deltaTime;
        float t = elapsed / duration;
        _renderer.material.color = Color.Lerp(startColor, Color.clear, t);
        yield return null;
    }

    gameObject.SetActive(false);
}

// Usage
StartCoroutine(FadeOut(1f));
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| `GetComponent` in Update | Expensive every frame | Cache in Awake |
| `Find` or `FindObjectOfType` | Slow, fragile | Inject references or use events |
| Heavy Update loops | Performance drain | Use events, coroutines, or FixedUpdate |
| String comparisons for tags | Typo-prone, slow | Use CompareTag or constants |
| Public fields for everything | No encapsulation | Use [SerializeField] private |

---

## Checklist

- [ ] References cached in Awake
- [ ] No GetComponent in Update/FixedUpdate
- [ ] No Find methods in runtime code
- [ ] ScriptableObjects for shared data
- [ ] Events for decoupled communication
- [ ] Null checks for destroyable objects

---

## References

- `references/lifecycle.md` — MonoBehaviour lifecycle and execution order

## Assets

- `assets/component-checklist.md` — Unity component design checklist
