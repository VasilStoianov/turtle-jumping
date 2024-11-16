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
  constructor(asset: HTMLImageElement, position: Vector2D) {
    this.asset = asset;
    this.velocity = 10;
    this.end = 0;
    this.isFirstShot = true;
    this.size = {
      width: 128,

      heidth: 131,
    };
    this.position = position;
  }
}