let words = [];
let remaining = [];
let current = null;
let correct = 0;
let answered = false;

// 間違えた単語（英語→日本語、重複なし）
let wrongMap = new Map();

/* =====================
   保存・復元
===================== */

function saveProgress() {
  localStorage.setItem("quizProgress", JSON.stringify({
    words,
    remaining,
    current,
    correct,
    wrong: Array.from(wrongMap.entries())
  }));
}

function loadProgress() {
  const data = localStorage.getItem("quizProgress");
  if (!data) return false;

  const obj = JSON.parse(data);
  words = obj.words;
  remaining = obj.remaining;
  current = obj.current;
  correct = obj.correct;
  wrongMap = new Map(obj.wrong || []);
  return true;
}

function clearProgress() {
  localStorage.removeItem("quizProgress");
}

/* =====================
   表紙
===================== */

function startNew() {
  clearProgress();
  wrongMap.clear();
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("quizArea").style.display = "block";
  alert("CSVファイルを選択してください");
}

function startContinue() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("quizArea").style.display = "block";
  showQuestion();
}

/* =====================
   CSV読み込み
===================== */

document.getElementById("fileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const lines = reader.result.split("\n");
    words = lines
      .map(l => l.trim())
      .filter(l => l)
      .map(l => l.split(","));

    remaining = [...words];
    correct = 0;
    current = null;
    answered = false;
    wrongMap.clear();

    document.getElementById("saveWrongBtn").style.display = "none";
    nextQuestion();
  };

  reader.readAsText(file, "UTF-8");
});

/* =====================
   クイズ処理
===================== */

function nextQuestion() {
  if (remaining.length === 0) {
    finishQuiz();
    return;
  }

  current = remaining[Math.floor(Math.random() * remaining.length)];
  answered = false;
  showQuestion();
  saveProgress();
}

function showQuestion() {
  if (!current) return;

  document.getElementById("question").textContent =
    "意味: " + current[1];
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("score").textContent =
    `正解: ${correct}`;
}

/* =====================
   答える
===================== */

document.getElementById("submitBtn").onclick = function () {
  if (answered || !current) return;

  const user = document.getElementById("answer").value.trim().toLowerCase();
  const answer = current[0].toLowerCase();

  if (user === answer) {
    correct++;
    remaining = remaining.filter(w => w !== current);
    document.getElementById("feedback").textContent = "正解！🎉";
  } else {
    // 英語,日本語 で1回だけ保存
    wrongMap.set(current[0], current[1]);
    document.getElementById("feedback").textContent =
      `不正解 ❌（正解: ${current[0]}）`;
  }

  answered = true;
  saveProgress();
};

/* =====================
   次へ
===================== */

document.getElementById("nextBtn").onclick = nextQuestion;

/* =====================
   終了
===================== */

function finishQuiz() {
  document.getElementById("question").textContent = "終了！🎉";
  document.getElementById("feedback").textContent =
    `正解数: ${correct}`;
  document.getElementById("saveWrongBtn").style.display = "inline-block";
  clearProgress();
}

/* =====================
   CSV保存（英語,日本語のみ）
===================== */

document.getElementById("saveWrongBtn").onclick = function () {
  if (wrongMap.size === 0) {
    alert("間違えた単語はありません！");
    return;
  }

  let csv = "英語,日本語\n";
  for (let [en, jp] of wrongMap) {
    csv += `${en},${jp}\n`;
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "wrong_words.csv";
  a.click();

  URL.revokeObjectURL(url);
};

/* =====================
   Enterキー
===================== */

document.getElementById("answer").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    if (!answered) {
      document.getElementById("submitBtn").click();
    } else {
      document.getElementById("nextBtn").click();
    }
  }
});

/* =====================
   初期表示
===================== */

window.onload = function () {
  const hasSave = loadProgress();

  document.getElementById("continueBtn").disabled = !hasSave;
  document.getElementById("newBtn").onclick = startNew;
  document.getElementById("continueBtn").onclick = startContinue;
};
