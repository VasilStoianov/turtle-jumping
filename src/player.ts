import { PlayerAnimation } from "./animations.js";
import { States } from "./states.js";
export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  animations: Map<States, PlayerAnimation>;
  walking: boolean;
  scale: number = 1;
  keys: Set<String>;
  speed: number = 6;
healtBar: {
    width: number;
    heidth: number;
  };

  health: number;
  onGround: boolean = true;
  isHit: boolean = false;
  vy: number = 20;
  weigth: number = 0;
  state: States;
  isDead: boolean;
  constructor() {
    this.keys = new Set();
    this.isDead = false;
    this.x = 300;
    this.y = 255;
    this.healtBar = {
      width: 100,
      heidth: 7
    }
    this.health = 100;
    this.width = 100;
    this.height = 110;
    this.walking = false;
    this.state = States.IDLE;

    this.animations = new Map<States, PlayerAnimation>();
    this.animations.set(
      States.IDLE,
      new PlayerAnimation(5, "assets/Char 2/no hands/idle_",350,false)
    );
    this.animations.set(
      States.RUN,
      new PlayerAnimation(7, "assets/Char 2/no hands/walk_",100,false)
    );
    this.animations.set(
      States.JUMPSTART,
      new PlayerAnimation(1, "assets/Char 2/no hands/jumpStart_",400,false)
    );
    this.animations.set(
      States.JUMPEND,
      new PlayerAnimation(2, "assets/Char 2/no hands/jumpEnd_",400,true)
    );
    this.animations.set(
      States.FALL,
      new PlayerAnimation(4, "assets/Char 2/no hands/fall_",300,false)
    );
    this.animations.set(
      States.ROLL,
      new PlayerAnimation(4, "assets/Char 2/no hands/roll_",300,false)
    );
    this.animations.set(States.HIT,
    new PlayerAnimation(2,"assets/Char 2/no hands/hit_",400,true));
  }
}