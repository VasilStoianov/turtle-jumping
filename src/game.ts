import {Assets} from "./assets.js";
import {Bullet} from "./bullet.js";
import {Enemy} from "./Enemy.js";
import {Level} from "./level.js";
import {Player} from "./player.js";
import {States} from "./states.js";
import {Vector2D} from "./vector2d.js";
import { BloodParticle } from "./blood.js";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const game = canvas.getContext("2d");
let addBullet: boolean = true;
export const GAME_WIDTH = 1900;
export const GAME_HEIGH = 720;
let bullets: Bullet[] = [];
let enemies: Enemy[] = [];
let bulletImg = new Image(60, 60);
bulletImg.src = "assets/bullet.png";
var player = new Player();
let gameFrame = 0;
var level = new Level("assets/spaceTile2.png");
const ArrowRight: string = "ArrowRight";
const ArrowLeft: string = "ArrowLeft";
const ArrowUp: string = "ArrowUp";
const ArrowDown: string = "ArrowDown";
const space: string = " ";
let time = Date.now();
let bulletTime = Date.now();
let enemiesCreated = 0;
const particles: BloodParticle[] = [];

// Create blood splatter
function createBlood(x: number, y: number) {
  let ranNumber = (Math.random()+0.5) * 25;
  for (let i = 0; i < ranNumber; i++) {
    particles.push(new BloodParticle(x, y));
  }
}

function animate() {
console.log(particles);
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.draw(game);
    }
  });
}

window.onkeydown = (event) => { 
  player.keys.add(event.key); };

function handleKeyEvents(player: Player, game: CanvasRenderingContext2D|null) {

if(player.keys.has("1")){
  player.currentWeapon = player.weapons[0];
}
if(player.keys.has("2")){
  player.currentWeapon = player.weapons[1];
}
if(player.keys.has("3")){
  player.currentWeapon = player.weapons[2];
}

  if (player.keys.has(ArrowRight)) {
    player.walking = true;
    player.scale = 1;
  }
  if (player.keys.has(ArrowLeft)) {
      player.walking = true;
      player.scale = -1;
  }
  if (player.keys.has(ArrowUp)) {
    if (player.onGround) {
      player.onGround = false;
      player.state = States.JUMPSTART;
    }
  }
  if (player.keys.has(ArrowDown)) {
    if (player.onGround) {

      player.state = States.ROLL;
    } else {
      player.state = States.FALL
      player.weigth = 50;
    }
  }

  if (player.keys.has(space)) {
    if (addBullet && player.state !== States.ROLL) {
      addBullet = false;
 let x = (player.x + player.width / 2) * player.scale;
  let y = player.y + player.height / 2;
 
      let img = new Bullet(
          bulletImg, new Vector2D((x + 105) * player.scale,
                                 y + 12));
      img.velocity *= player.scale;
      bullets.push(img);
    }
  }

  if (player.keys.has("r") && player.isDead) {

      player.reset();
      bullets = [];
      enemies = [];
      enemiesCreated = 0;
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
    enemies.forEach((enemy) => {
      let animation = enemy.animations.get(States.HIT);
      if (animation) {
        if (enemy.rolled && animation.currentFrame <= animation.frames / 2) {
          let mod = (enemy.scale * player.scale) / -1;
          enemy.x += 10 * mod;
          enemy.y -= 10;
        } else {
          enemy.x += enemy.vy * enemy.scale;
        }
      }
    });
  }
}

function handleMovement(player: Player, game: CanvasRenderingContext2D|null) {
  if (game) {
    if (player.walking) {
      if (player.state !== States.JUMPSTART && player.state !== States.ROLL &&
          player.onGround && !player.isHit) {
        player.state = States.RUN;
      }
      if (player.state === States.ROLL)
        player.speed = 12;
      else
        player.speed = 6;
      player.x += player.speed * player.scale;
    }
    if (!player.onGround) {
      player.y -= player.vy;
    }
  }
}

function handleEnemyAnimation(enemies: Enemy[], currentTime: number) {
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
        drawEnemy(enemy, States.RUN, game, x, currentTime);
        break;
      }

      case States.HIT: {
        drawEnemy(enemy, States.HIT, game, x, currentTime);
        break;
      }
      case States.JUMPEND: {
        drawEnemy(enemy, States.JUMPEND, game, x, currentTime);
        player.state = States.IDLE;
        break;
      }
      case States.IDLE: {
        drawEnemy(enemy, States.IDLE, game, x, currentTime);
        break;
      }
      case States.DEATH: {
        drawEnemy(enemy, States.DEATH, game, x, currentTime);
        break;
      }
      }
    } else {
      enemies.splice(index, 1);
    }
  });
}

