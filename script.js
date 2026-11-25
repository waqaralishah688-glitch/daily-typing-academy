
const passages = {
  easy: "Practice makes a person perfect. Keep learning and keep improving your typing skills every day.",
  medium: "Learning to type faster requires regular practice, patience, and concentration. Try to improve your accuracy every day.",
  hard: "Consistent practice develops exceptional typing accuracy and speed. Focus on precision, maintain a steady rhythm, and challenge yourself."
};

let selectedLevel = "easy";
let timeLeft = 60;
let timer = null;
let running = false;
let finished = false;

const passageElement = document.getElementById("passage");
const typingInput = document.getElementById("typing");
const timeElement = document.getElementById("time");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const resultElement = document.getElementById("result");
const finalWpmElement = document.getElementById("final-wpm");
const finalAccuracyElement = document.getElementById("final-accuracy");
const performanceElement = document.getElementById("performance");

let startTime = null;

function loadPassage() {
  passageElement.textContent = passages[selectedLevel];
  typingInput.value = "";
  typingInput.disabled = true;
  timeLeft = 60;
  running = false;
  finished = false;
  startTime = null;

  clearInterval(timer);

  timeElement.textContent = 60;
  wpmElement.textContent = 0;
  accuracyElement.textContent = "100%";

  if (resultElement) resultElement.style.display = "none";
}

document.querySelectorAll(".level-btn").forEach(button => {
  button.addEventListener("click", () => {
    if (running) return;

    selectedLevel = button.dataset.level;

    document.querySelectorAll(".level-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    loadPassage();
  });
});

function startTest() {
  if (running) return;

  loadPassage();

  running = true;
  finished = false;
  startTime = Date.now();

  typingInput.disabled = false;
  typingInput.focus();

  timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timeLeft = Math.max(0, 60 - elapsed);
    timeElement.textContent = timeLeft;

    updateStats();

    if (timeLeft <= 0) {
      finishTest();
    }
  }, 250);
}

function updateStats() {
  const typed = typingInput.value;
  const target = passageElement.textContent;

  let correct = 0;

  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correct++;
  }

  const accuracy = typed.length === 0
    ? 100
    : Math.round((correct / typed.length) * 100);

  const elapsedMinutes = Math.max(
    (Date.now() - startTime) / 60000,
    1 / 60
  );

  const words = typed.trim().length === 0
    ? 0
    : typed.trim().split(/\s+/).length;

  const wpm = Math.round(words / elapsedMinutes);

  wpmElement.textContent = wpm;
  accuracyElement.textContent = accuracy + "%";

  return { wpm, accuracy };
}

function finishTest() {
  if (finished) return;

  finished = true;
  running = false;

  clearInterval(timer);

  typingInput.disabled = true;

  const stats = updateStats();

  if (finalWpmElement) {
    finalWpmElement.textContent = stats.wpm;
  }

  if (finalAccuracyElement) {
    finalAccuracyElement.textContent = stats.accuracy + "%";
  }

  if (performanceElement) {
    if (stats.accuracy >= 90) {
      performanceElement.textContent = "Excellent! Great work!";
    } else if (stats.accuracy >= 70) {
      performanceElement.textContent = "Good job! Keep practicing!";
    } else {
      performanceElement.textContent = "Keep practicing. You can improve!";
    }
  }

  if (resultElement) {
    resultElement.style.display = "block";
    resultElement.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

typingInput.addEventListener("input", () => {
  if (!running || finished) return;

  const target = passageElement.textContent;
  const typed = typingInput.value;

  updateStats();

  // Passage complete hote hi timer rok kar result dikhao
  if (typed === target) {
    finishTest();
  }
});

startButton.addEventListener("click", startTest);
restartButton.addEventListener("click", startTest);

loadPassage();
