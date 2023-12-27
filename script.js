// Объекты и классы
//---------------------------------------------------
var GAME = {
  width: 600,
  height: 900,
  bgColor: "#85C1E9",
  scrollSpeed: 5,
  scrollGravity: 0.05,
  winLimit: 10,
  isRunning: true,
};

var GUI = {
  img: new Image(),
  spritePath: "./sprites/gui.png",
  isLoad: false,
  x: 0,
  y: 0,
  width: GAME.width,
  height: 150,
  textColor: "#481C1A",
}

var P_SPRITE = {
  img: new Image(),
  spritePath: "./sprites/player_sprite.png",
  isLoad: false,
  pos: "r",
  rightSpriteX: 335,
  rightSpriteY: 0,
  leftSpriteX: 0,
  leftSpriteY: 0,
  width: 333,
  height: 395,
};

var PLAYER = {
  x: 300,
  y: 500,
  width: GAME.width / 6,
  height: GAME.height / 7.2,
  xSpeed: 0,
  ySpeed: 0,
  xAcceleration: 0.32,
  xInertion: 0.075,
  xMaxSpeed: 7,
  maxJumpPower: 10,
  minJumpPower: 7,
  jumpPower: 10,
  gravity: 0.15,
  stars: 0,
  heightStat: 0,
  heightStatSpeed: 0,
};

class Background {
  constructor(y) {
    this.img = new Image();
    this.spritePath = "./sprites/bg_sprite.png";
    this.isLoad = false;

    this.x = 0;
    this.y = y;
    this.speed = 0;
    this.width = 600;
    this.height = 900;

    this.img.src = this.spritePath;
    this.img.onload = () => {
      this.isLoad = true;
    };
  }
}

class Platform {
  constructor(x, y) {
    this.img = new Image();
    this.spritePath = "./sprites/platform_sprite.png";
    this.isLoad = false;

    this.spriteWidth = 300;
    this.spriteHeight = 177;

    this.isMoving = false;
    this.x = x;
    this.y = y;
    this.xSpeed = 3;
    this.width = 150;
    this.height = 7;

    this.speed = 0;

    this.img.src = this.spritePath;
    this.img.onload = () => {
      this.isLoad = true;
    };
  }
}

class Star {
  constructor(x, y, isCollectable) {
    this.img = new Image();
    this.spritePath = "./sprites/star_sprite.png";
    this.isLoad = false;

    this.spriteWidth = 224;
    this.spriteHeight = 219;

    this.isCollectable = isCollectable;
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;

    this.speed = 0;

    this.img.src = this.spritePath;
    this.img.onload = () => {
      this.isLoad = true;
    };
  }
}
//---------------------------------------------------

// Создание холста и массивов спрайтов
//---------------------------------------------------
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

var font = new FontFace("SingleDay", "url(./fonts/SingleDay-Regular.ttf)");
document.fonts.add(font);

canvas.width = GAME.width;
canvas.height = GAME.height;

var bgs = [];
var platforms = [];
var stars = [];

var drawStatus;
//--------------------------------------------------

// Функции отрисовки
//--------------------------------------------------
function initSprites() {
  P_SPRITE.img.src = P_SPRITE.spritePath;

  P_SPRITE.img.onload = () => {
    P_SPRITE.isLoad = true;
  };

  GUI.img.src = GUI.spritePath;

  GUI.img.onload = () => {
    GUI.isLoad = true;
  }
}

function drawBackground() {
  ctx.clearRect(0, 0, GAME.width, GAME.height);
  ctx.fillStyle = GAME.bgColor;
  ctx.fillRect(0, 0, GAME.width, GAME.height);
  for (var i = 0; i < bgs.length; i++) {
    if (bgs[i].isLoad === true) {
      ctx.drawImage(bgs[i].img, bgs[i].x, bgs[i].y, GAME.width, GAME.height);
    }
  }
}

function drawGui() {
  ctx.drawImage(GUI.img, 0, 0, GUI.width, GUI.height);
  ctx.fillStyle = GUI.textColor;
  ctx.textAlign = "left";
  ctx.font = "72px SingleDay";
  ctx.fillText(PLAYER.stars + "/" + GAME.winLimit, 440, 95);
  if (PLAYER.heightStat > 10000) {
    ctx.fillText(">" + parseInt(PLAYER.heightStat / 1000) + "k", 100, 95);
  }
  else {
    ctx.fillText(parseInt(PLAYER.heightStat), 100, 95);
  }
}

function drawPlatforms() {
  for (var i = 0; i < platforms.length; i++) {
    ctx.drawImage(
      platforms[i].img,
      0,
      0,
      platforms[i].spriteWidth,
      platforms[i].spriteHeight,
      platforms[i].x,
      platforms[i].y,
      platforms[i].width,
      platforms[i].height * 13
    );
  }
}

