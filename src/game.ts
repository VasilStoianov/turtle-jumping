import {Assets} from "./assets.js";
import {Bullet} from "./bullet.js";
import {Enemy} from "./Enemy.js";
import {Level} from "./level.js";
import {Player} from "./player.js";
import {States} from "./states.js";
import {Vector2D} from "./vector2d.js";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const game = canvas.getContext("2d");
let addBullet: boolean = true;
export const GAME_WIDTH = 1900;
export const GAME_HEIGH = 720;
let bullets: Bullet[] = [];
let enemies: Enemy[] = [];
var player = new Player();
let gameFrame = 0;
let stagFrames = 7;
var level = new Level("assets/spaceTile2.png");
const ArrowRight: string = "ArrowRight";
const ArrowLeft: string = "ArrowLeft";
const ArrowUp: string = "ArrowUp";
const ArrowDown: string = "Arrowdown";
const space: string = " ";

window.onkeydown = (event) => { player.keys.add(event.key); };

function handleKeyEvents() {
  if (player.keys.has(ArrowRight)) {
    player.walking = true;
    if (player.state !== States.JUMPSTART && player.state !== States.ROLL) {
      player.state = States.RUN;
    }
    player.scale = 1;
  }
  if (player.keys.has(ArrowLeft)) {
    {
      player.walking = true;

      if (player.state !== States.JUMPSTART && player.state !== States.ROLL) {
        player.state = States.RUN;
      }
      player.scale = -1;
    }
  }
  if (player.keys.has(ArrowUp)) {
    if (player.onGround) {
      player.onGround = false;
      player.state = States.JUMPSTART;
    }
  }
  if (player.keys.has(ArrowDown)) {
    player.weigth = 50;
    player.state = States.ROLL;
  }

  if (player.keys.has(space)) {
    if (addBullet) {
      addBullet = false;
      let img =
          new Bullet("assets/bullet.png",
                     new Vector2D((weapon.position.x + 105) * player.scale,
                                  weapon.position.y + 12));
      img.velocity *= player.scale;
      bullets.push(img);
    }
  }
  if (player.keys.has("r")) {
    if (player.isDead) {
      player = new Player();
      bullets = [];
    }
  }
}

window.onkeyup = (e) => {
  switch (e.key) {
  case ArrowLeft: {
    player.walking = false;
    player.state = States.IDLE;
    player.keys.delete(ArrowLeft);
    break;
  }
  case ArrowRight: {
    player.walking = false;
    player.state = States.IDLE;
    player.keys.delete(ArrowRight);
    break;
  }
  case ArrowDown: {
    player.state = States.IDLE;
    player.keys.delete(ArrowDown);
    break;
  }
  default:
    player.keys.delete(e.key);
  }
};

function handleEnemyMovement(enemies: Enemy[],
                             game: CanvasRenderingContext2D|null) {
  if (game) {
    enemies.forEach((enemy) => { enemy.x -= enemy.vy; });
  }
}

function handleMovement(player: Player, game: CanvasRenderingContext2D|null) {
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
  enemies.forEach((enemy, index) => {
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
        drawEnemy(enemy, States.DEATH, game, x);
        break;
      }
      }
    } else {
      enemies.splice(index, 1);
    }
  });
}

function handleAnimation(player: Player) {
  if (game) {
    let x: number;
    if (player.scale < 0) {
      x = -(player.x + player.width);
    } else {
      x = player.x;
    }

    switch (player.state) {
    case States.RUN: {
      drawPlayer(States.RUN, game, player, x);
      break;
    }

    case States.JUMPSTART: {
      drawPlayer(States.JUMPSTART, game, player, x);
      break;
    }
    case States.JUMPEND: {
      drawPlayer(States.JUMPEND, game, player, x);
      player.state = States.IDLE;
      break;
    }
    case States.IDLE: {
      drawPlayer(States.IDLE, game, player, x);
      break;
    }
    case States.FALL: {
      drawPlayer(States.FALL, game, player, x);
      break;
    }
    case States.ROLL: {
      drawPlayer(States.ROLL, game, player, x);
      break;
    }
    case States.HIT: {
      drawPlayer(States.HIT, game, player, x);
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
        let firshot = new Assets("assets/muzzle.png",
                                 {width : 128, heidth : 128}, bullet.position);
        game?.save();
        game?.scale(player.scale, 1);
        game?.drawImage(firshot.asset, 0, 0, bullet.size.width,
                        bullet.size.heidth,
                        (bullet.position.x + 12) * player.scale,
                        bullet.position.y - 17, 64, 64);
        bullet.isFirstShot = false;
        game?.restore();
      }
      bullet.position.x += bullet.velocity;
      bullet.end += 10;
      game?.drawImage(bullet.asset, 0, 0, bullet.size.width, bullet.size.heidth,
                      bullet.position.x, bullet.position.y, 10, 10);
    }
  });
}

