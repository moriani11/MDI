let xp = 0;
let blurLevel = 10;

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".guess-game");
  const correctName = section.dataset.name.toLowerCase();
  const image = document.querySelector(".game-image");
  const input = document.querySelector("#game");
  const resultText = document.querySelector(".result");
  const xpText = document.querySelector(".xp");
  const guessBtn = document.querySelector(".guess");

  guessBtn.addEventListener("click", () => {
    const userGuess = input.value.trim().toLowerCase();
    if (userGuess === correctName) {
      xp += 10;
      xpText.textContent = `⭐ ${xp}`;
      resultText.textContent = "✅ Correct!";
      blurLevel = 10;
    } else {
      blurLevel = Math.max(0, blurLevel - 1);
      image.style.filter = `blur(${blurLevel}px)`;
      resultText.textContent = "❌ Fout! Probeer opnieuw.";
    }
  });
});