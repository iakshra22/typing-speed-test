const quotes = [
  "Consistency is more important than intensity. Work every day and results will come naturally.",
  "JavaScript is not just a programming language but the backbone of the interactive web that powers millions of websites today.",
  "Typing quickly and accurately is a valuable skill that improves communication, productivity, and saves time in the digital age.",
  "Discipline beats motivation. Even when you do not feel like doing something, show up and do it anyway.",
  "Do it because they say you can't.",
  "Technology is constantly evolving, and those who keep learning will always stay ahead of the curve.",
  "Do your best.",
  "Don't expect anything from anyone."
];

const quoteEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart");
const progressBar = document.getElementById("progress");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const playAgainBtn = document.getElementById("playAgain");
const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");
const toggleBtn = document.getElementById("toggleMode");
const startBtn = document.getElementById("startBtn");

let timeLimit = 60;            
let time = timeLimit;
let timer = null;
let timerStarted = false;

let currentLine = 0;
let selectedQuoteLines = [];

let cumCorrectChars = 0;
let cumTotalTyped = 0;

let currentCorrect = 0;
let currentTotalTyped = 0;

function pickRandomQuoteAndSplit() {
  const raw = quotes[Math.floor(Math.random() * quotes.length)];
  const matches = raw.match(/[^.!?]+[.!?]?/g) || [raw];
  selectedQuoteLines = matches.map(s => s.trim()).filter(Boolean);
  currentLine = 0;
}

function renderCurrentLine() {
  quoteEl.innerHTML = "";
  if (currentLine >= selectedQuoteLines.length) {
    finishTest();
    return;
  }
  const text = selectedQuoteLines[currentLine];
  for (let ch of text) {
    const span = document.createElement("span");
    span.innerText = ch;
    quoteEl.appendChild(span);
  }
  inputEl.value = "";
  inputEl.focus();
}

function startTimerIfNeeded() {
  if (timerStarted) return;
  timerStarted = true;
  timer = setInterval(() => {
    time--;
    updateTimerDisplay();
    if (time <= 0) {
      clearInterval(timer);
      finishTest();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const mm = Math.floor(time / 60).toString().padStart(2, "0");
  const ss = (time % 60).toString().padStart(2, "0");
  timerEl.textContent = `${mm}:${ss}`;
}

function computeAndShowStats() {
  const totalCorrect = cumCorrectChars + currentCorrect;
  const totalTyped = cumTotalTyped + currentTotalTyped;

  const secondsElapsed = Math.max(1, timeLimit - time); // avoid div-by-zero
  const minutesElapsed = secondsElapsed / 60;
  const wpm = minutesElapsed > 0 ? Math.round((totalCorrect / 5) / minutesElapsed) : 0;
  const accuracy = totalTyped > 0 ? Math.round((totalCorrect / totalTyped) * 100) : 0;

  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy;
}

inputEl.addEventListener("input", (e) => {
  startTimerIfNeeded();

  const quoteChars = quoteEl.querySelectorAll("span");
  const typedChars = inputEl.value.split("");

  currentCorrect = 0;
  currentTotalTyped = typedChars.length;

  let finishedLine = true;

  quoteChars.forEach((span, idx) => {
    const expected = span.innerText;
    const typed = typedChars[idx];
    span.classList.remove("correct", "incorrect");

    if (typed == null) {
      finishedLine = false;
    } else if (typed === expected) {
      span.classList.add("correct");
      currentCorrect++;
    } else {
      span.classList.add("incorrect");
      finishedLine = false;
    }
  });

  if (finishedLine && typedChars.length === quoteChars.length) {
    cumCorrectChars += currentCorrect;
    cumTotalTyped += currentTotalTyped;

    currentLine++;
    progressBar.style.width = `${Math.round((currentLine / selectedQuoteLines.length) * 100)}%`;

    setTimeout(() => {
      renderCurrentLine();
      currentCorrect = 0;
      currentTotalTyped = 0;
      computeAndShowStats();
    }, 300);
  } else {
    computeAndShowStats();
  }
});

restartBtn.addEventListener("click", resetGame);
playAgainBtn && playAgainBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  resetGame();
});

toggleBtn && toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggleBtn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});

startBtn && startBtn.addEventListener("click", () => {
  welcomeScreen && welcomeScreen.classList.add("hidden");
  gameScreen && gameScreen.classList.remove("hidden");
  resetGame();
});

function resetGame() {
  clearInterval(timer);
  timer = null;
  timerStarted = false;

  time = timeLimit;
  updateTimerDisplay();

  cumCorrectChars = 0;
  cumTotalTyped = 0;
  currentCorrect = 0;
  currentTotalTyped = 0;

  wpmEl.textContent = "0";
  accuracyEl.textContent = "0";
  progressBar.style.width = "0%";

  inputEl.disabled = false;
  inputEl.value = "";

  pickRandomQuoteAndSplit();
  renderCurrentLine();
}

function finishTest() {
  clearInterval(timer);
  timer = null;
  timerStarted = false;
  inputEl.disabled = true;

  const quoteChars = quoteEl.querySelectorAll("span");
  const typedChars = inputEl.value.split("");
  let lastCorrect = 0, lastTyped = typedChars.length;
  quoteChars.forEach((span, idx) => {
    if (typedChars[idx] != null && typedChars[idx] === span.innerText) lastCorrect++;
  });

  const totalCorrect = cumCorrectChars + lastCorrect;
  const totalTyped = cumTotalTyped + lastTyped;

  const secondsElapsed = Math.max(1, timeLimit - timeLimit + (timeLimit - time)); // ensures at least 1 sec
  const minutesElapsed = (timeLimit - time) / 60;
  const finalWpmValue = minutesElapsed > 0 ? Math.round((totalCorrect / 5) / minutesElapsed) : 0;
  const finalAccuracyValue = totalTyped > 0 ? Math.round((totalCorrect / totalTyped) * 100) : 0;

  finalWpm.textContent = finalWpmValue;
  finalAccuracy.textContent = finalAccuracyValue;

  wpmEl.textContent = finalWpmValue;
  accuracyEl.textContent = finalAccuracyValue;

  if (gameScreen && resultScreen) {
    gameScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
  }
}

updateTimerDisplay();















