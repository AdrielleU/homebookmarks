// Site settings and theme. Shared code: per-site values go in settings.yaml, not here.

// Used for anything settings.yaml leaves out.
const DEFAULTS = {
  title: "Home",
  searchUrl: "https://www.google.com/search?q=",
  size: "medium",
  view: "pages",
  viewToggle: true,
  search: "popup",
  searchToggle: true,
  theme: "light",
  themeToggle: true,
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

// Root font size for settings.yaml `size`; the whole page is sized in rem.
const SIZES = { small: 12, medium: 14, large: 16 };

const darkQuery = matchMedia("(prefers-color-scheme: dark)");

// view, search and theme each have a settings.yaml default, which a visitor can
// override with that setting's toolbar button (unless <name>Toggle is false).
// A visitor's choices are kept in their own browser only.
function pref(name) {
  if (SITE[`${name}Toggle`]) {
    try {
      const saved = localStorage.getItem(name);
      if (saved) return saved;
    } catch {}
  }
  return SITE[name];
}

function savePref(name, value) {
  try {
    localStorage.setItem(name, value);
  } catch {
    SITE = { ...SITE, [name]: value, [`${name}Toggle`]: false }; // storage blocked: keep it for this visit
  }
}

function isDark() {
  const mode = pref("theme");
  return mode === "dark" || (mode !== "light" && darkQuery.matches);
}

function applyTheme() {
  const [c50, c100, c200, c400, c500, c700, c800, c900] = PALETTES[SITE.color] ?? PALETTES.slate;
  const dark = isDark();

  const bg = SITE.background;
  // Background images must be local files; remote URLs are ignored.
  const image = bg.image && !String(bg.image).includes(":") ? String(bg.image) : "";
  const opacity = image ? bg.cardOpacity : 1;
  const see = (c) => (opacity < 1 ? `color-mix(in srgb, ${c} ${Math.round(opacity * 100)}%, transparent)` : c);

  const accent = PALETTES[SITE.accent];
  const vars = {
    bg: dark ? c900 : c100,
    card: see(dark ? c800 : "#ffffff"),
    "card-hover": see(dark ? c700 : c200),
    text: dark ? c100 : c900,
    muted: dark ? c400 : image ? c700 : c500,
    accent: accent ? (dark ? accent[3] : accent[5]) : SITE.accent,
    "bg-image": image ? `url("${encodeURI(image)}")` : "none",
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
  applyTheme();
  darkQuery.onchange = applyTheme; // only matters when the mode is "auto"
}
