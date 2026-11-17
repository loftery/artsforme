const THEMES = {
  default: { name: "Тёмное фэнтези", font: "'Cormorant Garamond', serif", googleFont: "Cormorant+Garamond:wght@400;600;700", vars: { "--bg":"#101722", "--bg2":"#172231", "--card":"#1b2838", "--card2":"#202f42", "--text":"#e7edf4", "--muted":"#b4c0ce", "--line":"#344459", "--accent":"#b7a06a", "--accent2":"#e0c98d", "--accent-soft":"rgba(183,160,106,.16)" } },
  roblox: { name: "Roblox", font: "'Rubik', sans-serif", googleFont: "Rubik:wght@400;600;800", vars: { "--bg":"#fff5f2", "--bg2":"#ffe8e2", "--card":"#ffffff", "--text":"#2a1a1a", "--muted":"#765b58", "--line":"#f2d5d0", "--accent":"#e2231a", "--accent2":"#0074bd", "--accent-soft":"rgba(226,35,26,.1)" } },
  doors: { name: "Doors", font: "'Special Elite', cursive", googleFont: "Special+Elite", vars: { "--bg":"#1a1a1a", "--bg2":"#242424", "--card":"#2d2d2d", "--card2":"#333", "--text":"#f5e6b8", "--muted":"#c6bb9e", "--line":"#3d3d3d", "--accent":"#f5c518", "--accent2":"#ffdf4d", "--accent-soft":"rgba(245,197,24,.15)" } },
  pressure: { name: "Pressure", font: "'Oswald', sans-serif", googleFont: "Oswald:wght@400;600;700", vars: { "--bg":"#0d1420", "--bg2":"#131c2b", "--card":"#1a2436", "--card2":"#202b40", "--text":"#d6e2f0", "--muted":"#aebed2", "--line":"#253349", "--accent":"#ff3b3b", "--accent2":"#4a9eff", "--accent-soft":"rgba(255,59,59,.15)" } },
  hollow: { name: "Hollow Knight", font: "'Cormorant Garamond', serif", googleFont: "Cormorant+Garamond:wght@400;600;700", vars: { "--bg":"#eef1f4", "--bg2":"#e0e6ec", "--card":"#ffffff", "--text":"#1a2530", "--muted":"#53677d", "--line":"#cdd6df", "--accent":"#2c4a6e", "--accent2":"#7fa8c9", "--accent-soft":"rgba(44,74,110,.1)" } },
  silksong: { name: "Silksong", font: "'Cormorant Garamond', serif", googleFont: "Cormorant+Garamond:ital,wght@1,400;1,600", vars: { "--bg":"#fdf0f0", "--bg2":"#f8e0e0", "--card":"#ffffff", "--text":"#2e1a1f", "--muted":"#80515a", "--line":"#f0cccf", "--accent":"#b8243a", "--accent2":"#e05a6e", "--accent-soft":"rgba(184,36,58,.1)" } },
  undertale: { name: "Undertale", font: "'Press Start 2P', monospace", googleFont: "Press+Start+2P", vars: { "--bg":"#1a1a1a", "--bg2":"#222", "--card":"#2a2a2a", "--card2":"#333", "--text":"#ffffff", "--muted":"#c2c2c2", "--line":"#404040", "--accent":"#ff0000", "--accent2":"#ff5555", "--accent-soft":"rgba(255,0,0,.15)" } },
  deltarune: { name: "Deltarune", font: "'VT323', monospace", googleFont: "VT323", vars: { "--bg":"#1a1428", "--bg2":"#241c38", "--card":"#2e2444", "--card2":"#382c52", "--text":"#e8e0f5", "--muted":"#c0b2db", "--line":"#40345e", "--accent":"#a855f7", "--accent2":"#d8a0ff", "--accent-soft":"rgba(168,85,247,.15)" } },
  oneshot: { name: "OneShot", font: "'Pixelify Sans', sans-serif", googleFont: "Pixelify+Sans:wght@400;600;700", vars: { "--bg":"#fef6e8", "--bg2":"#fceacb", "--card":"#ffffff", "--text":"#3a2a1a", "--muted":"#806746", "--line":"#f0dcc0", "--accent":"#e8933a", "--accent2":"#f5b866", "--accent-soft":"rgba(232,147,58,.12)" } },
  ultrakill: { name: "Ultrakill", font: "'Bebas Neue', sans-serif", googleFont: "Bebas+Neue", vars: { "--bg":"#0a0a0a", "--bg2":"#141414", "--card":"#1a1a1a", "--card2":"#222", "--text":"#f0e0e0", "--muted":"#c29a9f", "--line":"#333", "--accent":"#c8102e", "--accent2":"#ff2d4d", "--accent-soft":"rgba(200,16,46,.2)" } }
};

function applyTheme(themeId) {
  const t = THEMES[themeId] || THEMES.default;
  const linkId = 'gfont-' + themeId;
  if (!document.getElementById(linkId) && t.googleFont) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${t.googleFont}&display=swap`;
    document.head.appendChild(link);
  }
  document.body.style.fontFamily = t.font;
  for (const [k,v] of Object.entries(t.vars)) {
    document.documentElement.style.setProperty(k, v);
  }
  document.body.dataset.theme = themeId;
  localStorage.setItem('artist_theme', themeId);
}
window.APP_THEMES = { THEMES, applyTheme };
