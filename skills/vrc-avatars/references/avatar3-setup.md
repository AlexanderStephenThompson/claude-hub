# VRChat Avatar 3.0 Setup Reference

## Avatar Descriptor

### Basic Setup

1. Add `VRC Avatar Descriptor` to avatar root
2. Configure View Position (between eyes)
3. Set Lip Sync mode
4. Configure Eye Look (optional)

```
VRC Avatar Descriptor
├── View Position: (0, 1.6, 0.1)  // Adjust to eye level
├── Lip Sync
│   ├── Mode: Viseme Blend Shapes
│   └── Face Mesh: Body
├── Eye Look (optional)
│   ├── Eyes: Eye_L, Eye_R transforms
│   └── Eyelids: Blend shapes
└── Playable Layers
    ├── Base
    ├── Additive
    ├── Gesture
    ├── Action
    └── FX
```

---

## Playable Layers

### Layer Purposes

| Layer | Purpose | Common Uses |
|-------|---------|-------------|
| Base | Locomotion | Walking, running, jumping |
| Additive | Additive animations | Breathing, idle variations |
| Gesture | Hand gestures | Fist, point, peace, etc. |
| Action | Full body actions | Emotes, dances, sits |
| FX | Non-transform animations | Toggles, blend shapes, shaders |

### Default Layers

For simple avatars, use VRChat's default layers:
- Base: `vrc_AvatarV3LocomotionLayer`
- Additive: `vrc_AvatarV3IdleLayer`
- Gesture: `vrc_AvatarV3HandsLayer`
- Action: `vrc_AvatarV3ActionLayer`

---

## Expression Parameters

### Parameter Budget

**Total: 256 bits maximum (synced)**

| Type | Bits | Synced |
|------|------|--------|
| Bool | 1 | Yes |
| Int | 8 | Yes |
| Float | 8 | Yes |

### Built-in Parameters (Free)

These don't count against budget:
```
VRCEmote (int)
VRCFaceBlendH (float)
VRCFaceBlendV (float)
GestureLeft (int)
GestureRight (int)
GestureLeftWeight (float)
GestureRightWeight (float)
IsLocal (bool)
Seated (bool)
AFK (bool)
Grounded (bool)
And more...
```

### Custom Parameters

```csharp
// Example parameter setup
Name: "HatToggle"    Type: Bool   Default: True   Synced: True
Name: "OutfitIndex"  Type: Int    Default: 0      Synced: True
Name: "TailWag"      Type: Float  Default: 0      Synced: False  // Local only
```

**Tip:** Use `Saved` for parameters you want to persist across sessions.

---

## Expression Menu

### Structure

```
Main Menu
├── Expressions (Submenu)
│   ├── Happy (Toggle)
│   ├── Sad (Toggle)
│   └── Angry (Toggle)
├── Toggles (Submenu)
│   ├── Hat (Toggle)
│   ├── Glasses (Toggle)
│   └── Jacket (Toggle)
├── Outfit (Radial Puppet)
│   └── OutfitBlend (0-1 mapped to outfits)
└── Settings (Submenu)
    └── Tail Intensity (Radial)
```

### Control Types

| Type | Use For |
|------|---------|
| Button | One-shot actions |
| Toggle | On/off states |
| Sub Menu | Organizing options |
| Two Axis Puppet | X/Y control (joystick) |
| Four Axis Puppet | 4-direction control |
| Radial Puppet | Single value 0-1 |

---

## FX Layer Setup

### Basic Toggle

```
FX Controller
└── Toggle Layer
    ├── State: Off (default)
    │   └── Animation: HatOff
    ├── State: On
    │   └── Animation: HatOn
    └── Transitions
        ├── Off → On: HatToggle = true
        └── On → Off: HatToggle = false
```

### Animation Clips

For toggles, animate the property you want to change:
- GameObject active/inactive
- Blend shape values
- Material properties
- Shader parameters

```
HatOn.anim
└── Hat (GameObject): Active = 1

HatOff.anim
└── Hat (GameObject): Active = 0
```

---

## Gesture Layer Setup

### Hand Gestures (Built-in)

| GestureLeft/Right Value | Gesture |
|-------------------------|---------|
| 0 | Neutral |
| 1 | Fist |
| 2 | Open |
| 3 | Point |
| 4 | Peace |
| 5 | RockNRoll |
| 6 | Gun |
| 7 | Thumbs Up |

### Custom Gesture Response

```
Gesture Controller
└── Left Hand Layer
    ├── State: Neutral (default)
    ├── State: Fist
    │   └── Animation: LeftFist
    └── Transitions
        └── Any → Fist: GestureLeft = 1
```

---

## Write Defaults

**Choose one approach and stick with it:**

### Write Defaults ON
- Simpler setup
- Properties return to default when leaving state
- Can conflict between layers

### Write Defaults OFF (Recommended)
- More control
- Must explicitly set all animated properties in every state
- Each state fully defines its output

**Never mix** Write Defaults ON and OFF in the same controller.

---

## Common Patterns

### Outfit Switcher (Int Parameter)

```
FX Controller
└── Outfit Layer
    ├── State: Outfit0 (default)
    ├── State: Outfit1
    ├── State: Outfit2
    └── Transitions based on OutfitIndex int
```

### Blend Shape Control (Float Parameter)

```
FX Controller
└── Expression Layer
    └── Blend Tree
        ├── 0.0: Neutral face
        └── 1.0: Smiling face
        (Controlled by SmileAmount float)
```

---

## Testing Checklist

- [ ] Avatar Descriptor configured
- [ ] View position at eye level
- [ ] Lip sync working
- [ ] Expression menu navigable
- [ ] All toggles work
- [ ] Gestures respond correctly
- [ ] Parameters within budget
- [ ] Write Defaults consistent
- [ ] Tested in VRChat (not just Unity)
