const canvas = document.getElementById("game") as HTMLCanvasElement;
const game = canvas.getContext("2d");
const GAME_WIDTH = 1024;
const GAME_HEIGH = 720;

enum States {
  RUN,
  JUMPSTART,
  JUMPEND,
  IDLE,
  ROLL,
}

class PlayerAnimation {
  frames: number;
  images: HTMLImageElement[];
  src: string;
  currentFrame: number;

  constructor(frames: number, src: string) {
    this.images = [];
    this.frames = frames;
    for (let x = 0; x <= frames; x++) {
      let img = new Image();
      img.src = src + x + ".png";
      this.images.push(img);
    }
    this.currentFrame = 0;
  }
}

class Block {
  block: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  heigth: number;

  constructor(
    x: number,
    y: number,
    src: string,
    width: number,
    heigth: number
  ) {
    this.y = y;
    this.x = x;
    this.width = width;
    this.heigth = heigth;
    this.block = new Image(width, heigth);
    this.block.src = src;
  }
}

class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Level {
  blocks: Block[];
  background_image: {
    img: HTMLImageElement;
    width: number;
    heidth: number;
    position: Vector2D;
  };

  constructor(src: string, maxBlocks: number) {
    this.blocks = [];
    for (let x = 0; x <= 10; x++) {
      let block = new Block(x * 128, GAME_HEIGH - 128, src, 128, 128);
      this.blocks.push(block);
    }

    this.background_image = {
      img: new Image(GAME_WIDTH, GAME_HEIGH),
      width: GAME_WIDTH,
      heidth: GAME_HEIGH,
      position: new Vector2D(0, 0),
    };
    this.background_image.img.src = "assets/background/bglayer0.png";
  }
}

class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  animations: Map<States, PlayerAnimation>;
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
  state: States;

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
    this.state = States.IDLE;

    this.animations = new Map<States,PlayerAnimation>();
    this.animations.set(
      States.IDLE,
      new PlayerAnimation(5, "assets/Char 2/with hands/idle_")
    );
    this.animations.set(
      States.RUN,
      new PlayerAnimation(7, "assets/Char 2/with hands/walk_")
    );
    this.animations.set(States.JUMPSTART,new PlayerAnimation(1,"assets/Char 2/with hands/jumpStart_"));
    this.animations.set(States.JUMPEND,new PlayerAnimation(2,"assets/Char 2/with hands/jumpEnd_"));
    this.animations.set(States.ROLL,new PlayerAnimation(4,"assets/Char 2/with hands/fall_"));
    this.animations.set(States.ROLL,new PlayerAnimation(4,"assets/Char 2/with hands/roll_"));
  }
}
var player = new Player();

if (game) {
  game.fillStyle = "gray";
  game.fillRect(0, 0, GAME_WIDTH, GAME_HEIGH);
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
      player.state = States.RUN;
      player.scale = 1;
      break;
    }
    case "a":
      {
        player.walking = true;
        player.state = States.RUN;
        player.scale = -1;
      }
      break;
    case "w": {
      if (player.onGround) {
        player.onGround = false;
        player.state = States.JUMPSTART;
      }
      break;
    }
    case "s":
      {
        player.weigth = 50;
        player.state = States.ROLL;
      }
      break;
  }
};

window.onkeyup = (e) => {
  switch (e.key) {
    case "d": {
      player.walking = false;
      player.state = States.IDLE;
      break;
    }
    case "a": {
      player.walking = false;
      player.state = States.IDLE;
      break;
    }
    case "s":
      {
        player.state = States.IDLE;
      }
      break;
  }
};

function handleMovement(
  dt: number,
  player: Player,
  game: CanvasRenderingContext2D | null
) {
  if (game) {
    if (player.walking && player.scale == 1) {
      player.x += player.speed;
    }
    if (player.walking && player.scale == -1) {
      player.x -= player.speed;
    }
    if (!player.onGround) {
      player.y -= player.vy;
    }
  }
}

function handleAnimation() {
  if (game) {
    let x: number;
    if (player.scale < 0) {
      x = -(player.x + player.width);
    } else {
      x = player.x;
    }

    switch (player.state) {
      case States.RUN: {
        drawAnimation(States.RUN,game,x);
        break;
      }

      case States.JUMPSTART:{
        drawAnimation(States.JUMPSTART,game,x);
        break;
      }
      case States.JUMPEND: {
        drawAnimation(States.JUMPEND,game,x);
        player.state = States.IDLE;
        break;
      }
      case States.IDLE: {
       drawAnimation(States.IDLE,game,x);        
     break;  
    } 
      case States.ROLL: {
        drawAnimation(States.ROLL,game,x);
        break;
      }
    }
  }
}

function drawAnimation(state: States,game: CanvasRenderingContext2D,x:number){
let idleAnim = player.animations.get(state);
        if(idleAnim){
       
          let pos = Math.floor((gameFrame / stagFrames) % idleAnim.frames);
          
          if(idleAnim.images[pos]){
      game.save();
      game.scale(player.scale, 1);
      game.drawImage(
        idleAnim.images[pos],
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
      gameFrame++;
      idleAnim.currentFrame++;
      if (idleAnim.currentFrame > idleAnim.frames) idleAnim.currentFrame = 0;
    }
  }
}

var level = new Level("assets/spaceTile2.png", 10);

function loadLevel(game: CanvasRenderingContext2D | null) {
  if (game) {
    game.drawImage(level.background_image.img, 0, 0);
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

function applyGravity(player: Player, dt: number) {
  player.y += player.weigth;
  player.weigth = player.weigth + 1;
}

function handleCollision(player: Player, level: Level) {
  var collision: boolean = false;
  for (let x = 0; x < level.blocks.length; x++) {
    var image = level.blocks[x];
    if (image && player.y + player.height >= image.y) {
      player.onGround = true;
      player.weigth = 0;
      collision = true;
      player.y = image.y - player.height;
      if(player.state === States.JUMPSTART) player.state = States.JUMPEND;
    }
  }
  if (player.x + player.width >= GAME_WIDTH) {
    player.x = GAME_WIDTH - player.width;
  }
  if (player.x <= 0) {
    player.x = 0;
  }

  return collision;
}

let lastTime = 0;
let fps = 60;
let interval = 1000 / fps;
let acumilatedTime = 0;

function mainLoop(timestamp : number) {
  if (game) {
    game.reset();
  }
  let dt = timestamp - lastTime;
  lastTime = timestamp;
  //console.log(1 / ((performance.now() - timeElapsed) / 1000))
  acumilatedTime += dt;

  this.time = timestamp;
  if (acumilatedTime >= interval) {
    let deltaTime = dt / 1000;
    handleMovement(deltaTime, player, game);
    applyGravity(player, deltaTime);
    handleCollision(player, level);

    loadLevel(game);

    handleAnimation();
    requestAnimationFrame(mainLoop);
  }
}

requestAnimationFrame(mainLoop);
