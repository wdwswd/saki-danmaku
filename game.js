const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const introSakiCanvas = document.querySelector("#introSaki");
const introSakiCtx = introSakiCanvas.getContext("2d");

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
const speakerNameEl = document.querySelector("#speakerName");
const dialogueTextEl = document.querySelector("#dialogueText");
const dialogueChoicesEl = document.querySelector("#dialogueChoices");
const startBtn = document.querySelector("#startBtn");
const retryBtn = document.querySelector("#retryBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const musicBtn = document.querySelector("#musicBtn");
const shopBtn = document.querySelector("#shopBtn");
const shopPanel = document.querySelector("#shopPanel");
const closeShopBtn = document.querySelector("#closeShopBtn");
const shopItemsEl = document.querySelector("#shopItems");
const shopMessageEl = document.querySelector("#shopMessage");
const messageBtn = document.querySelector("#messageBtn");
const messagePanel = document.querySelector("#messagePanel");
const closeMessageBtn = document.querySelector("#closeMessageBtn");
const plainMessageEl = document.querySelector("#plainMessage");
const messagePassphraseEl = document.querySelector("#messagePassphrase");
const encryptMessageBtn = document.querySelector("#encryptMessageBtn");
const encryptedMessageEl = document.querySelector("#encryptedMessage");
const cryptoStatusEl = document.querySelector("#cryptoStatus");
const gameModeBtns = document.querySelectorAll("[data-game]");

const asset = new Image();
asset.src = "assets/character-source.png";

const musicTracks = ["assets/music/skybit-dogfight.mp3", "assets/music/skybit-dogfight-alt.mp3"];
const introMusic = new Audio("assets/music/conversation-theme.mp4");
introMusic.preload = "auto";
introMusic.volume = 0.34;
introMusic.loop = true;

const bgMusic = new Audio();
bgMusic.preload = "auto";
bgMusic.volume = 0.36;

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

const introLines = [
  { speaker: "Saki", text: "Hey... can you help me?", choices: ["Yes", "Sure"] },
  { speaker: "Player", text: "Yes, Saki. Tell me what is happening." },
  { speaker: "Saki", text: "A storm of hostile comments is flying across the screen." },
  { speaker: "Player", text: "I will move you around and keep you safe." },
  { speaker: "Saki", text: "Good. Shoot them down, collect coins, and level up." },
  { speaker: "Saki", text: "If we reach 10,000 points, I will show you my victory pose." },
];

const dandruffIntroLines = [
  { speaker: "Saki", text: "Hey... can you help me with something tiny?", choices: ["Yes", "Sure"] },
  { speaker: "Player", text: "Yes, Saki. Tell me what is happening." },
  { speaker: "Saki", text: "There are little pixel flakes hiding in my hair." },
  { speaker: "Player", text: "I will click them away carefully." },
  { speaker: "Saki", text: "They come back slowly, so keep checking my head." },
  { speaker: "Saki", text: "Every five flakes you clean, I will say thank you." },
];

const outfitCatalog = [
  {
    id: "maid",
    name: "Maid Outfit",
    price: 120,
    description: "A black-and-white pixel maid dress with apron sparkle.",
    preview: "linear-gradient(90deg, #111015 0 32%, #ffffff 32% 48%, #a58cff 48% 60%, #111015 60% 100%)",
  },
  {
    id: "sailor",
    name: "Sailor Uniform",
    price: 180,
    description: "A blue sailor collar, pleated skirt, and red ribbon.",
    preview: "linear-gradient(90deg, #3157a8 0 38%, #fff7fb 38% 56%, #e64068 56% 66%, #3157a8 66% 100%)",
  },
  {
    id: "magical",
    name: "Magical Girl Costume",
    price: 260,
    description: "Bright magical layers with star pixels and violet glow.",
    preview: "linear-gradient(90deg, #ff63a8 0 30%, #ffd166 30% 42%, #ffffff 42% 54%, #8069ff 54% 100%)",
  },
];

const state = {
  mode: "intro",
  gameType: "danmaku",
  introIndex: 0,
  introChoice: "",
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
  nextSurpriseScore: 10000,
  cheerMilestone: 0,
  cheerTimer: 0,
  seenBulletTier: 0,
  upgradeTimer: 0,
  upgradeTier: 0,
  musicEnabled: true,
  musicStarted: false,
  musicIndex: 0,
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
  dandruff: [],
  dandruffRemoved: 0,
  dandruffBottleCount: 0,
  dandruffRespawnTimer: 0,
  dandruffThanksTimer: 0,
  dandruffEatTimer: 0,
  dandruffEmoteTimer: 0,
  dandruffMessage: "Click the pixels in Saki's hair",
  bottlePulse: 0,
  equippedOutfit: "default",
  ownedOutfits: new Set(["default"]),
  shopMessage: "Break danmaku to earn coins, then buy outfits here.",
  shopResumeOnClose: false,
  messageResumeOnClose: false,
  sprite: null,
  cleanSprite: null,
};

const random = (min, max) => min + Math.random() * (max - min);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const nextLevelCost = (level) => 24 + level * 12;
const maxParticles = 170;
const bulletPalettes = [
  { core: "#5df0c4", accent: "#c9fff2", glow: "rgba(93, 240, 196, 0.8)", trail: "rgba(93, 240, 196, 0.24)" },
  { core: "#ffd166", accent: "#fff0a8", glow: "rgba(255, 209, 102, 0.86)", trail: "rgba(255, 209, 102, 0.28)" },
  { core: "#6bd3ff", accent: "#e3fbff", glow: "rgba(107, 211, 255, 0.9)", trail: "rgba(107, 211, 255, 0.3)" },
  { core: "#ff63a8", accent: "#ffd4e8", glow: "rgba(255, 99, 168, 0.9)", trail: "rgba(255, 99, 168, 0.3)" },
  { core: "#ffffff", accent: "#b48cff", glow: "rgba(255, 255, 255, 0.95)", trail: "rgba(180, 140, 255, 0.36)" },
  { core: "#ff8c42", accent: "#ffe2ad", glow: "rgba(255, 140, 66, 0.92)", trail: "rgba(255, 140, 66, 0.3)" },
  { core: "#7cff6b", accent: "#e4ffd8", glow: "rgba(124, 255, 107, 0.92)", trail: "rgba(124, 255, 107, 0.3)" },
  { core: "#d46bff", accent: "#f5d7ff", glow: "rgba(212, 107, 255, 0.92)", trail: "rgba(212, 107, 255, 0.3)" },
];
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

function buildCleanSpriteFromImage(image) {
  const portrait = document.createElement("canvas");
  portrait.width = 92;
  portrait.height = 128;
  const px = portrait.getContext("2d");
  px.imageSmoothingEnabled = false;
  px.clearRect(0, 0, portrait.width, portrait.height);

  px.fillStyle = "#0b0b0f";
  px.fillRect(10, 8, 72, 78);
  px.fillRect(4, 38, 18, 76);
  px.fillRect(70, 34, 18, 82);

  px.save();
  px.beginPath();
  px.ellipse(46, 44, 38, 42, 0, 0, Math.PI * 2);
  px.rect(18, 56, 56, 64);
  px.clip();
  px.drawImage(image, 58, 18, 732, 1032, 0, 0, portrait.width, portrait.height);
  px.restore();

  px.fillStyle = "rgba(8, 8, 11, 0.86)";
  px.fillRect(8, 24, 14, 58);
  px.fillRect(70, 22, 14, 60);
  px.fillRect(16, 9, 58, 14);
  px.fillRect(12, 21, 66, 16);
  px.fillRect(10, 34, 42, 12);
  px.fillRect(14, 46, 27, 9);
  px.fillRect(4, 76, 18, 42);
  px.fillRect(70, 76, 18, 42);

  px.fillStyle = "#fff1e8";
  px.fillRect(25, 48, 42, 28);
  px.fillRect(30, 75, 30, 12);
  px.fillRect(34, 86, 22, 7);

  px.fillStyle = "#0b0b0f";
  px.fillRect(20, 45, 38, 9);
  px.fillRect(18, 54, 22, 5);
  px.fillRect(21, 60, 12, 4);
  px.fillRect(60, 40, 12, 38);

  px.fillStyle = "#d93662";
  px.fillRect(57, 54, 7, 3);
  px.fillRect(59, 57, 5, 2);
  px.fillStyle = "#ffe3ec";
  px.fillRect(62, 54, 2, 1);

  px.fillStyle = "#d96f75";
  px.fillRect(42, 77, 8, 2);
  px.fillRect(45, 79, 4, 1);
  px.fillStyle = "rgba(255, 224, 224, 0.72)";
  px.fillRect(23, 66, 6, 3);
  px.fillRect(61, 66, 6, 3);

  px.fillStyle = "#ffffff";
  px.fillRect(28, 92, 36, 14);
  px.fillRect(32, 106, 28, 9);
  px.fillStyle = "#a58cff";
  px.fillRect(22, 109, 48, 15);
  px.fillRect(34, 101, 24, 10);
  px.fillStyle = "#4b378f";
  px.fillRect(42, 110, 9, 14);
  px.fillStyle = "#fbf8ff";
  px.fillRect(44, 112, 5, 5);

  px.fillStyle = "#8069ff";
  px.fillRect(70, 14, 14, 14);
  px.fillRect(76, 28, 12, 16);
  px.fillRect(64, 28, 13, 13);
  px.fillStyle = "#d9d1ff";
  px.fillRect(76, 16, 5, 4);
  px.fillRect(80, 31, 4, 4);

  px.fillStyle = "rgba(255, 255, 255, 0.34)";
  px.fillRect(31, 23, 8, 2);
  px.fillRect(40, 18, 9, 2);
  px.fillRect(50, 24, 5, 2);
  px.fillRect(35, 95, 5, 3);

  return portrait;
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

function buildFallbackCleanSprite() {
  const fallbackImage = buildFallbackSprite();
  const portrait = document.createElement("canvas");
  portrait.width = 92;
  portrait.height = 128;
  const px = portrait.getContext("2d");
  px.imageSmoothingEnabled = false;
  px.clearRect(0, 0, portrait.width, portrait.height);
  px.drawImage(fallbackImage, 0, 0, fallbackImage.width, fallbackImage.height, 10, 0, 72, 112);
  return portrait;
}

function renderIntroDialogue() {
  const lines = state.gameType === "dandruff" ? dandruffIntroLines : introLines;
  const line = lines[state.introIndex] || lines[lines.length - 1];
  speakerNameEl.textContent = line.speaker;
  dialogueTextEl.textContent =
    line.speaker === "Player" && state.introChoice
      ? `${state.introChoice}, Saki. Tell me what is happening.`
      : line.text;

  dialogueChoicesEl.classList.toggle("hidden", !line.choices);
  startBtn.classList.toggle("hidden", Boolean(line.choices));
  startBtn.textContent = state.introIndex >= lines.length - 1 ? "Start Game" : "Next";
}

function renderIntroSaki() {
  if (!introSakiCtx) return;

  const sprite = state.sprite || buildFallbackSprite();
  introSakiCtx.clearRect(0, 0, introSakiCanvas.width, introSakiCanvas.height);
  introSakiCtx.imageSmoothingEnabled = false;
  introSakiCtx.drawImage(sprite, 0, 0, introSakiCanvas.width, introSakiCanvas.height);
}

function advanceIntro(choice = "") {
  const lines = state.gameType === "dandruff" ? dandruffIntroLines : introLines;
  startIntroMusic();
  if (choice) state.introChoice = choice;

  if (state.introIndex < lines.length - 1) {
    state.introIndex += 1;
    renderIntroDialogue();
    return;
  }

  resetGame();
}

function startIntroMusic() {
  if (!state.musicEnabled || state.mode !== "intro") return;
  introMusic.play().catch(() => {});
}

function pauseIntroMusic() {
  introMusic.pause();
}

function stopIntroMusic() {
  introMusic.pause();
  introMusic.currentTime = 0;
}

function playMusicTrack() {
  if (!state.musicEnabled) return;
  bgMusic.src = musicTracks[state.musicIndex];
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {
    state.musicStarted = false;
  });
}

function startMusic() {
  if (!state.musicEnabled) return;
  state.musicStarted = true;
  if (!bgMusic.src) playMusicTrack();
  else bgMusic.play().catch(() => {
    state.musicStarted = false;
  });
}

function pauseMusic() {
  bgMusic.pause();
}

function toggleMusic() {
  state.musicEnabled = !state.musicEnabled;
  musicBtn.textContent = state.musicEnabled ? "♪" : "×";
  musicBtn.setAttribute("aria-pressed", String(state.musicEnabled));

  if (!state.musicEnabled) {
    pauseIntroMusic();
    pauseMusic();
    return;
  }

  if (state.mode === "intro") startIntroMusic();
  if (state.mode === "playing") startMusic();
}

function openShop() {
  state.shopMessage = state.gameType === "danmaku" ? "Spend coins from broken danmaku." : "Outfits are mainly for the shooting game.";
  state.shopResumeOnClose = false;
  if (state.mode === "playing") {
    state.shopResumeOnClose = true;
    state.mode = "paused";
    pauseBtn.textContent = "▶";
    pauseMusic();
  }
  renderShop();
  shopPanel.classList.remove("hidden");
}

function closeShop() {
  shopPanel.classList.add("hidden");
  if (state.shopResumeOnClose && state.mode === "paused") {
    state.mode = "playing";
    state.lastFrame = performance.now();
    pauseBtn.textContent = "Ⅱ";
    startMusic();
  }
  state.shopResumeOnClose = false;
}

function openMessagePanel() {
  state.messageResumeOnClose = false;
  if (state.mode === "playing") {
    state.messageResumeOnClose = true;
    state.mode = "paused";
    pauseBtn.textContent = "▶";
    pauseMusic();
  }
  cryptoStatusEl.textContent = "Runs locally in this browser. Enter a message and passphrase.";
  messagePanel.classList.remove("hidden");
}

function closeMessagePanel() {
  messagePanel.classList.add("hidden");
  if (state.messageResumeOnClose && state.mode === "paused") {
    state.mode = "playing";
    state.lastFrame = performance.now();
    pauseBtn.textContent = "Ⅱ";
    startMusic();
  }
  state.messageResumeOnClose = false;
}

function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function deriveMessageKey(passphrase, salt) {
  const baseKey = await globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return globalThis.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 120000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
}

async function generateEncryptedMessage() {
  const message = plainMessageEl.value.trim();
  const passphrase = messagePassphraseEl.value;

  if (!message || !passphrase) {
    cryptoStatusEl.textContent = "Add both a message and a passphrase first.";
    return;
  }

  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.subtle) {
    cryptoStatusEl.textContent = "Web Crypto is not available in this browser.";
    return;
  }

  encryptMessageBtn.disabled = true;
  cryptoStatusEl.textContent = "Encrypting locally...";

  try {
    const salt = cryptoApi.getRandomValues(new Uint8Array(16));
    const iv = cryptoApi.getRandomValues(new Uint8Array(12));
    const key = await deriveMessageKey(passphrase, salt);
    const encrypted = await cryptoApi.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(message));
    const payload = {
      type: "saki-group-message",
      version: 1,
      algorithm: "AES-GCM",
      kdf: "PBKDF2-SHA256",
      iterations: 120000,
      salt: bytesToBase64(salt),
      iv: bytesToBase64(iv),
      ciphertext: bytesToBase64(new Uint8Array(encrypted)),
    };

    encryptedMessageEl.value = btoa(JSON.stringify(payload));
    cryptoStatusEl.textContent = "Encrypted message generated locally.";
  } catch (error) {
    cryptoStatusEl.textContent = "Could not encrypt this message.";
  } finally {
    encryptMessageBtn.disabled = false;
  }
}

