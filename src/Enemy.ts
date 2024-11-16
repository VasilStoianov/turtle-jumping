import { PlayerAnimation } from "./animations.js";
import { States } from "./states.js";
export class Enemy {
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
    let rand = Math.random() * (3 - 1 + 1) + 1;
    this.x = 1900 - 200;
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
      new PlayerAnimation(7, "assets/Enemies/Enemy 1/walk_",100,false)
    );
    this.animations.set(
      States.HIT,
      new PlayerAnimation(2, "assets/Enemies/Enemy 1/hit_",250,true)
    );
    this.animations.set(
      States.DEATH,
      new PlayerAnimation(9, "assets/Enemies/Enemy 1/death_",100,false)
    );
  }
}

