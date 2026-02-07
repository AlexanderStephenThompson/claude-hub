# VRChat Udon Networking Reference

## Core Concepts

### Ownership Model

Every synced object has exactly one **owner**. Only the owner can modify synced variables.

```csharp
// Check ownership
bool isMine = Networking.IsOwner(gameObject);
VRCPlayerApi owner = Networking.GetOwner(gameObject);

// Transfer ownership
Networking.SetOwner(Networking.LocalPlayer, gameObject);
```

### Synced Variables

```csharp
[UdonSynced] private bool _isActive;
[UdonSynced] private float _health;
[UdonSynced] private Vector3 _position;
[UdonSynced] private string _playerName;  // Expensive, use sparingly
```

**Supported types:** bool, byte, sbyte, short, ushort, int, uint, long, ulong, float, double, Vector2, Vector3, Vector4, Quaternion, string, Color, Color32

---

## Ownership Transfer Pattern

```csharp
public void TakeOwnershipAndUpdate()
{
    // Step 1: Become owner
    if (!Networking.IsOwner(gameObject))
    {
        Networking.SetOwner(Networking.LocalPlayer, gameObject);
    }

    // Step 2: Modify synced variables
    _isActive = true;
    _lastInteractor = Networking.LocalPlayer.displayName;

    // Step 3: Request sync
    RequestSerialization();
}
```

---

## Serialization

### Manual Serialization

```csharp
public override void OnPreSerialization()
{
    // Called before data is sent to network
    // Use to prepare data for sync
    _syncedTime = Time.time;
}

public override void OnDeserialization()
{
    // Called when receiving data from network
    // Use to apply synced state
    UpdateVisuals();
}

public override void OnPostSerialization(SerializationResult result)
{
    // Called after serialization completes
    if (!result.success)
    {
        Debug.LogWarning("Sync failed");
    }
}
```

### Continuous vs Manual Sync

```csharp
// Continuous: Object syncs automatically (position, rotation)
// Set in VRC Object Sync component

// Manual: You control when to sync
[UdonSynced] private float _value;

public void UpdateValue(float newValue)
{
    if (!Networking.IsOwner(gameObject)) return;

    _value = newValue;
    RequestSerialization();  // Explicitly request sync
}
```

---

## Network Events

### SendCustomNetworkEvent

```csharp
// Send to all players (including self)
SendCustomNetworkEvent(NetworkEventTarget.All, "OnGlobalEvent");

// Send to owner only
SendCustomNetworkEvent(NetworkEventTarget.Owner, "OnOwnerEvent");

// The receiving method (must be public)
public void OnGlobalEvent()
{
    Debug.Log("All players received this");
}
```

### Event Reliability

Network events are **not guaranteed** to arrive. For critical state, use synced variables.

```csharp
// ❌ Bad - Event might not arrive
public void TakeDamage()
{
    SendCustomNetworkEvent(NetworkEventTarget.All, "PlayHitEffect");
}

// ✅ Good - State is synced reliably
[UdonSynced] private int _health;
[UdonSynced] private bool _wasHit;

public void TakeDamage()
{
    _health -= 10;
    _wasHit = true;
    RequestSerialization();
}

public override void OnDeserialization()
{
    if (_wasHit)
    {
        PlayHitEffect();
        _wasHit = false;  // Reset (owner will sync this)
    }
    UpdateHealthUI();
}
```

---

## Late Joiner Support

Players joining after events occurred need current state.

```csharp
[UdonSynced] private bool _doorOpen;
[UdonSynced] private int _score;

public override void OnPlayerJoined(VRCPlayerApi player)
{
    // Re-sync state for new player
    if (Networking.IsOwner(gameObject))
    {
        RequestSerialization();
    }
}

public override void OnDeserialization()
{
    // New player gets current state here
    SetDoorState(_doorOpen);
    UpdateScoreDisplay(_score);
}
```

---

## Player Events

```csharp
public override void OnPlayerJoined(VRCPlayerApi player)
{
    Debug.Log($"{player.displayName} joined");

    // Re-serialize state if we're owner
    if (Networking.IsOwner(gameObject))
    {
        RequestSerialization();
    }
}

public override void OnPlayerLeft(VRCPlayerApi player)
{
    Debug.Log($"{player.displayName} left");

    // Clean up player-specific state
    if (player == _assignedPlayer)
    {
        _assignedPlayer = null;
    }
}

public override void OnOwnershipTransferred(VRCPlayerApi newOwner)
{
    Debug.Log($"New owner: {newOwner.displayName}");
}
```

---

## Bandwidth Considerations

### Synced Variable Costs

| Type | Bytes | Notes |
|------|-------|-------|
| bool | 1 | Efficient |
| int | 4 | Common choice |
| float | 4 | Common choice |
| Vector3 | 12 | Position data |
| Quaternion | 16 | Rotation data |
| string | Variable | Expensive, avoid frequent sync |

### Best Practices

1. **Minimize synced variables** — Each adds network overhead
2. **Use smallest type** — byte instead of int if <256
3. **Batch updates** — One RequestSerialization for multiple changes
4. **Avoid string sync** — Use int IDs instead

```csharp
// ❌ Bad - Syncing full player name string
[UdonSynced] private string _lastInteractorName;

// ✅ Good - Sync player ID, look up locally
[UdonSynced] private int _lastInteractorId;

public override void OnDeserialization()
{
    VRCPlayerApi player = VRCPlayerApi.GetPlayerById(_lastInteractorId);
    if (player != null)
    {
        _displayedName = player.displayName;
    }
}
```

---

## Common Patterns

### Toggle with Ownership

```csharp
public override void Interact()
{
    Networking.SetOwner(Networking.LocalPlayer, gameObject);
    _isOn = !_isOn;
    RequestSerialization();
}

public override void OnDeserialization()
{
    SetToggleState(_isOn);
}
```

### Pickup Sync

```csharp
private VRC_Pickup _pickup;
[UdonSynced] private Vector3 _syncedPosition;
[UdonSynced] private Quaternion _syncedRotation;

public override void OnPickup()
{
    // Owner changes automatically with VRC_Pickup
}

public override void OnDrop()
{
    _syncedPosition = transform.position;
    _syncedRotation = transform.rotation;
    RequestSerialization();
}
```

---

## Debugging

```csharp
void Update()
{
    // Debug ownership and sync state
    Debug.Log($"Owner: {Networking.GetOwner(gameObject)?.displayName}");
    Debug.Log($"Is Owner: {Networking.IsOwner(gameObject)}");
    Debug.Log($"Is Master: {Networking.IsMaster}");
}
```