function drawStars() {
  for (var i = 0; i < stars.length; i++) {
    if (stars[i].isCollectable) {
      ctx.drawImage(
        stars[i].img,
        0,
        0,
        stars[i].spriteWidth,
        stars[i].spriteHeight,
        stars[i].x,
        stars[i].y,
        stars[i].width,
        stars[i].height
      );
    }
  }
}

function drawPlayer() {
  if (P_SPRITE.pos === "r") {
    ctx.drawImage(
      P_SPRITE.img,
      P_SPRITE.rightSpriteX,
      P_SPRITE.rightSpriteY,
      P_SPRITE.width,
      P_SPRITE.height,
      PLAYER.x,
      PLAYER.y,
      PLAYER.width,
      PLAYER.height
    );
  } else if (P_SPRITE.pos === "l") {
    ctx.drawImage(
      P_SPRITE.img,
      P_SPRITE.leftSpriteX,
      P_SPRITE.leftSpriteY,
      P_SPRITE.width,
      P_SPRITE.height,
      PLAYER.x,
      PLAYER.y,
      PLAYER.width,
      PLAYER.height
    );
  }
}

function drawGameOver() {
  ctx.fillStyle = "red";
  ctx.font = "100px SingleDay";
  ctx.textAlign = "center";
  ctx.fillText("Game over!", GAME.width / 2, GAME.height / 2);
  ctx.fillStyle = "black";
  ctx.font = "72px SingleDay";
  ctx.fillText("Press R to restart", GAME.width / 2, GAME.height / 2 + 100);
}

function drawWin() {
  ctx.fillStyle = "green";
  ctx.font = "100px SingleDay";
  ctx.textAlign = "center";
  ctx.fillText("You win!", GAME.width / 2, GAME.height / 2);
  ctx.fillStyle = "black";
  ctx.font = "72px SingleDay";
  ctx.fillText("Total height: " + parseInt(PLAYER.heightStat), GAME.width / 2, GAME.height / 2 + 100);
  ctx.fillText("Press R to play again", GAME.width / 2, GAME.height / 2 + 200);
}

function drawFrame() {
  ctx.clearRect(0, 0, GAME.width, GAME.height);
  drawBackground();
  drawPlatforms();
  drawStars();
  drawPlayer();
  drawGui();
}
//--------------------------------------------------

// Функции обновления состояния
//--------------------------------------------------
function initEntities() {
  bgs = [new Background(0), new Background(-GAME.height)];

  PLAYER.x = 300;
  PLAYER.y = 500;
  PLAYER.xSpeed = 0;
  PLAYER.ySpeed = 0;
  P_SPRITE.pos = "r";
  PLAYER.stars = 0;
  PLAYER.heightStat = 0;

  platforms[0] = new Platform(PLAYER.x, GAME.height - GAME.height / 4.5 + 100);
  for (var i = 1; i < 4; i++) {
    platforms[i] = new Platform(
      Math.random() * (GAME.width - platforms[0].width),
      GAME.height - (GAME.height / 4) * (i + 1) + 120
    );
  }

  for (var i = 0; i < 3; i++) {
    var chance = false;
    if (Math.random() > 0.6) {
      chance = true;
    }

    stars[i] = new Star(
      Math.random() * (GAME.width - 100),
      GAME.height - (GAME.height / 3) * (i + 1),
      chance
    );
  }
}

function updateEntities() {
  checkCollision();
  updatePlayer();
  updatePlatforms();
  updateStars();
}

function updatePlayer() {
  PLAYER.ySpeed += PLAYER.gravity; // Инерция и гравитация
  if (Math.abs(PLAYER.xSpeed) > 0) {
    PLAYER.xSpeed -= Math.sign(PLAYER.xSpeed) * PLAYER.xInertion;
  }

  if (PLAYER.heightStatSpeed > 0) {
    PLAYER.heightStatSpeed -= GAME.scrollGravity;
  }
  else {
    PLAYER.heightStatSpeed = 0;
  }

  PLAYER.x += PLAYER.xSpeed;
  PLAYER.y += PLAYER.ySpeed;

  PLAYER.heightStat += PLAYER.heightStatSpeed;
}

function updatePlatforms() {
  for (var i = 0; i < platforms.length; i++) {
    platforms[i].y += platforms[i].speed;
    if (platforms[i].speed > 0) {
      platforms[i].speed -= GAME.scrollGravity;
    } else {
      platforms[i].speed = 0;
    }

    if (platforms[i].isMoving) {
      platforms[i].x += platforms[i].xSpeed;
      if (
        platforms[i].x + platforms[i].width >= GAME.width ||
        platforms[i].x <= 0
      ) {
        platforms[i].xSpeed = -platforms[i].xSpeed;
      }
    }

    if (platforms[i].y > GAME.height) {
      platforms[i].y = -GAME.height / 4.5 + 140;
      check = Math.random();
      if (check > 0.5) {
        platforms[i].isMoving = true;
      } else {
        platforms[i].isMoving = false;
      }
    }
  }
}

