// GEWIJZIGD: test-login.js is vervangen.
// De echte authenticatie gebeurt nu server-side via /auth/login.
// Dit script leest alleen de fout- of succesboodschap uit de URL.

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  const success = params.get("success");

  const messageEl = document.getElementById("login-message");
  if (!messageEl) return;

  if (error) {
    messageEl.style.color = "red";
    messageEl.textContent = error;
  } else if (success) {
    messageEl.style.color = "green";
    messageEl.textContent = success;
  }
});