const canvas = document.getElementById("game") as HTMLCanvasElement;
const game = canvas.getContext("2d");
const GAME_WIDTH = 1024;
const GAME_HEIGH = 720;

class Level {
  blocks: HTMLImageElement[];

  constructor() {
    this.blocks = [];
    for (let x = 0; x <= 10; x++) {
      let image = new Image(128, 128);
      image.src = "assets/spaceTile2.png";
      this.blocks.push(image);
    }
  }
}

class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  idle: HTMLImageElement[];
  walk: HTMLImageElement[];
  maxIdle: number = 5;
  maxWalk: number = 7;
  walking: boolean;
  keys: string[];
  scale: number = 1;
  speed: number = 6;
  maxSpeed: number;
  onGround: boolean = true;
  vy: number = 20;
  weigth: number = 10;
  maxJump: boolean = false;

  constructor() {
    this.x = 300;
    this.y = 255;
    this.maxSpeed = 100;
    this.width = 100;
    this.height = 110;
    this.idle = [];
    this.walk = [];
    this.walking = false;
    this.keys = [];
    for (let x = 0; x <= 5; x++) {
      let image = new Image();
      image.src = "assets/Char 2/with hands/idle_" + x + ".png";
      this.idle.push(image);
    }

    for (let x = 0; x <= 7; x++) {
      let image = new Image();
      image.src = "assets/Char 2/with hands/walk_" + x + ".png";
      this.walk.push(image);
    }
  }
}
var player = new Player();

if (game) {
  game.fillStyle = "gray";
  game.fillRect(0, 0, game.canvas.width, game.canvas.height);
  game.stroke();
} else {
  console.log("Now working dude");
}

let numIdle = 0;
let numWalk = 0;
let gameFrame = 0;
let stagFrames = 6;
window.onkeydown = (event) => {
  switch (event.key) {
    case "d": {
      player.walking = true;
      player.scale = 1;
      break;
    }
    case "a": {
      player.walking = true;
      player.scale = -1;
      break;
    }
    case "w": {
      if(player.onGround){
      player.onGround = false;
      player.maxJump = false;
      }
    }
  }
};

window.onkeyup = (e) => {
  switch (e.key) {
    case "d": {
      player.walking = false;
      break;
    }
    case "a": {
      player.walking = false;
      break;
    }
  }
};

function handleMovement(player: Player, game: CanvasRenderingContext2D | null) {
  if (game) {
    if (player.walking && player.scale == 1) {
      player.x += player.speed;
    }
    if (player.walking && player.scale == -1) {
      player.x -= player.speed;
    }
    if (!player.onGround && !player.maxJump) {
      player.y -= player.vy;
      if (player.y <= -20) player.maxJump = true;
    }
  }
}

function handleAnimation() {
  if (game) {
    if (player.walking) {
      game.clearRect(0, 0, GAME_HEIGH, GAME_WIDTH);
      let pos = Math.floor((gameFrame / stagFrames) % player.maxWalk);
      game.drawImage(
        player.walk[pos],
        720,
        1060,
        650,
        750,
        player.x,
        player.y,
        player.width,
        player.height
      );
      game.stroke();
      numWalk++;
      gameFrame++;
      if (numWalk > player.maxWalk) numWalk = 0;
    } else {
      game.clearRect(0, 0, GAME_HEIGH, GAME_WIDTH);
      let pos = Math.floor((gameFrame / stagFrames) % player.maxIdle);
      game.drawImage(
        player.idle[pos],
        720,
        1060,
        650,
        750,
        player.x,
        player.y,
        player.width,
        player.height
      );
      game.stroke();
      gameFrame++;
      numIdle++;
      if (numIdle > player.maxIdle) numIdle = 0;
    }
  }
}

var level = new Level();

function loadLevel(game: CanvasRenderingContext2D | null) {
  if (game) {
    for (let x = 0; x < 10; x++) {
      let image = level.blocks[x];
      if (image) {
        game.beginPath();
        game.drawImage(image, image?.width * x, 400);
        game.stroke();
      }
    }
  }
}

function applyGravity(player: Player) {
  if (!player.onGround) {
    player.y += player.weigth;
  }
}

function handleCollision(player: Player, level: Level) {
  var collision: boolean = false;
  for (let x = 0; x < level.blocks.length; x++) {
    var image = level.blocks[x];
    if (player.y + player.height >= 400) {
      player.onGround = true;
      collision = true;
      player.y = 400 - player.height;
    }
  }
  return collision;
}

function mainLoop() {
  game?.reset();
  handleMovement(player, game);
  handleAnimation();
  applyGravity(player);
  handleCollision(player, level);
  loadLevel(game);
  requestAnimationFrame(mainLoop);
}

mainLoop();
