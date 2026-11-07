
const button = document.getElementById("popButton");
const game = document.querySelector(".game");
const emoji = document.getElementById("bigEmoji");
const message = document.getElementById("message");
const stars = document.getElementById("stars");
const confettiArea = document.getElementById("confettiArea");

const colors = [
  "#fff0f6",
  "#e0f7ff",
  "#fff6cc",
  "#e8ffe8",
  "#f0e6ff",
  "#ffe9d6"
];

const emojis = [
  "🎈",
  "🌟",
  "🐻",
  "🐸",
  "🍓",
  "🦋",
  "🐰",
  "🌈"
];

const messages = [
  "ぽんぽん<br>パーティー！",
  "わあ！",
  "きらきら！",
  "たのしいね！",
  "もういっかい！",
  "ぽんっ！"
];

let tapCount = 0;
let totalTapCount = Number(localStorage.getItem("ponponTotal")) || 0;
const totalCountDisplay = document.getElementById("totalCount");
totalCountDisplay.textContent =
    `これまでに ${totalTapCount.toLocaleString()} 回 おしたよ！`;
let audioContext = null;

// ボタンを押したときに短い音を鳴らす
function playSound() {
  try {
    if (!audioContext) {
      audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext
      )();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";

    const notes = [
  392, 349, 330, 0,
  294, 330, 349, 294, 262, 0,

  330, 349, 392, 330,
  294, 330, 349, 294,

  330, 349, 392, 330,
  294, 330, 349, 294,

  392, 349, 330, 0,
  294, 330, 349, 294, 262, 0
];
    const frequency = notes[(tapCount - 1) % notes.length];

if (frequency === 0) {
    return;
}

oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(
      0.0001,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.08,
      audioContext.currentTime + 0.03
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.35
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.4);
  } catch (error) {
    console.log("音を再生できませんでした");
  }
}

// 紙吹雪を出す
function makeConfetti() {
  const shapes = ["🎉", "⭐️", "💖", "🎊", "✨"];

  for (let i = 0; i < 24; i++) {
    const piece = document.createElement("div");

    piece.className = "confetti";
    piece.textContent =
      shapes[Math.floor(Math.random() * shapes.length)];

    piece.style.left = Math.random() * 100 + "%";
    piece.style.fontSize =
      20 + Math.random() * 25 + "px";

    piece.style.animationDuration =
      1.8 + Math.random() * 1.5 + "s";

    piece.style.animationDelay =
      Math.random() * 0.3 + "s";

    confettiArea.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 4000);
  }
}

// ボタンを押したときの動き
button.addEventListener("click", () => {
  tapCount++;
      totalTapCount++;
    localStorage.setItem("ponponTotal", totalTapCount);
    totalCountDisplay.textContent =
        `これまでに ${totalTapCount.toLocaleString()} 回 おしたよ！`;

  const colorIndex =
    Math.floor(Math.random() * colors.length);

  const emojiIndex =
    Math.floor(Math.random() * emojis.length);

  const messageIndex =
    Math.floor(Math.random() * messages.length);

  game.style.background = colors[colorIndex];

  emoji.textContent = emojis[emojiIndex];
  message.innerHTML = messages[messageIndex];

  stars.textContent =
    ["⭐️ 🌈 ⭐️", "✨ 💖 ✨", "🌟 🎈 🌟"][
      tapCount % 3
    ];

  makeConfetti();
  playSound();
});
