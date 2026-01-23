// ---------- 要素取得 ----------
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

// ---------- 状態 ----------
let words = [];
let remaining = [];
let current = null;
let correct = 0;
let answered = false;

// 間違えた単語（重複なし）
let wrongMap = new Map();

// ---------- 表紙 ----------
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
  wrongMap = new Map(data.wrongMap);

  startQuiz();
};

restartBtn.onclick = () => {
  location.reload();
};

// ---------- CSV読み込み ----------
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
    wrongMap.clear();

    startQuiz();
  };

  reader.readAsText(file, "UTF-8");
});

// ---------- クイズ開始 ----------
function startQuiz() {
  cover.style.display = "none";
  quizArea.style.display = "block";

  // ★ クイズ中は必ず非表示
  endArea.style.display = "none";

  nextQuestion();
}

// ---------- 次の問題 ----------
function nextQuestion() {
  // ★ 毎回隠す（安全策）
  endArea.style.display = "none";

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

// ---------- 判定 ----------
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
    // 英語,日本語 を1回だけ保存
    wrongMap.set(current[0], current[1]);
  }

  answered = true;
  saveState();
}

submitBtn.onclick = checkAnswer;
nextBtn.onclick = nextQuestion;

// ---------- Enterキー ----------
answerEl.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    answered ? nextQuestion() : checkAnswer();
  }
});

// ---------- 終了 ----------
function finishQuiz() {
  questionEl.textContent = "終了！";
  feedbackEl.textContent = "お疲れさまでした";
  scoreEl.textContent = `正解: ${correct}`;

  // ★ 終了したときだけ表示
  endArea.style.display = "flex";

  localStorage.removeItem("quizState");
}

// ---------- CSV保存 ----------
saveBtn.onclick = () => {
  if (wrongMap.size === 0) {
    alert("保存する単語がありません");
    return;
  }

  let csv = "";
  wrongMap.forEach((jp, en) => {
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

// ---------- 続き保存 ----------
function saveState() {
  const data = {
    words,
    remaining,
    correct,
    wrongMap: Array.from(wrongMap.entries())
  };
  localStorage.setItem("quizState", JSON.stringify(data));
}
