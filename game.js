const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const scoreEl = document.querySelector("#score");
const shieldEl = document.querySelector("#shield");
const comboEl = document.querySelector("#combo");
const goldEl = document.querySelector("#gold");
const levelEl = document.querySelector("#level");
const xpTextEl = document.querySelector("#xpText");
const xpFillEl = document.querySelector("#xpFill");
const finalScoreEl = document.querySelector("#finalScore");
const startPanel = document.querySelector("#startPanel");
const endPanel = document.querySelector("#endPanel");
const startBtn = document.querySelector("#startBtn");
const retryBtn = document.querySelector("#retryBtn");
const pauseBtn = document.querySelector("#pauseBtn");

const asset = new Image();
asset.src = "assets/character-source.png";

const badTexts = [
  "恶意弹幕",
  "人身攻击",
  "谣言",
  "刷屏",
  "引战",
  "诋毁",
  "挑衅",
  "阴阳怪气",
  "恶意揣测",
  "带节奏",
  "恶评",
  "拉踩",
];

const state = {
  mode: "intro",
  width: 0,
  height: 0,
  dpr: 1,
  time: 0,
  elapsed: 0,
  lastFrame: 0,
  score: 0,
  shield: 5,
  combo: 0,
  gold: 0,
  level: 1,
  levelGold: 0,
  levelPulse: 0,
  spawnTimer: 0.5,
  fireTimer: 0,
  shake: 0,
  player: {
    x: 120,
    y: 260,
    invuln: 0,
    muzzle: 0,
  },
  pointer: {
    active: false,
    x: 0,
    y: 0,
  },
  keys: new Set(),
  bullets: [],
  enemies: [],
  particles: [],
  sprite: null,
};

const random = (min, max) => min + Math.random() * (max - min);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const nextLevelCost = (level) => 24 + level * 12;
const dist2 = (ax, ay, bx, by) => {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
};

function resize() {
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  canvas.width = Math.floor(state.width * state.dpr);
  canvas.height = Math.floor(state.height * state.dpr);
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  state.player.x = clamp(state.player.x || state.width * 0.18, 44, state.width * 0.48);
  state.player.y = clamp(state.player.y || state.height * 0.5, playTop(), state.height - 46);
}

function roundRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width * 0.5, height * 0.5);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function buildSpriteFromImage(image) {
  const low = document.createElement("canvas");
  low.width = 44;
  low.height = 62;
  const px = low.getContext("2d");
  px.imageSmoothingEnabled = false;
  px.clearRect(0, 0, low.width, low.height);

  px.fillStyle = "rgba(12, 12, 15, 0.88)";
  px.fillRect(7, 9, 8, 43);
  px.fillRect(29, 10, 8, 43);
  px.fillRect(13, 4, 20, 9);
  px.fillRect(10, 46, 24, 8);

  px.save();
  px.beginPath();
  px.ellipse(22, 22, 18, 21, 0, 0, Math.PI * 2);
  px.rect(9, 32, 26, 26);
  px.clip();
  px.drawImage(image, 58, 18, 732, 1032, 0, 0, low.width, low.height);
  px.restore();

  px.fillStyle = "rgba(9, 9, 12, 0.82)";
  px.fillRect(6, 14, 5, 30);
  px.fillRect(32, 13, 5, 32);
  px.fillRect(10, 5, 26, 6);
  px.fillRect(13, 8, 25, 7);
  px.fillRect(11, 16, 20, 4);
  px.fillRect(8, 40, 7, 16);
  px.fillRect(30, 39, 7, 16);

  px.fillStyle = "rgba(255, 245, 237, 0.88)";
  px.fillRect(14, 23, 19, 13);
  px.fillRect(17, 35, 12, 5);

  px.fillStyle = "#e64068";
  px.fillRect(28, 23, 4, 2);
  px.fillRect(29, 24, 3, 2);
  px.fillStyle = "#ffe9ee";
  px.fillRect(31, 23, 1, 1);

  px.fillStyle = "#ffffff";
  px.fillRect(14, 39, 16, 7);
  px.fillRect(16, 46, 12, 6);
  px.fillStyle = "#a58cff";
  px.fillRect(11, 49, 22, 10);
  px.fillStyle = "#4b378f";
  px.fillRect(19, 50, 6, 9);
  px.fillStyle = "#fbf8ff";
  px.fillRect(20, 51, 3, 3);

  px.fillStyle = "#8069ff";
  px.fillRect(33, 8, 7, 7);
  px.fillRect(36, 15, 6, 8);
  px.fillRect(30, 15, 7, 7);
  px.fillStyle = "#d9d1ff";
  px.fillRect(36, 9, 2, 2);
  px.fillRect(38, 17, 2, 2);

  px.fillStyle = "rgba(255, 255, 255, 0.38)";
  px.fillRect(17, 13, 3, 2);
  px.fillRect(20, 10, 4, 1);
  px.fillRect(24, 43, 2, 2);

  return low;
}

