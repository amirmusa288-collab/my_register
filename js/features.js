/* ===================================================
   MY REGISTER - GUARANTEED VISIBLE TOOLBAR & FEATURES
   =================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initPinLock();
  createAlwaysVisibleToolbar();
});

/* ---------------------------------------------------
   1. SECURITY PIN LOCK
   --------------------------------------------------- */
function initPinLock() {
  const savedPin = localStorage.getItem("myregister_pin");

  const style = document.createElement("style");
  style.innerHTML = `
        #register-lock-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(18, 18, 18, 0.98); color: #e0c79b;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 999999; font-family: sans-serif; text-align: center;
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
   2. ALWAYS-VISIBLE TOOLBAR (INDEPENDENT INJECTION)
   --------------------------------------------------- */
function createAlwaysVisibleToolbar() {
  const style = document.createElement("style");
  style.innerHTML = `
        #custom-register-toolbar {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 8px !important;
            padding: 6px 10px !important;
            background-color: #fdf8eb !important;
            border-bottom: 1px solid #e0d0b0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
            z-index: 99999 !important;
        }
        .custom-site-btn {
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
            padding: 6px 12px !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            border-radius: 8px !important;
            border: none !important;
            cursor: pointer !important;
            color: #ffffff !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15) !important;
            font-family: inherit !important;
        }
        .custom-site-btn:active {
            transform: scale(0.96) !important;
        }
        .btn-voice { background-color: #2bbd7e !important; }
        .btn-backup { background-color: #8e44ad !important; }
        .btn-restore { background-color: #e67e22 !important; }
    `;
  document.head.appendChild(style);

  // Inject Custom Row at top of Page Area
  const toolbar = document.createElement("div");
  toolbar.id = "custom-register-toolbar";
  toolbar.innerHTML = `
        <button class="custom-site-btn btn-voice" onclick="startVoiceTyping()">🎙️ Voice</button>
        <button class="custom-site-btn btn-backup" onclick="downloadBackup()">💾 Backup</button>
        <button class="custom-site-btn btn-restore" onclick="restoreBackup()">📂 Restore</button>
        <input type="file" id="restore-file-input" style="display:none" onchange="handleFileRestore(event)">
    `;

  // Always put it right after the header or at the very top of body
  document.body.prepend(toolbar);

  /* --- Backup Logic --- */
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