function drawEnemy(enemy: Enemy, state: States, game: CanvasRenderingContext2D,
                   x: number) {
  game.save();
  game.scale(enemy.scale, 1);
  if (!(enemy.healtBar.width < 0)) {
    game.fillStyle = "green";
    game.fillRect(x, enemy.y - 20, enemy.healtBar.width, enemy.healtBar.heidth);
  }

  let idleAnim = enemy.animations.get(state);
  if (idleAnim) {
    let pos = Math.floor((gameFrame / stagFrames) % idleAnim.frames);
    let img = idleAnim.images[pos];
    if (img) {
      game.drawImage(img, 720, 1000, 650, 820, x, enemy.y, enemy.width,
                     enemy.height);
      game.restore();
      idleAnim.currentFrame++;
      if (idleAnim.currentFrame > idleAnim.frames) {
        if (enemy.state === States.DEATH) {
          enemy.forRemoval = true;
        } else if (idleAnim.currentFrame > idleAnim.frames &&
                   enemy.state === States.HIT) {
          enemy.state = States.RUN;
        }

        idleAnim.currentFrame = 0;
      }
    }
  }
}
function drawPlayer(state: States, game: CanvasRenderingContext2D,
                    player: Player, x: number) {
  let idleAnim = player.animations.get(state);
  if (idleAnim) {
    let pos = Math.floor((gameFrame / stagFrames) % idleAnim.frames);
    game.font = "24px serif";
    game.fillStyle = "grey";
    game.fillText("Health:", 100, 50);
    game.fillStyle = "red";
    game.fillText(player.health.toString(), 175, 50);
    let img = idleAnim.images[pos];
    if (img) {
      game.save();
      game.scale(player.scale, 1);

      game.drawImage(img, 720, 1060, 650, 750, x, player.y, player.width,
                     player.height);
      game.restore();
      idleAnim.currentFrame++;
      if (idleAnim.currentFrame > idleAnim.frames) {
        if (player.state === States.HIT && !player.walking) {
          player.state = States.IDLE;
          timeCol = false;
        }
        idleAnim.currentFrame = 0;
      }
    }
  }
}

function loadLevel(game: CanvasRenderingContext2D|null) {
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

function handleCollisionEnemy(enemy: Enemy, level: Level, player: Player,
                              timeCol: boolean) {
  for (let x = 0; x < level.blocks.length; x++) {
    var image = level.blocks[x];
    if (image && enemy.y + enemy.height >= image.position.y &&
        enemy.x + enemy.width <= image.position.x + image.size.width / 2) {
      enemy.onGround = true;
      enemy.weigth = 0;
      enemy.y = image.position.y - enemy.height;
    }
  }

  for (let x = 0; x < bullets.length; x++) {
    let bullet = bullets[x];
    if (bullet) {
      if ((bullet.position.x >= enemy.x &&
           bullet.position.x <= enemy.x + enemy.width &&
           bullet.position.y >= enemy.y &&
           bullet.position.y <= enemy.y + enemy.height) ||
          (bullet.position.x <= enemy.x + enemy.width &&
           bullet.position.x >= enemy.x && bullet.position.y >= enemy.y &&
           bullet.position.y <= enemy.y + enemy.height)) {
        bullets.splice(x, 1);
        enemy.state = States.HIT;
        enemy.health -= 8;
        enemy.healtBar.width -= 8;
        console.log(enemy.healtBar.width);
        if (enemy.health <= 0) {
          enemy.state = States.DEATH;
          enemy.isDead = true;
        }
      }
    }
  }

  if (player.x + player.width >= enemy.x && player.x <= enemy.x &&
      player.y >= enemy.y &&
      player.y + player.height >= enemy.y + enemy.height && !enemy.isDead) {
     let currentTime = Date.now();   
    if( currentTime - level.lastCollide >= 1000){
      level.lastCollide = currentTime;
        player.health -= 2;
    player.healtBar.width = player.health;
    player.state = States.HIT;
    if (player.health <= 0)
      player.isDead = true;
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

}

function handleCollision(player: Player, level: Level) {
  var collision: boolean = false;
  for (let x = 0; x < level.blocks.length; x++) {
    var image = level.blocks[x];
    if (image && player.y + player.height >= image.position.y &&
        player.x + player.width <= image.position.x + image.size.width / 2) {
      player.onGround = true;
      player.weigth = 0;
      collision = true;
      player.y = image.position.y - player.height;
      if (player.state === States.FALL)
        player.state = States.IDLE;
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

let weapon = new Assets("assets/test2.png", {width : 128, heidth : 128},
                        new Vector2D(300, 400));

function drawWeapon() {
  game?.save();
  game?.scale(player.scale, 1);
  weapon.position.x = (player.x + player.width / 2) * player.scale;
  weapon.position.x -= 25;
  weapon.position.y = player.y + player.height / 2;
  game?.drawImage(weapon.asset, weapon.position.x, weapon.position.y);
  let hand = new Image();
  hand.src = '../assets/handR1/idle_0.png';
  game?.drawImage(hand,775,1550,150,150,weapon.position.x,weapon.position.y+15 ,32,32);
  game?.restore();

}

let time = Date.now();
let bulletTime = Date.now();
let hitTime = Date.now();
// let enemiesToAdd = true;
let enemiesCreated = 0;
let timeCol = false;
function mainLoop(timestamp: number) {
  let currentTime = Date.now();
  if (player.isDead && game) {
    loadLevel(game);
    game.font = "48px serif";
    game.fillStyle = "red";
    game.fillText("DEAD! GAME OVER!", GAME_WIDTH / 2.5, GAME_HEIGH / 2);
    requestAnimationFrame(mainLoop);
  } else {
    if (currentTime - bulletTime >= 200) {
      addBullet = true;
      bulletTime = currentTime;
    }
        if (currentTime - time >= 2500 && enemiesCreated <= 12) {
      enemies.push(new Enemy());
      time = currentTime;
      enemiesCreated++;
    }
    handleKeyEvents();
    handleMovement(player, game);
    handleEnemyMovement(enemies, game);
    applyPlayerGravity(player);
    applyEnemyGravity(enemies);

    handleCollision(player, level);
    enemies.forEach(
        (enemy) => { handleCollisionEnemy(enemy, level, player, timeCol); });
    loadLevel(game);
    handleAnimation(player);
    drawWeapon();
    drawBullets();
    handleEnemyAnimation(enemies);
    gameFrame++;
    requestAnimationFrame(mainLoop);
  }
}

requestAnimationFrame(mainLoop);
