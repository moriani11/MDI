const form = document.querySelector(".registration");

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.querySelector("#username").value.trim();
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;
        const confirmPassword = document.querySelector("#confirm-password").value;

        const response = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, "confirm-password": confirmPassword }),
        });

        const data = await response.json();

        let message = document.querySelector(".register-message");
        if (!message) {
            message = document.createElement("p");
            message.classList.add("register-message");
            form.appendChild(message);
        }

        if (data.success) {
            message.style.color = "green";
            message.textContent = "Account aangemaakt! Je kan nu inloggen.";
            setTimeout(() => window.location.href = "/login", 1500);
        } else {
            message.style.color = "red";
            message.textContent = data.error;
        }
    });
}