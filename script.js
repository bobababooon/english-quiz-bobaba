const cover = document.getElementById("cover");
const quizArea = document.getElementById("quizArea");
const fileInput = document.getElementById("fileInput");

const startBtn = document.getElementById("startBtn");
const continueBtn = document.getElementById("continueBtn");
const restartBtn = document.getElementById("restartBtn");

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");

const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");
const saveBtn = document.getElementById("saveBtn");
const endArea = document.getElementById("endArea");

let words = [];
let remaining = [];
let current = null;
let correct = 0;
let answered = false;
let wrongSet = new Map();

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
  wrongSet = new Map(data.wrongSet);

  startQuiz();
};

restartBtn.onclick = () => location.reload();

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
    wrongSet.clear();

    startQuiz();
  };
  reader.readAsText(file, "UTF-8");
});

/* ---------- クイズ ---------- */

function startQuiz() {
  cover.style.display = "none";
  quizArea.style.display = "block";
  endArea.style.display = "none";
  nextQuestion();
}

function nextQuestion() {
  if (remaining.length === 0) {
    finishQuiz();
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

function checkAnswer() {
  if (answered) return;

  const user = answerEl.value.trim().toLowerCase();
  const answer = current[0].toLowerCase();

  if (user === answer) {
    correct++;
    remaining = remaining.filter(w => w !== current);
    feedbackEl.textContent = "正解！🎉";
  } else {
    feedbackEl.textContent = `不正解 ❌（正解: ${current[0]}）`;
    wrongSet.set(current[0], current[1]);
  }

  answered = true;
  saveState();
}

submitBtn.onclick = checkAnswer;
nextBtn.onclick = nextQuestion;

answerEl.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    answered ? nextQuestion() : checkAnswer();
  }
});

/* ---------- 終了 ---------- */

function finishQuiz() {
  questionEl.textContent = "終了！";
  feedbackEl.textContent = "お疲れさまでした";
  endArea.style.display = "flex";
  localStorage.removeItem("quizState");
}

/* ---------- 保存 ---------- */

saveBtn.onclick = () => {
  if (wrongSet.size === 0) {
    alert("保存する単語がありません");
    return;
  }

  let csv = "";
  wrongSet.forEach((jp, en) => {
    csv += `${en},${jp}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "wrong_words.csv";
  a.click();

  URL.revokeObjectURL(url);
};

/* ---------- 続き保存 ---------- */

function saveState() {
  const data = {
    words,
    remaining,
    correct,
    wrongSet: Array.from(wrongSet.entries())
  };
  localStorage.setItem("quizState", JSON.stringify(data));
}
