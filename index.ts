const canvas = document.getElementById("game") as HTMLCanvasElement;
const game = canvas.getContext("2d");

const GAME_WIDTH = 1900;
const GAME_HEIGH = 720;
let bullets: Bullet[] = [];
let enemies: Enemy[] = [];
enum States {
  RUN,
  JUMPSTART,
  JUMPEND,
  IDLE,
  FALL,
  ROLL,
  HIT,
  DEATH,
}

class Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  animations: Map<States, PlayerAnimation>;
  scale: number = -1;
  healtBar: {
    width: number;
    heidth: number;
  };
  speed: number = 6;
  maxSpeed: number;
  onGround: boolean = true;
  vy: number = 1;
  weigth: number = 0;
  state: States;
  health: number = 100;
  isDead: boolean;
  forRemoval: boolean = false;
  constructor() {
    this.isDead = false;
    let rand = (Math.random() * (3 -1 + 1) + 1)
    this.x = 450 * rand;
    this.vy *= Math.floor(rand);
    this.y = 255;
    this.maxSpeed = 100;
    this.width = 100;
    this.height = 110;
    this.state = States.RUN;

    this.healtBar = {
      width: 100,
      heidth: 7,
    };

    this.animations = new Map<States, PlayerAnimation>();
    this.animations.set(
      States.RUN,
      new PlayerAnimation(7, "assets/Enemies/Enemy 1/walk_")
    );
    this.animations.set(
      States.HIT,
      new PlayerAnimation(2, "assets/Enemies/Enemy 1/hit_")
    );
    this.animations.set(
      States.DEATH,
      new PlayerAnimation(9, "assets/Enemies/Enemy 1/death_")
    );
  }
}

class Bullet {
  asset: HTMLImageElement;
  size: {
    width: number;
    heidth: number;
  };
  velocity: number;
  position: Vector2D;
  end: number;
  isFirstShot: boolean;
  constructor(src: string, position: Vector2D) {
    this.asset = new Image(60, 60);
    this.velocity = 10;
    this.end = 0;
    this.isFirstShot = true;
    this.asset.src = src;
    this.size = {
      width: 128,

      heidth: 131,
    };
    this.position = position;
  }
}

class Assets {
  asset: HTMLImageElement;
  size: {
    width: number;
    heigth: number;
  };
  position: Vector2D;

  constructor(
    src: string,
    size: { width: number; heidth: number },
    position: Vector2D
  ) {
    this.asset = new Image(size.width, size.heidth);
    this.position = position;
    this.size = {
      width: size.width,
      heigth: size.heidth,
    };
    this.asset.src = src;
  }
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

class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Level {
  blocks: Assets[];
  background_image: {
    img: HTMLImageElement;
    width: number;
    heidth: number;
    position: Vector2D;
  };

