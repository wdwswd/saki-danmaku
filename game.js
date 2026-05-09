const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const introSakiCanvas = document.querySelector("#introSaki");
const introSakiCtx = introSakiCanvas.getContext("2d");

const scoreEl = document.querySelector("#score");
const shieldEl = document.querySelector("#shield");
const goldEl = document.querySelector("#gold");
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
const leaderboardBtn = document.querySelector("#leaderboardBtn");
const shopPanel = document.querySelector("#shopPanel");
const closeShopBtn = document.querySelector("#closeShopBtn");
const shopItemsEl = document.querySelector("#shopItems");
const shopMessageEl = document.querySelector("#shopMessage");
const leaderboardPanel = document.querySelector("#leaderboardPanel");
const closeLeaderboardBtn = document.querySelector("#closeLeaderboardBtn");
const leaderboardStatusEl = document.querySelector("#leaderboardStatus");
const leaderboardNameEl = document.querySelector("#leaderboardName");
const leaderboardSubmitBtn = document.querySelector("#leaderboardSubmitBtn");
const leaderboardListEl = document.querySelector("#leaderboardList");
const submitScoreBtn = document.querySelector("#submitScoreBtn");
const skipScoreBtn = document.querySelector("#skipScoreBtn");
const recordScoreBlock = document.querySelector("#recordScoreBlock");
const recordScoreChoices = document.querySelector("#recordScoreChoices");
const endScoreForm = document.querySelector("#endScoreForm");
const endLeaderboardNameEl = document.querySelector("#endLeaderboardName");
const endLeaderboardSubmitBtn = document.querySelector("#endLeaderboardSubmitBtn");
const endScoreStatusEl = document.querySelector("#endScoreStatus");
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

const leaderboardApiBaseUrl = window.SAKI_CONFIG?.leaderboardApiBaseUrl?.trim() || "";
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
    price: 1200,
    description: "A black-and-white pixel maid dress with apron sparkle.",
    preview: "linear-gradient(90deg, #111015 0 32%, #ffffff 32% 48%, #a58cff 48% 60%, #111015 60% 100%)",
  },
  {
    id: "sailor",
    name: "Sailor Uniform",
    price: 1200,
    description: "A blue sailor collar, pleated skirt, and red ribbon.",
    preview: "linear-gradient(90deg, #3157a8 0 38%, #fff7fb 38% 56%, #e64068 56% 66%, #3157a8 66% 100%)",
  },
  {
    id: "magical",
    name: "Magical Girl Costume",
    price: 1200,
    description: "Bright magical layers with star pixels and violet glow.",
    preview: "linear-gradient(90deg, #ff63a8 0 30%, #ffd166 30% 42%, #ffffff 42% 54%, #8069ff 54% 100%)",
  },
  {
    id: "mech",
    name: "Mech Warrior",
    price: 1200,
    description: "Steel armor plates, neon visor pixels, and battle boosters.",
    preview: "linear-gradient(90deg, #5f6f80 0 24%, #b9d3e8 24% 42%, #5df0c4 42% 52%, #2c3440 52% 100%)",
  },
  {
    id: "medieval",
    name: "European Medieval Dress",
    price: 1200,
    description: "A noble gown with gold trim, sleeves, and flower crown pixels.",
    preview: "linear-gradient(90deg, #5b2d6f 0 28%, #ffd166 28% 38%, #f7e8ff 38% 54%, #7d4aa8 54% 100%)",
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
  leaderboardResumeOnClose: false,
  leaderboardRows: [],
  leaderboardScore: 0,
  messageResumeOnClose: false,
  sprite: null,
  cleanSprite: null,
};

const random = (min, max) => min + Math.random() * (max - min);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const isTextEntryTarget = (target) =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  target instanceof HTMLSelectElement ||
  target?.isContentEditable;
const nextLevelCost = (level) => 24 + level * 12;
const maxParticles = 120;
const dressedSpriteCache = new WeakMap();
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
  state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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

