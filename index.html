let words = [];
let remaining = [];
let current = null;
let correct = 0;
let answered = false;

// CSV読み込み
document.getElementById("fileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const lines = reader.result.split("\n");
    words = lines
      .map(line => line.split(","))
      .filter(row => row[0]);

    remaining = [...words];
    correct = 0;

    document.getElementById("quizArea").style.display = "block";
    nextQuestion();
  };

  reader.readAsText(file, "UTF-8");
});

// 次の問題
function nextQuestion() {
  if (remaining.length === 0) {
    document.getElementById("question").textContent = "終了！";
    document.getElementById("feedback").textContent = "お疲れさま 🎉";
    return;
  }

  current = remaining[Math.floor(Math.random() * remaining.length)];
  document.getElementById("question").textContent = "意味: " + (current[1] || "");
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("score").textContent = `正解: ${correct}`;

  answered = false;
}

// 答え合わせ
function checkAnswer() {
  if (answered || !current) return;

  const user = document.getElementById("answer").value.trim();
  const answer = current[0];

  if (user.toLowerCase() === answer.toLowerCase()) {
    correct++;
    remaining = remaining.filter(w => w !== current);
    document.getElementById("feedback").textContent = "正解！🎉";
  } else {
    document.getElementById("feedback").textContent =
      `不正解 ❌（正解: ${answer}）`;
  }

  answered = true;
}

// ボタン操作
document.getElementById("submitBtn").onclick = checkAnswer;
document.getElementById("nextBtn").onclick = nextQuestion;

// Enterキー対応（スマホOK）
const input = document.getElementById("answer");

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();

    if (!answered) {
      checkAnswer();   // 1回目 Enter：答え合わせ
    } else {
      nextQuestion();  // 2回目 Enter：次の問題
    }
  }
});
