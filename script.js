const quotes = [
  "Consistency is more important than intensity. Work every day and results will come naturally.",
  "JavaScript is not just a programming language but the backbone of the interactive web that powers millions of websites today.",
  "Typing quickly and accurately is a valuable skill that improves communication, productivity, and saves time in the digital age.",
  "Discipline beats motivation. Even when you do not feel like doing something, show up and do it anyway.",
  "Technology is constantly evolving, and those who keep learning will always stay ahead of the curve.",
  "Dont expect anyhthing from anyone."
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

let time = 60;
let timer;
let correctChars = 0, totalChars = 0;
let currentLine = 0;
let selectedQuote = [];


function loadLine() {
  if (currentLine < selectedQuote.length) {
    quoteEl.innerHTML = "";
    selectedQuote[currentLine].split("").forEach(char => {
      let span = document.createElement("span");
      span.innerText = char;
      quoteEl.appendChild(span);
    });
    inputEl.value = "";
  } else {
    finishTest();
  }
}

function loadQuote() {
  let random = quotes[Math.floor(Math.random() * quotes.length)];
  selectedQuote = random.split(". ");
  currentLine = 0;
  loadLine();
}

function startTimer() {
  timer = setInterval(() => {
    time--;
    timerEl.textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      finishTest();
    }
  }, 1000);
}

inputEl.addEventListener("input", () => {
  const quoteChars = quoteEl.querySelectorAll("span");
  const inputChars = inputEl.value.split("");

  correctChars = 0;
  totalChars = inputChars.length;
  let finished = true;

  quoteChars.forEach((char, index) => {
    const typedChar = inputChars[index];
    if (typedChar == null) {
      char.classList.remove("correct", "incorrect");
      finished = false;
    } else if (typedChar === char.innerText) {
      char.classList.add("correct");
      char.classList.remove("incorrect");
      correctChars++;
    } else {
      char.classList.add("incorrect");
      char.classList.remove("correct");
      finished = false;
    }
  });

  if (finished && inputChars.length === quoteChars.length) {
    currentLine++;
    progressBar.style.width = `${(currentLine / selectedQuote.length) * 100}%`;
    setTimeout(loadLine, 500);
  }

  let minutes = (60 - time) / 60;
  let wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
  let accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy;
});

restartBtn.addEventListener("click", () => {
  resetGame();
});

playAgainBtn.addEventListener("click", () => {
  resetGame();
  resultScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
});


toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggleBtn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});


document.getElementById("startBtn").addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  resetGame();
});

function resetGame() {
  clearInterval(timer);
  time = 60;
  correctChars = 0;
  totalChars = 0;
  inputEl.disabled = false;
  timerEl.textContent = time;
  wpmEl.textContent = 0;
  accuracyEl.textContent = 0;
  progressBar.style.width = "0%";
  loadQuote();
  startTimer();
}

function finishTest() {
  clearInterval(timer);
  inputEl.disabled = true;
  finalWpm.textContent = wpmEl.textContent;
  finalAccuracy.textContent = accuracyEl.textContent;
  gameScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
}















