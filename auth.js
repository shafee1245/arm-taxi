/* =====================================================
   ARM TAXI – ADMIN AUTH (Frontend-only)
   Author: Senior Frontend Refactor
   ===================================================== */

/* ⚠️ DEMO ONLY – DO NOT USE IN PRODUCTION */
const ADMIN_EMAIL = "armdroptaxi73@gmail.com";
const ADMIN_PASSWORD = "armraja#7707";

/* ---------- UTILITIES ---------- */
const AUTH_KEY = "arm_admin_logged_in";
const EMAIL_KEY = "arm_admin_email";
const REMEMBER_KEY = "arm_admin_remember";

/* ---------- AUTH GUARD ---------- */
function requireAuth() {
  const isLoggedIn = localStorage.getItem(AUTH_KEY) === "true";
  if (!isLoggedIn) {
    location.replace("login.html");
  }
}

/* ---------- LOGIN ---------- */
function handleLogin(e) {
  e.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberInput = document.getElementById("remember");
  const loginBtn = document.getElementById("loginBtn");
  const messageBox = document.getElementById("loginMessage");

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  loginBtn.disabled = true;
  loginBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Authenticating...`;

  setTimeout(() => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(EMAIL_KEY, email);

      if (rememberInput.checked) {
        localStorage.setItem(REMEMBER_KEY, "true");
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      messageBox.textContent = "Login successful. Redirecting...";
      messageBox.className = "login-message success";
      messageBox.style.display = "block";

      setTimeout(() => {
        location.replace("dashboard.html");
      }, 1000);

    } else {
      messageBox.textContent = "Invalid email or password";
      messageBox.className = "login-message error";
      messageBox.style.display = "block";

      loginBtn.disabled = false;
      loginBtn.innerHTML = `<span>Sign In</span> <i class="fas fa-arrow-right"></i>`;

      shakeForm();
    }
  }, 800);
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  location.replace("login.html");
}

/* ---------- SHAKE EFFECT ---------- */
function shakeForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.classList.add("shake");
  setTimeout(() => form.classList.remove("shake"), 500);
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {

  /* LOGIN PAGE */
  if (document.getElementById("loginForm")) {

    // Already logged in → dashboard
    if (localStorage.getItem(AUTH_KEY) === "true") {
      location.replace("dashboard.html");
      return;
    }

    document
      .getElementById("loginForm")
      .addEventListener("submit", handleLogin);

    // Remembered email
    if (localStorage.getItem(REMEMBER_KEY) === "true") {
      const savedEmail = localStorage.getItem(EMAIL_KEY);
      if (savedEmail) {
        document.getElementById("email").value = savedEmail;
        document.getElementById("remember").checked = true;
      }
    }

    injectShakeCSS();
  }

  /* ADMIN PAGES */
  if (
    location.pathname.includes("dashboard.html") ||
    location.pathname.includes("orders.html")
  ) {
    requireAuth();
  }
});

/* ---------- SHAKE CSS ---------- */
function injectShakeCSS() {
  if (document.getElementById("shake-style")) return;

  const style = document.createElement("style");
  style.id = "shake-style";
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%,60%{transform:translateX(-6px)}
      40%,80%{transform:translateX(6px)}
    }
    .shake {
      animation: shake .4s ease-in-out;
    }
  `;
  document.head.appendChild(style);
}

/* ---------- GLOBAL ---------- */
window.logout = logout;