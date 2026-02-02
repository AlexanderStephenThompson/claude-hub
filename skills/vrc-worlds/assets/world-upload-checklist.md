# VRChat World Upload Checklist

## Pre-Build Checks

### Scene Setup
- [ ] VRCWorld component present and configured
- [ ] Spawn points set (multiple, spread out)
- [ ] Respawn height configured
- [ ] Reference camera set

### Performance (Quest)
- [ ] Draw calls < 100
- [ ] Triangles < 100,000
- [ ] Materials < 50
- [ ] Realtime lights: 0
- [ ] All lighting baked

### Performance (PC)
- [ ] Draw calls < 200
- [ ] Triangles < 1,000,000
- [ ] Materials < 100
- [ ] Realtime lights < 4

---

## Optimization

### Static Objects
- [ ] All non-moving objects marked static
- [ ] Static batching enabled
- [ ] Occlusion culling baked

### Lighting
- [ ] All lights baked
- [ ] Light probes cover playable area
- [ ] Reflection probes placed (1-2)
- [ ] No realtime shadows on Quest

### LODs
- [ ] LOD Groups on large meshes
- [ ] Distant objects cull at reasonable distance

### Textures
- [ ] Textures compressed
- [ ] Mipmaps enabled
- [ ] Reasonable resolutions (1024 typical, 2048 max)

---

## Functionality

### Spawn Area
- [ ] Multiple spawn points (avoid stacking)
- [ ] Clear of obstacles
- [ ] Well lit
- [ ] Safe (no fall hazards)

### Navigation
- [ ] Players can reach all intended areas
- [ ] No out-of-bounds exploits
- [ ] Fall protection where needed

### Interactions
- [ ] All Udon scripts tested
- [ ] Network sync verified (2+ players)
- [ ] Late joiners get correct state
- [ ] Pickups work correctly

---

## Audio

- [ ] Audio sources configured
- [ ] Volume levels balanced
- [ ] 3D sound settings correct
- [ ] No audio clipping

---

## Quest Compatibility

If uploading for Quest:

- [ ] Separate Quest build created
- [ ] Quest SDK selected
- [ ] Performance within Quest limits
- [ ] All shaders Quest-compatible
- [ ] No post-processing
- [ ] Tested on actual Quest hardware

---

## Before Upload

### Final Testing
- [ ] Play mode test in Unity
- [ ] No console errors
- [ ] All interactions work
- [ ] Performance acceptable

### Build Settings
- [ ] Correct platform selected (PC/Android)
- [ ] Build target matches intent
- [ ] SDK control panel shows no errors

### World Info
- [ ] Name is clear and descriptive
- [ ] Description explains the world
- [ ] Tags are appropriate
- [ ] Thumbnail captured

---

## Upload Process

1. Open VRChat SDK Control Panel
2. Click "Build & Publish"
3. Wait for build to complete
4. Fill in world details:
   - Name
   - Description
   - Tags
   - Content warnings (if applicable)
5. Capture/upload thumbnail
6. Click "Upload"

---

## Post-Upload

### Verification
- [ ] World appears in VRChat
- [ ] Can join successfully
- [ ] Everything works in VRChat
- [ ] Quest version works (if applicable)

### Testing in VRChat
- [ ] Solo test complete
- [ ] Multiplayer test (2+ people)
- [ ] Performance acceptable in VRChat
- [ ] No unexpected behaviors

---

## Common Upload Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Build fails | Script errors | Check console |
| Upload stuck | Network issue | Retry |
| World empty | Scene not saved | Save scene |
| Wrong spawn | Spawn not set | Configure VRCWorld |
| Black world | Lighting not baked | Bake lighting |
| Quest crash | Over limits | Optimize further |

---

## Version Control

Before major updates:
- [ ] Backup current project
- [ ] Note current version
- [ ] Document changes
- [ ] Test thoroughly before overwriting
