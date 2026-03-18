const emailCorrect = "test@gmail.com";
const passwordCorrect = "GameHub_Secret_99!";

if (window.location.pathname.includes("games.html")) {
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
  } else {
    if (localStorage.getItem("showWelcomeAlert") === "true") {
      setTimeout(() => {
        showLoginAlert("Je bent succesvol ingelogd!");
        localStorage.removeItem("showWelcomeAlert");
      }, 500);
    }
  }
}

const form = document.querySelector(".login");
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    let message = document.querySelector(".login-message");
    if (!message) {
      message = document.createElement("p");
      message.classList.add("login-message");
      form.appendChild(message);
    }

    message.classList.remove("success", "error");
    message.textContent = "Controleren...";

    const isValid = await checkLogin(email, password);

    if (isValid) {
      message.textContent = "Je bent ingelogd!";
      message.classList.add("success");
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("showWelcomeAlert", "true");

      setTimeout(() => {
        window.location.href = "games.html";
      }, 1000);
    } else {
      message.textContent = "Email of wachtwoord is fout";
      message.classList.add("error");
    }
  });
}

async function checkLogin(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return email === emailCorrect && password === passwordCorrect;
}

function showLoginAlert(text) {
  const alertBox = document.createElement("div");
  alertBox.textContent = text;
  alertBox.classList.add("login-alert");
  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
  }, 3000);
}

const logoutBtn = document.querySelector(".logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("showWelcomeAlert");
    window.location.href = "login.html";
  });
}
