let words = [];
let remaining = [];
let current = null;
let correct = 0;

/* ---------- CSV読み込み ---------- */
document.getElementById("fileInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const lines = reader.result.split(/\r?\n/);
    words = lines
      .map(line => line.split(","))
      .filter(row => row.length >= 2 && row[0] && row[1])
      .map(row => [row[0].trim(), row[1].trim()]);
  };
  reader.readAsText(file, "UTF-8");
});

/* ---------- 始めから ---------- */
document.getElementById("startBtn").onclick = () => {
  if (words.length === 0) {
    // CSV未選択なら何もしない
    return;
  }

  remaining = [...words];
  correct = 0;

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("quizArea").style.display = "block";

  nextQuestion();
};

/* ---------- 次の問題 ---------- */
function nextQuestion() {
  if (remaining.length === 0) {
    document.getElementById("question").textContent = "終了！";
    document.getElementById("feedback").textContent = "お疲れさまでした！";
    return;
  }

  current = remaining[Math.floor(Math.random() * remaining.length)];
  document.getElementById("question").textContent = "意味: " + current[1];
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("score").textContent = "正解: " + correct;
  document.getElementById("answer").focus();
}

/* ---------- 答える ---------- */
document.getElementById("submitBtn").onclick = () => {
  if (!current) return;

  const user = document.getElementById("answer").value.trim();
  const answer = current[0];

  if (user.toLowerCase() === answer.toLowerCase()) {
    correct++;
    remaining = remaining.filter(w => w !== current);
    document.getElementById("feedback").textContent = "正解！ 🎉";
  } else {
    document.getElementById("feedback").textContent =
      "不正解 ❌（正解: " + answer + "）";
  }
};

/* ---------- 次へ ---------- */
document.getElementById("nextBtn").onclick = nextQuestion;

/* ---------- Enterキー対応（スマホOK） ---------- */
document.getElementById("answer").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    if (document.getElementById("feedback").textContent === "") {
      document.getElementById("submitBtn").click();
    } else {
      nextQuestion();
    }
  }
});