function buildFallbackSprite() {
  const low = document.createElement("canvas");
  low.width = 44;
  low.height = 62;
  const px = low.getContext("2d");
  px.imageSmoothingEnabled = false;
  px.clearRect(0, 0, low.width, low.height);

  px.fillStyle = "#111015";
  px.fillRect(8, 8, 28, 32);
  px.fillRect(6, 17, 8, 32);
  px.fillRect(30, 18, 8, 32);
  px.fillStyle = "#fff4ee";
  px.fillRect(14, 20, 19, 18);
  px.fillStyle = "#0b0b0f";
  px.fillRect(10, 10, 28, 13);
  px.fillRect(9, 22, 12, 6);
  px.fillStyle = "#e64068";
  px.fillRect(29, 25, 4, 2);
  px.fillStyle = "#ffffff";
  px.fillRect(15, 39, 16, 9);
  px.fillStyle = "#9c7cff";
  px.fillRect(11, 49, 22, 10);
  px.fillRect(33, 9, 8, 14);
  px.fillRect(30, 14, 12, 7);
  return low;
}

function resetGame() {
  state.mode = "playing";
  state.elapsed = 0;
  state.score = 0;
  state.shield = 5;
  state.combo = 0;
  state.gold = 0;
  state.level = 1;
  state.levelGold = 0;
  state.levelPulse = 0;
  state.spawnTimer = 0.35;
  state.fireTimer = 0.08;
  state.shake = 0;
  state.bullets.length = 0;
  state.enemies.length = 0;
  state.particles.length = 0;
  state.player.x = state.width * 0.18;
  state.player.y = clamp(state.height * 0.55, playTop(), state.height - 46);
  state.player.invuln = 0;
  state.player.muzzle = 0;
  startPanel.classList.add("hidden");
  endPanel.classList.add("hidden");
  pauseBtn.textContent = "Ⅱ";
  updateHud();
}

function endGame() {
  state.mode = "over";
  finalScoreEl.textContent = Math.floor(state.score).toString();
  endPanel.classList.remove("hidden");
}

function togglePause() {
  if (state.mode === "playing") {
    state.mode = "paused";
    pauseBtn.textContent = "▶";
  } else if (state.mode === "paused") {
    state.mode = "playing";
    state.lastFrame = performance.now();
    pauseBtn.textContent = "Ⅱ";
  }
}

function updateHud() {
  const cost = nextLevelCost(state.level);
  const xpRatio = clamp(state.levelGold / cost, 0, 1);
  scoreEl.textContent = Math.floor(state.score).toString();
  shieldEl.textContent = Math.max(0, state.shield).toString();
  comboEl.textContent = state.combo.toString();
  goldEl.textContent = state.gold.toString();
  levelEl.textContent = state.level.toString();
  xpTextEl.textContent = `${state.levelGold} / ${cost}`;
  xpFillEl.style.width = `${Math.round(xpRatio * 100)}%`;
}

function spriteScale() {
  return clamp(state.width / 430, 1.75, 2.45);
}

function playTop() {
  return state.width <= 560 ? 172 : 112;
}

function playerBounds() {
  return {
    minX: 42,
    maxX: Math.max(150, state.width * 0.48),
    minY: playTop(),
    maxY: state.height - 44,
  };
}