function getDressedSprite(baseSprite, clean = false) {
  if (state.equippedOutfit === "default") return baseSprite;

  let cache = dressedSpriteCache.get(baseSprite);
  if (!cache) {
    cache = new Map();
    dressedSpriteCache.set(baseSprite, cache);
  }

  const key = `${state.equippedOutfit}:${clean ? "clean" : "small"}`;
  if (cache.has(key)) return cache.get(key);

  const dressed = document.createElement("canvas");
  dressed.width = baseSprite.width;
  dressed.height = baseSprite.height;
  const px = dressed.getContext("2d");
  px.imageSmoothingEnabled = false;
  px.clearRect(0, 0, dressed.width, dressed.height);
  px.drawImage(baseSprite, 0, 0);

  const unit = clean ? 2 : 1;
  const offsetX = clean ? 2 : 0;
  const offsetY = clean ? 2 : 0;
  drawOutfitPixels(px, state.equippedOutfit, unit, offsetX, offsetY);
  if (state.equippedOutfit !== "mech") redrawSakiFeatures(px, clean);

  cache.set(key, dressed);
  return dressed;
}

function drawOutfitPixels(context, outfitId, unit = 1, offsetX = 0, offsetY = 0) {
  const px = (x, y, w, h, color) => {
    context.fillStyle = color;
    context.fillRect(offsetX + x * unit, offsetY + y * unit, w * unit, h * unit);
  };

  if (outfitId === "maid") {
    px(8, 36, 29, 24, "#08070b");
    px(11, 37, 23, 20, "#fff7fb");
    px(10, 46, 25, 14, "#08070b");
    px(15, 39, 15, 19, "#fff7fb");
    px(8, 39, 7, 18, "#dcd8e8");
    px(30, 39, 7, 18, "#dcd8e8");
    px(12, 47, 4, 9, "#ffffff");
    px(29, 47, 4, 9, "#ffffff");
    px(18, 42, 9, 4, "#ffffff");
    px(17, 54, 11, 5, "#d9d1ff");
    px(20, 49, 5, 8, "#151218");
    px(7, 7, 8, 5, "#ffffff");
    px(28, 7, 9, 5, "#ffffff");
    px(14, 5, 16, 4, "#ffffff");
    px(11, 5, 3, 3, "#fff7fb");
    px(30, 5, 3, 3, "#fff7fb");
    px(6, 14, 5, 5, "#ffffff");
    px(34, 14, 5, 5, "#ffffff");
    px(7, 13, 3, 3, "#ff63a8");
    px(35, 13, 3, 3, "#ff63a8");
  } else if (outfitId === "sailor") {
    px(8, 38, 29, 22, "#3157a8");
    px(11, 38, 23, 16, "#fff7fb");
    px(11, 47, 23, 13, "#3157a8");
    px(13, 39, 19, 10, "#fff7fb");
    px(10, 41, 10, 8, "#3157a8");
    px(25, 41, 10, 8, "#3157a8");
    px(19, 42, 7, 10, "#e64068");
    px(16, 50, 14, 5, "#e64068");
    px(17, 55, 3, 4, "#fff7fb");
    px(22, 55, 3, 4, "#fff7fb");
    px(27, 55, 3, 4, "#fff7fb");
    px(14, 50, 18, 2, "#6bd3ff");
    px(22, 4, 14, 5, "#3157a8");
    px(28, 8, 11, 4, "#3157a8");
    px(25, 5, 9, 2, "#fff7fb");
    px(6, 18, 7, 6, "#e64068");
    px(9, 15, 5, 4, "#ff8aa0");
    px(35, 18, 4, 7, "#6bd3ff");
  } else if (outfitId === "magical") {
    px(6, 39, 33, 21, "#8069ff");
    px(8, 44, 7, 16, "#8069ff");
    px(30, 44, 7, 16, "#8069ff");
    px(11, 46, 23, 14, "#ff63a8");
    px(15, 39, 15, 20, "#ffffff");
    px(17, 47, 11, 12, "#ffd166");
    px(19, 41, 7, 8, "#8069ff");
    px(13, 42, 19, 5, "#ffd166");
    px(9, 54, 27, 4, "#ff63a8");
    px(13, 53, 5, 5, "#fff7fb");
    px(27, 53, 5, 5, "#fff7fb");
    px(16, 3, 4, 7, "#ffd166");
    px(21, 1, 5, 8, "#ffd166");
    px(27, 3, 4, 7, "#ffd166");
    px(17, 8, 15, 3, "#ffffff");
    px(35, 6, 4, 4, "#ffd166");
    px(39, 3, 3, "#ffffff");
    px(6, 27, 4, 4, "#ffd166");
    px(4, 31, 3, 3, "#ffffff");
    px(34, 26, 5, 5, "#ff63a8");
  } else if (outfitId === "mech") {
    px(5, 5, 35, 55, "#2c3440");
    px(8, 10, 29, 22, "#5f6f80");
    px(11, 18, 23, 7, "#151218");
    px(8, 43, 29, 17, "#2c3440");
    px(11, 39, 23, 11, "#758596");
    px(14, 47, 17, 12, "#b9d3e8");
    px(9, 41, 6, 9, "#5f6f80");
    px(30, 41, 6, 9, "#5f6f80");
    px(17, 44, 11, 4, "#5df0c4");
    px(20, 50, 5, 7, "#2c3440");
    px(8, 9, 29, 5, "#5f6f80");
    px(12, 6, 21, 4, "#2c3440");
    px(17, 8, 11, 3, "#5df0c4");
    px(5, 25, 6, 9, "#758596");
    px(34, 25, 6, 9, "#758596");
    px(3, 31, 5, 6, "#5df0c4");
    px(37, 31, 5, 6, "#5df0c4");
    px(13, 57, 6, 4, "#5df0c4");
    px(26, 57, 6, 4, "#5df0c4");
  } else if (outfitId === "medieval") {
    px(6, 37, 33, 23, "#5b2d6f");
    px(10, 38, 25, 16, "#f7e8ff");
    px(7, 44, 31, 16, "#5b2d6f");
    px(11, 39, 23, 12, "#f7e8ff");
    px(14, 46, 17, 14, "#7d4aa8");
    px(18, 41, 9, 18, "#ffd166");
    px(9, 47, 5, 10, "#d7b3ff");
    px(31, 47, 5, 10, "#d7b3ff");
    px(8, 55, 29, 4, "#7d4aa8");
    px(12, 54, 21, 3, "#ffd166");
    px(16, 57, 4, 3, "#f7e8ff");
    px(25, 57, 4, 3, "#f7e8ff");
    px(8, 7, 29, 4, "#ffd166");
    px(12, 5, 4, 4, "#ff8aa0");
    px(20, 4, 5, 4, "#fff7fb");
    px(30, 5, 4, 4, "#ff8aa0");
    px(6, 20, 7, 8, "#ffd166");
    px(35, 20, 5, 8, "#ffd166");
    px(5, 24, 3, 3, "#f7e8ff");
    px(38, 24, 3, 3, "#f7e8ff");
  }
}