  constructor(src: string) {
    this.blocks = [];
    for (let x = 0; x <= GAME_WIDTH / 128; x++) {
      let block = new Assets(
        src,
        { width: 128, heidth: 128 },
        new Vector2D(x * 128, GAME_HEIGH - 128)
      );
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
  walking: boolean;
  scale: number = 1;
  speed: number = 6;
  maxSpeed: number;
  onGround: boolean = true;
  vy: number = 20;
  weigth: number = 0;
  state: States;
  isDead: boolean;
  constructor() {
    this.isDead = false;
    this.x = 300;
    this.y = 255;
    this.maxSpeed = 100;
    this.width = 100;
    this.height = 110;
    this.walking = false;
    this.state = States.IDLE;

    this.animations = new Map<States, PlayerAnimation>();
    this.animations.set(
      States.IDLE,
      new PlayerAnimation(5, "assets/Char 2/with hands/idle_")
    );
    this.animations.set(
      States.RUN,
      new PlayerAnimation(7, "assets/Char 2/with hands/walk_")
    );
    this.animations.set(
      States.JUMPSTART,
      new PlayerAnimation(1, "assets/Char 2/with hands/jumpStart_")
    );
    this.animations.set(
      States.JUMPEND,
      new PlayerAnimation(2, "assets/Char 2/with hands/jumpEnd_")
    );
    this.animations.set(
      States.FALL,
      new PlayerAnimation(4, "assets/Char 2/with hands/fall_")
    );
    this.animations.set(
      States.ROLL,
      new PlayerAnimation(4, "assets/Char 2/with hands/roll_")
    );
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

let gameFrame = 0;
let stagFrames = 7;
window.onkeydown = (event) => {
  switch (event.key) {
    case "ArrowRight": {
      player.walking = true;
      if (player.state !== States.JUMPSTART && player.state !== States.ROLL) {
        player.state = States.RUN;
      }
      player.scale = 1;
      break;
    }
    case "ArrowLeft":
      {
        player.walking = true;

        if (player.state !== States.JUMPSTART && player.state !== States.ROLL) {
          player.state = States.RUN;
        }
        player.scale = -1;
      }
      break;
    case "ArrowUp": {
      if (player.onGround) {
        player.onGround = false;
        player.state = States.JUMPSTART;
      }
      break;
    }
    case "ArrowDown":
      {
        player.weigth = 50;
        player.state = States.ROLL;
      }
      break;

    case " ": {
      let img = new Bullet(
        "assets/bullet.png",
        new Vector2D(
          (weapon.position.x + 105) * player.scale,
          weapon.position.y + 12
        )
      );
      img.velocity *= player.scale;
      bullets.push(img);
      break;
    }
    case "r": {
      if (player.isDead) {
        player = new Player();
        bullets = [];
      }
      break;
    }
  }
};

window.onkeyup = (e) => {
  switch (e.key) {
    case "ArrowLeft": {
      player.walking = false;
      player.state = States.IDLE;
      break;
    }
    case "ArrowRight": {
      player.walking = false;
      player.state = States.IDLE;
      break;
    }
    case "ArrowDown":
      {
        player.state = States.IDLE;
      }
      break;
  }
};

function handleEnemyMovement(
  enemies: Enemy[],
  game: CanvasRenderingContext2D | null
) {
  if (game) {
    enemies.forEach((enemy) => {
      enemy.x -= enemy.vy;
    });
  }
}

function handleMovement(player: Player, game: CanvasRenderingContext2D | null) {
  if (game) {
    if (player.walking && player.scale == 1) {
      player.state = player.state === States.ROLL ? States.ROLL : States.RUN;
      player.x += player.speed;
    }
    if (player.walking && player.scale == -1) {
      player.state = player.state === States.ROLL ? States.ROLL : States.RUN;
      player.x -= player.speed;
    }
    if (!player.onGround) {
      player.y -= player.vy;
    }
  }
}

function handleEnemyAnimation(enemies: Enemy[]) {
  enemies.forEach((enemy,index) => {
     
    if (game && !enemy.forRemoval) {
      let x: number;
      if (enemy.scale < 0) {
        x = -(enemy.x + enemy.width);
      } else {
        x = enemy.x;
      }

      switch (enemy.state) {
        case States.RUN: {
          drawEnemy(enemy, States.RUN, game, x);
          break;
        }

        case States.HIT: {
          drawEnemy(enemy, States.HIT, game, x);
          break;
        }
        case States.JUMPEND: {
          drawEnemy(enemy, States.JUMPEND, game, x);
          player.state = States.IDLE;
          break;
        }
        case States.IDLE: {
          drawEnemy(enemy, States.IDLE, game, x);
          break;
        }
        case States.DEATH: {
          drawEnemy(enemy,States.DEATH,game,x);
          break;
        }
      }
    }
    else {
      enemies.splice(index,1);
      console.log(enemies);
    }
  });
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
        drawAnimation(States.RUN, game, x);
        break;
      }

      case States.JUMPSTART: {
        drawAnimation(States.JUMPSTART, game, x);
        break;
      }
      case States.JUMPEND: {
        drawAnimation(States.JUMPEND, game, x);
        player.state = States.IDLE;
        break;
      }
      case States.IDLE: {
        drawAnimation(States.IDLE, game, x);
        break;
      }
      case States.FALL: {
        drawAnimation(States.FALL, game, x);
        break;
      }
      case States.ROLL: {
        drawAnimation(States.ROLL, game, x);
        break;
      }
    }
  }
}

function drawBullets() {
  bullets.forEach((bullet, index) => {
    if (bullet.end >= GAME_WIDTH / 2) {
      bullets.splice(index, 1);
    } else {
      if (bullet.isFirstShot) {
        let firshot = new Assets(
          "assets/muzzle.png",
          { width: 128, heidth: 128 },
          bullet.position
        );
        game?.save();
        game?.scale(player.scale, 1);
        game?.drawImage(
          firshot.asset,
          0,
          0,
          bullet.size.width,
          bullet.size.heidth,
          (bullet.position.x + 12) * player.scale,
          bullet.position.y - 17,
          64,
          64
        );
        bullet.isFirstShot = false;
        game?.restore();
      }
      bullet.position.x += bullet.velocity;
      bullet.end += 10;
      game?.drawImage(
        bullet.asset,
        0,
        0,
        bullet.size.width,
        bullet.size.heidth,
        bullet.position.x,
        bullet.position.y,
        10,
        10
      );
    }
  });
}

for(let x = 0; x<= 10; x++){
enemies.push(new Enemy());
}

function drawEnemy(
  enemy: Enemy,
  state: States,
  game: CanvasRenderingContext2D,
  x: number
) {
  game.save();
  game.scale(enemy.scale, 1);
  if (!(enemy.healtBar.width < 0)) {
        game.fillStyle = "green";
    game.fillRect(x, enemy.y - 20, enemy.healtBar.width, enemy.healtBar.heidth);
  }

  let idleAnim = enemy.animations.get(state);
  if (idleAnim) {
    let pos = Math.floor((gameFrame / stagFrames) % idleAnim.frames);
    if (idleAnim.images[pos]) {
      game.drawImage(
        idleAnim.images[pos],
        720,
        980,
        650,
        750,
        x,
        enemy.y,
        enemy.width,
        enemy.height
      );
      game.restore();
      idleAnim.currentFrame++;
      if (idleAnim.currentFrame > idleAnim.frames) {
        if(enemy.state === States.DEATH) {
          enemy.forRemoval = true;
        }
        else if (
          idleAnim.currentFrame > idleAnim.frames &&
          enemy.state === States.HIT
        ) {
          enemy.state = States.RUN;
        }

        idleAnim.currentFrame = 0;
      }
    }
  }
}
function drawAnimation(
  state: States,
  game: CanvasRenderingContext2D,
  x: number
) {
  let idleAnim = player.animations.get(state);
  if (idleAnim) {
    let pos = Math.floor((gameFrame / stagFrames) % idleAnim.frames);

    if (idleAnim.images[pos]) {
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
      idleAnim.currentFrame++;
      if (idleAnim.currentFrame > idleAnim.frames) idleAnim.currentFrame = 0;
    }
  }
}

var level = new Level("assets/spaceTile2.png");
function loadLevel(game: CanvasRenderingContext2D | null) {
  if (game) {
    game.drawImage(level.background_image.img, 0, 0);
    for (let x = 0; x < GAME_WIDTH / 128; x++) {
      let image = level.blocks[x];
      if (image) {
        game.beginPath();
        game.drawImage(image.asset, image.position.x, image.position.y);
        game.stroke();
      }
    }
  }
}

function applyPlayerGravity(player: Player) {
  if (player.weigth > player.vy && player.state !== States.ROLL)
    player.state = States.FALL;
  player.y += player.weigth;
  player.weigth = player.weigth + 1;
}

function applyEnemyGravity(enemies: Enemy[]) {
  enemies.forEach((enemy) => {
    enemy.y += enemy.weigth;
    enemy.weigth += 1;
  });
}

function handleCollisionEnemy(enemy: Enemy, level: Level) {
  var collision: boolean = false;
  for (let x = 0; x < level.blocks.length; x++) {
    var image = level.blocks[x];
    if (
      image &&
      enemy.y + enemy.height >= image.position.y &&
      enemy.x + enemy.width <= image.position.x + image.size.width / 2
    ) {
      enemy.onGround = true;
      enemy.weigth = 0;
      collision = true;
      enemy.y = image.position.y - enemy.height;
    }
  }
  for (let x = 0; x < bullets.length; x++) {
    let bullet = bullets[x];
    if (bullet) {
      if (
        bullet.position.x >= enemy.x && bullet.position.x <=enemy.x + enemy.width &&
        bullet.position.y <= enemy.y + enemy.width
        || bullet.position.x <= enemy.x+enemy.width && bullet.position.x >= enemy.x ) {
        bullets.splice(x, 1);
        enemy.state = States.HIT;
        enemy.healtBar.width -= 5;
        if(enemy.healtBar.width<= 0 ) enemy.state = States.DEATH;
      }
  }
  }
  if (enemy.x + enemy.width >= GAME_WIDTH) {
    enemy.x = GAME_WIDTH - enemy.width;
  }
  if (enemy.y + enemy.height >= GAME_HEIGH) {
    enemy.isDead = true;
  }
  if (enemy.x <= 0) {
    enemy.x = 0;
  }

  return collision;
}

function handleCollision(player: Player, level: Level) {
  var collision: boolean = false;
  for (let x = 0; x < level.blocks.length; x++) {
    var image = level.blocks[x];
    if (
      image &&
      player.y + player.height >= image.position.y &&
      player.x + player.width <= image.position.x + image.size.width / 2
    ) {
      player.onGround = true;
      player.weigth = 0;
      collision = true;
      player.y = image.position.y - player.height;
      if (player.state === States.FALL) player.state = States.IDLE;
    }
  }
  if (player.x + player.width >= GAME_WIDTH) {
    player.x = GAME_WIDTH - player.width;
  }
  if (player.y + player.height >= GAME_HEIGH) {
    player.isDead = true;
  }
  if (player.x <= 0) {
    player.x = 0;
  }

  return collision;
}

let weapon = new Assets(
  "assets/test2.png",
  { width: 128, heidth: 128 },
  new Vector2D(300, 400)
);

function drawWeapon() {
  game?.save();
  game?.scale(player.scale, 1);
  weapon.position.x = (player.x + player.width / 2) * player.scale;
  weapon.position.x -= 25;
  weapon.position.y = player.y + player.height / 2;
  game?.drawImage(weapon.asset, weapon.position.x, weapon.position.y);
  game?.restore();
}

let lastTime = 0;
let fps = 30;
let interval = 1000 / fps;
let acumilatedTime = 0;

function mainLoop(timestamp: number) {
  if (game) {
    game.reset();
  }
  let dt = timestamp - lastTime;
  lastTime = timestamp;
  acumilatedTime += dt;

  this.time = timestamp;
  if (acumilatedTime >= interval) {
    if (player.isDead && game) {
      loadLevel(game);
      game.font = "48px serif";
      game.fillStyle = "red";
      game.fillText("DEAD! GAME OVER!", GAME_WIDTH / 2.5, GAME_HEIGH / 2);
      requestAnimationFrame(mainLoop);
    } else {
      handleMovement(player, game);
      handleEnemyMovement(enemies, game);
      applyPlayerGravity(player);
      applyEnemyGravity(enemies);
      handleCollision(player, level);
      enemies.forEach((enemy) => {
        handleCollisionEnemy(enemy, level);
      });
      loadLevel(game);
      handleAnimation();
      drawWeapon();
      drawBullets();
      handleEnemyAnimation(enemies);
      gameFrame++;
      requestAnimationFrame(mainLoop);
    }
  }
}

requestAnimationFrame(mainLoop);
