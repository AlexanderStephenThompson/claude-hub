---
name: unity-performance
description: Unity optimization for VR and mobile - draw calls, LOD, batching
user-invocable: false
---

# Unity Performance Skill

**Version:** 1.0
**Stack:** Unity (VR/Mobile focus)

> Patterns for optimizing Unity projects, especially for VR.

---

## Scope and Boundaries

**This skill covers:**
- Draw call reduction
- Batching (static, dynamic, GPU instancing)
- LOD implementation
- Occlusion culling
- Memory optimization
- VR-specific performance

**Defers to other skills:**
- `unity-csharp`: Code architecture
- `unity-shaders`: Shader optimization
- `vrc-worlds`: VRChat-specific limits

**Use this skill when:** Optimizing Unity performance, especially for VR.

---

## Core Principles

1. **Measure First** — Profile before optimizing; gut feelings lie.
2. **Draw Calls Matter Most** — Especially in VR; target <100.
3. **Batch Aggressively** — Same material = potential batch.
4. **LOD Everything** — Distance-based detail reduction.
5. **Overdraw is Expensive** — Especially on mobile/Quest.

---

## VR Performance Targets

| Metric | Quest 2 | PC VR |
|--------|---------|-------|
| Draw Calls | <100 | <200 |
| Triangles | <100K | <1M |
| Frame Time | <11ms (90fps) | <11ms (90fps) |
| Texture Memory | <200MB | <1GB |

---

## Patterns

### Material Atlasing

```
Before: 20 objects × 20 materials = 20 draw calls (no batching)
After:  20 objects × 1 atlas material = 1 draw call (batched)
```

Combine textures into atlases, share materials across objects.

### Static Batching Setup

```csharp
// Mark static objects in inspector or via code
gameObject.isStatic = true;

// Or specific flags
GameObjectUtility.SetStaticEditorFlags(gameObject,
    StaticEditorFlags.BatchingStatic |
    StaticEditorFlags.OcclusionStatic);
```

### LOD Group Configuration

```
LOD 0: 100% triangles (0-10m)
LOD 1: 50% triangles (10-25m)
LOD 2: 25% triangles (25-50m)
Culled: 0 triangles (50m+)
```

### Object Pooling

```csharp
public class ObjectPool : MonoBehaviour
{
    [SerializeField] private GameObject _prefab;
    [SerializeField] private int _initialSize = 10;

    private Queue<GameObject> _pool = new();

    private void Awake()
    {
        for (int i = 0; i < _initialSize; i++)
        {
            var obj = Instantiate(_prefab);
            obj.SetActive(false);
            _pool.Enqueue(obj);
        }
    }

    public GameObject Get()
    {
        if (_pool.Count == 0)
        {
            var obj = Instantiate(_prefab);
            return obj;
        }

        var pooled = _pool.Dequeue();
        pooled.SetActive(true);
        return pooled;
    }

    public void Return(GameObject obj)
    {
        obj.SetActive(false);
        _pool.Enqueue(obj);
    }
}
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Unique material per object | No batching possible | Share materials, use atlases |
| No LODs | Full detail at any distance | Add LOD groups |
| Instantiate/Destroy in gameplay | GC spikes, stutters | Object pooling |
| Realtime lights everywhere | Expensive shadows, lighting | Bake lighting, limit realtime |
| Transparent materials | Overdraw, no batching | Minimize, use cutout when possible |
| No occlusion culling | Render hidden objects | Bake occlusion data |

---

## Profiling Checklist

- [ ] Frame Debugger checked for draw calls
- [ ] Profiler run for CPU spikes
- [ ] Memory Profiler checked for leaks
- [ ] Stats window monitored (triangles, batches)
- [ ] Quest/mobile tested on device (not just editor)

---

## Optimization Checklist

- [ ] Static objects marked static
- [ ] Materials shared where possible
- [ ] Texture atlases for small props
- [ ] LOD groups on significant meshes
- [ ] Occlusion culling baked
- [ ] Object pooling for spawned objects
- [ ] Lighting baked (not all realtime)

---

## References

- `references/profiling.md` — Unity Profiler usage and interpretation

## Assets

- `assets/vr-performance-limits.md` — VR platform performance limits and targets