function redrawSakiFeatures(context, clean = false) {
  const unit = clean ? 2 : 1;
  const offsetX = clean ? 2 : 0;
  const offsetY = clean ? 2 : 0;
  const px = (x, y, w, h, color) => {
    context.fillStyle = color;
    context.fillRect(offsetX + x * unit, offsetY + y * unit, w * unit, h * unit);
  };

  px(10, 5, 26, 6, "#0b0b0f");
  px(13, 8, 25, 7, "#0b0b0f");
  px(11, 16, 20, 4, "#0b0b0f");
  px(28, 23, 4, 2, "#e64068");
  px(29, 24, 3, 2, "#e64068");
  px(31, 23, 1, 1, "#ffe9ee");
  px(33, 8, 7, 7, "#8069ff");
  px(36, 15, 6, 8, "#8069ff");
  px(30, 15, 7, 7, "#8069ff");
  px(36, 9, 2, 2, "#d9d1ff");
  px(38, 17, 2, 2, "#d9d1ff");
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

  const sprite = getDressedSprite(state.sprite || buildFallbackSprite(), false);
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
  state.shopMessage =
    state.gameType === "danmaku"
      ? "Spend shared coins from broken danmaku."
      : "Clean flakes for shared coins. Outfits update Saki in both games.";
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
  if (!messagePanel) return;
  state.messageResumeOnClose = false;
  if (state.mode === "playing") {
    state.messageResumeOnClose = true;
    state.mode = "paused";
    pauseBtn.textContent = "▶";
    pauseMusic();
  }
  if (cryptoStatusEl) cryptoStatusEl.textContent = "Runs locally in this browser. Enter a message and passphrase.";
  messagePanel.classList.remove("hidden");
}

