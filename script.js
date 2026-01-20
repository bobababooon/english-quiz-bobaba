// 要素取得
const cover = document.getElementById("cover");
const quizArea = document.getElementById("quizArea");
const fileInput = document.getElementById("fileInput");

const startBtn = document.getElementById("startBtn");
const continueBtn = document.getElementById("continueBtn");

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");

const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");

// 状態
let words = [];
let remaining = [];
let current = null;
let correct = 0;
let answered = false;

/* ---------- 表紙 ---------- */

startBtn.onclick = () => {
  fileInput.value = "";
  fileInput.click();
};

continueBtn.onclick = () => {
  const saved = localStorage.getItem("quizState");
  if (!saved) {
    alert("続きデータがありません");
    return;
  }

  const data = JSON.parse(saved);
  words = data.words;
  remaining = data.remaining;
  correct = data.correct;

  startQuiz();
};

/* ---------- CSV読み込み ---------- */

fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    words = reader.result
      .split("\n")
      .map(l => l.trim())
      .filter(l => l)
      .map(l => l.split(","));

    remaining = [...words];
    correct = 0;

    startQuiz();
  };

  reader.readAsText(file, "UTF-8");
});

/* ---------- クイズ開始 ---------- */

function startQuiz() {
  cover.style.display = "none";
  quizArea.style.display = "block";
  nextQuestion();
}

/* ---------- 出題 ---------- */

function nextQuestion() {
  if (remaining.length === 0) {
    questionEl.textContent = "終了！";
    feedbackEl.textContent = "お疲れさま！";
    localStorage.removeItem("quizState");
    return;
  }

  current = remaining[Math.floor(Math.random() * remaining.length)];
  answered = false;

  questionEl.textContent = "意味: " + current[1];
  answerEl.value = "";
  feedbackEl.textContent = "";
  scoreEl.textContent = `正解: ${correct}`;

  answerEl.focus();

  saveState();
}

/* ---------- 判定 ---------- */

submitBtn.onclick = checkAnswer;

function checkAnswer() {
  if (answered) return;

  const user = answerEl.value.trim();
  const answer = current[0];

  if (user.toLowerCase() === answer.toLowerCase()) {
    correct++;
    remaining = remaining.filter(w => w !== current);
    feedbackEl.textContent = "正解！🎉";
  } else {
    feedbackEl.textContent = `不正解 ❌（正解: ${answer}）`;
  }

  answered = true;
  saveState();
}

nextBtn.onclick = nextQuestion;

/* ---------- Enterキー対応 ---------- */

answerEl.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    if (!answered) {
      checkAnswer();
    } else {
      nextQuestion();
    }
  }
});

/* ---------- 続き保存 ---------- */

function saveState() {
  const data = {
    words,
    remaining,
    correct
  };
  localStorage.setItem("quizState", JSON.stringify(data));
}
