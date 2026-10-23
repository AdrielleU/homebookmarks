// Site settings and theme. Shared code: per-site values go in settings.yaml, not here.

// Used for anything settings.yaml leaves out.
const DEFAULTS = {
  title: "Home",
  searchUrl: "https://www.google.com/search?q=",
  size: "medium",
  view: "all",
  viewToggle: true,
  theme: "light",
  customize: true,
  color: "slate",
  accent: "sky",
  background: {
    image: "",
    blur: 0,
    brightness: 0.7,
    saturate: 1,
    cardOpacity: 0.6,
    cardBlur: "md",
  },
};

let SITE = DEFAULTS;

// Tailwind shades per color: 50, 100, 200, 400, 500, 700, 800, 900
const PALETTES = {
  slate:   ["#f8fafc", "#f1f5f9", "#e2e8f0", "#94a3b8", "#64748b", "#334155", "#1e293b", "#0f172a"],
  gray:    ["#f9fafb", "#f3f4f6", "#e5e7eb", "#9ca3af", "#6b7280", "#374151", "#1f2937", "#111827"],
  zinc:    ["#fafafa", "#f4f4f5", "#e4e4e7", "#a1a1aa", "#71717a", "#3f3f46", "#27272a", "#18181b"],
  neutral: ["#fafafa", "#f5f5f5", "#e5e5e5", "#a3a3a3", "#737373", "#404040", "#262626", "#171717"],
  stone:   ["#fafaf9", "#f5f5f4", "#e7e5e4", "#a8a29e", "#78716c", "#44403c", "#292524", "#1c1917"],
  red:     ["#fef2f2", "#fee2e2", "#fecaca", "#f87171", "#ef4444", "#b91c1c", "#991b1b", "#7f1d1d"],
  orange:  ["#fff7ed", "#ffedd5", "#fed7aa", "#fb923c", "#f97316", "#c2410c", "#9a3412", "#7c2d12"],
  amber:   ["#fffbeb", "#fef3c7", "#fde68a", "#fbbf24", "#f59e0b", "#b45309", "#92400e", "#78350f"],
  emerald: ["#ecfdf5", "#d1fae5", "#a7f3d0", "#34d399", "#10b981", "#047857", "#065f46", "#064e3b"],
  teal:    ["#f0fdfa", "#ccfbf1", "#99f6e4", "#2dd4bf", "#14b8a6", "#0f766e", "#115e59", "#134e4a"],
  sky:     ["#f0f9ff", "#e0f2fe", "#bae6fd", "#38bdf8", "#0ea5e9", "#0369a1", "#075985", "#0c4a6e"],
  blue:    ["#eff6ff", "#dbeafe", "#bfdbfe", "#60a5fa", "#3b82f6", "#1d4ed8", "#1e40af", "#1e3a8a"],
  indigo:  ["#eef2ff", "#e0e7ff", "#c7d2fe", "#818cf8", "#6366f1", "#4338ca", "#3730a3", "#312e81"],
  violet:  ["#f5f3ff", "#ede9fe", "#ddd6fe", "#a78bfa", "#8b5cf6", "#6d28d9", "#5b21b6", "#4c1d95"],
  purple:  ["#faf5ff", "#f3e8ff", "#e9d5ff", "#c084fc", "#a855f7", "#7e22ce", "#6b21a8", "#581c87"],
  rose:    ["#fff1f2", "#ffe4e6", "#fecdd3", "#fb7185", "#f43f5e", "#be123c", "#9f1239", "#881337"],
};

// Photos in lib/backgrounds/, each with a small preview in lib/backgrounds/thumbs/.
const BACKGROUNDS = [
  "alps-clouds", "beach", "desert-stars", "earth-night", "forest", "gradient-ocean", "gradient-rainbow",
  "highlands", "misty-hills", "mountain-valley", "night-sky", "red-mountains", "starry-peaks", "yosemite",
];

// Root font size for settings.yaml `size`; the whole page is sized in rem.
const SIZES = { small: 12, medium: 14, large: 16 };

