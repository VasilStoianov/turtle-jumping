import { Vector2D } from "./vector2d.js";

export class Bullet {
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