  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
  import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
  } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
  import {
    getDatabase,
    ref,
    set,
    onValue
  } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwtHHjiz4QGcPBCPCo1qxgXSEJIhcgxR0",
  authDomain: "home-automation-46f52.firebaseapp.com",
  databaseURL: "https://home-automation-46f52-default-rtdb.firebaseio.com",
  projectId: "home-automation-46f52",
  storageBucket: "home-automation-46f52.firebasestorage.app",
  messagingSenderId: "698399850115",
  appId: "1:698399850115:web:0849860e87222dcedea5b6"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db = getDatabase(app);

  // UI elements
  const authBox = document.getElementById("authBox");
  const controlBox = document.getElementById("controlBox");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const authMsg = document.getElementById("authMsg");
  const badge = document.getElementById("statusBadge");

  const gpioButtons = {
    door: document.getElementById("doorBtn"),
    gpio2: document.getElementById("gpio2Btn"),
    gpio3: document.getElementById("gpio3Btn")
  };

  const gpioLabels = {
    door: document.getElementById("doorStatus"),
    gpio2: document.getElementById("gpio2Status"),
    gpio3: document.getElementById("gpio3Status")
  };

  // Login
  loginBtn.onclick = async () => {
    authMsg.textContent = "";
    try {
      await signInWithEmailAndPassword(
        auth,
        document.getElementById("emailField").value,
        document.getElementById("passwordField").value
      );
    } catch (e) {
      authMsg.textContent = e.message;
    }
  };

  logoutBtn.onclick = () => signOut(auth);

  // Auth state monitor
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authBox.style.display = "none";
      controlBox.style.display = "block";
      badge.className = "status-badge online";
      badge.textContent = "Online";
      startListeners();
    } else {
      authBox.style.display = "block";
      controlBox.style.display = "none";
      badge.className = "status-badge offline";
      badge.textContent = "Offline";
    }
  });

  // Listen to DB
  function startListeners() {
    ["door", "gpio2", "gpio3"].forEach((key) => {
      onValue(ref(db, "/" + key), (snapshot) => {
        let value = snapshot.val() ? 1 : 0;
        updateUI(key, value);
      });
    });

    // Button click
    Object.values(gpioButtons).forEach((btn) => {
      btn.onclick = () => {
        let gpio = btn.dataset.gpio;
        let newState = btn.classList.contains("on") ? 0 : 1;
        set(ref(db, "/" + gpio), newState);
      };
    });
  }

  // Update UI
  function updateUI(key, val) {
    let btn = gpioButtons[key];
    let lab = gpioLabels[key];

    if (val === 1) {
      btn.classList.add("on");
      lab.textContent = "Status: ON";
      lab.style.color = "#9effae";
    } else {
      btn.classList.remove("on");
      lab.textContent = "Status: OFF";
      lab.style.color = "#d1d1d1";
    }
  }
