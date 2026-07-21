// --- Game Variables ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;
let devicePixelRatio = window.devicePixelRatio || 1;

// UI Elements
const mainMenu = document.getElementById('main-menu');
const startBtn = document.getElementById('start-btn');
const nextLevelDiv = document.getElementById('level-complete');
const nextLevelBtn = document.getElementById('next-level-btn');
const nextLevelInfo = document.getElementById('next-level-info');
const gameOverDiv = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const scoreboard = document.querySelector('#scoreboard .stat-value');
const levelIndicator = document.querySelector('#level-indicator .stat-value');
const muteBtn = document.getElementById('mute-btn');
const soundIcon = document.querySelector('.sound-icon');
const lbDiv = document.getElementById('leaderboard');
const lbList = document.getElementById('lb-list');
const showLbBtn = document.getElementById('show-lb-btn');
const showLbBtnOver = document.getElementById('show-lb-btn-over');
const closeLbBtn = document.getElementById('close-lb-btn');

// Game State
let running = false;
let gameOver = false;
let paused = false;
let level = 1;
let score = 0;
let highScores = [];
let mute = false;
let requestId = null;

// --- Sound Effects ---
const SFX = {
  flap: new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_12c6b4ba6e.mp3'),
  die: new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_12c6b4ba6e.mp3'),
  score: new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_12c6b4ba6e.mp3'),
  levelUp: new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_12c6b4ba6e.mp3'),
  powerup: new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_12c6b4ba6e.mp3'),
};

function playSFX(name) {
  if (!mute && SFX[name]) {
    SFX[name].currentTime = 0;
    SFX[name].play();
  }
}

muteBtn.onclick = () => {
  mute = !mute;
  soundIcon.textContent = mute ? '🔇' : '🔊';
};