function closeMessagePanel() {
  if (!messagePanel) return;
  messagePanel.classList.add("hidden");
  if (state.messageResumeOnClose && state.mode === "paused") {
    state.mode = "playing";
    state.lastFrame = performance.now();
    pauseBtn.textContent = "Ⅱ";
    startMusic();
  }
  state.messageResumeOnClose = false;
}

function leaderboardEndpoint(path) {
  return `${leaderboardApiBaseUrl.replace(/\/$/, "")}${path}`;
}

function openLeaderboard(score = state.gameType === "danmaku" ? Math.floor(state.score) : 0) {
  state.leaderboardScore = Math.max(state.leaderboardScore, score);
  state.leaderboardResumeOnClose = false;

  if (state.mode === "playing") {
    state.leaderboardResumeOnClose = true;
    state.mode = "paused";
    pauseBtn.textContent = "▶";
    pauseMusic();
  }

  leaderboardNameEl.value = localStorage.getItem("sakiLeaderboardName") || "";
  leaderboardPanel.classList.remove("hidden");
  renderLeaderboard();
  loadLeaderboard();
}

function closeLeaderboard() {
  leaderboardPanel.classList.add("hidden");
  if (state.leaderboardResumeOnClose && state.mode === "paused") {
    state.mode = "playing";
    state.lastFrame = performance.now();
    pauseBtn.textContent = "Ⅱ";
    startMusic();
  }
  state.leaderboardResumeOnClose = false;
}

function renderLeaderboard() {
  const submitScore = Math.floor(state.leaderboardScore || 0);
  const apiMode = Boolean(leaderboardApiBaseUrl);
  leaderboardStatusEl.textContent = apiMode
    ? `Cloud ranking ready. Current score: ${submitScore}`
    : "Online ranking is not connected yet. Deploy the Cloudflare Worker and set its URL in config.js.";
  leaderboardSubmitBtn.disabled = !apiMode || submitScore <= 0;
  leaderboardListEl.innerHTML = "";

  if (!state.leaderboardRows.length) {
    const empty = document.createElement("li");
    empty.className = "leaderboard-row";
    empty.innerHTML = `<span class="leaderboard-rank">--</span><span class="leaderboard-name">${apiMode ? "No scores yet" : "Connect online ranking first"}</span><span class="leaderboard-score">0</span>`;
    leaderboardListEl.appendChild(empty);
    return;
  }

  state.leaderboardRows.forEach((row, index) => {
    const item = document.createElement("li");
    item.className = "leaderboard-row";
    item.innerHTML = `
      <span class="leaderboard-rank">#${index + 1}</span>
      <span class="leaderboard-name"></span>
      <span class="leaderboard-score">${Number(row.score || 0).toLocaleString()}</span>
    `;
    item.querySelector(".leaderboard-name").textContent = row.name || row.player_name || "Player";
    leaderboardListEl.appendChild(item);
  });
}

function resetEndScorePrompt() {
  recordScoreBlock.classList.remove("hidden");
  recordScoreChoices.classList.remove("hidden");
  endScoreForm.classList.add("hidden");
  endLeaderboardSubmitBtn.disabled = false;
  endScoreStatusEl.textContent = "";
  endLeaderboardNameEl.value = "";
}

function showEndScoreNamePrompt() {
  recordScoreChoices.classList.add("hidden");
  endScoreForm.classList.remove("hidden");
  endScoreStatusEl.textContent = "Enter your name to save this run.";
  endLeaderboardNameEl.value = localStorage.getItem("sakiLeaderboardName") || "";
  endLeaderboardNameEl.focus();
}

function skipEndScoreSubmission() {
  recordScoreChoices.classList.add("hidden");
  endScoreForm.classList.add("hidden");
  endScoreStatusEl.textContent = "Score recording skipped.";
}

async function loadLeaderboard() {
  if (!leaderboardApiBaseUrl) {
    state.leaderboardRows = [];
    renderLeaderboard();
    return;
  }

  try {
    const response = await fetch(leaderboardEndpoint("/leaderboard"));
    if (!response.ok) throw new Error("leaderboard load failed");
    const data = await response.json();
    state.leaderboardRows = data.scores || [];
  } catch (error) {
    leaderboardStatusEl.textContent = "Could not load online ranking. Check the Worker URL in config.js.";
    state.leaderboardRows = [];
  }

  renderLeaderboard();
}