const darkQuery = matchMedia("(prefers-color-scheme: dark)");

// settings.yaml sets the starting look; a visitor can change view with its toolbar
// button (unless viewToggle is false), and mode, background and colors in the gear
// menu (unless customize is false). Their choices stay in their own browser.
const unsaved = {}; // used for this visit when the browser blocks storage

// Colors a visitor can set, each kept separately for light and dark mode
// (stored as "light.accent", "dark.card", ...; the background too, as "light.background").
// Unset = the site's default look.
const COLORS = ["accent", "color", "text", "muted", "card"];
const MODES = ["light", "dark"];

function readPref(key) {
  if (key in unsaved) return unsaved[key];
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function savePref(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
    delete unsaved[key];
  } catch {
    unsaved[key] = value ?? null;
  }
}

// view or theme: the visitor's choice, or the site's setting.
function pref(name) {
  if (name === "view" ? SITE.viewToggle : SITE.customize) {
    const saved = readPref(name);
    if (saved !== null) return saved;
  }
  return SITE[name];
}

// A bundled photo's name, from "forest", "forest.jpg" or "backgrounds/forest.jpg"; else null.
function photoName(value) {
  const m = /^(?:backgrounds\/)?([\w-]+?)(?:\.jpg)?$/.exec(String(value ?? ""));
  return m && BACKGROUNDS.includes(m[1]) ? m[1] : null;
}

// Where an image lives: bundled photos in lib/backgrounds/, your own in config/images/.
function imageUrl(value) {
  const name = photoName(value);
  return name ? `lib/backgrounds/${name}.jpg` : `config/images/${value}`;
}

// settings.yaml's background.image: one image for both modes, or { light: ..., dark: ... }.
// Bundled photos are kept as "backgrounds/<name>.jpg", the same form visitors' choices use.
function siteBackground(mode) {
  const image = SITE.background.image;
  const value = (image && typeof image === "object" ? image[mode] : image) || "";
  const name = photoName(value);
  return name ? `backgrounds/${name}.jpg` : value;
}

// The background for one mode: the visitor's choice ("" = none), or the site's.
function backgroundFor(mode) {
  if (SITE.customize) {
    const saved = readPref(`${mode}.background`);
    if (saved !== null) return saved;
  }
  return siteBackground(mode);
}

// A visitor's color for one mode, or null to use the site's default.
function customColor(name, mode) {
  if (!SITE.customize) return null;
  const value = readPref(`${mode}.${name}`);
  return value && (isHex(value) || PALETTES[value]) ? value : null;
}

function setColor(name, mode, value) {
  savePref(`${mode}.${name}`, value ? value.toLowerCase() : null);
}

function resetPrefs() {
  for (const key of ["theme", ...MODES.flatMap((m) => [`${m}.background`, ...COLORS.map((c) => `${m}.${c}`)])]) savePref(key, null);
}

// Before they were per mode, the background, accent and color were saved once for both.
function upgradePrefs() {
  for (const name of ["background", "accent", "color"]) {
    const old = readPref(name);
    if (old === null) continue;
    for (const mode of MODES) if (readPref(`${mode}.${name}`) === null) savePref(`${mode}.${name}`, old);
    savePref(name, null);
  }
}

const isHex = (c) => /^#[0-9a-f]{6}$/i.test(c);

// A color name from PALETTES, or shades made from any hex color by mixing it with white and black.
function shadesOf(color) {
  if (PALETTES[color]) return PALETTES[color];
  if (!isHex(color)) return null;
  const rgb = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
  const mix = (to, t) => "#" + rgb.map((c) => Math.round(c + (to - c) * t).toString(16).padStart(2, "0")).join("");
  return [mix(255, 0.95), mix(255, 0.9), mix(255, 0.75), mix(255, 0.3), color, mix(0, 0.35), mix(0, 0.6), mix(0, 0.78)];
}

const hexOf = (color) => (isHex(color) ? color.toLowerCase() : (shadesOf(color) ?? PALETTES.slate)[4]);

