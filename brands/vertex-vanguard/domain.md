# Vertex Vanguard — Domain Language

## Brand Terms

| Use This | Not This |
|----------|----------|
| World (VRChat) | Map, level, environment |
| Spawn space | Starting area, spawn point |
| Social zones (small/medium/large) | Rooms, areas, spaces |
| Connectors | Hallways, transitions, pathways |
| Feature layers | Features, systems (a "layer" applies across zones — lighting, audio, interactivity) |
| UdonSharp | Udon, VRChat scripting |
| VRChat SDK / Creator Companion | VRChat tools |
| ORL Shaders | VRChat shaders, custom shaders |
| FBX export | Model export |
| Post processing | Visual effects (in VRChat context: Unity post-processing stack) |

## The Pipeline

Always in this order, never skip steps:
1. Retopo
2. UV unwrap
3. Texture

## VRChat World Anatomy Model

Alexander's framework for VRChat world design:

```
Spawn > Social Zones (small/medium/large) > Feature Layers > Connectors
```

- **Spawn:** Entry point, first impression
- **Social zones:** Scaled spaces for different group sizes
- **Feature layers:** Cross-zone systems (exploration, lighting, interactivity)
- **Connectors:** Tissue between zones (not just hallways — mood transitions)

## Specific Projects

| Name | What It Is |
|------|-----------|
| The Grotto | Alexander's cyberpunk penthouse VRChat world |