// --- Responsive Canvas ---
function resizeCanvas() {
  let w = Math.min(window.innerWidth, 480);
  let h = Math.min(window.innerHeight, 720);
  devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = w * devicePixelRatio;
  canvas.height = h * devicePixelRatio;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  width = canvas.width;
  height = canvas.height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- Leaderboard ---
function loadLeaderboard() {
  try {
    highScores = JSON.parse(localStorage.getItem('flyordie-lb') || '[]');
  } catch {
    highScores = [];
  }
}

function saveLeaderboard() {
  localStorage.setItem('flyordie-lb', JSON.stringify(highScores));
}

function showLeaderboard() {
  lbDiv.classList.add('visible');
  mainMenu.classList.remove('visible');
  gameOverDiv.classList.remove('visible');
  lbList.innerHTML = '';
  loadLeaderboard();
  let html = '';
  highScores.slice(0, 10).forEach(({score, level}, i) => {
    const rank = i + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
    html += `<li>
      <span>${medal}</span>
      <span><b>${score}</b> pts - Level ${level}</span>
    </li>`;
  });
  lbList.innerHTML = html || '<li>No scores yet. Play to set a record!</li>';
}

showLbBtn.onclick = showLeaderboard;
showLbBtnOver.onclick = showLeaderboard;
closeLbBtn.onclick = () => {
  lbDiv.classList.remove('visible');
  mainMenu.classList.add('visible');
};

// --- Game Entities ---
class Player {
  constructor() {
    this.x = width / 5;
    this.y = height / 2;
    this.r = 20 * devicePixelRatio;
    this.vy = 0;
    this.gravity = 0.6 * devicePixelRatio;
    this.flap = -9 * devicePixelRatio;
    this.color = '#00f3ff';
    this.alive = true;
    this.powered = false;
    this.powerTimer = 0;
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.alive ? (this.powered ? '#00ff88' : this.color) : '#ff3366';
    ctx.shadowColor = this.powered ? '#00ff88' : this.color;
    ctx.shadowBlur = this.powered ? 30 : 15;
    ctx.fill();
    ctx.restore();
  }

  update() {
    if (!this.alive) return;
    this.vy += this.gravity;
    this.y += this.vy;
    if (this.powered) {
      this.powerTimer--;
      if (this.powerTimer <= 0) this.powered = false;
    }
  }

  flapUp() {
    if (!this.alive) return;
    this.vy = this.flap;
    playSFX('flap');
  }

  powerUp() {
    this.powered = true;
    this.powerTimer = 120; // 2s at 60fps
    playSFX('powerup');
  }
}

class Obstacle {
  constructor(gapY, gapH) {
    this.x = width + 50 * devicePixelRatio;
    this.w = 40 * devicePixelRatio;
    this.gapY = gapY;
    this.gapH = gapH;
    this.speed = 4 + level * 0.7;
    this.passed = false;
  }

  update() {
    this.x -= this.speed * devicePixelRatio;
  }

  draw() {
    ctx.save();
    
    // Gradient for pipes
    const gradient = ctx.createLinearGradient(this.x, 0, this.x + this.w, 0);
    gradient.addColorStop(0, '#ff3366');
    gradient.addColorStop(0.5, '#ff006e');
    gradient.addColorStop(1, '#ff3366');
    
    ctx.fillStyle = gradient;
    ctx.shadowColor = '#ff006e';
    ctx.shadowBlur = 20;
    
    // Top pipe
    ctx.fillRect(this.x, 0, this.w, this.gapY - this.gapH / 2);
    
    // Bottom pipe
    ctx.fillRect(this.x, this.gapY + this.gapH / 2, this.w, height - this.gapY - this.gapH / 2);
    
    ctx.restore();
  }

  offScreen() {
    return this.x + this.w < 0;
  }
}

class PowerUp {
  constructor() {
    this.x = width + 50 * devicePixelRatio;
    this.y = Math.random() * (height - 60 * devicePixelRatio) + 30 * devicePixelRatio;
    this.r = 14 * devicePixelRatio;
    this.speed = 4 + level * 0.7;
    this.collected = false;
    this.angle = 0;
  }

  update() {
    this.x -= this.speed * devicePixelRatio;
    this.angle += 0.1;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // Star shape
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5;
      const x = Math.cos(angle) * this.r;
      const y = Math.sin(angle) * this.r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 25;
    ctx.fill();
    
    ctx.restore();
  }

  offScreen() {
    return this.x + this.r < 0;
  }
}

// --- Game Logic ---
let player, obstacles, powerUps, frameCount, scoreThisLevel, nextPowerSpawn;

function resetGameVars(levelNum = 1) {
  player = new Player();
  obstacles = [];
  powerUps = [];
  frameCount = 0;
  scoreThisLevel = 0;
  nextPowerSpawn = Math.floor(Math.random() * 120) + 180;
  level = levelNum;
  running = true;
  paused = false;
  gameOver = false;
  scoreboard.textContent = score;
  levelIndicator.textContent = level;
}

function startGame() {
  mainMenu.classList.remove('visible');
  gameOverDiv.classList.remove('visible');
  nextLevelDiv.classList.remove('visible');
  lbDiv.classList.remove('visible');
  score = 0;
  resetGameVars(1);
  requestId = requestAnimationFrame(gameLoop);
}

function nextLevel() {
  nextLevelDiv.classList.remove('visible');
  score += scoreThisLevel;
  resetGameVars(level + 1);
  playSFX('levelUp');
  requestId = requestAnimationFrame(gameLoop);
}

function endGame() {
  running = false;
  gameOver = true;
  player.alive = false;
  finalScoreEl.textContent = `Final Score: ${score} (Level ${level})`;
  gameOverDiv.classList.add('visible');
  
  // Save leaderboard
  loadLeaderboard();
  highScores.push({score, level});
  highScores = highScores.sort((a, b) => b.score - a.score).slice(0, 10);
  saveLeaderboard();
  playSFX('die');
}

startBtn.onclick = startGame;
restartBtn.onclick = startGame;
nextLevelBtn.onclick = nextLevel;

// --- Controls ---
function handleFlap(e) {
  if (!running || paused) return;
  player.flapUp();
}

canvas.addEventListener('mousedown', handleFlap);
canvas.addEventListener('touchstart', handleFlap);

// --- Game Loop ---
function gameLoop() {
  ctx.clearRect(0, 0, width, height);
  
  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#2d3561');
  grad.addColorStop(1, '#1a1f3a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Draw and Update Player
  player.update();
  player.draw();

  // Spawn Obstacles
  if (frameCount % Math.max(90 - level * 4, 40) === 0) {
    let gapH = Math.max(110 - level * 7, 60) * devicePixelRatio;
    let gapY = Math.random() * (height - gapH * 1.2) + gapH * 0.6;
    obstacles.push(new Obstacle(gapY, gapH));
  }
  
  obstacles.forEach(o => o.update());
  obstacles.forEach(o => o.draw());
  obstacles = obstacles.filter(o => !o.offScreen());

  // Spawn PowerUp
  if (frameCount > nextPowerSpawn && Math.random() < 0.01 + level * 0.001) {
    powerUps.push(new PowerUp());
    nextPowerSpawn = frameCount + Math.floor(Math.random() * 150) + 200;
  }
  
  powerUps.forEach(p => p.update());
  powerUps.forEach(p => p.draw());
  powerUps = powerUps.filter(p => !p.offScreen());

  // Collision Detection
  obstacles.forEach(o => {
    // Player hit obstacle
    if (!o.passed && !player.powered &&
      player.x + player.r > o.x && player.x - player.r < o.x + o.w &&
      (player.y - player.r < o.gapY - o.gapH / 2 || player.y + player.r > o.gapY + o.gapH / 2)) {
      endGame();
    }
    
    // Count as passed
    if (!o.passed && o.x + o.w < player.x - player.r) {
      o.passed = true;
      scoreThisLevel += 1;
      scoreboard.textContent = score + scoreThisLevel;
      playSFX('score');
    }
  });

  // Player hit ground or ceiling
  if (player.y + player.r > height || player.y - player.r < 0) {
    endGame();
  }

  // PowerUp collection
  powerUps.forEach(p => {
    if (!p.collected &&
      Math.abs(player.x - p.x) < player.r + p.r &&
      Math.abs(player.y - p.y) < player.r + p.r) {
      p.collected = true;
      player.powerUp();
      scoreThisLevel += 5;
      scoreboard.textContent = score + scoreThisLevel;
    }
  });
  powerUps = powerUps.filter(p => !p.collected);

  // Particle Effects
  if (player.powered) {
    for (let i = 0; i < 8; i++) {
      let angle = (i / 8) * 2 * Math.PI + frameCount * 0.1;
      let px = player.x + Math.cos(angle) * player.r * 1.3;
      let py = player.y + Math.sin(angle) * player.r * 1.3;
      ctx.beginPath();
      ctx.arc(px, py, 5 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff88';
      ctx.globalAlpha = 0.6;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Level Progression
  if (scoreThisLevel >= 15 + level * 5) {
    running = false;
    nextLevelInfo.textContent = `Get ready for Level ${level + 1}!`;
    nextLevelDiv.classList.add('visible');
    score += scoreThisLevel;
    levelIndicator.textContent = level + 1;
    playSFX('levelUp');
    return;
  }

  // Next Frame
  frameCount++;
  if (running && !gameOver) {
    requestId = requestAnimationFrame(gameLoop);
  }
}

// --- Init Leaderboard ---
loadLeaderboard();

// --- Pause Feature ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'p' || e.key === 'P') {
    paused = !paused;
    if (!paused && running) {
      requestId = requestAnimationFrame(gameLoop);
    }
  }
});

// --- Show Main Menu on Load ---
mainMenu.classList.add('visible');
