# VR Performance Limits Quick Reference

## Target Frame Rates

| Platform | FPS | Frame Budget |
|----------|-----|--------------|
| Quest 2 | 72-120 Hz | 8-14ms |
| Quest 3 | 90-120 Hz | 8-11ms |
| PC VR (Index) | 90-144 Hz | 7-11ms |
| PSVR 2 | 90-120 Hz | 8-11ms |

**Rule:** Stay under frame budget or users get sick.

---

## Quest 2 Limits

### Excellent (Target This)
| Metric | Limit |
|--------|-------|
| Draw Calls | 50 |
| Triangles | 50,000 |
| Skinned Meshes | 1 |
| Materials | 25 |

### Good (Acceptable)
| Metric | Limit |
|--------|-------|
| Draw Calls | 100 |
| Triangles | 100,000 |
| Skinned Meshes | 4 |
| Materials | 50 |

### Medium (Last Resort)
| Metric | Limit |
|--------|-------|
| Draw Calls | 200 |
| Triangles | 200,000 |
| Skinned Meshes | 8 |
| Materials | 75 |

---

## Quest 3 Limits

~50% more headroom than Quest 2, but same principles apply.

| Rank | Draw Calls | Triangles |
|------|------------|-----------|
| Excellent | 75 | 75,000 |
| Good | 150 | 150,000 |
| Medium | 300 | 300,000 |

---

## PC VR Limits

More flexible, but still important for wide compatibility.

| Rank | Draw Calls | Triangles |
|------|------------|-----------|
| Excellent | 100 | 500,000 |
| Good | 200 | 1,000,000 |
| Medium | 400 | 2,000,000 |

---

## Memory Limits

### Quest 2
- **Total App Memory:** ~2GB usable
- **Texture Memory:** Keep under 200MB
- **Audio Memory:** Keep under 50MB

### Quest 3
- **Total App Memory:** ~4GB usable
- **Texture Memory:** Keep under 500MB

---

## Texture Guidelines

| Platform | Max Resolution | Format |
|----------|----------------|--------|
| Quest | 1024x1024 typical | ASTC 6x6 |
| Quest (hero) | 2048x2048 | ASTC 4x4 |
| PC VR | 2048x2048 typical | DXT5/BC7 |

**Always:**
- Generate mipmaps
- Use compression
- Power of 2 dimensions

---

## Lighting Limits

### Quest
| Type | Recommendation |
|------|----------------|
| Realtime Lights | **0** (bake everything) |
| Baked Lights | Unlimited |
| Light Probes | Yes, required for dynamic objects |
| Reflection Probes | 1-2 baked, 0 realtime |
| Shadows | **Off** (bake into lightmaps) |

### PC VR
| Type | Recommendation |
|------|----------------|
| Realtime Lights | 1-2 |
| Baked Lights | Unlimited |
| Shadows | 1 realtime shadow caster |
| Reflection Probes | 2-4 baked |

---

## Shader Limits

### Quest
- Single-pass instanced required
- No tessellation
- No geometry shaders
- Minimal fragment complexity
- Prefer unlit/mobile shaders

### PC VR
- Single-pass instanced recommended
- Standard shaders OK
- Avoid heavy post-processing

---

## Physics Limits

| Platform | Recommendation |
|----------|----------------|
| Quest | <50 active rigidbodies |
| Quest | <100 active colliders |
| PC VR | <200 active rigidbodies |
| PC VR | <500 active colliders |

**Always:**
- Use simple colliders (box, sphere, capsule)
- Avoid mesh colliders
- Use layer collision matrix
- Pool physics objects

---

## Quick Decision Matrix

| Question | Quest | PC VR |
|----------|-------|-------|
| Realtime shadows? | No | Maybe 1 |
| Dynamic lights? | No | 1-2 |
| Post-processing? | Minimal | Light |
| Skinned meshes? | 1-4 | 8-16 |
| LODs required? | Yes | Yes |
| Baked lighting? | Required | Recommended |

---

## Testing Checklist

- [ ] Tested on actual Quest hardware
- [ ] Maintains 72fps minimum
- [ ] No dropped frames during action
- [ ] No thermal throttling (extended play)
- [ ] Memory under 2GB
- [ ] Draw calls under 100