function updatePlayer(dt) {
  const player = state.player;
  const bounds = playerBounds();
  const speed = 320 + Math.min(120, state.elapsed * 2.5) + Math.min(75, (state.level - 1) * 9);
  let dx = 0;
  let dy = 0;

  if (state.keys.has("arrowleft") || state.keys.has("a")) dx -= 1;
  if (state.keys.has("arrowright") || state.keys.has("d")) dx += 1;
  if (state.keys.has("arrowup") || state.keys.has("w")) dy -= 1;
  if (state.keys.has("arrowdown") || state.keys.has("s")) dy += 1;

  if (dx || dy) {
    const length = Math.hypot(dx, dy) || 1;
    player.x += (dx / length) * speed * dt;
    player.y += (dy / length) * speed * dt;
  }

  if (state.pointer.active) {
    const targetX = clamp(state.pointer.x, bounds.minX, bounds.maxX);
    const targetY = clamp(state.pointer.y, bounds.minY, bounds.maxY);
    const ease = 1 - Math.pow(0.001, dt);
    player.x += (targetX - player.x) * ease;
    player.y += (targetY - player.y) * ease;
  }

  player.x = clamp(player.x, bounds.minX, bounds.maxX);
  player.y = clamp(player.y, bounds.minY, bounds.maxY);
  player.invuln = Math.max(0, player.invuln - dt);
  player.muzzle = Math.max(0, player.muzzle - dt);
}

function fireBullet(force = false) {
  if (state.mode !== "playing") return;
  if (!force && state.fireTimer > 0) return;

  const tier = Math.min(2, Math.floor((state.level - 1) / 2));
  const spread = tier === 0 ? [0] : tier === 1 ? [-0.055, 0.055] : [-0.08, 0, 0.08];
  const fireDelay = Math.max(0.09, 0.16 - (state.level - 1) * 0.008);

  for (const offset of spread) {
    state.bullets.push({
      x: state.player.x + 32,
      y: state.player.y - 8,
      vx: 650,
      vy: offset * 650,
      radius: 5,
      life: 1.2,
      color: tier === 0 ? "#5df0c4" : tier === 1 ? "#ffd166" : "#c9f8ff",
    });
  }

  state.player.muzzle = 0.09;
  state.fireTimer = force ? Math.min(0.08, fireDelay) : fireDelay;
}

function spawnEnemy() {
  const text = badTexts[Math.floor(Math.random() * badTexts.length)];
  const textUnits = Array.from(text).length;
  const hp = clamp(1 + Math.floor(random(0, 1.45 + state.elapsed / 34 + state.level / 16)), 1, 5);
  const width = Math.max(78, 34 + textUnits * 19 + hp * 10);
  const height = 30 + hp * 2;
  const palette = [
    ["#ff5370", "rgba(255, 83, 112, 0.18)"],
    ["#ffd166", "rgba(255, 209, 102, 0.16)"],
    ["#b48cff", "rgba(180, 140, 255, 0.18)"],
    ["#ff8aa0", "rgba(255, 138, 160, 0.18)"],
  ][Math.floor(random(0, 4))];

  state.enemies.push({
    x: state.width + width,
    y: random(playTop() + 18, Math.max(playTop() + 56, state.height - 56)),
    baseY: 0,
    width,
    height,
    hp,
    maxHp: hp,
    speed: random(82, 150) + Math.min(95, state.elapsed * 1.35),
    wobble: random(0.7, 1.8),
    phase: random(0, Math.PI * 2),
    text,
    color: palette[0],
    fill: palette[1],
  });

  const next = 1.02 - Math.min(0.58, state.elapsed / 80) + random(-0.18, 0.2);
  state.spawnTimer = Math.max(0.28, next);
}

function addGoldReward(enemy) {
  const reward = enemy.maxHp * 5 + Math.min(8, Math.floor(state.combo / 3));
  state.gold += reward;
  state.levelGold += reward;
  state.score += reward;

  while (state.levelGold >= nextLevelCost(state.level)) {
    state.levelGold -= nextLevelCost(state.level);
    state.level += 1;
    state.levelPulse = 1.15;
    state.shake = Math.max(state.shake, 7);
    if (state.shield < 7) state.shield += 1;
    spawnBurst(state.player.x, state.player.y - 24, "#ffd166", 24);
  }

  spawnCoinText(enemy.x, enemy.y, reward);
  updateHud();
}

