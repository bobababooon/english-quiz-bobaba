let words = [];
let remaining = [];
let current = null;
let correct = 0;

// CSV読み込み
document.getElementById("fileInput").addEventListener("change", function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    const lines = reader.result.split("\n");
    words = lines.map(line => line.split(","))
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
    return;
  }

  current = remaining[Math.floor(Math.random() * remaining.length)];
  document.getElementById("question").textContent = "意味: " + current[1];
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("score").textContent = `正解: ${correct}`;
}

// 答える
document.getElementById("submitBtn").onclick = function() {
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
};

// 次へ
document.getElementById("nextBtn").onclick = nextQuestion;

