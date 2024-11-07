const canvas = document.getElementById("game") as HTMLCanvasElement;
const game = canvas.getContext("2d");
const GAME_WIDTH = 1024;
const GAME_HEIGH = 720;

class Block{

   block: HTMLImageElement;
   x: number;
   y: number;
   width: number;
   heigth: number;

   constructor(x:number,y: number,src:  string,width: number,heigth: number){
     this.y = y;
     this.x = x;
     this.width = width;
     this.heigth = heigth;
     this.block = new Image(width,heigth);
     this.block.src = src;
   
   }
}

class Level {
  blocks: Block[];

  constructor(src: string, maxBlocks: number) {
    this.blocks = [];
    for (let x = 0; x <= 10; x++) {
       let block = new Block(x*128,GAME_HEIGH-128,
      src,128,128);
      this.blocks.push(block);
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
  weigth: number = 0;

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
    }
    break;
    case "w": {
      if (player.onGround) {
        player.onGround = false;
      }
      break;
    }
    case 's': {
      player.weigth = 50;
    }
    break;
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

function handleMovement(dt: number,player: Player, game: CanvasRenderingContext2D | null) {
  if (game) {
    if (player.walking && player.scale == 1) {
      player.x += (player.speed);
    }
    if (player.walking && player.scale == -1) {
      player.x -= (player.speed);
    }
    if (!player.onGround ) {
      player.y -= player.vy;
      
           }
  }
}

function handleAnimation() {
  if (game) {
     let x: number;
      if(player.scale<0) {x = -(player.x + player.width);
      }else {
        x = player.x;
      }

    if (player.walking) {
           game.clearRect(0, 0, GAME_HEIGH, GAME_WIDTH);
      let pos = Math.floor((gameFrame / stagFrames) % player.maxWalk);
      game.save();
      game.scale(player.scale,1);
      game.drawImage(
        player.walk[pos],
        720,
        1060,
        650,
        750,
        x,
        player.y,
        player.width,
        player.height
      );
      game.restore();
      game.stroke();
      numWalk++;
      gameFrame++;
      if (numWalk > player.maxWalk) numWalk = 0;
    } else {
      game.clearRect(0, 0, GAME_HEIGH, GAME_WIDTH);
      let pos = Math.floor((gameFrame / stagFrames) % player.maxIdle);
    game.save();
    game.scale(player.scale,1);
    game.drawImage(
        player.idle[pos],
        720,
        1060,
        650,
        750,
        x,
        player.y,
        player.width,
        player.height
      );
      game.restore();
      game.stroke();
      gameFrame++;
      numIdle++;
      if (numIdle > player.maxIdle) numIdle = 0;
    }
  }
}

var level = new Level("assets/spaceTile2.png",10);

function loadLevel(game: CanvasRenderingContext2D | null) {
  if (game) {
    for (let x = 0; x < 10; x++) {
      let image = level.blocks[x];
      if (image) {
        game.beginPath();
        game.drawImage(image.block, image.x, image.y);
        game.stroke();
      }
    }
  }
}

function applyGravity(player: Player,dt: number) {
    player.y += player.weigth;
    player.weigth = player.weigth + 1;
  }

function handleCollision(player: Player, level: Level) {
  var collision: boolean = false;
  for (let x = 0; x < level.blocks.length; x++) {
    var image = level.blocks[x];
    if (player.y + player.height >= image.y) {
      player.onGround = true;
      player.weigth = 0;
      collision = true;
      player.y = image.y - player.height;
    }
  }
   if(player.x + player.width >= GAME_WIDTH){
        player.x = GAME_WIDTH - player.width;
   }
   if(player.x <= 0){
    player.x = 0;
   }

  return collision;
}

let lastTime = 0;
let fps = 60;
let interval = 1000/ fps;
let acumilatedTime = 0;


function mainLoop(timestamp) {
  if(game){
  game.reset();
  }
  let dt = timestamp - lastTime;
  lastTime = timestamp;
  //console.log(1 / ((performance.now() - timeElapsed) / 1000))
  acumilatedTime += dt;
  
  this.time = timestamp;
  if(acumilatedTime >= interval){
   let deltaTime = dt/1000;
  handleMovement(deltaTime,player, game);
  handleAnimation();
  applyGravity(player,deltaTime);
  handleCollision(player, level);
  loadLevel(game);
  requestAnimationFrame(mainLoop);
  }
}

 requestAnimationFrame(mainLoop);