function renderShop() {
  shopMessageEl.textContent = state.shopMessage;
  shopItemsEl.innerHTML = "";

  for (const outfit of outfitCatalog) {
    const owned = state.ownedOutfits.has(outfit.id);
    const equipped = state.equippedOutfit === outfit.id;
    const buttonText = equipped ? "Equipped" : owned ? "Equip" : `Buy ${outfit.price}`;

    const card = document.createElement("article");
    card.className = "shop-card";
    card.innerHTML = `
      <div class="shop-preview" style="background-image: ${outfit.preview}"></div>
      <h3>${outfit.name}</h3>
      <p>${outfit.description}</p>
      <div class="shop-price"><span>Cost</span><strong>${outfit.price} coins</strong></div>
      <button class="shop-buy-button${equipped ? " equipped" : ""}" type="button" data-outfit="${outfit.id}">
        ${buttonText}
      </button>
    `;
    shopItemsEl.appendChild(card);
  }
}

function buyOrEquipOutfit(outfitId) {
  const outfit = outfitCatalog.find((item) => item.id === outfitId);
  if (!outfit) return;

  if (state.ownedOutfits.has(outfit.id)) {
    state.equippedOutfit = outfit.id;
    state.shopMessage = `${outfit.name} equipped.`;
    renderShop();
    return;
  }

  if (state.gold < outfit.price) {
    state.shopMessage = `Need ${outfit.price - state.gold} more coins for ${outfit.name}.`;
    renderShop();
    return;
  }

  state.gold -= outfit.price;
  state.ownedOutfits.add(outfit.id);
  state.equippedOutfit = outfit.id;
  state.shopMessage = `${outfit.name} bought and equipped.`;
  spawnBurst(state.player.x, state.player.y - 36, "#ffd166", 18);
  updateHud();
  renderShop();
}

