/*
  COOKIE CONSENT BANNER — My Register
  ------------------------------------------------------------------
  Self-contained feature file. It does NOT require any changes inside
  index.html's <body> — it builds its own banner and styles at runtime.

  HOW TO INSTALL (one-time, one line):
  Add this line just before the closing </body> tag in index.html,
  next to the dark-mode.js line:

      <script src="features/cookie-consent.js"></script>

  That's it. Any future change to the cookie banner only touches
  THIS file — index.html stays untouched.
  ------------------------------------------------------------------
*/
(function () {
  const STORAGE_KEY = 'myreg_cookie_consent'; // '1' = accepted, '0' = declined

  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing !== null) return; // already answered — don't show again

  /* ---------- 1. Styles ---------- */
  const css = `
  #cookieConsentBar{
    position:fixed;left:0;right:0;bottom:0;
    z-index:600;
    background:linear-gradient(135deg,#1E1B2E,#2A2440);
    color:#EDEAF5;
    padding:16px 18px calc(16px + env(safe-area-inset-bottom));
    box-shadow:0 -8px 30px rgba(0,0,0,0.35);
    display:flex;flex-direction:column;gap:12px;
    font-family:'Inter',sans-serif;
    animation:cookieSlideUp .35s ease;
  }
  @keyframes cookieSlideUp{ from{transform:translateY(100%);} to{transform:translateY(0);} }
  #cookieConsentBar p{
    margin:0;font-size:13.5px;line-height:1.6;color:#D9D5E8;
  }
  #cookieConsentBar a{ color:#F3B26A;text-decoration:underline; }
  .cookie-btn-row{ display:flex;gap:10px; }
  .cookie-accept, .cookie-decline{
    flex:1;padding:11px;border:none;border-radius:10px;
    font-weight:700;font-size:13.5px;cursor:pointer;font-family:'Inter',sans-serif;
  }
  .cookie-accept{
    background:linear-gradient(135deg,#F3B26A,#D98F3D);color:#2B1A08;
    box-shadow:0 6px 16px rgba(217,143,61,0.35);
  }
  .cookie-decline{
    background:rgba(255,255,255,0.08);color:#EDEAF5;border:1px solid rgba(255,255,255,0.18);
  }
  @media(min-width:600px){
    #cookieConsentBar{
      flex-direction:row;align-items:center;justify-content:space-between;
      max-width:640px;left:50%;transform:translateX(-50%);
      bottom:16px;border-radius:16px;
    }
    .cookie-btn-row{ flex-shrink:0; }
  }
  `;
  const styleTag = document.createElement('style');
  styleTag.id = 'cookie-consent-styles';
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------- 2. Banner markup ---------- */
  const bar = document.createElement('div');
  bar.id = 'cookieConsentBar';
  bar.innerHTML = `
    <p>This site uses cookies for basic analytics and ads. Your notebook pages themselves are never uploaded — they stay saved only on this device. <a href="/privacy.html">Privacy Policy</a></p>
    <div class="cookie-btn-row">
      <button class="cookie-decline" id="cookieDeclineBtn">Decline</button>
      <button class="cookie-accept" id="cookieAcceptBtn">Accept</button>
    </div>
  `;
  document.body.appendChild(bar);

  function closeBar() {
    bar.style.transition = 'transform .3s ease, opacity .3s ease';
    bar.style.transform = 'translateY(20px)';
    bar.style.opacity = '0';
    setTimeout(() => bar.remove(), 300);
  }

  document.getElementById('cookieAcceptBtn').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, '1');
    closeBar();
  });
  document.getElementById('cookieDeclineBtn').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, '0');
    closeBar();
  });
})();
