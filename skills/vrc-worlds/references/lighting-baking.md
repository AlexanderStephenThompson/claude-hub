# VRChat World Lighting Reference

## Why Bake Lighting?

| Lighting Type | Quest Compatible | Performance |
|---------------|------------------|-------------|
| Baked | ✅ Yes | Excellent |
| Realtime | ❌ No (1-2 max) | Poor |
| Mixed | ⚠️ Limited | Moderate |

**Rule:** Bake everything on Quest. Realtime lights destroy performance.

---

## Baking Setup

### Step 1: Mark Static Objects

All non-moving objects should be static:

1. Select object in Hierarchy
2. Inspector > Static dropdown
3. Enable:
   - Contribute GI (receives and contributes to lighting)
   - Reflection Probe Static (for reflections)

Or via script:
```csharp
gameObject.isStatic = true;
```

### Step 2: Configure Lights

For each light:
- **Mode:** Baked (or Mixed for shadows on Quest PC fallback)
- **Indirect Multiplier:** 1-2 for bounced light

```
Directional Light (Sun)
├── Mode: Baked
├── Intensity: 1
└── Indirect Multiplier: 1.5

Point/Spot Lights
├── Mode: Baked
├── Range: Appropriate for area
└── Indirect Multiplier: 1
```

### Step 3: Lightmap Settings

Window > Rendering > Lighting

**Recommended Settings:**
```
Lightmapper: GPU Lightmapper (faster)
Direct Samples: 32
Indirect Samples: 500
Environment Samples: 256
Lightmap Resolution: 20-40 texels per unit
Lightmap Padding: 2
Lightmap Size: 1024 (Quest) / 2048 (PC)
Compress Lightmaps: Yes
Ambient Occlusion: Yes
```

### Step 4: Bake

1. Click "Generate Lighting"
2. Wait for bake to complete
3. Check for artifacts

---

## Light Probes

**Purpose:** Provide lighting data for dynamic/moving objects.

### Placement

```
Light Probe Group placement:
├── Cover all walkable areas
├── Denser near light transitions
├── At different heights if multi-level
└── Inside and outside buildings
```

### Best Practices

1. Create empty GameObject
2. Add Light Probe Group component
3. Edit probe positions in Scene view
4. Place probes where players/objects will be

**Density:**
- Open areas: 2-4 meter spacing
- Light transitions: 0.5-1 meter spacing
- Doorways: Probes on both sides

---

## Reflection Probes

**Purpose:** Provide accurate reflections for shiny surfaces.

### Setup

1. Create Reflection Probe (GameObject > Light > Reflection Probe)
2. Set Type: Baked
3. Adjust box size to cover area
4. Set Resolution: 128 (Quest) / 256 (PC)

### Placement

```
One probe per:
├── Major room
├── Distinct lighting environment
└── Area with reflective surfaces
```

---

## Common Issues

### Black Dynamic Objects

**Cause:** No light probes

**Fix:** Add Light Probe Group covering the area

### Light Bleeding

**Cause:** Lightmap resolution too low or geometry issues

**Fix:**
- Increase lightmap resolution
- Add lightmap padding
- Fix mesh geometry (no overlapping UVs)

### Bake Takes Forever

**Cause:** Too many lights, high resolution

**Fix:**
- Reduce lightmap resolution
- Use GPU lightmapper
- Reduce sample counts
- Bake in sections

### Seams Between Objects

**Cause:** Separate lightmap UVs at borders

**Fix:**
- Use same lightmap for adjacent objects
- Increase lightmap padding
- Use "Stitch Seams" option

---

## Quest-Specific Settings

```
Lightmap Size: 1024 max
Lightmap Resolution: 20 texels/unit
Compress Lightmaps: Yes
Directional Mode: Non-Directional (smaller, faster)
Reflection Probe Resolution: 128
Reflection Probe Count: 1-2 per world
```

---

## PC Settings (Higher Quality)

```
Lightmap Size: 2048
Lightmap Resolution: 40 texels/unit
Directional Mode: Directional
Reflection Probe Resolution: 256-512
Reflection Probe Count: As needed
```

---

## Baking Checklist

### Before Baking
- [ ] All static objects marked static
- [ ] All lights set to Baked
- [ ] Light Probe Groups placed
- [ ] Reflection Probes placed
- [ ] Lightmap settings configured

### After Baking
- [ ] No black areas
- [ ] No light bleeding
- [ ] Dynamic objects lit correctly
- [ ] Reflections look correct
- [ ] File size acceptable

### Testing
- [ ] Test in VRChat (not just Unity)
- [ ] Test on target platform (Quest)
- [ ] Check lightmap texture memory
- [ ] Verify performance targets met
