---
name: vrc-avatars
description: VRChat avatar building - Avatar 3.0, expressions, performance
user-invocable: false
---

# VRChat Avatars Skill

**Version:** 1.0
**Stack:** VRChat SDK, Unity

VRChat's performance ranking system means avatars ranked "Poor" or "Very Poor" get automatically hidden by most players' safety settings — your carefully crafted avatar becomes an invisible robot silhouette. Too many materials break batching. Too many bones eat CPU. Mixed Write Defaults cause unpredictable animation behavior. And Quest has dramatically stricter limits that require a separate build, not just the same avatar with fewer polygons.

Building within Good rank limits from the start means your avatar is actually seen by other players. The parameter budget and PhysBone limits aren't arbitrary — they're the line between visible and invisible.

---

## Scope and Boundaries

**This skill covers:**
- Avatar 3.0 setup
- Expression menus and parameters
- Performance optimization
- PhysBones and contacts
- Animator controllers

**Defers to other skills:**
- `unity-csharp`: C# patterns and performance optimization

**Use this skill when:** Building or optimizing VRChat avatars.

---

## Core Principles

1. **Performance Rank Matters** — Poor avatars get blocked.
2. **Quest Compatibility** — Separate build, stricter limits.
3. **Parameter Budget** — 256 bits max for synced parameters.
4. **PhysBone Limits** — More bones = more cost.
5. **Test on Device** — Mirror and performance differ.

---

## Performance Limits

### Quest (Target: Good)

| Metric | Good | Medium | Poor |
|--------|------|--------|------|
| Triangles | 10,000 | 15,000 | 20,000 |
| Materials | 1 | 2 | 4 |
| Bones | 90 | 150 | 256 |
| PhysBones | 0 | 6 | 8 |

### PC (Target: Good)

| Metric | Good | Medium | Poor |
|--------|------|--------|------|
| Triangles | 32,000 | 70,000 | - |
| Materials | 4 | 8 | 16 |
| Bones | 150 | 256 | 400 |
| PhysBones | 16 | 32 | 64 |
| PhysBone Colliders | 8 | 16 | 32 |

---

## Patterns

### Hierarchy Structure

```
Avatar Root
├── Armature
│   └── Hips
│       ├── Spine → Chest → Neck → Head
│       │                         ├── Eye_L, Eye_R
│       │                         └── Hair bones
│       ├── Leg_L → Knee → Foot → Toe
│       ├── Leg_R → ...
│       └── (Shoulder → Arm → Elbow → Hand → Fingers)
├── Body (SkinnedMeshRenderer)
├── Clothes (optional separate mesh)
└── Accessories
```

### Parameter Budget (256 bits)

```
Type        Bits    Common Uses
─────────────────────────────────
Bool        1       Toggles
Int         8       Outfit index, state machines
Float       8       Blend shapes, radial controls

Example Budget:
- VRCEmote (int)         8 bits
- VRCFaceBlendH (float)  8 bits
- VRCFaceBlendV (float)  8 bits
- Custom toggles ×10     10 bits
- Outfit selector        8 bits
- Remaining             214 bits
```

### Expression Menu Structure

```
Main Menu
├── Expressions
│   ├── Happy
│   ├── Sad
│   └── Surprised
├── Toggles
│   ├── Hat On/Off
│   ├── Glasses On/Off
│   └── Jacket On/Off
├── Outfits (Radial)
│   └── Select 1-4
└── Settings
    ├── PhysBone Intensity
    └── Fallback Toggle
```

### Write Defaults Pattern

```
Choose ONE approach project-wide:

Write Defaults ON:
- Simpler setup
- Properties return to default when state exits
- Can cause conflicts between layers

Write Defaults OFF (Recommended):
- More control
- Must explicitly set all animated properties
- Each state fully defines its output
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Too many materials | Breaks batching, hurts rank | Combine textures, atlas |
| Mixed Write Defaults | Undefined behavior | Pick one, be consistent |
| Unoptimized PhysBones | Performance cost | Reduce count, simplify chains |
| No fallback avatar | Blocked users see robot | Set a performant fallback |
| Synced parameters for local-only | Wastes sync budget | Mark local-only correctly |
| Full body mesh on Quest | Triangle count | Separate Quest mesh |

---

## Checklist

### Setup
- [ ] Armature follows humanoid structure
- [ ] Avatar descriptor configured
- [ ] Eye tracking configured (if applicable)
- [ ] Visemes configured
- [ ] View position set correctly

### Performance
- [ ] Triangle count within target rank
- [ ] Material count minimized (atlasing)
- [ ] Bone count within limits
- [ ] PhysBones optimized
- [ ] Quest version uploaded (if applicable)

### Expressions
- [ ] Expression menu organized
- [ ] Parameters within 256-bit budget
- [ ] Write Defaults consistent
- [ ] Gesture layer configured
- [ ] Toggles tested

### Quality
- [ ] No clipping in default pose
- [ ] PhysBones behave naturally
- [ ] Expressions look correct
- [ ] Tested in VRChat (not just Unity)

---

## References

- `references/avatar3-setup.md` — Avatar 3.0 configuration guide

## Assets

- `assets/avatar-performance-limits.md` — Quest and PC performance limits