async function saveLeaderboardScore(name, score, statusEl) {
  if (!leaderboardApiBaseUrl) {
    statusEl.textContent = "Online ranking is not connected yet. Set the Worker URL in config.js.";
    return false;
  }
  if (!name) {
    statusEl.textContent = "Enter a player name first.";
    return false;
  }
  if (score <= 0) {
    statusEl.textContent = "Finish a shooting run before submitting.";
    return false;
  }

  localStorage.setItem("sakiLeaderboardName", name);

  try {
    const response = await fetch(leaderboardEndpoint("/score"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, score, game: "danmaku" }),
    });
    if (!response.ok) throw new Error("score submit failed");
    statusEl.textContent = "Score recorded on the ranking.";
    await loadLeaderboard();
    return true;
  } catch (error) {
    statusEl.textContent = "Could not submit score.";
    return false;
  }
}

async function submitLeaderboardScore() {
  const name = leaderboardNameEl.value.trim().slice(0, 18);
  const score = Math.floor(state.leaderboardScore || 0);
  leaderboardSubmitBtn.disabled = true;
  await saveLeaderboardScore(name, score, leaderboardStatusEl);
  leaderboardSubmitBtn.disabled = false;
}

async function submitEndLeaderboardScore() {
  const name = endLeaderboardNameEl.value.trim().slice(0, 18);
  const score = Math.floor(state.leaderboardScore || 0);
  endLeaderboardSubmitBtn.disabled = true;
  const saved = await saveLeaderboardScore(name, score, endScoreStatusEl);
  endLeaderboardSubmitBtn.disabled = saved;
  if (saved) endScoreForm.classList.add("hidden");
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
  closeLeaderboard();
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
  state.level = 1;
  state.levelGold = 0;
  state.levelPulse = 0;
  state.nextSurpriseScore = 10000;
  state.cheerMilestone = 0;
  state.cheerTimer = 0;
  state.seenBulletTier = 0;
  state.upgradeTimer = 0;
  state.upgradeTier = 0;
  state.spawnTimer = 0.16;
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
  state.leaderboardScore = state.gameType === "danmaku" ? Math.floor(state.score) : 0;
  finalScoreEl.textContent = Math.floor(state.score).toString();
  resetEndScorePrompt();
  recordScoreBlock.classList.toggle("hidden", state.gameType !== "danmaku");
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
    goldEl.textContent = state.gold.toString();
    xpTextEl.textContent = `${state.dandruffBottleCount} / 65 bottle`;
    xpFillEl.style.width = `${Math.round(clamp(state.dandruffBottleCount / 65, 0, 1) * 100)}%`;
    return;
  }

  const cost = nextLevelCost(state.level);
  const xpRatio = clamp(state.levelGold / cost, 0, 1);
  scoreEl.textContent = Math.floor(state.score).toString();
  shieldEl.textContent = Math.max(0, state.shield).toString();
  goldEl.textContent = state.gold.toString();
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
      shape: tier % 5,
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
    speed: random(78, 132) + Math.min(66, state.elapsed * 0.72) + hard * 8,
    wobble: random(0.55, 1.45 + hard * 0.08),
    phase: random(0, Math.PI * 2),
    text,
    color: palette[0],
    fill: palette[1],
  });

  const next = 0.31 - Math.min(0.08, state.elapsed / 180) - hard * 0.012 + random(-0.035, 0.055);
  state.spawnTimer = Math.max(hard > 0 ? 0.16 : 0.2, next);
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
  state.shake = Math.max(state.shake, 5 + Math.min(3, tier));
  spawnBurst(state.player.x + 36, state.player.y - 10, palette.core, 14);
  spawnShockwave(state.player.x + 34, state.player.y - 8, palette.core, 1);
}