function setGameType(gameType) {
  if (!["danmaku", "dandruff"].includes(gameType) || state.gameType === gameType) return;

  state.gameType = gameType;
  closeShop();
  closeMessagePanel();
  updateGameModeButtons();
  state.pointer.active = false;
  state.bullets.length = 0;
  state.enemies.length = 0;
  state.particles.length = 0;

  if (state.mode === "playing" || state.mode === "paused" || state.mode === "over") resetGame();
  else {
    renderIntroDialogue();
    updateHud();
  }
}

function updateGameModeButtons() {
  for (const button of gameModeBtns) {
    const active = button.dataset.game === state.gameType;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  }
}

function resetGame() {
  if (state.gameType === "dandruff") {
    resetDandruffGame();
    return;
  }

  resetDanmakuGame();
}

function resetDanmakuGame() {
  stopIntroMusic();
  state.mode = "playing";
  state.elapsed = 0;
  state.score = 0;
  state.shield = 5;
  state.combo = 0;
  state.gold = 0;
  state.level = 1;
  state.levelGold = 0;
  state.levelPulse = 0;
  state.nextSurpriseScore = 10000;
  state.cheerMilestone = 0;
  state.cheerTimer = 0;
  state.seenBulletTier = 0;
  state.upgradeTimer = 0;
  state.upgradeTier = 0;
  state.spawnTimer = 0.24;
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
  startMusic();
}

function resetDandruffGame() {
  stopIntroMusic();
  state.mode = "playing";
  state.elapsed = 0;
  state.score = 0;
  state.shield = 0;
  state.combo = 0;
  state.gold = 0;
  state.level = 1;
  state.levelGold = 0;
  state.levelPulse = 0;
  state.cheerTimer = 0;
  state.upgradeTimer = 0;
  state.spawnTimer = 0;
  state.fireTimer = 0;
  state.shake = 0;
  state.bullets.length = 0;
  state.enemies.length = 0;
  state.particles.length = 0;
  state.dandruff.length = 0;
  state.dandruffRemoved = 0;
  state.dandruffBottleCount = 0;
  state.dandruffRespawnTimer = 0.8;
  state.dandruffThanksTimer = 0;
  state.dandruffEatTimer = 0;
  state.dandruffEmoteTimer = 0;
  state.dandruffMessage = "Click the pixels in Saki's hair";
  state.bottlePulse = 0;
  state.player.x = state.width * 0.5;
  state.player.y = state.height * 0.58;
  state.pointer.active = false;

  for (let i = 0; i < 16; i += 1) spawnDandruff(true);

  startPanel.classList.add("hidden");
  endPanel.classList.add("hidden");
  pauseBtn.textContent = "Ⅱ";
  updateHud();
  startMusic();
}

function endGame() {
  state.mode = "over";
  finalScoreEl.textContent = Math.floor(state.score).toString();
  endPanel.classList.remove("hidden");
  pauseMusic();
}

function togglePause() {
  if (state.mode === "playing") {
    state.mode = "paused";
    pauseBtn.textContent = "▶";
    pauseMusic();
  } else if (state.mode === "paused") {
    state.mode = "playing";
    state.lastFrame = performance.now();
    pauseBtn.textContent = "Ⅱ";
    startMusic();
  }
}

