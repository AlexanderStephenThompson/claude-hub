# Udon Script Checklist

## Script Setup

### Header
- [ ] Using statements present
- [ ] Inherits from UdonSharpBehaviour
- [ ] Namespace used (optional but recommended)

```csharp
using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

public class MyBehavior : UdonSharpBehaviour
{
}
```

---

## Synced Variables

### Declaration
- [ ] Only necessary variables synced
- [ ] Smallest appropriate type used
- [ ] No string sync unless essential

```csharp
[UdonSynced] private bool _isActive;
[UdonSynced] private int _score;  // Not uint if negative possible
[UdonSynced] private Vector3 _targetPosition;
```

### Modification
- [ ] Ownership transferred before modification
- [ ] RequestSerialization called after changes

```csharp
public void UpdateState()
{
    if (!Networking.IsOwner(gameObject))
    {
        Networking.SetOwner(Networking.LocalPlayer, gameObject);
    }

    _isActive = true;
    _score += 10;
    RequestSerialization();
}
```

---

## Deserialization

### State Application
- [ ] OnDeserialization updates all visual state
- [ ] Handles null/destroyed references
- [ ] Works for late joiners

```csharp
public override void OnDeserialization()
{
    // Apply ALL synced state
    SetActiveState(_isActive);
    UpdateScoreDisplay(_score);
    MoveToPosition(_targetPosition);
}
```

---

## Late Joiner Support

- [ ] OnPlayerJoined triggers re-serialization
- [ ] All state reconstructable from synced vars

```csharp
public override void OnPlayerJoined(VRCPlayerApi player)
{
    if (Networking.IsOwner(gameObject))
    {
        RequestSerialization();
    }
}
```

---

## Event Handling

### Player Events
- [ ] OnPlayerJoined handles new players
- [ ] OnPlayerLeft cleans up player references
- [ ] Null checks on player references

```csharp
public override void OnPlayerJoined(VRCPlayerApi player)
{
    UpdatePlayerCount();
}

public override void OnPlayerLeft(VRCPlayerApi player)
{
    if (_assignedPlayer != null && _assignedPlayer == player)
    {
        _assignedPlayer = null;
    }
}
```

### Network Events
- [ ] Network events for non-critical actions only
- [ ] Critical state uses synced variables
- [ ] Public methods for network event targets

```csharp
// Non-critical: Sound effect (missing it is OK)
SendCustomNetworkEvent(NetworkEventTarget.All, "PlaySound");

// Critical: Score change (must be reliable)
_score += 10;
RequestSerialization();
```

---

## Interactions

### Interact()
- [ ] Ownership handled before state change
- [ ] Visual feedback provided
- [ ] Works for all players

```csharp
public override void Interact()
{
    Networking.SetOwner(Networking.LocalPlayer, gameObject);
    _isActive = !_isActive;
    RequestSerialization();
}

public override void OnDeserialization()
{
    UpdateVisuals();  // Everyone sees the change
}
```

---

## Performance

### Update Loops
- [ ] Minimal logic in Update
- [ ] No network operations in Update
- [ ] Cache component references

```csharp
// ❌ Bad
void Update()
{
    if (Networking.IsOwner(gameObject))
    {
        RequestSerialization();  // Don't spam this
    }
}

// ✅ Good - serialize only on change
private bool _needsSync;

void Update()
{
    if (_needsSync && Networking.IsOwner(gameObject))
    {
        RequestSerialization();
        _needsSync = false;
    }
}
```

### References
- [ ] GetComponent cached in Start
- [ ] No Find methods at runtime
- [ ] Player references validated

---

## Error Handling

- [ ] Null checks on player references
- [ ] Ownership checks before modification
- [ ] Graceful handling of missing components

```csharp
public void SetTarget(VRCPlayerApi player)
{
    if (player == null || !player.IsValid())
    {
        Debug.LogWarning("Invalid player");
        return;
    }

    if (!Networking.IsOwner(gameObject))
    {
        Networking.SetOwner(Networking.LocalPlayer, gameObject);
    }

    _targetPlayerId = player.playerId;
    RequestSerialization();
}
```

---

## Testing

### Local Testing
- [ ] Works in single-player test
- [ ] No errors in console
- [ ] Interactions respond correctly

### Network Testing
- [ ] Test with 2+ clients
- [ ] Late joiner gets correct state
- [ ] State syncs correctly
- [ ] Ownership transfers properly

### Edge Cases
- [ ] Owner leaves - new owner works
- [ ] Rapid interactions handled
- [ ] Multiple players interact simultaneously

---

## Documentation

- [ ] Public methods documented
- [ ] Synced variable purposes clear
- [ ] Network behavior documented

```csharp
/// <summary>
/// Toggles the door state. Synced across network.
/// Ownership transfers to interacting player.
/// </summary>
public override void Interact()
{
    // Implementation
}
```

---

## Common Bugs Checklist

| Bug | Cause | Fix |
|-----|-------|-----|
| State not syncing | Missing RequestSerialization | Call after changes |
| Only owner sees change | Missing OnDeserialization | Update visuals there |
| Late joiner wrong state | No OnPlayerJoined sync | Add re-serialization |
| Can't modify state | Not owner | SetOwner first |
| Null reference on player | Player left | Null check |
