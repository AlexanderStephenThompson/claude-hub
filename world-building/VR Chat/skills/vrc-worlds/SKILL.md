---
name: vrc-worlds
description: VRChat world building - setup, lighting, optimization, limits
user-invocable: false
---

# VRChat Worlds Skill

**Version:** 1.0
**Stack:** VRChat SDK, Unity

A VRChat world that runs at 30fps on your PC can run at 5fps on Quest. Realtime lights that look great in the editor tank performance for every player in the room. The Unity editor lies about performance — everything looks smooth until you test on actual hardware with actual players. And VRChat's performance ranking system means a poorly optimized world gets fewer visitors, not just a worse experience.

Quest-first building with baked lighting, proper spawn setup, and occlusion culling means your world runs well everywhere and gets promoted by the ranking system.

---

## Scope and Boundaries

**This skill covers:**
- World setup and scene hierarchy
- VRChat performance limits
- Lighting and baking
- Spawn and respawn setup
- World optimization
- SDK components

**Defers to other skills:**
- `vrc-udon`: Scripting and networking
- `unity-csharp`: C# patterns and performance optimization

**Use this skill when:** Building or optimizing VRChat worlds.

---

## Core Principles

1. **Quest Compatibility** — Build for Quest first, enhance for PC.
2. **Bake Everything Possible** — Realtime lighting kills performance.
3. **Respect the Limits** — Stay within performance ranks.
4. **Test on Device** — Editor performance lies.
5. **Spawn Matters** — First impression is at spawn.

---

## Performance Limits

### Quest (Target: Excellent/Good)

| Metric | Excellent | Good | Medium |
|--------|-----------|------|--------|
| Triangles | 50,000 | 100,000 | 200,000 |
| Batches | 50 | 100 | 200 |
| Materials | 25 | 50 | 75 |
| Lights (realtime) | 0 | 1 | 2 |

### PC (Target: Excellent/Good)

| Metric | Excellent | Good | Medium |
|--------|-----------|------|--------|
| Triangles | 500,000 | 1,000,000 | 2,000,000 |
| Batches | 100 | 200 | 400 |
| Materials | 50 | 100 | 200 |
| Lights (realtime) | 2 | 4 | 8 |

---

## Patterns

### Scene Hierarchy

```
World
├── Environment
│   ├── Static (mark as static)
│   │   ├── Ground
│   │   ├── Buildings
│   │   └── Props
│   └── Dynamic
│       └── Interactive objects
├── Lighting
│   ├── Directional Light (baked or mixed)
│   ├── Light Probes
│   └── Reflection Probes
├── Audio
│   └── Audio sources
├── VRChat
│   ├── VRCWorld (descriptor)
│   ├── Spawn Points
│   └── Mirrors/Portals
└── Udon
    └── Scripts and behaviors
```

### Spawn Area Setup

```
Spawn Checklist:
- Multiple spawn points (avoid stacking)
- Clear floor (no obstacles)
- Good lighting (players see themselves)
- Mirror nearby (avatar check)
- Safe area (no hazards)
- Interesting view (sets the mood)
```

### Lighting Setup (Quest-Compatible)

```
1. Set all lights to "Baked"
2. Mark static geometry as "Contribute GI" + "Reflection Probe Static"
3. Place Light Probes for dynamic objects
4. Place Reflection Probes for shiny surfaces
5. Bake with GPU Lightmapper
6. Delete realtime lights or set to "Not Important"
```

### Occlusion Culling Setup

```
1. Mark large static objects as "Occluder Static"
2. Mark all static objects as "Occludee Static"
3. Window > Rendering > Occlusion Culling
4. Set appropriate cell sizes
5. Bake
6. Test with Occlusion visualization
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Realtime lights on Quest | Tanks performance | Bake all lighting |
| No light probes | Dynamic objects are black | Add light probe groups |
| Single spawn point | Players stack on join | Multiple spread spawns |
| Unbaked reflections | Expensive or broken | Use baked reflection probes |
| No LODs on props | Full detail at distance | Add LOD groups |
| Post-processing on Quest | Not supported, ignored | PC-only or remove |

---

## Checklist

### Setup
- [ ] VRCWorld descriptor configured
- [ ] Multiple spawn points placed
- [ ] Respawn height set appropriately
- [ ] Reference camera configured

### Performance
- [ ] All static objects marked static
- [ ] Lighting fully baked (Quest)
- [ ] Light probes cover play area
- [ ] Occlusion culling baked
- [ ] LODs on significant meshes
- [ ] Tested on Quest hardware

### Quality
- [ ] Spawn area is welcoming
- [ ] Mirror available near spawn
- [ ] No z-fighting or visual glitches
- [ ] Audio levels balanced
- [ ] World descriptively named

---

## References

- `references/lighting-baking.md` — Baked lighting setup for VRChat worlds

## Assets

- `assets/world-upload-checklist.md` — Complete world upload checklist