// ---- Seeds: a visitor's whole look as one number, to share or load elsewhere ----
// Bits, lowest first: format (2, always 3), mode (2), view (1), light-mode background
// (5: 0 none, 1 the site's own image, 2+ a photo in BACKGROUNDS), which colors are set
// (10: light then dark, in COLORS order), 24 bits for each color that is set, then the
// dark-mode background plus 1 (5). Seeds from before per-mode backgrounds end after the
// colors and use one background for both modes.
// The last two digits are a check (the number mod 97), so a mistyped seed is rejected.
const THEMES = ["light", "dark", "auto"];
const SEED_FORMAT = 3n;

function backgroundCode(mode) {
  const bg = backgroundFor(mode);
  const photo = BACKGROUNDS.findIndex((n) => bg === `backgrounds/${n}.jpg`);
  return BigInt(photo >= 0 ? photo + 2 : bg ? 1 : 0);
}

function makeSeed() {
  const colors = MODES.flatMap((mode) => COLORS.map((name) => customColor(name, mode)));
  const fields = [
    [SEED_FORMAT, 2n],
    [BigInt(Math.max(0, THEMES.indexOf(pref("theme")))), 2n],
    [pref("view") === "all" ? 1n : 0n, 1n],
    [backgroundCode("light"), 5n],
    [BigInt(colors.reduce((mask, c, i) => (c ? mask | (1 << i) : mask), 0)), 10n],
    ...colors.filter(Boolean).map((c) => [BigInt("0x" + hexOf(c).slice(1)), 24n]),
    [backgroundCode("dark") + 1n, 5n],
  ];
  let n = 0n;
  let shift = 0n;
  for (const [value, bits] of fields) {
    n |= value << shift;
    shift += bits;
  }
  return `${n}${String(n % 97n).padStart(2, "0")}`;
}

// Returns the settings in a seed, or null if it isn't a valid one.
function readSeed(seed) {
  const digits = String(seed).replace(/[\s,.-]/g, "");
  if (!/^\d{3,}$/.test(digits)) return null;
  const n = BigInt(digits.slice(0, -2));
  if (n % 97n !== BigInt(digits.slice(-2))) return null;
  let rest = n;
  const take = (bits) => {
    const value = rest & ((1n << BigInt(bits)) - 1n);
    rest >>= BigInt(bits);
    return Number(value);
  };
  const hex = (v) => "#" + v.toString(16).padStart(6, "0");
  const photoOf = (bg, mode) => (bg === 0 ? "" : bg === 1 ? siteBackground(mode) : `backgrounds/${BACKGROUNDS[bg - 2]}.jpg`);
  const valid = (bg) => bg <= BACKGROUNDS.length + 1;
  const colors = {};

  if ((n & 3n) === SEED_FORMAT) {
    take(2);
    const theme = THEMES[take(2)];
    const view = take(1) ? "all" : "pages";
    const bg = take(5);
    const mask = take(10);
    MODES.forEach((mode, m) => COLORS.forEach((name, c) => {
      if (mask & (1 << (m * COLORS.length + c))) colors[`${mode}.${name}`] = hex(take(24));
    }));
    const dark = rest === 0n ? bg : take(5) - 1; // older seeds: same background in both modes
    if (rest !== 0n || !theme || !valid(bg) || dark < 0 || !valid(dark)) return null;
    return { theme, view, backgrounds: { light: photoOf(bg, "light"), dark: photoOf(dark, "dark") }, colors };
  }

  // First format: mode, view, background, then one primary and one secondary color for both modes.
  const theme = THEMES[take(2)];
  const view = take(1) ? "all" : "pages";
  const bg = take(5);
  const accent = hex(take(24));
  const color = hex(take(24));
  if (take(2) !== 1 || rest !== 0n || !theme || !valid(bg)) return null;
  for (const mode of MODES) Object.assign(colors, { [`${mode}.accent`]: accent, [`${mode}.color`]: color });
  return { theme, view, backgrounds: { light: photoOf(bg, "light"), dark: photoOf(bg, "dark") }, colors };
}

