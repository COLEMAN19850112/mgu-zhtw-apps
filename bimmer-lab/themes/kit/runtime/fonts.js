'use strict';
/**
 * fonts.js - loads the pre-baked glyph atlases (kit/runtime/fonts/*.json,
 * made by kit/tools/bake_fonts.py) and picks the best size for a request.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DIR = path.join(__dirname, 'fonts');
const families = Object.create(null);

function family(name) {
    if (families[name] !== undefined) return families[name];
    let fam = null;
    try {
        const j = JSON.parse(fs.readFileSync(path.join(DIR, name + '.json'), 'utf8'));
        fam = j.sizes.map((s) => ({
            size: s.size, ascent: s.ascent, descent: s.descent, atlasW: s.atlasW, atlasH: s.atlasH,
            glyphs: s.glyphs, _alpha: s.alpha, alpha: null, family: name, cacheKey: j.cacheKey || '',
        }));
    } catch (e) { fam = null; }
    families[name] = fam;
    return fam;
}

/** Smallest baked size >= requested (downscaling looks better), else largest. */
function get(name, size, text) {
    // Shared supplemental atlases avoid duplicating glyphs in every numeric size.
    if (text && /[\u3000-\u9fff\uff00-\uffef]/.test(text)) name = 'cjk';
    else if (text && /[\u0400-\u04ff]/.test(text)) name = 'cyrillic';
    const fam = family(name) || family('label');
    if (!fam) return null;
    let best = null;
    for (const f of fam) if (f.size >= size && (!best || f.size < best.size)) best = f;
    if (!best) best = fam[fam.length - 1];
    if (!best.alpha) best.alpha = zlib.inflateSync(Buffer.from(best._alpha, 'base64'));
    return best;
}

function measure(f, s) {
    let w = 0;
    for (const ch of s) { const g = f.glyphs[ch.codePointAt(0)] || f.glyphs[63]; if (g) w += g[6]; }
    return w;
}


// Center-only GPU transport: exact HUD Widgets base, plus the 24 Cluster Themes glyphs.
// get()/measure()/software Canvas keep the original 21 atlas untouched.
function gpuGlyph(f, code) {
    if (f.family !== 'cjk') return { font: f, glyph: f.glyphs[code] || f.glyphs[63] };
    const bases = family('cjk-hud20-base'), extras = family('cjk-ct21-extra');
    const base = bases && bases.find((x) => x.size === f.size);
    const extra = extras && extras.find((x) => x.size === f.size);
    if (!base || !extra) throw new Error('CT21 center font resources missing');
    code = f.glyphs[code] ? code : 63; // retain the original missing-character '?' fallback
    const chosen = base.glyphs[code] ? base : extra.glyphs[code] ? extra : null;
    if (!chosen) throw new Error('CT21 center glyph missing: ' + code);
    if (!chosen.alpha) chosen.alpha = zlib.inflateSync(Buffer.from(chosen._alpha, 'base64'));
    if (chosen === base) chosen.family = 'cjk';
    return { font: chosen, glyph: chosen.glyphs[code] };
}

module.exports = { get, measure, gpuGlyph };
