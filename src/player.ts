import {PlayerAnimation} from "./animations.js";
import {Assets} from "./assets.js";
import {States} from "./states.js";
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
  currentWeapon: Map<States, PlayerAnimation>;

  weapons: Map<States, PlayerAnimation>[] = [];

  health: number;
  onGround: boolean = true;
  isHit: boolean = false;
  vy: number = 20;
  weigth: number = 0;
  state: States;
  handL: HTMLImageElement;
  isDead: boolean;
  constructor() {
    this.keys = new Set();
    this.isDead = false;
    this.x = 300;
    this.y = 255;
    this.health = 100;
    this.width = 100;
    this.height = 110;
    this.walking = false;
    this.state = States.IDLE;

    this.animations = new Map<States, PlayerAnimation>();
    this.animations.set(
        States.IDLE,
        new PlayerAnimation(5, "assets/Char 2/no hands/idle_", 350, false, 7));
    this.animations.set(
        States.RUN,
        new PlayerAnimation(7, "assets/Char 2/no hands/walk_", 100, false, 7));
    this.animations.set(States.JUMPSTART,
                        new PlayerAnimation(1,
                                            "assets/Char 2/no hands/jumpStart_",
                                            400, false, 7));
    this.animations.set(States.JUMPEND,
                        new PlayerAnimation(2,
                                            "assets/Char 2/no hands/jumpEnd_",
                                            400, true, 7));
    this.animations.set(
        States.FALL,
        new PlayerAnimation(4, "assets/Char 2/no hands/fall_", 300, false, 7));
    this.animations.set(
        States.ROLL,
        new PlayerAnimation(4, "assets/Char 2/no hands/roll_", 300, false, 3));
    this.animations.set(
        States.HIT,
        new PlayerAnimation(2, "assets/Char 2/no hands/hit_", 400, true, 7));
    this.handL = new Image();
    this.handL.src = "../assets/handR1/idle_0.png";

    let wep1 = new Map<States, PlayerAnimation>();
    let wepo2 = new Map<States, PlayerAnimation>();
    let wepo3 = new Map<States, PlayerAnimation>();


    wep1.set(
        States.RUN,
        new PlayerAnimation(7, "assets/Weapons/weaponR1/walk_", 400, true, 7));
    wep1.set(
        States.IDLE,
        new PlayerAnimation(5, "assets/Weapons/weaponR1/idle_", 400, true, 7));
    wep1.set(States.JUMPSTART,
              new PlayerAnimation(1, "assets/Weapons/weaponR1/jumpStart_", 400,
                                  true, 7));
    wep1.set(States.JUMPEND,
              new PlayerAnimation(1, "assets/Weapons/weaponR1/jumpEnd_", 400,
                                  true, 7));

    wep1.set(
        States.FALL,
        new PlayerAnimation(4, "assets/Weapons/weaponR1/fall_", 300, false, 7));
   wep1.set(
        States.HIT,
        new PlayerAnimation(2, "assets/Weapons/weaponR1/hit_", 400, true, 7));




    wepo2.set(
        States.RUN,
        new PlayerAnimation(7, "assets/Weapons/weaponR2/walk_", 400, true, 7));
    wepo2.set(
        States.IDLE,
        new PlayerAnimation(5, "assets/Weapons/weaponR2/idle_", 400, true, 7));

    wepo2.set(States.JUMPSTART,
              new PlayerAnimation(1, "assets/Weapons/weaponR2/jumpStart_", 400,
                                  true, 7));
    wepo2.set(States.JUMPEND,
              new PlayerAnimation(1, "assets/Weapons/weaponR2/jumpEnd_", 400,
                                  true, 7));
   wepo2.set(
        States.HIT,
        new PlayerAnimation(2, "assets/Weapons/weaponR2/hit_", 400, true, 7));

    wepo2.set(
        States.FALL,
        new PlayerAnimation(4, "assets/Weapons/weaponR2/fall_", 300, false, 7));


    wepo3.set(
        States.RUN,
        new PlayerAnimation(7, "assets/Weapons/weaponR3/walk_", 400, true, 7));
    wepo3.set(
        States.IDLE,
        new PlayerAnimation(5, "assets/Weapons/weaponR3/idle_", 400, true, 7));
    wepo3.set(States.JUMPSTART,
              new PlayerAnimation(1, "assets/Weapons/weaponR3/jumpStart_", 400,
                                  true, 7));
    wepo3.set(States.JUMPEND,
              new PlayerAnimation(1, "assets/Weapons/weaponR3/jumpEnd_", 400,
                                  true, 7));

    wepo3.set(
        States.FALL,
        new PlayerAnimation(4, "assets/Weapons/weaponR3/fall_", 300, false, 7));
   wepo3.set(
        States.HIT,
        new PlayerAnimation(2, "assets/Weapons/weaponR3/hit_", 400, true, 7));

    this.weapons.push(wep1);
    this.weapons.push(wepo2);
    this.weapons.push(wepo3);
    this.currentWeapon = this.weapons[0];
  }

 reset(){
  this.isDead = false;
    this.x = 300;
    this.y = 255;
    this.health = 100;
    this.width = 100;
    this.height = 110;
    this.walking = false;
    this.state = States.IDLE;


  }
}
