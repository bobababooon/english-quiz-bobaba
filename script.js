let words = [];
let remaining = [];
let current = null;
let correct = 0;
let answered = false;

/* =====================
   保存・復元
===================== */

function saveProgress() {
  localStorage.setItem("quizProgress", JSON.stringify({
    words,
    remaining,
    current,
    correct
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

  document.getElementById("quizArea").style.display = "block";
  showQuestion();
  return true;
}

function clearProgress() {
  localStorage.removeItem("quizProgress");
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

    clearProgress();
    document.getElementById("quizArea").style.display = "block";
    nextQuestion();
  };

  reader.readAsText(file, "UTF-8");
});

/* =====================
   問題処理
===================== */

function nextQuestion() {
  if (remaining.length === 0) {
    document.getElementById("question").textContent = "終了！🎉";
    document.getElementById("feedback").textContent =
      `正解数: ${correct}`;
    clearProgress();
    return;
  }

  current = remaining[Math.floor(Math.random() * remaining.length)];
  answered = false;

  showQuestion();
  saveProgress();
}

function showQuestion() {
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
    document.getElementById("feedback").textContent =
      `不正解 ❌（正解: ${current[0]}）`;
  }

  answered = true;
  saveProgress();
};

/* =====================
   次へ
===================== */

document.getElementById("nextBtn").onclick = function () {
  nextQuestion();
};

/* =====================
   Enterキー対応（スマホOK）
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
   ページ再訪時
===================== */

window.onload = function () {
  if (loadProgress()) {
    if (confirm("前回の続きから再開しますか？")) {
      return;
    } else {
      clearProgress();
      location.reload();
    }
  }
};