function loadSeed(seed) {
  const values = readSeed(seed);
  if (!values) return false;
  resetPrefs();
  savePref("theme", values.theme);
  savePref("view", values.view);
  for (const mode of MODES) savePref(`${mode}.background`, values.backgrounds[mode]);
  for (const [key, value] of Object.entries(values.colors)) savePref(key, value);
  return true;
}

function isDark() {
  const mode = pref("theme");
  return mode === "dark" || (mode !== "light" && darkQuery.matches);
}

// The colors in use right now, after the visitor's choices, for the gear menu to show.
let CURRENT = {};

function applyTheme() {
  const dark = isDark();
  const mode = dark ? "dark" : "light";
  const mine = (name) => customColor(name, mode);
  const [c50, c100, c200, c400, c500, c700, c800, c900] = shadesOf(mine("color") ?? SITE.color) ?? PALETTES.slate;

  const bg = SITE.background;
  // Background images must be local files; remote URLs are ignored.
  const chosen = backgroundFor(mode);
  const image = chosen && !String(chosen).includes(":") ? String(chosen) : "";
  const opacity = image ? bg.cardOpacity : 1;
  const see = (c) => (opacity < 1 ? `color-mix(in srgb, ${c} ${Math.round(opacity * 100)}%, transparent)` : c);

  const accentName = mine("accent") ?? SITE.accent;
  const palette = PALETTES[accentName];
  const text = mine("text") ?? (dark ? c100 : c900);
  const card = mine("card") ?? (dark ? c800 : "#ffffff");
  CURRENT = {
    accent: palette ? (dark ? palette[3] : palette[5]) : isHex(accentName) ? accentName : PALETTES.sky[dark ? 3 : 5],
    color: hexOf(mine("color") ?? SITE.color),
    text,
    muted: mine("muted") ?? (image ? (dark ? c200 : c700) : dark ? c400 : c500), // text right on a photo needs more contrast
    card,
  };
  const vars = {
    bg: dark ? c900 : c100,
    card: see(card),
    // Hovered cards lean toward the text color, so they stand out from any card color.
    "card-hover": see(mine("card") ? `color-mix(in srgb, ${card} 85%, ${text})` : dark ? c700 : c200),
    text,
    muted: CURRENT.muted,
    accent: CURRENT.accent,
    "bg-image": image ? `url("${encodeURI(imageUrl(image))}")` : "none",
    "bg-blur": `${bg.blur}px`,
    // Text sits right on the image, so dark mode dims it and light mode fades it toward white.
    "bg-brightness": image && dark ? bg.brightness : 1,
    "bg-wash": image && !dark ? `rgb(255 255 255 / ${Math.min(0.85, Math.max(0, (1 - bg.brightness) * 2)).toFixed(2)})` : "transparent",
    "bg-saturate": bg.saturate,
    "mono-filter": dark ? "invert(0.9)" : "invert(0.15)",
    // Same names as Homepage's cardBlur, or a number of px.
    "card-blur": `${{ none: 0, xs: 2, sm: 4, md: 12, lg: 16, xl: 24 }[bg.cardBlur] ?? (bg.cardBlur || 0)}px`,
  };
  const root = document.documentElement;
  root.style.colorScheme = dark ? "dark" : "light";
  root.style.fontSize = `${SIZES[SITE.size] ?? (Number(SITE.size) || SIZES.medium)}px`;
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(`--${k}`, v);
}

// Merge settings.yaml over the defaults and apply them.
function applySettings(data) {
  data = data && typeof data === "object" ? data : {};
  SITE = { ...DEFAULTS, ...data, background: { ...DEFAULTS.background, ...(data.background ?? {}) } };
  if (data.customize === undefined && data.themeToggle === false) SITE.customize = false; // older settings.yaml
  upgradePrefs();
  applyTheme();
  darkQuery.onchange = applyTheme; // only matters when the mode is "auto"
}
