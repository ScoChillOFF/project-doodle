// Объекты и классы
//---------------------------------------------------
var GAME = {
  width: 600,
  height: 900,
  bgColor: "#85C1E9"
};

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
};

class Background {
  constructor(y) {
    this.img = new Image();
    this.spritePath = "./sprites/bg_sprite.png";
    this.isLoad = false;

    this.x = 0;
    this.y = y;
    this.speed = 0;
    this.gravity = 0.05;
    this.scrollSpeed = 4.2;
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
    this.gravity = 0.05;
    this.scrollSpeed = PLAYER.jumpPower / 2;

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

canvas.width = GAME.width;
canvas.height = GAME.height;

var bgs = [new Background(0), new Background(-GAME.height)];
var platforms = [new Platform(PLAYER.x, GAME.height - GAME.height / 4.5 + 100)];
for (var i = 1; i < 4; i++) {
  platforms[i] = new Platform(
    Math.random() * (GAME.width - platforms[0].width),
    GAME.height - (GAME.height / 4) * (i + 1) + 120
  );
}
//--------------------------------------------------

// Функции отрисовки
//--------------------------------------------------
function initSprites() {
  P_SPRITE.img.src = P_SPRITE.spritePath;

  P_SPRITE.img.onload = () => {
    P_SPRITE.isLoad = true;
  };
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
      )
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

function drawFrame() {
  ctx.clearRect(0, 0, GAME.width, GAME.height);
  drawBackground();
  drawPlatforms();
  drawPlayer();
}
//--------------------------------------------------

// Функции обновления состояния
//--------------------------------------------------
function updateEntities() {
  checkCollision();
  updatePlayer();
  updatePlatforms();
}

function updatePlayer() {
  PLAYER.ySpeed += PLAYER.gravity; // Инерция и гравитация
  if (Math.abs(PLAYER.xSpeed) > 0) {
    PLAYER.xSpeed -= Math.sign(PLAYER.xSpeed) * PLAYER.xInertion;
  }

  PLAYER.x += PLAYER.xSpeed;
  PLAYER.y += PLAYER.ySpeed;
}

function updatePlatforms() {
  for (var i = 0; i < platforms.length; i++) {
    platforms[i].y += platforms[i].speed;
    if (platforms[i].speed > 0) {
      platforms[i].speed -= platforms[i].gravity;
    } else {
      platforms[i].speed = 0;
    }

    if (platforms[i].isMoving) {
      platforms[i].x += platforms[i].xSpeed;
      if (platforms[i].x + platforms[i].width >= GAME.width || platforms[i].x <= 0) {
        platforms[i].xSpeed = -platforms[i].xSpeed;
      }
    }

    if (platforms[i].y > GAME.height) {
      platforms[i].y = -GAME.height / 4.5 + 140;
      check = Math.random();
      if (check > 0.5) {
        platforms[i].isMoving = true;
      }
      else {
        platforms[i].isMoving = false;
      }
    }
  }
}

function updateBackground() {
  for (var i = 0; i < bgs.length; i++) {
    bgs[i].y += bgs[i].speed;

    if (bgs[i].speed > 0) {
      bgs[i].speed -= bgs[i].gravity;
    }
    else {
      bgs[i].speed = 0;
    }

    if (bgs[i]. y > GAME.height) {
      bgs[i].y = -GAME.height + 10;
    }
  }
}

function checkCollision() {
  if (PLAYER.y + PLAYER.height > GAME.height) {
    restart();
  }

  if (checkPlatformsCollision()) {
    processScroll();
    PLAYER.ySpeed = -PLAYER.jumpPower;
    PLAYER.jumpPower = PLAYER.maxJumpPower;
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
    var precisionCollision = Math.abs(PLAYER.y + PLAYER.height - platforms[i].y) < platforms[i].height;

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


function processScroll() {
  if (PLAYER.y < GAME.height - GAME.height / 3) {
    for (var i = 0; i < platforms.length; i++) {
      PLAYER.jumpPower = PLAYER.minJumpPower;
      platforms[i].speed = platforms[i].scrollSpeed;
    }

    for (var i = 0; i < bgs.length; i++) {
      bgs[i].speed = bgs[i].scrollSpeed;
    }
  }
}

function restart() {
  PLAYER.x = 300;
  PLAYER.y = 500;
  PLAYER.xSpeed = 0;
  PLAYER.ySpeed = 0;
  P_SPRITE.pos = "r";

  platforms[0] = new Platform(PLAYER.x, GAME.height - GAME.height / 4.5 + 100);
  for (var i = 1; i < 4; i++) {
    platforms[i] = new Platform(
      Math.random() * (GAME.width - platforms[0].width),
      GAME.height - (GAME.height / 4) * (i + 1) + 120
    );
  }
}
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
}
//--------------------------------------------------

// Main
//--------------------------------------------------
function play() {
  drawFrame();
  updateEntities();
  updateBackground();
  requestAnimationFrame(play);
}

initSprites();
initEventListeners();
play();