function handleAnimation(player: Player, currentTime: number) {
  if (game) {
    let x: number;
    if (player.scale < 0) {
      x = -(player.x + player.width);
    } else {
      x = player.x;
    }

    switch (player.state) {
    case States.RUN: {
      drawPlayer(States.RUN, game, player, x, currentTime);
      break;
    }

    case States.JUMPSTART: {
      drawPlayer(States.JUMPSTART, game, player, x, currentTime);
      break;
    }
    case States.JUMPEND: {
      drawPlayer(States.JUMPEND, game, player, x, currentTime);
      player.state = States.IDLE;
      break;
    }
    case States.IDLE: {
      drawPlayer(States.IDLE, game, player, x, currentTime);
      break;
    }
    case States.FALL: {
      drawPlayer(States.FALL, game, player, x, currentTime);
      break;
    }
    case States.ROLL: {
      drawPlayer(States.ROLL, game, player, x, currentTime);
      break;
    }
    case States.HIT: {
      drawPlayer(States.HIT, game, player, x, currentTime);
    }
    }
  }
}

let firshot = new Assets("assets/muzzle.png", {width : 128, heidth : 128},
                         new Vector2D(430, 549));

function drawBullets() {
  bullets.forEach((bullet, index) => {
    if (bullet.end >= GAME_WIDTH / 2) {
      bullets.splice(index, 1);
    } else {
      if (bullet.isFirstShot) {
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
                   x: number, currentTime: number) {
  game.save();
  game.scale(enemy.scale, 1);
  if (!(enemy.healtBar.width < 0)) {
    game.fillStyle = "green";
    game.fillRect(x, enemy.y - 20, enemy.healtBar.width, enemy.healtBar.heidth);
  }

  let idleAnim = enemy.animations.get(state);
  if (idleAnim) {
    let pos = Math.floor((gameFrame / idleAnim.stagFrames) % idleAnim.frames);
    let img = idleAnim.images[pos];
    if (img) {
      game.drawImage(img, 720, 1000, 650, 820, x, enemy.y, enemy.width,
                     enemy.height);
      game.restore();
      if (currentTime - idleAnim.elapsedTime >= idleAnim.latency) {
        idleAnim.currentFrame++;
        idleAnim.elapsedTime = currentTime;
      }
      if (idleAnim.currentFrame > idleAnim.frames) {
        if (enemy.state === States.DEATH) {
          enemy.forRemoval = true;
        }
        if (idleAnim.currentFrame > idleAnim.frames &&
            enemy.state === States.HIT) {
          enemy.rolled = false;
          enemy.state = States.RUN;
        }

        idleAnim.currentFrame = 0;
      }
    }
  }
}

function drawPlayer(state: States, game: CanvasRenderingContext2D,
                    player: Player, x: number, currentTime: number) {
  let idleAnim = player.animations.get(state);
  if (idleAnim) {
    let pos = Math.floor((gameFrame / idleAnim.stagFrames) % idleAnim.frames);
    game.font = "48px serif";
    game.fillStyle = "grey";
    game.fillText("Health:", 100, 50);
    game.fillStyle = "red";
    game.fillText(player.health.toString(), 250, 50);
    let img = idleAnim.images[pos];
    if (img) {
      game.save();
      game.scale(player.scale, 1);

      game.drawImage(img, 690, 1040, 690, 790, x, player.y, player.width,
                     player.height);
      game.restore();
      if (currentTime - idleAnim.elapsedTime >= idleAnim.latency) {
        idleAnim.currentFrame++;
        idleAnim.elapsedTime = currentTime;
      }
      if (idleAnim.currentFrame > idleAnim.frames) {
        if (player.state === States.HIT && !player.walking) {
          player.isHit = false;
          player.state = States.IDLE;
        } else if (player.state === States.HIT && player.walking) {
          player.isHit = false;
          player.state = States.RUN;
        }
        idleAnim.currentFrame = 0;
      }
    }
  }
}

function loadLevel(game: CanvasRenderingContext2D|null) {
  if (game) {
    game.drawImage(level.background_image.img, 0, 0);
    for (let x = 0; x <= level.blocks.length; x++) {
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

function handleCollisionEnemy(enemies: Enemy[], level: Level, player: Player) {
  enemies.forEach((enemy,index) => {
     if (enemy.forRemoval){
        enemies.splice(index, 1);
         return;
      }
    if (enemy.health <= 0 || enemy.y + enemy.height >= GAME_HEIGH) {
    enemy.state = States.DEATH;
    enemy.isDead = true;
    return;
  }
  for (let x = 0; x < level.blocks.length; x++) {
    var image = level.blocks[x];
    if (image && enemy.y + enemy.height >= image.position.y &&
        enemy.x + enemy.width <= image.position.x + image.size.width) {
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
           bullet.position.y <= enemy.y + enemy.height && !enemy.isDead) ||
          (bullet.position.x <= enemy.x + enemy.width &&
           bullet.position.x >= enemy.x && bullet.position.y >= enemy.y &&
           bullet.position.y <= enemy.y + enemy.height && !enemy.isDead)) {
        bullets.splice(x, 1);
  createBlood( enemy.x + enemy.width/2, enemy.y + enemy.height/2);
        enemy.state = States.HIT;
        enemy.health -= 8;
        enemy.healtBar.width -= 8;
      }
    }
  }

  let xCollision =
      player.x + player.width >= enemy.x && player.x <= enemy.x + enemy.width;
  let yCollision =
      player.y + player.height >= enemy.y && player.y <= enemy.y + enemy.height;

  if (xCollision && yCollision && !enemy.isDead) {
    let currentTime = Date.now();
    if (currentTime - enemy.lastCollide >= 1000) {
      if (player.state === States.ROLL) {
        enemy.rolled = true;
        enemy.state = States.HIT;
        enemy.health -= 40;
        enemy.healtBar.width -= 40;
      } else {
        player.health -= 10;
        player.state = States.HIT;
        player.isHit = true;
      }

      enemy.lastCollide = currentTime;
    }
  }
  if (enemy.x + enemy.width >= GAME_WIDTH) {
    enemy.scale = -1;
  }
  if (enemy.y + enemy.height >= GAME_HEIGH) {
    enemy.isDead = true;
  }
  if (enemy.x <= 0) {
    enemy.scale = 1;
  }
});
}

function handleCollision(player: Player, level: Level) {
  if(player.health<=0){
    player.isDead = true;
    return;
  }
  for (let x = 0; x <= level.blocks.length; x++) {
    var image = level.blocks[x];
    if (image && player.y + player.height >= image.position.y &&
        player.x + player.width <= image.position.x + image.size.width) {
      player.onGround = true;
      player.weigth = 0;
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
}





new Assets("assets/test2.png", {width : 128, heidth : 128},
                          new Vector2D(300, 400));

function drawWeapon() {
  game?.save();

const weapon = player.currentWeapon.get(player.state);
if(weapon && player.state != States.ROLL){
   game?.scale(player.scale, 1);
 let x = (player.x + player.width / 2) * player.scale;
  let y = player.y + player.height / 2;
  let frame = Math.floor((gameFrame/weapon.stagFrames) % weapon.frames);


  game?.drawImage(player.handL, 755, 1565, 170, 170, x + 25,
                  y + 20, 32, 32);
  game?.drawImage(weapon.images[frame],640,1480,855,306, x - 25,
                  y,128,39); // Offset by half the weapon size

 game?.drawImage(player.handL, 755, 1565, 170, 170, x - 30,
                  y + 21, 32, 32);
  weapon.currentFrame++;
  if(weapon.currentFrame>= weapon.frames){
    weapon.currentFrame = 0;
  }
 }
  game?.restore();
}

function mainLoop() {
  let currentTime = Date.now();
  handleKeyEvents(player, game);
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
    handleMovement(player, game);
    handleEnemyMovement(enemies, game);
    applyPlayerGravity(player);
    applyEnemyGravity(enemies);
    handleCollision(player, level);
    handleCollisionEnemy(enemies, level, player);
    loadLevel(game);
    handleAnimation(player, currentTime);
    drawBullets();
    drawWeapon();
    handleEnemyAnimation(enemies, currentTime);

    animate();
    gameFrame++;
    requestAnimationFrame(mainLoop);
  }
}

requestAnimationFrame(mainLoop);