function spawnBurst(x, y, color, amount = 12) {
  for (let i = 0; i < amount; i += 1) {
    state.particles.push({
      x,
      y,
      vx: random(-160, 160),
      vy: random(-150, 150),
      size: random(3, 8),
      life: random(0.28, 0.62),
      maxLife: 0.62,
      color,
    });
  }
}

function spawnCoinText(x, y, amount) {
  state.particles.push({
    x,
    y: y - 18,
    vx: random(-14, 14),
    vy: -62,
    size: 0,
    life: 0.72,
    maxLife: 0.72,
    color: "#ffd166",
    text: `+${amount}`,
  });
}

function damageShield(amount) {
  state.shield -= amount;
  state.combo = 0;
  state.shake = 10;
  state.player.invuln = 0.82;
  spawnBurst(state.player.x, state.player.y, "#ff5370", 18);
  updateHud();
  if (state.shield <= 0) endGame();
}

function pointInEnemy(point, enemy) {
  const left = enemy.x - enemy.width * 0.5;
  const right = enemy.x + enemy.width * 0.5;
  const top = enemy.y - enemy.height * 0.5;
  const bottom = enemy.y + enemy.height * 0.5;
  const closestX = clamp(point.x, left, right);
  const closestY = clamp(point.y, top, bottom);
  return dist2(point.x, point.y, closestX, closestY) <= point.radius * point.radius;
}

function enemyHitsPlayer(enemy) {
  const player = state.player;
  const radius = 26 * spriteScale();
  const left = enemy.x - enemy.width * 0.5;
  const right = enemy.x + enemy.width * 0.5;
  const top = enemy.y - enemy.height * 0.5;
  const bottom = enemy.y + enemy.height * 0.5;
  const closestX = clamp(player.x, left, right);
  const closestY = clamp(player.y, top, bottom);
  return dist2(player.x, player.y, closestX, closestY) <= radius * radius;
}

function updateWorld(dt) {
  if (state.mode !== "playing") return;

  state.elapsed += dt;
  state.fireTimer -= dt;
  state.spawnTimer -= dt;
  state.shake = Math.max(0, state.shake - dt * 42);
  state.levelPulse = Math.max(0, state.levelPulse - dt);

  updatePlayer(dt);
  fireBullet(false);

  if (state.spawnTimer <= 0) {
    spawnEnemy();
    if (state.elapsed > 45 && Math.random() > 0.72) spawnEnemy();
  }

  for (const bullet of state.bullets) {
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;
  }
  state.bullets = state.bullets.filter(
    (bullet) => bullet.life > 0 && bullet.x < state.width + 40 && bullet.y > -40 && bullet.y < state.height + 40,
  );

  for (const enemy of state.enemies) {
    enemy.phase += enemy.wobble * dt;
    enemy.x -= enemy.speed * dt;
    enemy.y += Math.sin(enemy.phase) * 16 * dt;
  }

  for (const enemy of state.enemies) {
    for (const bullet of state.bullets) {
      if (bullet.dead || enemy.dead) continue;
      if (pointInEnemy(bullet, enemy)) {
        bullet.dead = true;
        enemy.hp -= 1;
        spawnBurst(bullet.x, bullet.y, bullet.color, 5);
        if (enemy.hp <= 0) {
          enemy.dead = true;
          state.combo += 1;
          state.score += 12 + Math.min(34, state.combo * 2);
          addGoldReward(enemy);
          spawnBurst(enemy.x, enemy.y, enemy.color, 16);
          if (state.combo > 0 && state.combo % 12 === 0 && state.shield < 7) state.shield += 1;
          updateHud();
        }
      }
    }
  }

  state.bullets = state.bullets.filter((bullet) => !bullet.dead);

  for (const enemy of state.enemies) {
    if (enemy.dead) continue;
    if (enemyHitsPlayer(enemy) && state.player.invuln <= 0) {
      enemy.dead = true;
      damageShield(1);
    } else if (enemy.x + enemy.width * 0.5 < -10) {
      enemy.dead = true;
      damageShield(1);
    }
  }

  state.enemies = state.enemies.filter((enemy) => !enemy.dead);

  for (const particle of state.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.96;
    particle.vy *= 0.96;
    particle.life -= dt;
  }
  state.particles = state.particles.filter((particle) => particle.life > 0);
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, state.width, state.height);
  gradient.addColorStop(0, "#151218");
  gradient.addColorStop(0.45, "#231921");
  gradient.addColorStop(1, "#10201d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.save();
  ctx.globalAlpha = 0.36;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  const gap = 54;
  const offset = (state.time * 18) % gap;
  for (let x = -state.height; x < state.width + state.height; x += gap) {
    ctx.beginPath();
    ctx.moveTo(x + offset, 0);
    ctx.lineTo(x + state.height * 0.62 + offset, state.height);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 58; i += 1) {
    const x = (i * 149 + state.time * (18 + (i % 4) * 6)) % (state.width + 36);
    const y = (i * 83) % state.height;
    const size = 2 + (i % 3);
    ctx.fillStyle = i % 5 === 0 ? "#5df0c4" : i % 3 === 0 ? "#ffd166" : "#9c7cff";
    ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
  }
  ctx.restore();
}

