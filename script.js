// ---------- データ ----------
let words = [
  { en: "apple", jp: "りんご" },
  { en: "dog", jp: "犬" },
  { en: "book", jp: "本" }
];

let index = 0;
let score = 0;

// 重複なしで間違えた単語を保存
let wrongWordsSet = new Set();

// ---------- 要素 ----------
const quizArea = document.getElementById("quizArea");
const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answer");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const endArea = document.getElementById("endArea");
const wrongCountEl = document.getElementById("wrongCount");

// ---------- クイズ開始 ----------
function startQuiz() {
  index = 0;
  score = 0;
  wrongWordsSet.clear();

  quizArea.style.display = "block";
  endArea.style.display = "none";

  showQuestion();
}

// ---------- 問題表示 ----------
function showQuestion() {
  if (index >= words.length) {
    finishQuiz();
    return;
  }

  questionEl.textContent = words[index].en;
  answerInput.value = "";
  feedbackEl.textContent = "";
  scoreEl.textContent = `正解数: ${score}`;
}

// ---------- 判定 ----------
function checkAnswer() {
  const userAnswer = answerInput.value.trim();
  const correct = words[index].jp;

  if (userAnswer === correct) {
    feedbackEl.textContent = "⭕ 正解！";
    score++;
  } else {
    feedbackEl.textContent = `❌ 不正解（正解: ${correct}）`;
    // 英語,日本語 の形で保存（重複なし）
    wrongWordsSet.add(`${words[index].en},${correct}`);
  }

  index++;
  setTimeout(showQuestion, 800);
}

// ---------- 終了 ----------
function finishQuiz() {
  quizArea.style.display = "none";
  endArea.style.display = "block";

  // 重複なしの間違えた単語数
  wrongCountEl.textContent =
    `間違えた単語数（重複なし）: ${wrongWordsSet.size}`;
}

// ---------- CSV保存 ----------
function saveCSV() {
  if (wrongWordsSet.size === 0) {
    alert("保存する単語がありません");
    return;
  }

  const csv = Array.from(wrongWordsSet).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "wrong_words.csv";
  a.click();

  URL.revokeObjectURL(url);
}
