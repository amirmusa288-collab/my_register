/* ===================================================
   MY REGISTER - ALL-IN-ONE ADVANCED FEATURES
   1. PIN Lock Security
   2. Backup & Restore Data (Toolbar Integration)
   3. Voice Typing (Toolbar Integration)
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

  // CSS Styles for Lock Overlay
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

  // HTML Structure for Lock
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
                <button class="pin-btn" onclick="saveNewPinPin()">Unlock</button>
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

  window.saveNewPinPin = function () {
    const val = document.getElementById("pin-field").value;
    if (val === localStorage.getItem("myregister_pin")) {
      document.getElementById("register-lock-overlay").remove();
    } else {
      alert("Incorrect PIN! Please try again.");
    }
  };
}

/* ---------------------------------------------------
   2. TOOLBAR INTEGRATION (Voice, Backup & Restore)
   --------------------------------------------------- */
function injectToolbarButtons() {
  // CSS for Toolbar Button Styles matching the site's design
  const style = document.createElement("style");
  style.innerHTML = `
        .custom-tb-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            padding: 6px 12px;
            font-size: 13px;
            font-weight: 600;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            text-decoration: none;
            white-space: nowrap;
            transition: opacity 0.2s;
        }
        .custom-tb-btn:hover { opacity: 0.9; }
        .btn-voice { background-color: #d9a752; color: #111; }
        .btn-backup { background-color: #4a6fa5; color: #fff; }
        .btn-restore { background-color: #6c757d; color: #fff; }
    `;
  document.head.appendChild(style);

  // Function to attach buttons into the top toolbar
  const attachToToolbar = () => {
    // Search for existing toolbar containing Currency Calc / History / PDF
    const allButtons = Array.from(document.querySelectorAll("button, a, div"));
    const calcBtn = allButtons.find(
      (el) => el.textContent && el.textContent.includes("Currency Calc")
    );

    if (calcBtn && calcBtn.parentElement) {
      const parentToolbar = calcBtn.parentElement;

      // Check if already injected to prevent duplication
      if (document.getElementById("injected-features-container")) return;

      const container = document.createElement("span");
      container.id = "injected-features-container";
      container.style.cssText = "display: inline-flex; gap: 6px; margin-left: 6px;";

      container.innerHTML = `
                <button class="custom-tb-btn btn-voice" id="voice-type-btn" onclick="startVoiceTyping()">🎙️ Voice</button>
                <button class="custom-tb-btn btn-backup" onclick="downloadBackup()">💾 Backup</button>
                <button class="custom-tb-btn btn-restore" onclick="restoreBackup()">📂 Restore</button>
                <input type="file" id="restore-file-input" style="display:none" onchange="handleFileRestore(event)">
            `;

      parentToolbar.appendChild(container);
    }
  };

  // Run on load and observe DOM changes (to work properly across page flips/views)
  attachToToolbar();
  const observer = new MutationObserver(attachToToolbar);
  observer.observe(document.body, { childList: true, subtree: true });

  /* --- Backup Logic --- */
  window.downloadBackup = function () {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(localStorage));
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
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const voiceBtn = document.getElementById("voice-type-btn");
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const lang = confirm(
      "Click OK for Urdu speech, or Cancel for English speech."
    )
      ? "ur-PK"
      : "en-US";
    recognition.lang = lang;
    recognition.start();
    if (voiceBtn) voiceBtn.innerText = "🎙️ Listening...";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const activeElem = document.activeElement;

      if (
        activeElem &&
        (activeElem.tagName === "TEXTAREA" || activeElem.tagName === "INPUT")
      ) {
        activeElem.value += " " + transcript;
      } else {
        alert(
          "Recognized Text: " +
            transcript +
            "\n(Please tap on a page or text box first to insert text)"
        );
      }
      if (voiceBtn) voiceBtn.innerText = "🎙️ Voice";
    };

    recognition.onerror = () => {
      if (voiceBtn) voiceBtn.innerText = "🎙️ Voice";
    };

    recognition.onend = () => {
      if (voiceBtn) voiceBtn.innerText = "🎙️ Voice";
    };
  };
}