function drawPlayer() {
  const sprite = state.sprite || buildFallbackSprite();
  const scale = spriteScale();
  const width = sprite.width * scale;
  const height = sprite.height * scale;
  const player = state.player;
  const bob = Math.sin(state.time * 6.5) * 2;

  ctx.save();
  ctx.translate(player.x, player.y + bob);

  ctx.globalAlpha = 0.72;
  const trail = player.muzzle > 0 ? 7 : 4;
  for (let i = 0; i < trail; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? "rgba(93, 240, 196, 0.48)" : "rgba(255, 209, 102, 0.42)";
    ctx.fillRect(-width * 0.56 - i * 8, height * 0.18 - i * 2, 14 - i, 5);
  }

  if (player.invuln > 0) {
    ctx.strokeStyle = player.invuln % 0.18 > 0.09 ? "#5df0c4" : "#ffd166";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -height * 0.08, width * 0.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalAlpha = player.invuln > 0 && Math.floor(state.time * 18) % 2 === 0 ? 0.68 : 1;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sprite, -width * 0.5, -height * 0.62, width, height);
  ctx.restore();
  ctx.imageSmoothingEnabled = true;
}

function drawBullets() {
  for (const bullet of state.bullets) {
    ctx.save();
    ctx.translate(bullet.x, bullet.y);
    ctx.fillStyle = bullet.color;
    ctx.shadowColor = bullet.color;
    ctx.shadowBlur = 16;
    ctx.fillRect(-5, -3, 13, 6);
    ctx.fillRect(2, -6, 4, 12);
    ctx.restore();
  }
}

function drawEnemies() {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const enemy of state.enemies) {
    const left = enemy.x - enemy.width * 0.5;
    const top = enemy.y - enemy.height * 0.5;

    ctx.save();
    ctx.shadowColor = enemy.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = enemy.fill;
    ctx.strokeStyle = enemy.color;
    ctx.lineWidth = 1.5;
    roundRect(ctx, left, top, enemy.width, enemy.height, 8);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = enemy.color;
    ctx.fillRect(left + 9, enemy.y - 7, 4, 14);
    ctx.fillRect(left + 8, enemy.y + 10, 6, 3);

    ctx.font = "700 15px Inter, PingFang SC, Microsoft YaHei, sans-serif";
    ctx.fillStyle = "#fff7fb";
    ctx.fillText(enemy.text, enemy.x + 8, enemy.y + 0.5);

    if (enemy.maxHp > 1) {
      const barWidth = enemy.width - 24;
      const ratio = clamp(enemy.hp / enemy.maxHp, 0, 1);
      ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
      ctx.fillRect(left + 12, top + enemy.height - 5, barWidth, 2);
      ctx.fillStyle = enemy.color;
      ctx.fillRect(left + 12, top + enemy.height - 5, barWidth * ratio, 2);
    }
    ctx.restore();
  }
}

