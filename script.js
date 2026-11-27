
const passages = {
  easy: "I love learning English typing. Practice every day and improve your typing speed. Keep working hard and never give up.",
  medium: "Typing is an important computer skill. Regular practice helps you improve speed, accuracy and confidence. Try to type every day.",
  hard: "Technology has transformed communication, education and business. Developing accurate typing skills can improve productivity and create new opportunities."
};

const passageElement = document.getElementById("passage");
const typingInput = document.getElementById("typingInput");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const cpmElement = document.getElementById("cpm");
const accuracyElement = document.getElementById("accuracy");
const errorsElement = document.getElementById("errors");
const resultElement = document.getElementById("result");
const difficulty = document.getElementById("difficulty");
const restartBtn = document.getElementById("restartBtn");

let originalText = "";
let timeLeft = 60;
let timer = null;
let started = false;
let finished = false;

function showPassage() {
  passageElement.innerHTML = "";

  originalText.split("").forEach(character => {
    const span = document.createElement("span");
    span.textContent = character;
    passageElement.appendChild(span);
  });
}

function startTest() {
  clearInterval(timer);

  originalText = passages[difficulty.value];
  timeLeft = 60;
  started = false;
  finished = false;

  typingInput.value = "";
  typingInput.disabled = false;
  typingInput.focus();

  timerElement.textContent = 60;
  wpmElement.textContent = 0;
  cpmElement.textContent = 0;
  accuracyElement.textContent = "100%";
  errorsElement.textContent = 0;
  resultElement.textContent = "";

  showPassage();
}

function updateStats() {
  const typed = typingInput.value;
  const spans = passageElement.querySelectorAll("span");

  let correctCharacters = 0;
  let errors = 0;

  typed.split("").forEach((character, index) => {
    if (character === originalText[index]) {
      correctCharacters++;
    } else {
      errors++;
    }
  });

  spans.forEach((span, index) => {
    span.className = "";

    if (index < typed.length) {
      if (typed[index] === originalText[index]) {
        span.classList.add("correct");
      } else {
        span.classList.add("incorrect");
      }
    }
  });

  const elapsed = 60 - timeLeft;
  const minutes = elapsed / 60;

  const wpm = minutes > 0
    ? Math.round((correctCharacters / 5) / minutes)
    : 0;

  const cpm = minutes > 0
    ? Math.round(correctCharacters / minutes)
    : 0;

  const accuracy = typed.length > 0
    ? Math.round((correctCharacters / typed.length) * 100)
    : 100;

  wpmElement.textContent = wpm;
  cpmElement.textContent = cpm;
  accuracyElement.textContent = accuracy + "%";
  errorsElement.textContent = errors;

  if (typed.length >= originalText.length) {
    finishTest();
  }
}

function finishTest() {
  if (finished) return;

  finished = true;
  clearInterval(timer);
  typingInput.disabled = true;

  resultElement.textContent =
    "Test Completed! WPM: " + wpmElement.textContent +
    " | CPM: " + cpmElement.textContent +
    " | Accuracy: " + accuracyElement.textContent +
    " | Errors: " + errorsElement.textContent;
}

typingInput.addEventListener("input", () => {
  if (finished) return;

  if (!started && typingInput.value.length > 0) {
    started = true;

    timer = setInterval(() => {
      timeLeft--;
      timerElement.textContent = timeLeft;

      updateStats();

      if (timeLeft <= 0) {
        finishTest();
      }
    }, 1000);
  }

  updateStats();
});

restartBtn.addEventListener("click", startTest);
difficulty.addEventListener("change", startTest);

startTest();
