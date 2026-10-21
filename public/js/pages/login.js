import { api } from "../api.js";
import { homeForRole, getSession } from "../auth.js";
import { showBanner, hideBanner, setFieldError } from "../validation.js";
import { setPending } from "../ui.js";

const form = document.getElementById("login-form");
const banner = document.getElementById("banner");
const submitBtn = document.getElementById("submit-btn");
const identifierEl = document.getElementById("identifier");
const passwordEl = document.getElementById("password");
const toggleBtn = document.getElementById("toggle-password");

toggleBtn.addEventListener("click", () => {
  const show = passwordEl.type === "password";
  passwordEl.type = show ? "text" : "password";
  toggleBtn.textContent = show ? "Hide" : "Show";
  toggleBtn.setAttribute("aria-pressed", String(show));
  toggleBtn.setAttribute("aria-label", show ? "Hide password" : "Show password");
});

// Already signed in? Go straight to the right dashboard.
getSession().then((user) => {
  if (user) window.location.replace(homeForRole(user.role));
});

function fillAndSubmit(email, pass) {
  identifierEl.value = email;
  passwordEl.value = pass;
  form.dispatchEvent(new Event("submit", { cancelable: true }));
}

document.getElementById("btn-demo-student")?.addEventListener("click", () => {
  fillAndSubmit("student@hostel.local", "Demo@1234");
});

document.getElementById("btn-demo-warden")?.addEventListener("click", () => {
  fillAndSubmit("warden@hostel.local", "Demo@1234");
});

document.getElementById("btn-demo-admin")?.addEventListener("click", () => {
  fillAndSubmit("admin@hostel.local", "Demo@1234");
});

// Signed-out notice
if (new URLSearchParams(location.search).get("signedout") === "1") {
  showBanner(banner, "info", "You have been signed out.");
  banner.className = "form-banner info visible";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideBanner(banner);
  let ok = true;
  if (!identifierEl.value.trim()) { setFieldError({ el: identifierEl, errorEl: document.getElementById("identifier-error") }, "Enter your email or student ID."); ok = false; }
  if (!passwordEl.value) { setFieldError({ el: passwordEl, errorEl: document.getElementById("password-error") }, "Enter your password."); ok = false; }
  if (!ok) return;

  setPending(submitBtn, true, "Signing in…");
  try {
    const res = await api("/auth/login", {
      method: "POST",
      body: { identifier: identifierEl.value.trim(), password: passwordEl.value },
    });
    const params = new URLSearchParams(location.search);
    const next = params.get("next");
    // Only allow same-origin relative redirects
    const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
    window.location.replace(safeNext ?? homeForRole(res.user.role));
  } catch (err) {
    setPending(submitBtn, false);
    showBanner(banner, "error", err.message);
    if (err.code === "INVALID_CREDENTIALS") passwordEl.select();
  }
});