function drawParticles() {
  for (const particle of state.particles) {
    const alpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    if (particle.text) {
      ctx.fillStyle = particle.color;
      ctx.font = "900 18px Inter, PingFang SC, Microsoft YaHei, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(particle.text, particle.x, particle.y);
    } else {
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
  }
  ctx.globalAlpha = 1;
}

function drawLevelUp() {
  if (state.levelPulse <= 0 || state.mode !== "playing") return;

  const alpha = clamp(state.levelPulse, 0, 1);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 28px Inter, PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillStyle = "#ffd166";
  ctx.shadowColor = "rgba(255, 209, 102, 0.65)";
  ctx.shadowBlur = 18;
  ctx.fillText(`等级 ${state.level}`, state.width * 0.5, playTop() + 22);
  ctx.restore();
}

function drawPaused() {
  if (state.mode !== "paused") return;
  ctx.save();
  ctx.fillStyle = "rgba(18, 16, 20, 0.52)";
  ctx.fillRect(0, 0, state.width, state.height);
  ctx.fillStyle = "#f8f1ff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 42px Inter, PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillText("暂停", state.width * 0.5, state.height * 0.5);
  ctx.restore();
}

function drawIntroPreview() {
  if (state.mode !== "intro") return;
  state.player.x = state.width * 0.22 + Math.sin(state.time * 1.5) * 10;
  state.player.y = state.height * 0.58 + Math.sin(state.time * 2) * 7;
  drawPlayer();
}

function draw() {
  ctx.save();
  if (state.shake > 0 && state.mode === "playing") {
    ctx.translate(random(-state.shake, state.shake), random(-state.shake, state.shake));
  }
  drawBackground();
  drawEnemies();
  drawBullets();
  drawParticles();
  if (state.mode !== "intro") drawPlayer();
  drawIntroPreview();
  drawLevelUp();
  ctx.restore();
  drawPaused();
}

function frame(now) {
  const dt = Math.min(0.034, (now - state.lastFrame) / 1000 || 0);
  state.lastFrame = now;
  state.time += dt;

  if (state.mode === "intro" && state.bullets.length < 12 && state.time % 0.26 < dt) {
    state.bullets.push({
      x: state.width * 0.22 + 34,
      y: state.height * 0.58 - 8 + Math.sin(state.time * 8) * 6,
      vx: 420,
      vy: Math.sin(state.time * 2) * 36,
      radius: 5,
      life: 1.3,
      color: "#5df0c4",
    });
  }

  if (state.mode === "intro") {
    for (const bullet of state.bullets) {
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      bullet.life -= dt;
    }
    state.bullets = state.bullets.filter((bullet) => bullet.life > 0 && bullet.x < state.width + 40);
  }

  updateWorld(dt);
  draw();
  requestAnimationFrame(frame);
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

window.addEventListener("resize", resize);

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (["arrowleft", "arrowright", "arrowup", "arrowdown", " ", "w", "a", "s", "d"].includes(key)) {
    event.preventDefault();
  }
  if (key === "enter" && state.mode !== "playing") resetGame();
  if (key === "p" || key === "escape") togglePause();
  if (key === " ") fireBullet(true);
  state.keys.add(key);
});

window.addEventListener("keyup", (event) => {
  state.keys.delete(event.key.toLowerCase());
});

canvas.addEventListener("pointerdown", (event) => {
  if (state.mode !== "playing") return;
  canvas.setPointerCapture(event.pointerId);
  state.pointer.active = true;
  Object.assign(state.pointer, pointerPosition(event));
  fireBullet(true);
});

canvas.addEventListener("pointermove", (event) => {
  if (!state.pointer.active) return;
  Object.assign(state.pointer, pointerPosition(event));
});

canvas.addEventListener("pointerup", (event) => {
  state.pointer.active = false;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener("pointercancel", () => {
  state.pointer.active = false;
});

startBtn.addEventListener("click", resetGame);
retryBtn.addEventListener("click", resetGame);
pauseBtn.addEventListener("click", togglePause);

asset.addEventListener("load", () => {
  state.sprite = buildSpriteFromImage(asset);
});

asset.addEventListener("error", () => {
  state.sprite = buildFallbackSprite();
});

resize();
state.sprite = buildFallbackSprite();
state.lastFrame = performance.now();
requestAnimationFrame(frame);
