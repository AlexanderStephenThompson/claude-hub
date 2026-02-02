---
name: vrc-udon
description: VRChat Udon and UdonSharp patterns - networking, sync, interactions
user-invocable: false
---

# VRChat Udon Skill

**Version:** 1.0
**Stack:** VRChat SDK, UdonSharp

> Patterns for VRChat world scripting with Udon.

---

## Scope and Boundaries

**This skill covers:**
- UdonSharp syntax and patterns
- Networking and synchronization
- Player interactions
- World events
- Common Udon behaviors

**Defers to other skills:**
- `unity-csharp`: General C# patterns
- `vrc-worlds`: World setup and optimization
- `unity-performance`: Performance optimization

**Use this skill when:** Writing Udon scripts for VRChat worlds.

---

## Core Principles

1. **Network Awareness** — Every synced variable has bandwidth cost.
2. **Owner Model** — Only owner can modify synced variables.
3. **Late Joiners** — State must be correct for players who join later.
4. **Local vs Global** — Be explicit about what's local vs networked.
5. **Event-Driven** — Use SendCustomEvent, not polling.

---

## Patterns

### Basic UdonSharp Script

```csharp
using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

public class MyBehavior : UdonSharpBehaviour
{
    [UdonSynced] private bool _isActive;

    public override void Interact()
    {
        // Take ownership before modifying synced var
        Networking.SetOwner(Networking.LocalPlayer, gameObject);
        _isActive = !_isActive;
        RequestSerialization();
    }

    public override void OnDeserialization()
    {
        // Called when synced vars update from network
        UpdateVisuals();
    }

    private void UpdateVisuals()
    {
        // Update based on _isActive state
    }
}
```

### Ownership Transfer Pattern

```csharp
public void TakeOwnershipAndModify()
{
    // Always check and transfer ownership first
    if (!Networking.IsOwner(gameObject))
    {
        Networking.SetOwner(Networking.LocalPlayer, gameObject);
    }

    // Now safe to modify synced variables
    _syncedValue = newValue;
    RequestSerialization();
}
```

### Late Joiner Support

```csharp
[UdonSynced] private bool _doorOpen;

public override void OnPlayerJoined(VRCPlayerApi player)
{
    // If we're owner, re-serialize state for the new player
    if (Networking.IsOwner(gameObject))
    {
        RequestSerialization();
    }
}

public override void OnDeserialization()
{
    // Late joiners get current state here
    SetDoorState(_doorOpen);
}
```

### Custom Event Communication

```csharp
// Script A - sends event
public UdonBehaviour targetScript;

public void OnButtonPress()
{
    targetScript.SendCustomEvent("HandleButtonPress");
}

// Script B - receives event
public void HandleButtonPress()
{
    // Handle the event
}

// Network event (all players)
public void TriggerGlobalEvent()
{
    SendCustomNetworkEvent(NetworkEventTarget.All, "OnGlobalEvent");
}

public void OnGlobalEvent()
{
    // Runs on all players
}
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Modifying synced vars without ownership | Silent failure | SetOwner first, then modify |
| Forgetting RequestSerialization | Changes don't sync | Always call after modifying synced vars |
| Syncing too much data | Network lag | Minimize synced variables |
| Update() for network checks | Performance waste | Use OnDeserialization, events |
| No late joiner handling | Broken state for joiners | Re-serialize on player join |

---

## Checklist

- [ ] Ownership transferred before synced var changes
- [ ] RequestSerialization called after changes
- [ ] OnDeserialization updates all visual state
- [ ] Late joiners handled (OnPlayerJoined + serialize)
- [ ] Network events used for global triggers
- [ ] Minimal synced variable count

---

## References

- `references/networking.md` — Udon networking, sync, and ownership patterns

## Assets

- `assets/udon-checklist.md` — Udon script development checklist
