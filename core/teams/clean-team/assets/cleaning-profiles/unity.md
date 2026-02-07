# Unity Cleaning Profile

Project type detection: `.csproj` files exist, or `Assets/` directory with Unity meta files (`.meta`).

---

## Asset Folder Structure

Ensure standard Unity folder organization:

```
Assets/
├── Materials/        # All materials
├── Textures/         # All textures
├── Scripts/          # All C# scripts
├── Prefabs/          # All prefabs
├── Scenes/           # All scenes
├── Animations/       # Animation clips and controllers
├── Audio/            # Sound effects and music
├── Shaders/          # Custom shaders (if any)
├── Resources/        # Runtime-loaded assets only
├── Editor/           # Editor-only scripts
├── Plugins/          # Third-party plugins
└── StreamingAssets/  # Raw files for runtime access
```

Flag files in wrong folders (e.g., materials in Scripts/).

---

## Script Conventions

### Naming
- Scripts use **PascalCase**: `PlayerController.cs`, not `playerController.cs`
- Script filename must match the primary class name
- One MonoBehaviour per file (flag files with multiple)

### Organization
- Group `using` directives: Unity namespaces first, then System, then project-specific
- Remove unused `using` directives
- Remove empty Unity lifecycle methods (`Start()`, `Update()` with no body)

---

## Scene Hierarchy

- Root objects should be organizational containers (empty GameObjects with descriptive names)
- Recommended root structure: `--- Environment ---`, `--- UI ---`, `--- Systems ---`, `--- Dynamic ---`
- Flag deeply nested hierarchies (>5 levels) that could flatten
- Flag objects with default names (`GameObject`, `Cube`, `Sphere`)

---

## Prefab Hygiene

- Flag prefab overrides that should be applied or reverted
- Flag prefabs with missing script references
- Flag duplicate prefabs (same name, different folders)

---

## Anti-Patterns

- **Don't move assets that are referenced by GUIDs** — Unity tracks by meta file; moves are usually safe but verify
- **Don't delete .meta files** — Unity needs them for asset tracking
- **Don't rename scripts without updating class names** — Will break MonoBehaviour references
- **Don't restructure Plugins/ or third-party assets** — They expect specific paths
