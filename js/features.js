/* ===================================================
   MY REGISTER - ALL-IN-ONE ADVANCED FEATURES
   1. PIN Lock Security
   2. Backup & Restore Data (Toolbar Buttons)
   3. Voice Typing (Toolbar Buttons)
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
   2. TOOLBAR INTEGRATION (Voice, Backup & Restore)
   --------------------------------------------------- */
function injectToolbarButtons() {
  const style = document.createElement("style");
  style.innerHTML = `
        .custom-feat-btn {
            background-color: #f3e5ab !important;
            color: #2b2319 !important;
            border: 1px solid #c5a059 !important;
            padding: 5px 10px !important;
            font-size: 12px !important;
            font-weight: bold !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            margin-left: 4px !important;
            display: inline-block !important;
            vertical-align: middle !important;
        }
        .custom-feat-btn:hover {
            background-color: #e5d394 !important;
        }
    `;
  document.head.appendChild(style);

  // Function to continuously check and inject buttons into the top toolbar
  const interval = setInterval(() => {
    // Find the toolbar area where Currency Calc or PDF buttons exist
    const buttons = document.querySelectorAll("button, div, span");
    let targetToolbar = null;

    for (let btn of buttons) {
      if (btn.innerText && (btn.innerText.includes("Currency Calc") || btn.innerText.includes("History"))) {
        targetToolbar = btn.parentElement;
        break;
      }
    }

    if (targetToolbar && !document.getElementById("my-custom-features-box")) {
      const box = document.createElement("span");
      box.id = "my-custom-features-box";
      box.innerHTML = `
                <button class="custom-feat-btn" onclick="startVoiceTyping()">🎙️ Voice</button>
                <button class="custom-feat-btn" onclick="downloadBackup()">💾 Backup</button>
                <button class="custom-feat-btn" onclick="restoreBackup()">📂 Restore</button>
                <input type="file" id="restore-file-input" style="display:none" onchange="handleFileRestore(event)">
            `;
      targetToolbar.appendChild(box);
      clearInterval(interval); // Stop searching once successfully added
    }
  }, 500);

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