function triggerScoreSurprise(milestone) {
  state.cheerMilestone = milestone;
  state.cheerTimer = 3.2;
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
  spawnBurst(enemy.x, enemy.y, enemy.color, 7);
  spawnBurst(enemy.x, enemy.y, "#fff7fb", 2);
  spawnShockwave(enemy.x, enemy.y, enemy.color, 0.34);

  const count = Math.min(4, Math.max(0, maxParticles - state.particles.length));
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
      const cleanReward = 5;
      state.dandruffRemoved += 1;
      state.score = state.dandruffRemoved;
      state.gold += cleanReward;
      state.combo += 1;
      state.dandruffBottleCount += 1;
      state.bottlePulse = 0.34;
      spawnBurst(x, y, "#ffffff", 3);
      spawnBurst(x, y, "#c9fff2", 1);
      spawnCoinText(x, y, cleanReward);
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
    const enemyCap = 20 + Math.min(10, hard * 2);
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
  gradient.addColorStop(0, "#07070b");
  gradient.addColorStop(0.52, "#101018");
  gradient.addColorStop(1, "#05070a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.save();
  ctx.globalAlpha = 0.025 + pulse * 0.018;
  ctx.fillStyle = palette.core;
  ctx.fillRect(0, 0, state.width, state.height);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.14;
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
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 24; i += 1) {
    const x = (i * 149 + state.time * (12 + (i % 4) * 5)) % (state.width + 36);
    const y = (i * 83) % state.height;
    const size = 2 + (i % 3);
    ctx.fillStyle = i % 5 === 0 ? palette.accent : i % 3 === 0 ? palette.core : "#fff7fb";
    ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
  }
  ctx.restore();
}