function updateHud() {
  if (state.gameType === "dandruff") {
    scoreEl.textContent = state.dandruffRemoved.toString();
    shieldEl.textContent = "OK";
    comboEl.textContent = state.combo.toString();
    goldEl.textContent = state.gold.toString();
    levelEl.textContent = state.level.toString();
    xpTextEl.textContent = `${state.dandruffBottleCount} / 65 bottle`;
    xpFillEl.style.width = `${Math.round(clamp(state.dandruffBottleCount / 65, 0, 1) * 100)}%`;
    return;
  }

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

function scoreTier() {
  return Math.floor(state.score / 5000);
}

function bulletPowerTier() {
  return Math.min(6, scoreTier());
}

function activeBulletPalette() {
  return bulletPalettes[scoreTier() % bulletPalettes.length];
}

function hardModeLevel() {
  return Math.max(0, Math.floor((state.score - 12500) / 4000) + 1);
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

  const tier = scoreTier();
  const power = bulletPowerTier();
  const levelSpread = Math.min(2, Math.floor((state.level - 1) / 2));
  const spread =
    Math.max(power, levelSpread) === 0
      ? [0]
      : Math.max(power, levelSpread) === 1
        ? [-0.055, 0.055]
        : power >= 5
          ? [-0.15, -0.085, -0.025, 0.025, 0.085, 0.15]
          : power >= 3
          ? [-0.12, -0.045, 0.045, 0.12]
          : [-0.08, 0, 0.08];
  const palette = bulletPalettes[tier % bulletPalettes.length];
  const fireDelay = Math.max(0.058, 0.16 - (state.level - 1) * 0.008 - power * 0.009);

  for (const offset of spread) {
    state.bullets.push({
      x: state.player.x + 32,
      y: state.player.y - 8,
      vx: 650 + power * 42,
      vy: offset * (650 + power * 42),
      radius: 5 + power * 0.75,
      life: 1.2 + power * 0.06,
      color: palette.core,
      accent: palette.accent,
      glow: palette.glow,
      trail: palette.trail,
      tier,
      power,
      spin: random(0, Math.PI * 2),
    });
  }

  state.player.muzzle = 0.11 + power * 0.006;
  state.fireTimer = force ? Math.min(0.08, fireDelay) : fireDelay;
}

function spawnEnemy() {
  const text = badTexts[Math.floor(Math.random() * badTexts.length)];
  const textUnits = Array.from(text).length;
  const hard = hardModeLevel();
  const hpMax = hard > 0 ? 3 : 2;
  const hpRoll = random(0, 0.72 + state.elapsed / 120 + state.level / 45 + hard * 0.08);
  const hp = clamp(1 + Math.floor(hpRoll), 1, hpMax);
  const width = Math.max(76, 34 + textUnits * 18 + hp * 6);
  const height = 28 + hp * 2;
  const palette = [
    ["#ff5370", "rgba(255, 83, 112, 0.24)"],
    ["#ffd166", "rgba(255, 209, 102, 0.2)"],
    ["#b48cff", "rgba(180, 140, 255, 0.24)"],
    ["#ff8aa0", "rgba(255, 138, 160, 0.22)"],
  ][Math.floor(random(0, 4))];

  state.enemies.push({
    x: state.width + width,
    y: random(playTop() + 18, Math.max(playTop() + 56, state.height - 56)),
    baseY: 0,
    width,
    height,
    hp,
    maxHp: hp,
    speed: random(62, 108) + Math.min(58, state.elapsed * 0.64) + hard * 7,
    wobble: random(0.55, 1.45 + hard * 0.08),
    phase: random(0, Math.PI * 2),
    text,
    color: palette[0],
    fill: palette[1],
  });

  const next = 0.74 - Math.min(0.24, state.elapsed / 150) - hard * 0.025 + random(-0.08, 0.13);
  state.spawnTimer = Math.max(hard > 0 ? 0.2 : 0.3, next);
}

function addGoldReward(enemy) {
  const previousScore = state.score;
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
  checkScoreMilestones(previousScore);
  updateHud();
}

function checkScoreMilestones(previousScore) {
  const newTier = Math.floor(state.score / 5000);
  if (newTier > state.seenBulletTier) {
    for (let tier = state.seenBulletTier + 1; tier <= newTier; tier += 1) {
      triggerBulletUpgrade(tier);
    }
    state.seenBulletTier = newTier;
  }

  while (state.score >= state.nextSurpriseScore) {
    triggerScoreSurprise(state.nextSurpriseScore);
    state.nextSurpriseScore += 10000;
  }

  if (previousScore < 10000 && state.score >= 10000 && state.cheerTimer <= 0) {
    triggerScoreSurprise(10000);
  }
}

function triggerBulletUpgrade(tier) {
  const palette = bulletPalettes[tier % bulletPalettes.length];
  state.upgradeTimer = 2.2;
  state.upgradeTier = tier;
  state.shake = Math.max(state.shake, 7 + Math.min(4, tier));
  spawnBurst(state.player.x + 36, state.player.y - 10, palette.core, 26);
  spawnShockwave(state.player.x + 34, state.player.y - 8, palette.core, 1);
  spawnShockwave(state.player.x + 34, state.player.y - 8, palette.accent, 0.58);
}

function triggerScoreSurprise(milestone) {
  state.cheerMilestone = milestone;
  state.cheerTimer = 8.8;
  state.shake = Math.max(state.shake, 8);
  spawnBurst(state.player.x, state.player.y - 38, "#ffd166", 28);
  spawnShockwave(state.width * 0.5, state.height * 0.52, "#ffd166", 1);
  spawnShockwave(state.width * 0.5, state.height * 0.52, "#ffffff", 0.56);
}

function spawnBurst(x, y, color, amount = 12) {
  const available = Math.max(0, maxParticles - state.particles.length);
  const count = Math.min(amount, available);
  for (let i = 0; i < count; i += 1) {
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

function spawnShockwave(x, y, color, alpha = 1) {
  if (state.particles.length >= maxParticles) return;
  state.particles.push({
    x,
    y,
    vx: 0,
    vy: 0,
    size: 0,
    life: 0.72,
    maxLife: 0.72,
    color,
    alpha,
    ring: true,
    startRadius: 8,
    maxRadius: 110 + random(0, 54),
    lineWidth: random(3, 5),
  });
}

function spawnEnemyBreak(enemy) {
  spawnBurst(enemy.x, enemy.y, enemy.color, 13);
  spawnBurst(enemy.x, enemy.y, "#fff7fb", 5);
  spawnShockwave(enemy.x, enemy.y, enemy.color, 0.48);

  const count = Math.min(8, Math.max(0, maxParticles - state.particles.length));
  for (let i = 0; i < count; i += 1) {
    state.particles.push({
      x: enemy.x + random(-enemy.width * 0.34, enemy.width * 0.34),
      y: enemy.y + random(-enemy.height * 0.28, enemy.height * 0.28),
      vx: random(-210, 95),
      vy: random(-145, 145),
      size: random(4, 9),
      life: random(0.38, 0.82),
      maxLife: 0.82,
      color: i % 3 === 0 ? "#ffffff" : enemy.color,
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

function dandruffLayout() {
  const sprite = state.cleanSprite || state.sprite || buildFallbackCleanSprite();
  const scale = clamp(Math.min(state.width / 360, state.height / 205), 2.75, 3.75);
  const width = sprite.width * scale;
  const height = sprite.height * scale;
  const x = state.width * 0.5;
  const y = state.height * 0.56;
  return {
    sprite,
    scale,
    width,
    height,
    x,
    y,
    left: x - width * 0.5,
    top: y - height * 0.5,
  };
}

function bottleLayout() {
  const width = 78;
  const height = 178;
  const x = clamp(state.width - 118, 760, state.width - 92);
  const y = state.height * 0.54;

  return {
    x,
    y,
    width,
    height,
    left: x - width * 0.5,
    top: y - height * 0.5,
  };
}

function spawnDandruff(initial = false) {
  if (state.dandruff.length >= 24) return;
  state.dandruff.push({
    rx: random(0.16, 0.76),
    ry: random(0.06, 0.42),
    size: random(3, 4.6),
    phase: random(0, Math.PI * 2),
    fresh: initial ? 0 : 0.4,
  });
}

function updateDandruffWorld(dt) {
  state.elapsed += dt;
  state.dandruffRespawnTimer -= dt;
  state.dandruffThanksTimer = Math.max(0, state.dandruffThanksTimer - dt);
  state.dandruffEatTimer = Math.max(0, state.dandruffEatTimer - dt);
  state.dandruffEmoteTimer = Math.max(0, state.dandruffEmoteTimer - dt);
  state.bottlePulse = Math.max(0, state.bottlePulse - dt);

  for (const spot of state.dandruff) {
    spot.fresh = Math.max(0, spot.fresh - dt);
  }

  if (state.dandruffRespawnTimer <= 0) {
    spawnDandruff(false);
    state.dandruffRespawnTimer = random(1.0, 1.8);
  }

  updateParticles(dt);
  updateHud();
}

function handleDandruffClick(point) {
  if (handleBottleClick(point)) return;

  const layout = dandruffLayout();
  for (let i = state.dandruff.length - 1; i >= 0; i -= 1) {
    const spot = state.dandruff[i];
    const x = layout.left + spot.rx * layout.width;
    const y = layout.top + spot.ry * layout.height;
    const radius = Math.max(12, spot.size * layout.scale * 0.85);

    if (dist2(point.x, point.y, x, y) <= radius * radius) {
      state.dandruff.splice(i, 1);
      state.dandruffRemoved += 1;
      state.score = state.dandruffRemoved;
      state.gold += 1;
      state.combo += 1;
      state.dandruffBottleCount += 1;
      state.bottlePulse = 0.34;
      spawnBurst(x, y, "#ffffff", 3);
      spawnBurst(x, y, "#c9fff2", 1);
      spawnBottleCollect(x, y);

      if (state.dandruffRemoved % 5 === 0) {
        state.dandruffThanksTimer = 2.6;
        state.dandruffEmoteTimer = 1.6;
        state.dandruffMessage = "thank you!";
        state.level += 1;
        spawnPixelEmotes(layout.x + layout.width * 0.18, layout.top + layout.height * 0.12);
      }

      updateHud();
      return;
    }
  }

  state.combo = 0;
  updateHud();
}

function handleBottleClick(point) {
  const bottle = bottleLayout();
  const inside =
    point.x >= bottle.left &&
    point.x <= bottle.left + bottle.width &&
    point.y >= bottle.top &&
    point.y <= bottle.top + bottle.height + 44;

  if (!inside) return false;
  if (state.dandruffBottleCount < 65) return true;

  state.dandruffBottleCount -= 65;
  state.score += 65;
  state.gold += 65;
  state.combo += 5;
  state.dandruffEatTimer = 2.2;
  state.dandruffThanksTimer = 2.4;
  state.dandruffMessage = "you ate 65 flakes?!";
  state.bottlePulse = 0.9;
  spawnPixelEmotes(bottle.x - 64, bottle.top + 18);
  spawnBurst(bottle.x, bottle.y - 12, "#ffd166", 14);
  spawnBurst(bottle.x, bottle.y - 12, "#fff7fb", 8);
  updateHud();
  return true;
}

function spawnBottleCollect(x, y) {
  const bottle = bottleLayout();
  const count = Math.min(4, Math.max(0, maxParticles - state.particles.length));

  for (let i = 0; i < count; i += 1) {
    state.particles.push({
      x: x + random(-6, 6),
      y: y + random(-6, 6),
      vx: random(-18, 18),
      vy: random(-24, 10),
      targetX: bottle.x + random(-18, 18),
      targetY: bottle.top + bottle.height * 0.62 + random(-16, 14),
      size: random(3, 5),
      life: 0.72,
      maxLife: 0.72,
      color: "#fff7fb",
      collect: true,
    });
  }
}

function spawnPixelEmotes(x, y) {
  const emoteColors = ["#ff63a8", "#ffd166", "#5df0c4"];
  for (let i = 0; i < 4; i += 1) {
    state.particles.push({
      x: x + random(42, 96),
      y: y + random(6, 42),
      vx: random(-12, 18),
      vy: random(-56, -28),
      size: random(4, 6),
      life: random(0.6, 0.9),
      maxLife: 0.9,
      color: emoteColors[i % emoteColors.length],
      emote: i % 2 === 0 ? "heart" : "smile",
    });
  }
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
  if (state.gameType === "dandruff") {
    updateDandruffWorld(dt);
    return;
  }

  state.elapsed += dt;
  state.fireTimer -= dt;
  state.spawnTimer -= dt;
  state.shake = Math.max(0, state.shake - dt * 42);
  state.levelPulse = Math.max(0, state.levelPulse - dt);
  state.cheerTimer = Math.max(0, state.cheerTimer - dt);
  state.upgradeTimer = Math.max(0, state.upgradeTimer - dt);

  updatePlayer(dt);
  fireBullet(false);

  if (state.spawnTimer <= 0) {
    const hard = hardModeLevel();
    const enemyCap = 14 + Math.min(8, hard * 2);
    spawnEnemy();
    if (state.enemies.length < enemyCap && state.elapsed > 18 && Math.random() > 0.58) spawnEnemy();
    if (state.enemies.length < enemyCap && hard > 0 && Math.random() < Math.min(0.16 + hard * 0.04, 0.38)) {
      spawnEnemy();
    }
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
        spawnBurst(bullet.x, bullet.y, bullet.color, 3);
        if (enemy.hp <= 0) {
          enemy.dead = true;
          state.combo += 1;
          state.score += 12 + Math.min(34, state.combo * 2);
          addGoldReward(enemy);
          spawnEnemyBreak(enemy);
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

  updateParticles(dt);
}

function updateParticles(dt) {
  for (const particle of state.particles) {
    if (particle.collect) {
      const ease = 1 - Math.pow(0.01, dt);
      particle.x += (particle.targetX - particle.x) * ease;
      particle.y += (particle.targetY - particle.y) * ease;
    } else {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= 0.96;
      particle.vy *= 0.96;
    }
    particle.life -= dt;
  }
  state.particles = state.particles.filter((particle) => particle.life > 0);
}

function drawBackground() {
  const palette = activeBulletPalette();
  const pulse = 0.5 + Math.sin(state.time * 1.2) * 0.5;
  const gradient = ctx.createLinearGradient(0, 0, state.width, state.height);
  gradient.addColorStop(0, "#151218");
  gradient.addColorStop(0.44, palette.trail);
  gradient.addColorStop(1, "#101b1d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.save();
  ctx.globalAlpha = 0.06 + pulse * 0.04;
  ctx.fillStyle = palette.core;
  ctx.fillRect(0, 0, state.width, state.height);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.24;
  ctx.strokeStyle = palette.trail;
  ctx.lineWidth = 1;
  const gap = 64;
  const offset = (state.time * 14) % gap;
  for (let x = -state.height; x < state.width + state.height; x += gap) {
    ctx.beginPath();
    ctx.moveTo(x + offset, 0);
    ctx.lineTo(x + state.height * 0.62 + offset, state.height);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 36; i += 1) {
    const x = (i * 149 + state.time * (12 + (i % 4) * 5)) % (state.width + 36);
    const y = (i * 83) % state.height;
    const size = 2 + (i % 3);
    ctx.fillStyle = i % 5 === 0 ? palette.accent : i % 3 === 0 ? palette.core : "#fff7fb";
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
  drawOutfitOverlay(width, height, scale);
  drawPixelGun(width, height, scale, player.muzzle > 0);
  ctx.restore();
  ctx.imageSmoothingEnabled = true;
}

function drawOutfitOverlay(playerWidth, playerHeight, scale) {
  if (state.equippedOutfit === "default") return;

  const ox = -playerWidth * 0.5;
  const oy = -playerHeight * 0.62;
  const px = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(ox + x * scale, oy + y * scale, w * scale, h * scale);
  };

  if (state.equippedOutfit === "maid") {
    px(10, 46, 25, 14, "#08070b");
    px(15, 39, 15, 19, "#fff7fb");
    px(12, 47, 4, 9, "#ffffff");
    px(29, 47, 4, 9, "#ffffff");
    px(18, 42, 9, 4, "#ffffff");
    px(17, 54, 11, 5, "#d9d1ff");
    px(20, 49, 5, 8, "#151218");
    px(9, 8, 7, 3, "#ffffff");
    px(28, 8, 7, 3, "#ffffff");
    px(16, 6, 12, 3, "#ffffff");
    px(11, 5, 3, 3, "#fff7fb");
    px(30, 5, 3, 3, "#fff7fb");
    px(6, 14, 5, 5, "#ffffff");
    px(34, 14, 5, 5, "#ffffff");
    px(7, 13, 3, 3, "#ff63a8");
    px(35, 13, 3, 3, "#ff63a8");
  } else if (state.equippedOutfit === "sailor") {
    px(11, 47, 23, 13, "#3157a8");
    px(13, 39, 19, 10, "#fff7fb");
    px(10, 41, 10, 8, "#3157a8");
    px(25, 41, 10, 8, "#3157a8");
    px(19, 42, 7, 10, "#e64068");
    px(17, 55, 3, 4, "#fff7fb");
    px(22, 55, 3, 4, "#fff7fb");
    px(27, 55, 3, 4, "#fff7fb");
    px(14, 50, 18, 2, "#6bd3ff");
    px(24, 5, 11, 4, "#3157a8");
    px(29, 9, 9, 3, "#3157a8");
    px(26, 6, 7, 2, "#fff7fb");
    px(6, 18, 7, 6, "#e64068");
    px(9, 15, 5, 4, "#ff8aa0");
    px(35, 18, 4, 7, "#6bd3ff");
  } else if (state.equippedOutfit === "magical") {
    px(8, 44, 7, 16, "#8069ff");
    px(30, 44, 7, 16, "#8069ff");
    px(11, 46, 23, 14, "#ff63a8");
    px(15, 39, 15, 20, "#ffffff");
    px(17, 47, 11, 12, "#ffd166");
    px(19, 41, 7, 8, "#8069ff");
    px(13, 53, 5, 5, "#fff7fb");
    px(27, 53, 5, 5, "#fff7fb");
    px(18, 4, 3, 5, "#ffd166");
    px(22, 2, 4, 6, "#ffd166");
    px(27, 4, 3, 5, "#ffd166");
    px(19, 8, 11, 2, "#ffffff");
    px(35, 6, 4, 4, "#ffd166");
    px(39, 3, 3, 3, "#ffffff");
    px(6, 27, 4, 4, "#ffd166");
    px(4, 31, 3, 3, "#ffffff");
    px(34, 26, 5, 5, "#ff63a8");
  }
}

function drawPixelGun(playerWidth, playerHeight, scale, firing) {
  const unit = scale;
  const gunX = playerWidth * 0.12;
  const gunY = -playerHeight * 0.08;
  const map = [
    ".....................",
    ".........MMMMMM......",
    "........MMMMMMMMMM...",
    "....HHH.MDDDDDDDTT...",
    "...HHHHHDDDDDDDDTT...",
    "...HHHHH.MMMMMMMM....",
    "...CCCHH....DDD......",
    "...CCCC....DDDD......",
    "...CCCC....DDD.......",
    "..........DDD........",
  ];
  const colors = {
    C: "#a58cff",
    H: "#fff4ee",
    M: "#5a5664",
    D: "#151218",
    T: "#5df0c4",
  };

  ctx.save();
  ctx.translate(gunX, gunY);
  drawPixelMap(map, colors, unit, unit * 0.32);

  if (firing) {
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(22 * unit, 3 * unit, 3 * unit, unit);
    ctx.fillRect(21 * unit, 4 * unit, 5 * unit, unit);
    ctx.fillRect(22 * unit, 5 * unit, 3 * unit, unit);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(23 * unit, 4 * unit, unit, unit);
  }

  ctx.restore();
}

function drawPixelMap(map, colors, unit, edge = Math.max(1, unit * 0.28)) {
  for (let row = 0; row < map.length; row += 1) {
    for (let col = 0; col < map[row].length; col += 1) {
      const cell = map[row][col];
      if (cell === ".") continue;
      ctx.fillStyle = colors[cell];
      ctx.fillRect(col * unit, row * unit, unit, unit);
    }
  }

  ctx.fillStyle = "#151218";
  for (let row = 0; row < map.length; row += 1) {
    for (let col = 0; col < map[row].length; col += 1) {
      if (map[row][col] === ".") continue;
      const px = col * unit;
      const py = row * unit;
      if (!map[row - 1] || map[row - 1][col] === ".") ctx.fillRect(px, py, unit, edge);
      if (!map[row + 1] || map[row + 1][col] === ".") ctx.fillRect(px, py + unit - edge, unit, edge);
      if (map[row][col - 1] === "." || col === 0) ctx.fillRect(px, py, edge, unit);
      if (map[row][col + 1] === "." || col === map[row].length - 1) {
        ctx.fillRect(px + unit - edge, py, edge, unit);
      }
    }
  }
}

function drawBullets() {
  for (const bullet of state.bullets) {
    const power = bullet.power || bullet.tier || 0;
    const spin = bullet.spin || 0;
    const flare = 1 + Math.sin(state.time * 18 + spin) * 0.08;

    ctx.save();
    ctx.translate(bullet.x, bullet.y);
    ctx.globalAlpha = 0.42 + Math.min(0.28, power * 0.04);
    ctx.fillStyle = bullet.trail || "rgba(93, 240, 196, 0.24)";
    ctx.fillRect(-20 - power * 5, -2, 18 + power * 4, 4);
    if (power >= 2) {
      ctx.fillRect(-14 - power * 2, -8, 12 + power * 2, 3);
      ctx.fillRect(-14 - power * 2, 5, 12 + power * 2, 3);
    }
    if (power >= 4) {
      ctx.fillRect(-26 - power * 2, -13, 20 + power * 2, 2);
      ctx.fillRect(-26 - power * 2, 11, 20 + power * 2, 2);
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = bullet.color;
    ctx.shadowColor = bullet.glow || bullet.color;
    ctx.shadowBlur = 8 + power * 3;
    ctx.fillRect(-5, (-3 - power * 0.5) * flare, 13 + power * 4, 6 + power);
    ctx.fillRect(2, -6 - power, 4 + power, 12 + power * 2);
    if (power >= 1) {
      ctx.fillStyle = bullet.accent || "#ffffff";
      ctx.fillRect(4, -2 - power * 0.3, 8 + power * 2, 4 + power * 0.5);
    }
    if (power >= 3) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(3, -2, 10 + power * 2, 4);
      ctx.strokeStyle = bullet.accent || bullet.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8 - power * 2, 0);
      ctx.lineTo(1, -8 - power);
      ctx.lineTo(14 + power * 4, 0);
      ctx.lineTo(1, 8 + power);
      ctx.closePath();
      ctx.stroke();
    }
    if (power >= 5) {
      ctx.globalAlpha = 0.82;
      ctx.strokeStyle = bullet.glow || bullet.color;
      ctx.lineWidth = 2;
      const ring = 20 + Math.sin(state.time * 22 + spin) * 4;
      ctx.strokeRect(6 + power * 1.5 - ring * 0.5, -ring * 0.5, ring, ring);
    }
    ctx.restore();
  }
}

function drawEnemies() {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const enemy of state.enemies) {
    const left = enemy.x - enemy.width * 0.5;
    const top = enemy.y - enemy.height * 0.5;
    const pixel = 4;

    ctx.save();
    ctx.fillStyle = enemy.fill;
    ctx.fillRect(left + pixel, top, enemy.width - pixel * 2, enemy.height);
    ctx.fillRect(left, top + pixel, enemy.width, enemy.height - pixel * 2);

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(12, 12, 15, 0.82)";
    ctx.fillRect(left + pixel, top + pixel, enemy.width - pixel * 2, pixel);
    ctx.fillRect(left + pixel, top + enemy.height - pixel * 2, enemy.width - pixel * 2, pixel);
    ctx.fillRect(left + pixel, top + pixel, pixel, enemy.height - pixel * 2);
    ctx.fillRect(left + enemy.width - pixel * 2, top + pixel, pixel, enemy.height - pixel * 2);

    ctx.fillStyle = enemy.color;
    ctx.fillRect(left + pixel * 2, top + pixel * 2, pixel, pixel * 3);
    ctx.fillRect(left + pixel * 3, top + pixel * 2, pixel, pixel);
    ctx.fillRect(left + pixel * 2, top + enemy.height - pixel * 3, pixel * 2, pixel);
    ctx.fillRect(left + enemy.width - pixel * 4, top + pixel * 2, pixel * 2, pixel);
    ctx.fillRect(left + enemy.width - pixel * 3, top + enemy.height - pixel * 3, pixel, pixel);

    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    ctx.fillRect(left + pixel * 5, top + pixel * 2, enemy.width * 0.28, pixel);
    ctx.fillRect(left + enemy.width * 0.56, top + enemy.height - pixel * 3, enemy.width * 0.18, pixel);

    ctx.font = "900 15px 'Courier New', Inter, PingFang SC, Microsoft YaHei, sans-serif";
    ctx.fillStyle = "#fff7fb";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 2;
    ctx.fillText(enemy.text, enemy.x + 8, enemy.y + 0.5);
    ctx.shadowBlur = 0;

    if (enemy.maxHp > 1) {
      const barWidth = enemy.width - 24;
      const ratio = clamp(enemy.hp / enemy.maxHp, 0, 1);
      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.fillRect(left + 12, top + enemy.height - 7, barWidth, 3);
      ctx.fillStyle = enemy.color;
      ctx.fillRect(left + 12, top + enemy.height - 7, barWidth * ratio, 3);
    }
    ctx.restore();
  }
}

function drawParticles() {
  for (const particle of state.particles) {
    const alpha = clamp(particle.life / particle.maxLife, 0, 1);

    if (particle.ring) {
      const progress = 1 - alpha;
      const radius = particle.startRadius + (particle.maxRadius - particle.startRadius) * progress;
      const pixel = 6;
      const left = Math.round((particle.x - radius) / pixel) * pixel;
      const top = Math.round((particle.y - radius) / pixel) * pixel;
      const size = Math.round((radius * 2) / pixel) * pixel;
      ctx.save();
      ctx.globalAlpha = alpha * (particle.alpha || 1);
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = particle.lineWidth;
      ctx.strokeRect(left, top, size, size);
      ctx.globalAlpha *= 0.55;
      ctx.strokeRect(left + pixel * 2, top + pixel * 2, Math.max(pixel, size - pixel * 4), Math.max(pixel, size - pixel * 4));
      ctx.restore();
    } else if (particle.emote) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(particle.x, particle.y);
      if (particle.emote === "heart") drawPixelHeart(0, 0, particle.size, particle.color);
      else drawPixelSmile(0, 0, particle.size, particle.color);
      ctx.restore();
    } else if (particle.text) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.font = "900 18px Inter, PingFang SC, Microsoft YaHei, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(particle.text, particle.x, particle.y);
    } else {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
  }
  ctx.globalAlpha = 1;
}

function drawPixelHeart(x, y, unit, color) {
  ctx.fillStyle = color;
  const map = ["XX.XX", "XXXXX", ".XXX.", "..X.."];
  for (let row = 0; row < map.length; row += 1) {
    for (let col = 0; col < map[row].length; col += 1) {
      if (map[row][col] === "X") ctx.fillRect(x + col * unit, y + row * unit, unit, unit);
    }
  }
}

function drawPixelSmile(x, y, unit, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, unit * 5, unit);
  ctx.fillRect(x, y + unit, unit, unit * 3);
  ctx.fillRect(x + unit * 4, y + unit, unit, unit * 3);
  ctx.fillRect(x, y + unit * 4, unit * 5, unit);
  ctx.fillStyle = "#151218";
  ctx.fillRect(x + unit, y + unit * 2, unit, unit);
  ctx.fillRect(x + unit * 3, y + unit * 2, unit, unit);
  ctx.fillRect(x + unit * 2, y + unit * 3, unit, unit);
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
  ctx.shadowBlur = 10;
  ctx.fillText(`等级 ${state.level}`, state.width * 0.5, playTop() + 22);
  ctx.restore();
}

function drawBulletUpgradeShock() {
  if (state.upgradeTimer <= 0 || state.mode !== "playing") return;

  const alpha = clamp(state.upgradeTimer / 2.2, 0, 1);
  const palette = bulletPalettes[state.upgradeTier % bulletPalettes.length];
  const x = state.player.x + 36;
  const y = state.player.y - 8;

  ctx.save();
  ctx.globalAlpha = alpha * 0.22;
  ctx.fillStyle = palette.core;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.globalAlpha = alpha;
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i += 1) {
    const radius = (1 - alpha) * (74 + i * 38) + i * 16;
    const pixel = 8;
    const left = Math.round((x - radius) / pixel) * pixel;
    const top = Math.round((y - radius) / pixel) * pixel;
    const size = Math.round((radius * 2) / pixel) * pixel;
    ctx.strokeRect(left, top, size, size);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = palette.glow;
  ctx.shadowBlur = 10;
  ctx.font = "900 30px 'Courier New', Inter, PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`BULLET LV ${state.upgradeTier + 1}`, state.width * 0.5, playTop() + 52);
  ctx.font = "900 17px 'Courier New', Inter, PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillStyle = palette.accent;
  ctx.fillText("SHOCK UPGRADE", state.width * 0.5, playTop() + 83);
  ctx.restore();
}

function drawSpeechBubble(x, y, text) {
  const width = 360;
  const height = 88;
  const left = clamp(x, 24, state.width - width - 24);
  const top = clamp(y, playTop() + 10, state.height - height - 28);

  ctx.save();
  ctx.fillStyle = "rgba(248, 241, 255, 0.94)";
  ctx.strokeStyle = "#ffd166";
  ctx.lineWidth = 3;
  roundRect(ctx, left, top, width, height, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#151218";
  ctx.beginPath();
  ctx.moveTo(left + 44, top + height - 1);
  ctx.lineTo(left + 72, top + height + 24);
  ctx.lineTo(left + 92, top + height - 1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#4b378f";
  ctx.font = "900 15px Inter, PingFang SC, Microsoft YaHei, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Saki", left + 18, top + 14);

  ctx.fillStyle = "#151218";
  ctx.font = "800 20px Inter, PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillText(text, left + 18, top + 42);
  ctx.restore();
}

function drawThumbsUp(x, y, scale) {
  const unit = scale;
  const map = [
    "...........SSSSS...............",
    "..........SSSSSS...............",
    ".........SSSSSSS...............",
    "........SSSSSSSS...............",
    ".......SSSSSSSSS...............",
    "......SSSSSSSSS................",
    ".....SSSSSSSSS.................",
    "....SSSSSSSSS..................",
    "...SSSSSSSSS...................",
    "...SSSSSSSS....................",
    "...SSSSSSSS....................",
    "...SSSSSSSSSSSSSSSS............",
    "...SSSSSSSSSSSSSSSSSSS.........",
    "...SSSSSSSSSSSSSSSSSSSS........",
    "..SSSSSSSSSSSSSSSSSSSSS........",
    ".CCCCCCSSSSSSSSSSSSSSSS........",
    ".CCCCCCSSSSSSSSSSSSSSS.........",
    ".CCCCCCSSSSSSSSSSSSSSSS........",
    ".CCCCCCSSSSSSSSSSSSSSS.........",
    ".CCCCCCSSSSSSSSSSSSSSSS........",
    ".CCCCCCSSSSSSSSSSSSSSS.........",
    ".CCCCCCSSSSSSSSSSSSSS..........",
    ".CCCCCCSSSSSSSSSSSSS...........",
    ".CCCCCCSSSSSSSSSSSS............",
    ".CCCCCCSSSSSSSSSS..............",
    ".CCCCCCSSSSSSSS................",
    ".CCCCCC........................",
  ];
  const colors = {
    S: "#f4d2bf",
    C: "#a58cff",
  };

  ctx.save();
  ctx.translate(x, y);
  drawPixelMap(map, colors, unit, Math.max(1, unit * 0.22));
  ctx.fillStyle = "#fff4ee";
  ctx.fillRect(9 * unit, 3 * unit, 2 * unit, unit);
  ctx.fillRect(19 * unit, 15 * unit, 7 * unit, unit);
  ctx.fillRect(19 * unit, 17 * unit, 6 * unit, unit);
  ctx.fillRect(19 * unit, 19 * unit, 6 * unit, unit);
  ctx.fillRect(18 * unit, 21 * unit, 5 * unit, unit);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(26 * unit, 4 * unit, unit, unit);
  ctx.fillRect(28 * unit, 6 * unit, unit, unit);
  ctx.fillRect(27 * unit, 8 * unit, unit, unit);
  ctx.restore();
}

function drawDandruffGame() {
  if (state.gameType !== "dandruff" || state.mode === "intro") return;

  const layout = dandruffLayout();
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(layout.x - layout.width * 0.48, layout.y + layout.height * 0.49, layout.width * 0.96, 10);

  ctx.drawImage(layout.sprite, layout.left, layout.top, layout.width, layout.height);

  for (const spot of state.dandruff) {
    const x = layout.left + spot.rx * layout.width;
    const y = layout.top + spot.ry * layout.height + Math.sin(state.time * 3 + spot.phase) * 1.5;
    const unit = Math.max(2.5, spot.size * layout.scale * 0.14);
    const alpha = spot.fresh > 0 ? 0.45 + Math.sin(state.time * 18) * 0.2 : 1;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#fff7fb";
    ctx.fillRect(x, y, unit * 2, unit);
    ctx.fillRect(x + unit, y - unit, unit, unit * 3);
    ctx.fillStyle = "#c9fff2";
    ctx.fillRect(x + unit * 2, y + unit, unit, unit);
    ctx.fillStyle = "#151218";
    ctx.fillRect(x - unit * 0.35, y - unit * 0.35, unit * 0.35, unit * 2.5);
    ctx.globalAlpha = 1;
  }

  drawDandruffBottle();
  drawDandruffSpeech(layout);
  drawDandruffHint(layout);
  ctx.restore();
  ctx.imageSmoothingEnabled = true;
}

function drawDandruffBottle() {
  const bottle = bottleLayout();
  const fillRatio = clamp(state.dandruffBottleCount / 65, 0, 1);
  const pulse = 1 + state.bottlePulse * 0.08;
  const left = bottle.left;
  const top = bottle.top;
  const width = bottle.width * pulse;
  const height = bottle.height * pulse;
  const x = bottle.x - width * 0.5;
  const y = bottle.y - height * 0.5;
  const liquidHeight = (height - 46) * fillRatio;

  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.fillStyle = "#151218";
  ctx.fillRect(14, 0, width - 28, 14);
  ctx.fillRect(8, 12, width - 16, height - 12);

  ctx.fillStyle = "rgba(201, 255, 242, 0.12)";
  ctx.fillRect(16, 22, width - 32, height - 34);
  ctx.fillStyle = "rgba(255, 247, 251, 0.2)";
  ctx.fillRect(22, 28, 7, height - 50);

  ctx.fillStyle = "#6e5c88";
  ctx.fillRect(14, 0, width - 28, 4);
  ctx.fillRect(10, 14, 4, height - 20);
  ctx.fillRect(width - 14, 14, 4, height - 20);
  ctx.fillRect(14, height - 10, width - 28, 4);

  ctx.fillStyle = "#fff7fb";
  ctx.fillRect(22, height - 18 - liquidHeight, width - 44, liquidHeight);
  ctx.fillStyle = "#c9fff2";
  for (let i = 0; i < Math.min(state.dandruffBottleCount, 34); i += 1) {
    const px = 24 + ((i * 13) % Math.max(1, width - 50));
    const py = height - 22 - ((i * 9) % Math.max(1, liquidHeight || 1));
    ctx.fillRect(px, py, 4, 4);
  }

  ctx.fillStyle = "#151218";
  ctx.font = "900 13px 'Courier New', Inter, PingFang SC, Microsoft YaHei, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillRect(8, height + 10, width - 16, 34);
  ctx.fillStyle = state.dandruffBottleCount >= 65 ? "#ffd166" : "#f8f1ff";
  ctx.fillText(`${state.dandruffBottleCount}/65`, width * 0.5, height + 25);

  if (state.dandruffBottleCount >= 65) {
    ctx.fillStyle = "#ff63a8";
    ctx.fillRect(2, height + 50, width - 4, 28);
    ctx.fillStyle = "#151218";
    ctx.fillText("EAT?", width * 0.5, height + 65);
  }

  if (state.dandruffEatTimer > 0) {
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(0, -32, width, 24);
    ctx.fillStyle = "#151218";
    ctx.fillText("gulp!", width * 0.5, -19);
  }

  ctx.restore();
}

function drawDandruffSpeech(layout) {
  if (state.dandruffThanksTimer <= 0) return;

  const alpha = clamp(state.dandruffThanksTimer / 0.45, 0, 1);
  const width = 190;
  const height = 74;
  const left = clamp(layout.x + layout.width * 0.24, 24, state.width - width - 24);
  const top = clamp(layout.top + layout.height * 0.16, playTop(), state.height - height - 24);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#f8f1ff";
  ctx.fillRect(left + 6, top, width - 12, height);
  ctx.fillRect(left, top + 6, width, height - 12);
  ctx.fillStyle = "#151218";
  ctx.fillRect(left + 6, top + 6, width - 12, 4);
  ctx.fillRect(left + 6, top + height - 10, width - 12, 4);
  ctx.fillRect(left + 6, top + 6, 4, height - 12);
  ctx.fillRect(left + width - 10, top + 6, 4, height - 12);
  ctx.fillStyle = "#4b378f";
  ctx.font = "900 17px 'Courier New', Inter, PingFang SC, Microsoft YaHei, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(state.dandruffMessage, left + 18, top + 34);
  drawPixelHeart(left + 132, top + 22, 5, "#ff63a8");
  drawPixelSmile(left + 158, top + 20, 4, "#ffd166");
  ctx.restore();
}

function drawDandruffHint(layout) {
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "#151218";
  ctx.fillRect(24, state.height - 74, 430, 46);
  ctx.fillStyle = "#5df0c4";
  ctx.fillRect(28, state.height - 70, 422, 4);
  ctx.fillRect(28, state.height - 32, 422, 4);
  ctx.fillRect(28, state.height - 70, 4, 42);
  ctx.fillRect(446, state.height - 70, 4, 42);
  ctx.fillStyle = "#f8f1ff";
  ctx.font = "900 14px 'Courier New', Inter, PingFang SC, Microsoft YaHei, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `Cleaned: ${state.dandruffRemoved}   Bottle: ${state.dandruffBottleCount}/65`,
    44,
    state.height - 50,
  );
  ctx.restore();
}

function drawTenKCheer() {
  if (state.cheerTimer <= 0 || state.mode !== "playing") return;

  const duration = 9.2;
  const progress = 1 - state.cheerTimer / duration;
  const alpha = state.cheerTimer < 1 ? state.cheerTimer : Math.min(1, progress / 0.12);
  const sprite = state.sprite || buildFallbackSprite();
  const baseScale = clamp(state.width / 720, 2.35, 3.35);
  const pulse = 1 + Math.sin(state.time * 6) * 0.025;
  const width = sprite.width * baseScale * pulse;
  const height = sprite.height * baseScale * pulse;
  const x = state.width * 0.5 - 138;
  const y = state.height * 0.54 + Math.sin(state.time * 5) * 4;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(18, 16, 20, 0.52)";
  ctx.fillRect(0, 0, state.width, state.height);

  const milestone = state.cheerMilestone || 10000;
  const cheerLine =
    milestone % 30000 === 0
      ? `${milestone.toLocaleString()}! SUPER SAKI!`
      : milestone % 20000 === 0
        ? `${milestone.toLocaleString()}! KEEP GOING!`
        : `${milestone.toLocaleString()}! THUMBS UP!`;

  drawSpeechBubble(state.width * 0.5 - 52, state.height * 0.18, cheerLine);

  ctx.imageSmoothingEnabled = false;
  ctx.shadowColor = "rgba(255, 209, 102, 0.72)";
  ctx.shadowBlur = 12;
  ctx.drawImage(sprite, x - width * 0.5, y - height * 0.62, width, height);
  ctx.shadowBlur = 0;

  const raise = progress < 0.28 ? 90 * (1 - progress / 0.28) : 0;
  const thumbWave = progress > 0.28 ? Math.sin(progress * Math.PI * 7) * 4 : 0;
  drawThumbsUp(x + width * 0.12, y - height * 0.72 + raise + thumbWave, baseScale);

  ctx.fillStyle = "#ffd166";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 44px 'Courier New', Inter, PingFang SC, Microsoft YaHei, sans-serif";
  ctx.fillText(`${milestone.toLocaleString()} POINTS`, state.width * 0.5, y + height * 0.44);
  ctx.restore();
  ctx.imageSmoothingEnabled = true;
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
}

function draw() {
  ctx.save();
  if (state.shake > 0 && state.mode === "playing") {
    ctx.translate(random(-state.shake, state.shake), random(-state.shake, state.shake));
  }
  drawBackground();
  if (state.gameType === "dandruff" && state.mode !== "intro") {
    drawDandruffGame();
    drawParticles();
  } else {
    drawEnemies();
    drawBullets();
    drawParticles();
    if (state.mode !== "intro") drawPlayer();
    drawIntroPreview();
    drawLevelUp();
    drawBulletUpgradeShock();
    drawTenKCheer();
  }
  ctx.restore();
  drawPaused();
}

function frame(now) {
  const dt = Math.min(0.034, (now - state.lastFrame) / 1000 || 0);
  state.lastFrame = now;
  state.time += dt;

  if (state.mode === "intro" && state.gameType === "danmaku" && state.bullets.length < 12 && state.time % 0.26 < dt) {
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

  if (state.mode === "intro" && state.gameType === "danmaku") {
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
  if (key === "enter" && state.mode === "intro") advanceIntro();
  if (key === "enter" && state.mode === "over") resetGame();
  if (key === "p" || key === "escape") togglePause();
  if (key === " " && state.gameType === "danmaku") fireBullet(true);
  state.keys.add(key);
});

window.addEventListener("keyup", (event) => {
  state.keys.delete(event.key.toLowerCase());
});

canvas.addEventListener("pointerdown", (event) => {
  if (state.mode !== "playing") return;

  if (state.gameType === "dandruff") {
    handleDandruffClick(pointerPosition(event));
    return;
  }

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

dialogueChoicesEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-choice]");
  if (!button) return;
  advanceIntro(button.dataset.choice);
});
startBtn.addEventListener("click", () => advanceIntro());
retryBtn.addEventListener("click", resetGame);
pauseBtn.addEventListener("click", togglePause);
musicBtn.addEventListener("click", toggleMusic);
shopBtn.addEventListener("click", openShop);
closeShopBtn.addEventListener("click", closeShop);
shopPanel.addEventListener("click", (event) => {
  if (event.target === shopPanel) closeShop();
});
shopItemsEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-outfit]");
  if (!button) return;
  buyOrEquipOutfit(button.dataset.outfit);
});
messageBtn.addEventListener("click", openMessagePanel);
closeMessageBtn.addEventListener("click", closeMessagePanel);
messagePanel.addEventListener("click", (event) => {
  if (event.target === messagePanel) closeMessagePanel();
});
encryptMessageBtn.addEventListener("click", () => {
  generateEncryptedMessage();
});
for (const button of gameModeBtns) {
  button.addEventListener("click", () => setGameType(button.dataset.game));
}

bgMusic.addEventListener("ended", () => {
  state.musicIndex = (state.musicIndex + 1) % musicTracks.length;
  if (state.musicStarted && state.musicEnabled && state.mode === "playing") playMusicTrack();
});

asset.addEventListener("load", () => {
  state.sprite = buildSpriteFromImage(asset);
  state.cleanSprite = buildCleanSpriteFromImage(asset);
  renderIntroSaki();
});

asset.addEventListener("error", () => {
  state.sprite = buildFallbackSprite();
  state.cleanSprite = buildFallbackCleanSprite();
});

resize();
state.sprite = buildFallbackSprite();
state.cleanSprite = buildFallbackCleanSprite();
renderIntroSaki();
musicBtn.setAttribute("aria-pressed", "true");
updateGameModeButtons();
renderIntroDialogue();
state.lastFrame = performance.now();
requestAnimationFrame(frame);
