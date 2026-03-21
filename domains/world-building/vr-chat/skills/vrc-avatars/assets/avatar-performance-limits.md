# VRChat Avatar Performance Limits

## Performance Ranks

| Rank | Icon | Meaning |
|------|------|---------|
| Excellent | 🟢 | Optimal, no impact |
| Good | 🟢 | Minor impact |
| Medium | 🟡 | Moderate impact |
| Poor | 🟠 | Significant impact |
| Very Poor | 🔴 | Heavy impact, may be blocked |

---

## Quest Limits

### Excellent
| Metric | Limit |
|--------|-------|
| Polygons | 7,500 |
| Skinned Meshes | 1 |
| Meshes | 1 |
| Materials | 1 |
| Bones | 75 |
| PhysBones | 0 |
| PhysBone Colliders | 0 |
| PhysBone Collision Check Count | 0 |
| Particle Systems | 0 |
| Texture Memory | 10 MB |

### Good
| Metric | Limit |
|--------|-------|
| Polygons | 10,000 |
| Skinned Meshes | 1 |
| Meshes | 1 |
| Materials | 1 |
| Bones | 90 |
| PhysBones | 4 |
| PhysBone Colliders | 4 |
| PhysBone Collision Check Count | 16 |
| Particle Systems | 0 |
| Texture Memory | 18 MB |

### Medium
| Metric | Limit |
|--------|-------|
| Polygons | 15,000 |
| Skinned Meshes | 2 |
| Meshes | 2 |
| Materials | 2 |
| Bones | 150 |
| PhysBones | 6 |
| PhysBone Colliders | 8 |
| PhysBone Collision Check Count | 32 |
| Particle Systems | 0 |
| Texture Memory | 25 MB |

### Poor
| Metric | Limit |
|--------|-------|
| Polygons | 20,000 |
| Skinned Meshes | 2 |
| Meshes | 2 |
| Materials | 4 |
| Bones | 256 |
| PhysBones | 8 |
| PhysBone Colliders | 16 |
| PhysBone Collision Check Count | 64 |
| Particle Systems | 0 |
| Texture Memory | 40 MB |

---

## PC Limits

### Excellent
| Metric | Limit |
|--------|-------|
| Polygons | 32,000 |
| Skinned Meshes | 1 |
| Meshes | 4 |
| Materials | 4 |
| Bones | 75 |
| PhysBones Components | 4 |
| PhysBones Transforms | 16 |
| PhysBone Colliders | 4 |
| Particle Systems | 0 |
| Texture Memory | 40 MB |

### Good
| Metric | Limit |
|--------|-------|
| Polygons | 70,000 |
| Skinned Meshes | 2 |
| Meshes | 8 |
| Materials | 8 |
| Bones | 150 |
| PhysBones Components | 8 |
| PhysBones Transforms | 64 |
| PhysBone Colliders | 8 |
| Particle Systems | 4 |
| Texture Memory | 75 MB |

### Medium
| Metric | Limit |
|--------|-------|
| Polygons | 70,000 |
| Skinned Meshes | 8 |
| Meshes | 16 |
| Materials | 16 |
| Bones | 256 |
| PhysBones Components | 16 |
| PhysBones Transforms | 128 |
| PhysBone Colliders | 16 |
| Particle Systems | 8 |
| Texture Memory | 110 MB |

### Poor
| Metric | Limit |
|--------|-------|
| Polygons | 70,000 |
| Skinned Meshes | 16 |
| Meshes | 24 |
| Materials | 32 |
| Bones | 400 |
| PhysBones Components | 32 |
| PhysBones Transforms | 256 |
| PhysBone Colliders | 32 |
| Particle Systems | 16 |
| Texture Memory | 150 MB |

---

## Parameter Budget

**Total synced bits: 256**

| Type | Bits |
|------|------|
| Bool | 1 bit |
| Int | 8 bits |
| Float | 8 bits |

**Note:** Built-in parameters (VRCEmote, Gestures, etc.) don't count.

---

## Optimization Strategies

### Reduce Polygons
1. Use decimation tools (Blender Decimate)
2. Remove unseen geometry
3. Simplify complex shapes
4. Use LODs (PC)

### Reduce Materials
1. Atlas textures together
2. Merge meshes with same material
3. Use fewer unique shaders

### Reduce Bones
1. Remove unused bones
2. Merge nearby bones
3. Simplify finger bones (Quest)

### Optimize PhysBones
1. Reduce bone count per chain
2. Simplify collision shapes
3. Use radius instead of colliders
4. Reduce collision check count

### Reduce Texture Memory
1. Lower texture resolution
2. Use compression (ASTC for Quest)
3. Share textures between materials
4. Remove unnecessary channels

---

## Quick Reference Card

### Quest Target: Good
```
Polygons: 10,000
Materials: 1
Bones: 90
PhysBones: 4
Textures: 18 MB
```

### PC Target: Good
```
Polygons: 70,000
Materials: 8
Bones: 150
PhysBones: 64 transforms
Textures: 75 MB
```

---

## Checking Performance

1. Select avatar in Hierarchy
2. Open VRChat SDK Control Panel
3. View "Avatar Performance Stats"
4. Address any orange/red warnings