function updateStars() {
  for (var i = 0; i < stars.length; i++) {
    stars[i].y += stars[i].speed;

    if (stars[i].speed > 0) {
      stars[i].speed -= GAME.scrollGravity;
    } else {
      stars[i].speed = 0;
    }

    if (stars[i].y > GAME.height) {
      stars[i].y = -GAME.height / (3 + Math.random() * 2);
      stars[i].x = Math.random() * (GAME.width - 100);

      var chance = false;
      if (Math.random() > 0.6) {
        chance = true;
        console.log(chance);
      }

      stars[i].isCollectable = chance;
    }
  }
}

function updateBackground() {
  for (var i = 0; i < bgs.length; i++) {
    bgs[i].y += bgs[i].speed;

    if (bgs[i].speed > 0) {
      bgs[i].speed -= GAME.scrollGravity;
    } else {
      bgs[i].speed = 0;
    }

    if (bgs[i].y > GAME.height) {
      bgs[i].y = -GAME.height + 10;
    }
  }
}

function checkCollision() {
  if (PLAYER.y + PLAYER.height > GAME.height) {
    gameOver();
  }

  if (checkPlatformsCollision()) {
    processScroll();
    PLAYER.ySpeed = -PLAYER.jumpPower;
    PLAYER.jumpPower = PLAYER.maxJumpPower;
  }

  if (checkStarsCollision()) {
    PLAYER.stars += 1;
    if (PLAYER.stars >= GAME.winLimit) {
      drawGui();
      win();
    }
  }

  if (PLAYER.x + PLAYER.width > GAME.width) {
    PLAYER.x = GAME.width - PLAYER.width;
    PLAYER.xSpeed = 0;
  }

  if (PLAYER.x < 0) {
    PLAYER.x = 0;
    PLAYER.xSpeed = 0;
  }

  if (PLAYER.y < 0) {
    PLAYER.y = 0;
  }
}

function checkPlatformsCollision() {
  for (var i = 0; i < platforms.length; i++) {
    var leftCollision = PLAYER.x + PLAYER.width - 7 > platforms[i].x;
    var rightCollision = PLAYER.x < platforms[i].x + platforms[i].width - 7;
    var precisionCollision =
      Math.abs(PLAYER.y + PLAYER.height - platforms[i].y) < platforms[i].height;

    if (
      leftCollision &&
      rightCollision &&
      precisionCollision &&
      PLAYER.ySpeed > 0
    ) {
      return true;
    }
  }
  return false;
}

function checkStarsCollision() {
  for (var i = 0; i < stars.length; i++) {
    var topCollision = PLAYER.y + PLAYER.height > stars[i].y;
    var bottomCollision = PLAYER.y < stars[i].y + stars[i].height;
    var leftCollision = PLAYER.x + PLAYER.width > stars[i].x;
    var rightCollision = PLAYER.x < stars[i].x + stars[i].height;

    if (
      topCollision &&
      bottomCollision &&
      leftCollision &&
      rightCollision &&
      stars[i].isCollectable
    ) {
      stars[i].isCollectable = false;
      return true;
    }
  }
  return false;
}

function processScroll() {
  if (PLAYER.y < GAME.height - GAME.height / 3) {
    for (var i = 0; i < platforms.length; i++) {
      PLAYER.jumpPower = PLAYER.minJumpPower;
      platforms[i].speed = GAME.scrollSpeed;
    }

    for (var i = 0; i < bgs.length; i++) {
      bgs[i].speed = GAME.scrollSpeed - 0.8;
    }

    for (var i = 0; i < stars.length; i++) {
      stars[i].speed = GAME.scrollSpeed;
    }

    PLAYER.heightStatSpeed = GAME.scrollSpeed;
  }
}

function gameOver() {
  GAME.isRunning = false;
  drawGameOver();
}

function win() {
  GAME.isRunning = false;
  drawWin();
}

function restart() {
  initEntities();
  GAME.isRunning = true;
};
//--------------------------------------------------

// Функции обработки управления
//--------------------------------------------------
function initEventListeners() {
  window.addEventListener("keydown", onCanvasKeydown);
}

function onCanvasKeydown(event) {
  if (
    event.key === "ArrowRight" &&
    Math.abs(PLAYER.xSpeed) < PLAYER.xMaxSpeed
  ) {
    PLAYER.xSpeed += PLAYER.xAcceleration;
    P_SPRITE.pos = "r";
  }

  if (event.key === "ArrowLeft" && Math.abs(PLAYER.xSpeed) < PLAYER.xMaxSpeed) {
    PLAYER.xSpeed -= PLAYER.xAcceleration;
    P_SPRITE.pos = "l";
  }

  if ((event.key === "r" || event.key === "й") && !GAME.isRunning) {
    restart();
  }
}
//--------------------------------------------------

// Main
//--------------------------------------------------
function play() {
  if (GAME.isRunning) {
    drawFrame();
    updateEntities();
    updateBackground();
  }
  drawStatus = requestAnimationFrame(play);
}

initSprites();
initEntities();
initEventListeners();
play();
