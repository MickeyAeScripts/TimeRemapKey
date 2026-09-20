// TimeRemapKey.jsx
// Toggles a Time Remap keyframe at the playhead on every selected layer.
//   - no key at the playhead -> adds one (enabling Time Remapping first if
//     the layer doesn't have it yet; AE's own in/out keys are kept)
//   - key already at the playhead -> removes it
// Each layer is decided on its own, so a mixed selection ends up mixed.
// Keyframe times in the AE API are composition time, so comp.time is used
// as-is (verified on layers with a non-zero startTime).
(function () {
    // ---- config (tweak here for future variations) -------------------------
    var CFG = {
        REVEAL_PROPERTY: true,  // show Time Remap in the timeline afterwards
        SELECT_NEW_KEY: true,   // leave the new key(s) selected (F9-ready)
        KEEP_LAYER_SELECTION: true,
        DISABLE_WHEN_EMPTY: true // removing the last key turns Time Remap off
    };
    // -----------------------------------------------------------------------

    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) return;

    var layers = comp.selectedLayers.slice(0);
    if (!layers || layers.length === 0) return;

    var t = comp.time;
    var EPS = comp.frameDuration / 4;

    function canRemap(layer) {
        if (!(layer instanceof AVLayer)) return false;
        if (layer.timeRemapEnabled) return true;
        try { return layer.canSetTimeRemapEnabled; } catch (e) { return false; }
    }

    function keyIndexAtTime(p, kt) {
        if (p.numKeys === 0) return -1;
        var i = p.nearestKeyIndex(kt);
        return (Math.abs(p.keyTime(i) - kt) < EPS) ? i : -1;
    }

    var touched = [];

    app.beginUndoGroup("Toggle Time Remap Keyframe");
    try {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (!canRemap(layer)) continue;

            // a layer without Time Remapping has no key here by definition,
            // so this branch is always an "add"
            if (!layer.timeRemapEnabled) layer.timeRemapEnabled = true;

            var tr = layer.timeRemap;
            if (!tr || !tr.canVaryOverTime) continue;

            var idx = keyIndexAtTime(tr, t);
            if (idx !== -1) {
                tr.removeKey(idx);
                if (CFG.DISABLE_WHEN_EMPTY && tr.numKeys === 0) {
                    try { layer.timeRemapEnabled = false; continue; } catch (e) {}
                }
                if (CFG.REVEAL_PROPERTY) touched.push({ prop: tr, key: -1 });
            } else {
                // addKey() keeps the value the property already has at that time
                touched.push({ prop: tr, key: tr.addKey(t) });
            }
        }

        for (i = 0; i < touched.length; i++) {
            var tp = touched[i];
            try {
                // selecting the property also selects all of its keys, so
                // narrow it down to just the new one afterwards -- and on a
                // removal (tp.key === -1) that means clearing them all, since
                // there is no new key to leave selected
                if (CFG.REVEAL_PROPERTY) tp.prop.selected = true;
                if (CFG.SELECT_NEW_KEY || tp.key === -1) {
                    for (var k = 1; k <= tp.prop.numKeys; k++) {
                        tp.prop.setSelectedAtKey(k, k === tp.key);
                    }
                }
            } catch (e) {}
        }

        if (CFG.KEEP_LAYER_SELECTION) {
            for (i = 0; i < layers.length; i++) {
                try { layers[i].selected = true; } catch (e) {}
            }
        }
    } finally {
        app.endUndoGroup();
    }
})();
