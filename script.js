
const passages = {
  easy: [
    "I love learning English. Every day I practice typing on my computer. Good practice makes me faster and more confident. I always try to improve my skills.",
    "My family is very important to me. We help each other and spend time together. I enjoy reading books, learning new things and helping my friends.",
    "Education helps people build a better future. Students should practice every day, work hard and never give up on their dreams.",
    "A good morning routine makes the day better. Wake up early, drink water, read something useful and prepare for your daily work."
  ],

  medium: [
    "Typing is an important computer skill. Regular practice helps you improve your speed, accuracy and confidence. Try to type every day and learn from your mistakes.",
    "Technology has changed the way people communicate and work. Computers help students learn new skills, find useful information and complete their tasks more quickly.",
    "Time management is important for success. Make a daily plan, focus on your goals and complete important tasks before spending time on entertainment.",
    "Learning a new skill requires patience and dedication. Small improvements every day can create excellent results over time. Keep practicing and stay motivated."
  ],

  hard: [
    "Technology has transformed communication, education and business. Developing accurate typing skills can improve productivity, reduce unnecessary mistakes and create valuable opportunities in the modern workplace.",
    "Digital communication requires clarity, accuracy and attention to detail. Professional typing skills help individuals prepare documents, communicate effectively and manage information with greater efficiency.",
    "Consistent practice develops concentration, confidence and discipline. By identifying common mistakes and improving typing techniques, learners can gradually achieve better performance and professional results.",
    "The modern workplace increasingly depends on digital skills. Accurate communication, efficient information management and strong computer knowledge can help individuals adapt to changing professional environments."
  ]
};

const $ = id => document.getElementById(id);

const passageElement = $("passage");
const typingInput = $("typingInput");
const timerElement = $("timer");
const wpmElement = $("wpm");
const cpmElement = $("cpm");
const accuracyElement = $("accuracy");
const errorsElement = $("errors");
const bestWPMElement = $("bestWPM");
const resultElement = $("result");
const difficulty = $("difficulty");
const duration = $("duration");
const restartBtn = $("restartBtn");
const historyBody = $("historyBody");
const noHistory = $("noHistory");
const paragraphNumber = $("paragraphNumber");

let originalText = "";
let timeLeft = 60;
let timer = null;
let started = false;
let finished = false;
let paragraphIndex = 0;

let completedCorrect = 0;
let completedErrors = 0;
let completedTyped = 0;

let bestWPM = Number(localStorage.getItem("bestWPM")) || 0;

let history = [];

try {
  history = JSON.parse(localStorage.getItem("typingHistory")) || [];
  if (!Array.isArray(history)) history = [];
} catch {
  history = [];
}

function getCurrentStats() {
  const typed = typingInput.value;

  let correct = 0;
  let errors = 0;

  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === originalText[i]) {
      correct++;
    } else {
      errors++;
    }
  }

  return {
    correct,
    errors,
    typed: typed.length
  };
}

function getElapsedMinutes() {
  const totalSeconds = Number(duration.value) * 60;
  return Math.max(0, totalSeconds - timeLeft) / 60;
}

function updateStats() {
  const current = getCurrentStats();

  const totalCorrect = completedCorrect + current.correct;
  const totalErrors = completedErrors + current.errors;
  const totalTyped = completedTyped + current.typed;

  const elapsed = getElapsedMinutes();

  const wpm = elapsed > 0
    ? Math.round((totalCorrect / 5) / elapsed)
    : 0;

  const cpm = elapsed > 0
    ? Math.round(totalCorrect / elapsed)
    : 0;

  const accuracy = totalTyped > 0
    ? Math.round((totalCorrect / totalTyped) * 100)
    : 100;

  wpmElement.textContent = wpm;
  cpmElement.textContent = cpm;
  accuracyElement.textContent = accuracy + "%";
  errorsElement.textContent = totalErrors;

  const spans = passageElement.querySelectorAll("span");

  spans.forEach((span, index) => {
    span.className = "";

    if (index < typingInput.value.length) {
      if (typingInput.value[index] === originalText[index]) {
        span.classList.add("correct");
      } else {
        span.classList.add("incorrect");
      }
    }
  });
}

function loadParagraph() {
  const level = difficulty.value;
  const list = passages[level];

  originalText = list[paragraphIndex % list.length];

  passageElement.innerHTML = "";

  originalText.split("").forEach(character => {
    const span = document.createElement("span");
    span.textContent = character;
    passageElement.appendChild(span);
  });

  paragraphNumber.textContent = "Paragraph " + (paragraphIndex + 1);
  typingInput.value = "";
  typingInput.maxLength = originalText.length;
}

function startTest() {
  clearInterval(timer);

  timeLeft = Number(duration.value) * 60;
  paragraphIndex = 0;

  completedCorrect = 0;
  completedErrors = 0;
  completedTyped = 0;

  started = false;
  finished = false;

  timerElement.textContent = timeLeft;
  wpmElement.textContent = 0;
  cpmElement.textContent = 0;
  accuracyElement.textContent = "100%";
  errorsElement.textContent = 0;

  bestWPMElement.textContent = bestWPM;
  resultElement.textContent = "";

  typingInput.disabled = false;

  loadParagraph();
  typingInput.focus();
}

function saveHistory() {
  const finalWPM = Number(wpmElement.textContent);
  const finalCPM = Number(cpmElement.textContent);
  const finalAccuracy = accuracyElement.textContent;
  const finalErrors = Number(errorsElement.textContent);

  if (finalWPM > bestWPM) {
    bestWPM = finalWPM;
    localStorage.setItem("bestWPM", bestWPM);
    bestWPMElement.textContent = bestWPM;
  }

  const record = {
    date: new Date().toLocaleDateString(),
    time: duration.value + " min",
    level: difficulty.value,
    wpm: finalWPM,
    cpm: finalCPM,
    accuracy: finalAccuracy,
    errors: finalErrors
  };

  history.unshift(record);
  history = history.slice(0, 20);

  localStorage.setItem("typingHistory", JSON.stringify(history));

  showHistory();
}

function finishTest() {
  if (finished) return;

  finished = true;
  clearInterval(timer);
  typingInput.disabled = true;

  saveHistory();

  resultElement.textContent =
    "Test Completed! WPM: " + wpmElement.textContent +
    " | CPM: " + cpmElement.textContent +
    " | Accuracy: " + accuracyElement.textContent +
    " | Errors: " + errorsElement.textContent;
}

function moveToNextParagraph() {
  const current = getCurrentStats();

  completedCorrect += current.correct;
  completedErrors += current.errors;
  completedTyped += current.typed;

  paragraphIndex++;

  loadParagraph();
  updateStats();
  typingInput.focus();
}

function showHistory() {
  historyBody.innerHTML = "";

  noHistory.style.display = history.length ? "none" : "block";

  history.forEach(item => {
    const row = document.createElement("tr");

    [
      item.date,
      item.time,
      item.level,
      item.wpm,
      item.accuracy,
      item.errors
    ].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    historyBody.appendChild(row);
  });
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

  if (typingInput.value.length >= originalText.length) {
    moveToNextParagraph();
  }
});

restartBtn.addEventListener("click", startTest);

difficulty.addEventListener("change", startTest);
duration.addEventListener("change", startTest);

$("clearHistoryBtn").addEventListener("click", () => {
  if (!confirm("Are you sure you want to clear your test history?")) {
    return;
  }

  history = [];
  localStorage.removeItem("typingHistory");
  showHistory();
});

bestWPMElement.textContent = bestWPM;

showHistory();
startTest();
