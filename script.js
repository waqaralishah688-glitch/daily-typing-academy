const passages = {
  easy: "The quick brown fox jumps over the lazy dog.",
  medium: "Learning English typing every day can improve your speed and accuracy.",
  hard: "Consistent practice develops excellent typing skills, confidence, and productivity."
};

let currentLevel = "easy";
let timeLeft = 60;
let timer = null;
let started = false;

const passage = document.getElementById("passage");
const typing = document.getElementById("typing");
const time = document.getElementById("time");
const wpm = document.getElementById("wpm");
const accuracy = document.getElementById("accuracy");
const finalWpm = document.getElementById("final-wpm");
const finalAccuracy = document.getElementById("final-accuracy");
const performance = document.getElementById("performance");

function resetTest() {
  clearInterval(timer);
  timer = null;
  started = false;
  timeLeft = 60;

  time.textContent = 60;
  wpm.textContent = 0;
  accuracy.textContent = "100%";
  finalWpm.textContent = 0;
  finalAccuracy.textContent = "0%";
  performance.textContent = "Good luck!";

  typing.value = "";
  typing.disabled = true;
  passage.textContent = passages[currentLevel];
}

document.querySelectorAll(".level-btn").forEach(button => {
  button.addEventListener("click", () => {
    currentLevel = button.dataset.level;
    resetTest();
  });
});

document.getElementById("start").addEventListener("click", () => {
  resetTest();
  started = true;
  typing.disabled = false;
  typing.focus();

  timer = setInterval(() => {
    timeLeft--;
    time.textContent = timeLeft;
    updateStats();

    if (timeLeft <= 0) finishTest();
  }, 1000);
});

document.getElementById("restart").addEventListener("click", resetTest);

function updateStats() {
  const typedText = typing.value;
  const targetText = passage.textContent;
  let correct = 0;

  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === targetText[i]) correct++;
  }

  const elapsed = 60 - timeLeft;
  const minutes = elapsed / 60;
  const speed = minutes > 0
    ? Math.round(typedText.length / 5 / minutes)
    : 0;

  const accuracyValue = typedText.length > 0
    ? Math.round(correct / typedText.length * 100)
    : 100;

  wpm.textContent = speed;
  accuracy.textContent = accuracyValue + "%";
}

typing.addEventListener("input", () => {
  if (!started) return;
  updateStats();

  if (typing.value.length >= passage.textContent.length) {
    finishTest();
  }
});

function finishTest() {
  clearInterval(timer);
  timer = null;
  started = false;
  typing.disabled = true;

  finalWpm.textContent = wpm.textContent;
  finalAccuracy.textContent = accuracy.textContent;

  const score = parseInt(accuracy.textContent);

  if (score >= 90) {
    performance.textContent = "Excellent! Great work!";
  } else if (score >= 70) {
    performance.textContent = "Good job! Keep practicing!";
  } else {
    performance.textContent = "Keep Practicing!";
  }
}

resetTest();