function drawPlayer() {
  const sprite = getDressedSprite(state.sprite || buildFallbackSprite(), false);
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
  drawPixelGun(width, height, scale, player.muzzle > 0);
  ctx.restore();
  ctx.imageSmoothingEnabled = true;
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
    const shape = bullet.shape || 0;
    const flare = 1 + Math.sin(state.time * 14 + spin) * 0.06;
    const coreLength = 14 + power * 3;
    const coreHeight = 6 + Math.min(4, power);

    ctx.save();
    ctx.translate(bullet.x, bullet.y);

    ctx.globalAlpha = 0.28 + Math.min(0.2, power * 0.03);
    ctx.fillStyle = bullet.trail || "rgba(93, 240, 196, 0.24)";
    ctx.fillRect(-18 - power * 4, -2, 16 + power * 3, 4);
    if (power >= 2) {
      ctx.fillRect(-12 - power * 2, -7, 10 + power * 2, 3);
      ctx.fillRect(-12 - power * 2, 4, 10 + power * 2, 3);
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = bullet.color;

    if (shape === 0) {
      ctx.fillRect(-5, -coreHeight * 0.5 * flare, coreLength, coreHeight);
      ctx.fillRect(2, -coreHeight, 4 + power, coreHeight * 2);
    } else if (shape === 1) {
      ctx.fillRect(-3, -coreHeight * 0.5, coreLength - 2, coreHeight);
      ctx.fillRect(2, -coreHeight - 3, coreHeight, coreHeight);
      ctx.fillRect(2, 3, coreHeight, coreHeight);
      ctx.fillRect(coreLength - 2, -2, 5 + power, 4);
    } else if (shape === 2) {
      ctx.rotate(Math.PI * 0.25);
      const size = 8 + power * 1.5;
      ctx.fillRect(-size * 0.5, -size * 0.5, size, size);
      ctx.rotate(-Math.PI * 0.25);
      ctx.fillRect(3, -2, coreLength + 2, 4);
    } else if (shape === 3) {
      ctx.fillRect(-4, -coreHeight - 2, coreLength, coreHeight - 1);
      ctx.fillRect(-4, 3, coreLength, coreHeight - 1);
      ctx.fillRect(4, -3, coreLength + 4, 6);
    } else {
      const size = 11 + power * 2;
      ctx.fillRect(-2, -size * 0.5, size, 3);
      ctx.fillRect(-2, size * 0.5 - 3, size, 3);
      ctx.fillRect(-2, -size * 0.5, 3, size);
      ctx.fillRect(size - 5, -size * 0.5, 3, size);
      ctx.fillRect(4, -2, coreLength, 4);
    }

    ctx.fillStyle = bullet.accent || "#ffffff";
    ctx.fillRect(4, -2, Math.max(8, coreLength - 4), 4);
    if (power >= 4) ctx.fillRect(coreLength + 1, -5, 4, 10);

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
  ctx.globalAlpha = alpha * 0.12;
  ctx.fillStyle = palette.core;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.globalAlpha = alpha;
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2;
  for (let i = 0; i < 2; i += 1) {
    const radius = (1 - alpha) * (74 + i * 38) + i * 16;
    const pixel = 8;
    const left = Math.round((x - radius) / pixel) * pixel;
    const top = Math.round((y - radius) / pixel) * pixel;
    const size = Math.round((radius * 2) / pixel) * pixel;
    ctx.strokeRect(left, top, size, size);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
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
  const unit = scale * 0.58;
  const map = [
    "........SSSS.........",
    ".......SSSSS.........",
    "......SSSSSS.........",
    ".....SSSSSSS.........",
    "....SSSSSSS..........",
    "...SSSSSSS...........",
    "..SSSSSSS............",
    "..SSSSSSSSSSSS.......",
    "..SSSSSSSSSSSSSS.....",
    ".CCCCSSSSSSSSSSS.....",
    ".CCCCSSSSSSSSSSSS....",
    ".CCCCSSSSSSSSSSS.....",
    ".CCCCSSSSSSSSSS......",
    ".CCCCSSSSSSSSS.......",
    ".CCCCSSSSSS..........",
    ".CCCC................",
  ];
  const colors = {
    S: "#f4d2bf",
    C: "#a58cff",
  };

  ctx.save();
  ctx.translate(x, y);
  drawPixelMap(map, colors, unit, Math.max(1, unit * 0.22));
  ctx.fillStyle = "#fff4ee";
  ctx.fillRect(7 * unit, 2 * unit, 2 * unit, unit);
  ctx.fillRect(12 * unit, 9 * unit, 5 * unit, unit);
  ctx.fillRect(12 * unit, 11 * unit, 5 * unit, unit);
  ctx.fillRect(12 * unit, 13 * unit, 4 * unit, unit);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(18 * unit, 4 * unit, unit, unit);
  ctx.fillRect(19 * unit, 6 * unit, unit, unit);
  ctx.restore();
}

function drawDandruffGame() {
  if (state.gameType !== "dandruff" || state.mode === "intro") return;

  const layout = dandruffLayout();
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(layout.x - layout.width * 0.48, layout.y + layout.height * 0.49, layout.width * 0.96, 10);

  ctx.save();
  ctx.translate(layout.x, layout.y);
  const dressedSprite = getDressedSprite(layout.sprite, true);
  ctx.drawImage(dressedSprite, -layout.width * 0.5, -layout.height * 0.5, layout.width, layout.height);
  ctx.restore();

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

  const duration = 3.2;
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

  const raise = progress < 0.22 ? 52 * (1 - progress / 0.22) : 0;
  const thumbWave = progress > 0.24 ? Math.sin(progress * Math.PI * 6) * 2 : 0;
  drawThumbsUp(x + width * 0.18, y - height * 0.48 + raise + thumbWave, baseScale);

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
  if (isTextEntryTarget(event.target)) return;

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
leaderboardBtn.addEventListener("click", () => openLeaderboard());
closeShopBtn.addEventListener("click", closeShop);
shopPanel.addEventListener("click", (event) => {
  if (event.target === shopPanel) closeShop();
});
shopItemsEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-outfit]");
  if (!button) return;
  buyOrEquipOutfit(button.dataset.outfit);
});
messageBtn?.addEventListener("click", openMessagePanel);
closeMessageBtn?.addEventListener("click", closeMessagePanel);
messagePanel?.addEventListener("click", (event) => {
  if (event.target === messagePanel) closeMessagePanel();
});
encryptMessageBtn?.addEventListener("click", () => {
  generateEncryptedMessage();
});
closeLeaderboardBtn.addEventListener("click", closeLeaderboard);
leaderboardPanel.addEventListener("click", (event) => {
  if (event.target === leaderboardPanel) closeLeaderboard();
});
leaderboardSubmitBtn.addEventListener("click", submitLeaderboardScore);
submitScoreBtn.addEventListener("click", showEndScoreNamePrompt);
skipScoreBtn.addEventListener("click", skipEndScoreSubmission);
endLeaderboardSubmitBtn.addEventListener("click", submitEndLeaderboardScore);
endLeaderboardNameEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") submitEndLeaderboardScore();
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
