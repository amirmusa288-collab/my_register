/*
  BACKUP FEATURE (Export / Import) — My Register
  ------------------------------------------------------------------
  Self-contained feature file. It does NOT require any changes inside
  index.html's <body> — it finds the existing "Export" section on the
  Index screen and adds its own buttons there at runtime.

  HOW TO INSTALL (one-time, one line):
  Add this line just before the closing </body> tag in index.html,
  next to the dark-mode.js and cookie-consent.js lines:

      <script src="features/backup.js"></script>

  That's it. Any future change to backup/restore only touches THIS
  file — index.html stays untouched.
  ------------------------------------------------------------------
*/
(function () {

  function collectAllData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('myreg_')) {
        data[key] = localStorage.getItem(key);
      }
    }
    return data;
  }

  function exportBackup() {
    const payload = {
      app: 'My Register',
      exportedAt: new Date().toISOString(),
      data: collectAllData()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = 'my-register-backup-' + dateStr + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importBackupFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      let parsed;
      try {
        parsed = JSON.parse(e.target.result);
      } catch (err) {
        alert('This file is not a valid backup format.');
        return;
      }
      if (!parsed || typeof parsed.data !== 'object') {
        alert('This file does not look like a My Register backup.');
        return;
      }
      const confirmMsg = 'Replace your current data with this backup? Your existing register will be overwritten.';
      if (!confirm(confirmMsg)) return;

      Object.keys(parsed.data).forEach(key => {
        localStorage.setItem(key, parsed.data[key]);
      });
      alert('Backup restored successfully. Reloading the page.');
      location.reload();
    };
    reader.readAsText(file);
  }

  /* ---------- Inject buttons into the existing Export section ---------- */
  function injectUI() {
    const indexBody = document.querySelector('#screenIndex .index-body');
    if (!indexBody) return;

    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '8px';
    wrap.style.marginBottom = '24px';

    const exportBtn = document.createElement('button');
    exportBtn.textContent = '💾 Export Backup (JSON)';
    exportBtn.style.cssText = 'flex:1;padding:13px;border:none;border-radius:12px;background:linear-gradient(135deg,#1FA971,#178A5E);color:#fff;font-weight:700;font-size:13px;cursor:pointer;font-family:Inter,sans-serif;box-shadow:0 6px 16px rgba(31,169,113,0.3);';
    exportBtn.addEventListener('click', exportBackup);

    const importBtn = document.createElement('button');
    importBtn.textContent = '📂 Import Backup';
    importBtn.style.cssText = 'flex:1;padding:13px;border:none;border-radius:12px;background:linear-gradient(135deg,#3E8FD9,#2E6FB0);color:#fff;font-weight:700;font-size:13px;cursor:pointer;font-family:Inter,sans-serif;box-shadow:0 6px 16px rgba(62,143,217,0.3);';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) importBackupFile(fileInput.files[0]);
      fileInput.value = '';
    });
    importBtn.addEventListener('click', () => fileInput.click());

    wrap.appendChild(exportBtn);
    wrap.appendChild(importBtn);
    wrap.appendChild(fileInput);

    indexBody.appendChild(wrap);
  }

  let attempts = 0;
  const tryInject = setInterval(() => {
    attempts++;
    if (document.querySelector('#screenIndex .index-body')) {
      injectUI();
      clearInterval(tryInject);
    } else if (attempts > 20) {
      clearInterval(tryInject);
    }
  }, 150);
})();
