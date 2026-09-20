# TimeRemapKey ⏱️

A tiny After Effects script that **toggles a Time Remap keyframe at the playhead** on every selected layer. Built to live on a hotkey.

## What it does

Select any number of layers, park the playhead, run the script, and for each layer:

- **No key at the playhead** → adds a Time Remap keyframe there. If the layer doesn't have Time Remapping yet, it's enabled first (After Effects' own in/out keys are kept).
- **Key already at the playhead** → removes it. If that was the last key, Time Remapping is switched back off.

Each layer is decided on its own, so a mixed selection ends up mixed. The new key keeps whatever value the layer already had at that time — nothing jumps.

Afterwards the Time Remap property is revealed in the timeline with **only the new key selected**, so you can hit **F9** straight away. Your layer selection is kept, and it's all one undo step.

## Installation

### As a Regular Script
- Place `TimeRemapKey.jsx` in your **Scripts** folder and run via **File → Scripts → TimeRemapKey.jsx**:
  ```
  Windows: C:\Program Files\Adobe\Adobe After Effects [version]\Support Files\Scripts\
  macOS:   /Applications/Adobe After Effects [version]/Scripts/
  ```

### As a Hotkey (recommended)
- Keep the `.jsx` anywhere and trigger it from your hotkey tool of choice, e.g. AutoHotkey:
  ```ahk
  run, "<path-to-AfterFX.exe>" -r "C:\path\to\TimeRemapKey.jsx"
  ```

## Usage

1. **Open a composition** and select the footage / precomp layer(s) you want to retime.
2. **Move the playhead** to where you want the key.
3. **Run the script** — key added. Run it again on the same frame — key removed.

## Example

```
Freeze-frame in three presses:
  ▶ playhead at 2:00  → run   (key A)
  ▶ playhead at 3:00  → run   (key B)
  drag key B's value to match key A → the layer holds from 2:00 to 3:00
```

## Options

A small config block at the top of the script lets you change the behaviour:

| Option | Default | What it does |
|---|---|---|
| `REVEAL_PROPERTY` | `true` | Show Time Remap in the timeline afterwards |
| `SELECT_NEW_KEY` | `true` | Leave only the new key selected (F9-ready) |
| `KEEP_LAYER_SELECTION` | `true` | Re-select your layers when done |
| `DISABLE_WHEN_EMPTY` | `true` | Removing the last key turns Time Remapping off |

## Requirements

- Adobe After Effects (any version with scripting support)
- Layers that support Time Remapping (footage with duration, precomps). Anything else in the selection — solids, text, shapes, stills — is silently skipped.

## Notes

- A key counts as "at the playhead" if it's within a quarter of a frame, so sub-frame drift won't leave you with two keys on one frame.
- Nothing happens if no composition is active or no layers are selected.

## License

MIT
