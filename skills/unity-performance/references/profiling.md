# Unity Profiling Reference

## Profiler Window

### Opening
- Window > Analysis > Profiler
- Or Ctrl+7 / Cmd+7

### Key Modules

| Module | Shows | Look For |
|--------|-------|----------|
| CPU | Script execution time | Spikes, slow methods |
| GPU | Render time | Draw call bottlenecks |
| Memory | Allocation, GC | GC spikes, leaks |
| Rendering | Draw calls, batches | High batch count |
| Physics | Collision checks | Excessive contacts |

---

## Frame Debugger

**Window > Analysis > Frame Debugger**

Shows every draw call in sequence. Use to:
- See what breaks batching
- Identify redundant draws
- Debug shader issues

---

## CPU Profiling

### Reading the Timeline

```
Main Thread
├── PlayerLoop
│   ├── Update.ScriptRunBehaviourUpdate
│   │   └── YourScript.Update()  ← Your code
│   ├── PreLateUpdate.ScriptRunBehaviourLateUpdate
│   └── FixedUpdate.PhysicsFixedUpdate
└── Rendering
    └── Camera.Render
```

### Common Culprits

| Issue | Profiler Sign | Fix |
|-------|---------------|-----|
| GetComponent in Update | Repeated GC alloc | Cache in Awake |
| Find methods | Deep hierarchy time | Cache or use events |
| String concatenation | GC.Alloc | StringBuilder |
| LINQ in Update | GC.Alloc | Manual loops |
| Physics queries | Physics.* entries | Cache, use layers |

### Deep Profiling

Enable for detailed call stacks (slower):
- Profiler > CPU > toggle "Deep Profile"

For production builds:
```csharp
using UnityEngine.Profiling;

Profiler.BeginSample("MyExpensiveOperation");
DoExpensiveThing();
Profiler.EndSample();
```

---

## Memory Profiling

### Memory Profiler Package

Install from Package Manager for detailed snapshots.

### Common Memory Issues

| Issue | Sign | Fix |
|-------|------|-----|
| GC spikes | Jagged GC.Collect | Reduce allocations |
| Texture memory | Large "Texture" pool | Compress, mipmap |
| Mesh memory | Large "Mesh" pool | LODs, occlusion |
| Asset duplication | Same asset twice | Use Resources or Addressables properly |

### Zero-Allocation Patterns

```csharp
// ❌ Allocates
void Update()
{
    var enemies = FindObjectsOfType<Enemy>();
    foreach (var e in enemies.Where(e => e.IsActive))
    {
        Debug.Log($"Enemy at {e.transform.position}");
    }
}

// ✅ No allocations
private List<Enemy> _enemyCache = new List<Enemy>();
private StringBuilder _sb = new StringBuilder();

void Update()
{
    // Reuse list
    _enemyCache.Clear();
    EnemyManager.GetActiveEnemies(_enemyCache);

    foreach (var e in _enemyCache)
    {
        _sb.Clear();
        _sb.Append("Enemy at ");
        _sb.Append(e.transform.position);
        Debug.Log(_sb);
    }
}
```

---

## GPU Profiling

### Stats Window

**Game view > Stats** shows:
- FPS
- Batches (draw calls)
- Tris/Verts
- SetPass calls

### Targets

| Platform | Target Batches | Target Tris |
|----------|----------------|-------------|
| Quest | <100 | <100K |
| Mobile | <100 | <200K |
| PC VR | <200 | <1M |
| PC | <500 | <2M |

### Reducing Draw Calls

1. **Static batching** - Mark non-moving objects static
2. **GPU instancing** - Enable on materials
3. **Texture atlasing** - Combine textures
4. **Material sharing** - Same material = potential batch
5. **Occlusion culling** - Don't draw hidden objects

---

## Physics Profiling

### Physics Debugger

**Window > Analysis > Physics Debugger**

Shows:
- Collider shapes
- Contact points
- Trigger volumes

### Common Physics Issues

| Issue | Sign | Fix |
|-------|------|-----|
| Too many colliders | High "Physics.Simulate" | Simplify, use compound |
| Complex mesh colliders | High collision time | Use primitives |
| Many trigger overlaps | High "Physics.Contacts" | Reduce triggers, use layers |
| Raycasts every frame | High "Physics.Raycast" | Cache, reduce frequency |

### Layer Collision Matrix

Edit > Project Settings > Physics > Layer Collision Matrix

- Disable collisions between layers that never interact
- Dramatically reduces collision checks

---

## Build Profiling

### Development Build

```
Build Settings > Development Build ✓
Build Settings > Autoconnect Profiler ✓
```

Profiler connects to device automatically.

### Profiling Markers

```csharp
using Unity.Profiling;

static readonly ProfilerMarker s_MyMarker = new ProfilerMarker("MySystem.Update");

void Update()
{
    using (s_MyMarker.Auto())
    {
        // Profiled code
    }
}
```

---

## Performance Checklist

### Before Profiling
- [ ] Use Release/Development build (not Editor)
- [ ] Test on target hardware
- [ ] Disable unnecessary debugging

### During Profiling
- [ ] Record representative gameplay
- [ ] Look for spikes, not averages
- [ ] Profile worst-case scenarios

### Interpreting Results
- [ ] Is it CPU or GPU bound?
- [ ] Is it script time or rendering?
- [ ] Are there GC spikes?
- [ ] What's causing the most draw calls?
