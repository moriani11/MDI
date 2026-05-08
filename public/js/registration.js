// GEWIJZIGD: registratie verloopt nu via een echte server POST (form action).
// Dit script toont alleen de fout- of succesboodschap uit de URL.

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const success = params.get("success");

    const messageEl = document.getElementById("register-message");
    if (!messageEl) return;

    if (error) {
        messageEl.style.color = "red";
        messageEl.textContent = error;
    } else if (success) {
        messageEl.style.color = "green";
        messageEl.textContent = success;
    }
});