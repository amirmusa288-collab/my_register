/*
  DARK MODE — My Register
  ------------------------------------------------------------------
  Self-contained feature file. It does NOT require any changes inside
  index.html's <body> — it builds its own toggle button and injects
  its own <style> tag at runtime.

  HOW TO INSTALL (one-time, one line):
  Add this line just before the closing </body> tag in index.html:

      <script src="features/dark-mode.js"></script>

  That's it. Every future change to dark mode only touches THIS file.
  ------------------------------------------------------------------
*/
(function () {
  const STORAGE_KEY = 'myreg_dark_mode';

  /* ---------- 1. Dark theme CSS (overrides existing CSS variables) ---------- */
  const darkCSS = `
  body.dark-mode{
    background:linear-gradient(160deg,#14161F 0%,#181425 45%,#1C1712 100%) !important;
  }
  body.dark-mode{
    --paper:#211E2B;
    --paper-line:#332F42;
    --paper-shadow:#1A1824;
    --ink:#EDEAF5;
    --muted:#8C87A0;
  }
  body.dark-mode #screenIndex,
  body.dark-mode #screenPage{ background:var(--paper) !important; }
  body.dark-mode .search-box,
  body.dark-mode .jump-row input,
  body.dark-mode .tagged-row,
  body.dark-mode .page-cell,
  body.dark-mode .version-item,
  body.dark-mode .search-result,
  body.dark-mode .calc-row select,
  body.dark-mode .calc-row input,
  body.dark-mode .sub-toolbar select,
  body.dark-mode .sub-toolbar input[type=text],
  body.dark-mode .mini-btn,
  body.dark-mode .modal-sheet,
  body.dark-mode .calc-drawer{
    background:#2A2739 !important;
    color:var(--ink) !important;
    border-color:var(--paper-line) !important;
  }
  body.dark-mode .cover-article{
    background:var(--paper) !important;
    color:var(--ink) !important;
  }
  body.dark-mode .cover-article p,
  body.dark-mode .cover-article li{ color:#C7C2D8 !important; }
  body.dark-mode .sub-toolbar{ background:#241F33 !important; }
  body.dark-mode .tag-bar{ background:#241F33 !important; }
  body.dark-mode #typeArea,
  body.dark-mode .flip-leaf,
  body.dark-mode #drawCanvas{
    background-image:repeating-linear-gradient(var(--paper) 0px, var(--paper) 33px, var(--paper-line) 34px) !important;
    color:var(--ink) !important;
  }
  body.dark-mode .calc-result{ background:#1C1930 !important; }
  body.dark-mode .btn-ghost{ filter:brightness(0.92); }

  /* Floating toggle button */
  #darkModeToggle{
    position:fixed;
    bottom:calc(18px + env(safe-area-inset-bottom));
    right:calc(16px + env(safe-area-inset-right));
    width:48px;height:48px;border-radius:50%;
    background:linear-gradient(135deg,#3A4F8A,#5B4B9A);
    border:2px solid #F3B26A;
    color:#F3B26A;font-size:20px;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 8px 20px rgba(0,0,0,0.35);
    cursor:pointer;z-index:500;
    transition:transform .15s ease;
  }
  #darkModeToggle:active{ transform:scale(0.9); }
  `;

  const styleTag = document.createElement('style');
  styleTag.id = 'dark-mode-styles';
  styleTag.textContent = darkCSS;
  document.head.appendChild(styleTag);

  /* ---------- 2. Floating toggle button ---------- */
  const btn = document.createElement('button');
  btn.id = 'darkModeToggle';
  btn.title = 'Toggle dark mode';

  function isDarkOn() {
    return document.body.classList.contains('dark-mode');
  }
  function setIcon() {
    btn.textContent = isDarkOn() ? '☀️' : '🌙';
  }
  function applyDarkMode(on) {
    document.body.classList.toggle('dark-mode', on);
    setIcon();
    localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
  }
  btn.addEventListener('click', () => applyDarkMode(!isDarkOn()));

  /* ---------- 3. Restore saved preference on load ---------- */
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyDarkMode(saved === null ? prefersDark : saved === '1');

  document.body.appendChild(btn);
})();
