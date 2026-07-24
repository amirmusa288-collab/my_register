/* ===================================================
   MY REGISTER - ALL-IN-ONE ADVANCED FEATURES
   1. PIN Lock Security
   2. Backup & Restore Data
   3. Urdu/English Voice Typing
   =================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initPinLock();
  initBackupSystem();
  initVoiceTyping();
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
                <button class="pin-btn" onclick="verifyPin()">Unlock</button>
            </div>
        `;
  }
  document.body.appendChild(lockHTML);

  // Global functions for PIN logic
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
   2. BACKUP & RESTORE FEATURE
   --------------------------------------------------- */
function initBackupSystem() {
  // Add Backup buttons to UI float container
  const btnContainer = document.createElement("div");
  btnContainer.style.cssText =
    "position: fixed; bottom: 15px; right: 15px; z-index: 999; display: flex; gap: 8px;";

  btnContainer.innerHTML = `
        <button onclick="downloadBackup()" style="background: #2b2319; color: #c5a059; border: 1px solid #c5a059; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px;">💾 Backup</button>
        <button onclick="restoreBackup()" style="background: #2b2319; color: #c5a059; border: 1px solid #c5a059; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px;">📂 Restore</button>
        <input type="file" id="restore-file-input" style="display:none" onchange="handleFileRestore(event)">
    `;
  document.body.appendChild(btnContainer);

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
}

/* ---------------------------------------------------
   3. VOICE TYPING FEATURE
   --------------------------------------------------- */
function initVoiceTyping() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return; // Browser doesn't support speech

  const voiceBtn = document.createElement("button");
  voiceBtn.innerText = "🎙️ Voice Typing";
  voiceBtn.style.cssText =
    "position: fixed; bottom: 15px; left: 15px; z-index: 999; background: #c5a059; color: #1a140e; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 12px;";

  document.body.appendChild(voiceBtn);

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceBtn.onclick = () => {
    const lang = confirm("Click OK for Urdu speech, or Cancel for English speech.")
      ? "ur-PK"
      : "en-US";
    recognition.lang = lang;
    recognition.start();
    voiceBtn.innerText = "🎙️ Listening...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const activeElem = document.activeElement;

    if (
      activeElem &&
      (activeElem.tagName === "TEXTAREA" || activeElem.tagName === "INPUT")
    ) {
      activeElem.value += " " + transcript;
    } else {
      alert("Recognized Text: " + transcript + "\n(Please tap on a page or text box first to insert text)");
    }
    voiceBtn.innerText = "🎙️ Voice Typing";
  };

  recognition.onerror = () => {
    voiceBtn.innerText = "🎙️ Voice Typing";
  };
}
