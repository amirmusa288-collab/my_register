/* ===================================================
   MY REGISTER - ULTIMATE ALL-IN-ONE FEATURES
   1. Secure PIN Lock
   2. Voice Typing, Backup, & Restore (Seamless Toolbar Integration)
   =================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initPinLock();
  injectToolbarButtons();
});

/* ---------------------------------------------------
   1. PIN LOCK FEATURE
   --------------------------------------------------- */
function initPinLock() {
  const savedPin = localStorage.getItem("myregister_pin");

  const style = document.createElement("style");
  style.innerHTML = `
        #register-lock-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(18, 18, 18, 0.98); color: #e0c79b;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 99999; font-family: sans-serif; text-align: center;
        }
        .pin-box {
            background: #2b2319; border: 2px solid #c5a059; padding: 30px;
            border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); width: 280px;
        }
        .pin-input {
            width: 80%; padding: 10px; font-size: 22px; text-align: center;
            letter-spacing: 5px; margin: 15px 0; border: 1px solid #c5a059;
            background: #1a140e; color: #fff; border-radius: 6px;
        }
        .pin-btn {
            background: #c5a059; color: #1a140e; border: none; padding: 10px 20px;
            font-size: 16px; font-weight: bold; border-radius: 6px; cursor: pointer; width: 90%;
        }
    `;
  document.head.appendChild(style);

  const lockHTML = document.createElement("div");
  lockHTML.id = "register-lock-overlay";

  if (!savedPin) {
    lockHTML.innerHTML = `
            <div class="pin-box">
                <h2>🔐 Set Security PIN</h2>
                <p style="font-size: 13px; color: #ccc;">Create a 4-digit PIN for your register</p>
                <input type="password" id="pin-field" class="pin-input" maxlength="4" placeholder="****">
                <button class="pin-btn" onclick="saveNewPin()">Save PIN</button>
            </div>
        `;
  } else {
    lockHTML.innerHTML = `
            <div class="pin-box">
                <h2>🔒 Register Locked</h2>
                <p style="font-size: 13px; color: #ccc;">Enter your 4-digit PIN</p>
                <input type="password" id="pin-field" class="pin-input" maxlength="4" placeholder="****">
                <button class="pin-btn" onclick="verifyPin()">Unlock</button>
            </div>
        `;
  }
  document.body.appendChild(lockHTML);

  window.saveNewPin = function () {
    const val = document.getElementById("pin-field").value;
    if (val.length === 4) {
      localStorage.setItem("myregister_pin", val);
      alert("PIN set successfully!");
      document.getElementById("register-lock-overlay").remove();
    } else {
      alert("Please enter a valid 4-digit PIN.");
    }
  };

  window.verifyPin = function () {
    const val = document.getElementById("pin-field").value;
    if (val === localStorage.getItem("myregister_pin")) {
      document.getElementById("register-lock-overlay").remove();
    } else {
      alert("Incorrect PIN! Please try again.");
    }
  };
}

/* ---------------------------------------------------
   2. TOOLBAR INTEGRATION FOR BUTTONS
   --------------------------------------------------- */
function injectToolbarButtons() {
  const style = document.createElement("style");
  style.innerHTML = `
        .site-style-btn {
            display: inline-flex !important;
            align-items: center !important;
            gap: 5px !important;
            padding: 6px 14px !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            border-radius: 8px !important;
            border: none !important;
            cursor: pointer !important;
            color: #ffffff !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            transition: transform 0.1s ease, opacity 0.2s !important;
            font-family: inherit !important;
        }
        .site-style-btn:active {
            transform: scale(0.96) !important;
        }
        .btn-color-voice { background-color: #2bbd7e !important; }
        .btn-color-backup { background-color: #8e44ad !important; }
        .btn-color-restore { background-color: #e67e22 !important; }
    `;
  document.head.appendChild(style);

  const checkInterval = setInterval(() => {
    const pdfBtn = Array.from(document.querySelectorAll("button, a, div")).find(
      (el) => el.textContent && el.textContent.trim().endsWith("PDF")
    );

    if (pdfBtn && pdfBtn.parentElement) {
      const toolbarContainer = pdfBtn.parentElement;

      if (!document.getElementById("matched-features-group")) {
        const group = document.createElement("div");
        group.id = "matched-features-group";
        group.style.cssText = "display: inline-flex; gap: 8px; margin-left: 8px;";

        group.innerHTML = `
                    <button class="site-style-btn btn-color-voice" onclick="startVoiceTyping()">🎙️ Voice</button>
                    <button class="site-style-btn btn-color-backup" onclick="downloadBackup()">💾 Backup</button>
                    <button class="site-style-btn btn-color-restore" onclick="restoreBackup()">📂 Restore</button>
                    <input type="file" id="restore-file-input" style="display:none" onchange="handleFileRestore(event)">
                `;

        toolbarContainer.appendChild(group);
      }
      clearInterval(checkInterval);
    }
  }, 300);

  /* --- Backup System Logic --- */
  window.downloadBackup = function () {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "MyRegister_Backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  window.restoreBackup = function () {
    document.getElementById("restore-file-input").click();
  };

  window.handleFileRestore = function (event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach((key) => {
          localStorage.setItem(key, data[key]);
        });
        alert("Data restored successfully!");
        location.reload();
      } catch (err) {
        alert("Invalid file format. Please upload a valid JSON backup file.");
      }
    };
    fileReader.readAsText(event.target.files[0]);
  };

  /* --- Voice Typing Logic --- */
  window.startVoiceTyping = function () {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const lang = confirm("Click OK for Urdu speech, or Cancel for English speech.") ? "ur-PK" : "en-US";
    recognition.lang = lang;
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const activeElem = document.activeElement;

      if (activeElem && (activeElem.tagName === "TEXTAREA" || activeElem.tagName === "INPUT")) {
        activeElem.value += " " + transcript;
      } else {
        alert("Recognized Text: " + transcript + "\n(Please tap on a page or text box first to insert text)");
      }
    };
  };
}
